"""
REST API views for public portfolio consumption, project case studies, and contact dispatch.
"""

import logging

import requests
from django.conf import settings
from django.core.mail import send_mail
from django.db import connection
from django.db.models import Prefetch, Q
from django.http import FileResponse, HttpResponseNotModified
from drf_spectacular.utils import OpenApiParameter, OpenApiTypes, extend_schema
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.api.serializers import (
    AchievementSerializer,
    CertificateSerializer,
    CompetencySerializer,
    ContactSubmissionSerializer,
    EducationSerializer,
    ExperienceSerializer,
    FocusAreaSerializer,
    HackathonSerializer,
    JourneyItemSerializer,
    LeadershipSerializer,
    ProfileSerializer,
    ProjectDetailSerializer,
    ProjectSummarySerializer,
    SiteSettingsSerializer,
    SkillGroupSerializer,
    StatSerializer,
    TestimonialSerializer,
)
from apps.api.throttles import ContactDailyThrottle, ContactHourlyThrottle
from apps.content.models import (
    Achievement,
    Certificate,
    Competency,
    Education,
    Experience,
    FocusArea,
    Hackathon,
    JourneyItem,
    Leadership,
    SiteSettings,
    SkillGroup,
    Stat,
    Testimonial,
)
from apps.core.cache import get_cached_portfolio, set_cached_portfolio
from apps.inbox.models import ContactMessage
from apps.profiles.models import Profile, ResumeVersion
from apps.projects.models import (
    Project,
    ProjectFeature,
    ProjectFeatureGroup,
)

logger = logging.getLogger(__name__)


def verify_turnstile_token(token, remote_ip=None):
    """
    Verify Cloudflare Turnstile token against Cloudflare's siteverify endpoint.
    Skips verification if TURNSTILE_SECRET_KEY is empty/unconfigured.
    """
    secret = getattr(settings, "TURNSTILE_SECRET_KEY", None)
    if not secret:
        return True

    if not token:
        return False

    try:
        payload = {
            "secret": secret,
            "response": token,
        }
        if remote_ip:
            payload["remoteip"] = remote_ip

        res = requests.post(
            "https://challenges.cloudflare.com/turnstile/v0/siteverify",
            data=payload,
            timeout=5,
        )
        data = res.json()
        return bool(data.get("success"))
    except Exception as exc:
        logger.error("Cloudflare Turnstile verification error: %s", exc)
        return False


class PortfolioBundleView(APIView):
    """
    Returns the complete portfolio bundle in a single high-efficiency payload.
    Supports ETag HTTP 304 Not Modified caching with stale-while-revalidate.
    """

    permission_classes = [AllowAny]

    @extend_schema(
        operation_id="api_v1_portfolio_bundle",
        summary="Retrieve complete bundled portfolio payload",
        description="Returns profile, site settings, focus areas, computed stats, skills, experience, education, journey, leadership, credentials, and published project summaries in a single cached payload.",
        responses={200: OpenApiTypes.OBJECT},
    )
    def get(self, request):
        cached_data, cached_etag = get_cached_portfolio()

        if cached_data and cached_etag:
            # Check conditional request If-None-Match header
            client_etag = request.META.get("HTTP_IF_NONE_MATCH")
            if client_etag and client_etag == cached_etag:
                return HttpResponseNotModified()

            response = Response(cached_data)
            response["ETag"] = cached_etag
            response["Cache-Control"] = "public, max-age=60, stale-while-revalidate=300"
            return response

        # Query database with eager relations to prevent N+1 queries
        profile = Profile.load()
        site_settings = SiteSettings.load()
        active_resume = ResumeVersion.get_active()

        stats = Stat.objects.filter(is_visible=True).order_by("order", "id")
        focus_areas = FocusArea.objects.filter(is_visible=True).order_by("order", "id")
        competencies = Competency.objects.filter(is_visible=True).order_by("order", "id")
        skill_groups = SkillGroup.objects.prefetch_related("skills").order_by(
            "order", "id"
        )
        experiences = Experience.objects.prefetch_related("bullets").order_by(
            "order", "id"
        )
        education = Education.objects.order_by("order", "id")
        journey = JourneyItem.objects.filter(is_visible=True).order_by("order", "id")
        leadership = Leadership.objects.filter(is_visible=True).order_by("order", "id")
        certificates = Certificate.objects.filter(is_visible=True).order_by(
            "order", "id"
        )
        hackathons = Hackathon.objects.filter(is_visible=True).order_by("order", "id")
        achievements = Achievement.objects.filter(is_visible=True).order_by(
            "order", "id"
        )
        testimonials = Testimonial.objects.filter(is_visible=True).order_by(
            "order", "id"
        )

        projects = (
            Project.objects.filter(is_published=True)
            .prefetch_related("stack")
            .order_by("order", "id")
        )

        bundle = {
            "profile": ProfileSerializer(profile).data,
            "settings": SiteSettingsSerializer(site_settings).data,
            "stats": StatSerializer(stats, many=True).data,
            "focus_areas": FocusAreaSerializer(focus_areas, many=True).data,
            "competencies": CompetencySerializer(competencies, many=True).data,
            "skills": SkillGroupSerializer(skill_groups, many=True).data,
            "experience": ExperienceSerializer(experiences, many=True).data,
            "education": EducationSerializer(education, many=True).data,
            "journey": JourneyItemSerializer(journey, many=True).data,
            "leadership": LeadershipSerializer(leadership, many=True).data,
            "certificates": CertificateSerializer(certificates, many=True).data,
            "hackathons": HackathonSerializer(hackathons, many=True).data,
            "achievements": AchievementSerializer(achievements, many=True).data,
            "testimonials": TestimonialSerializer(testimonials, many=True).data,
            "projects": ProjectSummarySerializer(projects, many=True).data,
            "active_resume_url": "/api/v1/resume/" if active_resume else None,
        }

        etag = set_cached_portfolio(bundle, timeout=300)

        client_etag = request.META.get("HTTP_IF_NONE_MATCH")
        if client_etag and client_etag == etag:
            return HttpResponseNotModified()

        response = Response(bundle)
        if etag:
            response["ETag"] = etag
        response["Cache-Control"] = "public, max-age=60, stale-while-revalidate=300"
        return response


class ProjectListView(APIView):
    """
    List published projects with optional filters for type, tier, and search query.
    """

    permission_classes = [AllowAny]

    @extend_schema(
        operation_id="api_v1_projects_list",
        summary="List published projects",
        parameters=[
            OpenApiParameter(
                "type",
                OpenApiTypes.STR,
                description="Filter by project type (Full Stack, Frontend, Backend, Website)",
            ),
            OpenApiParameter(
                "tier",
                OpenApiTypes.STR,
                description="Filter by tier (featured, compact)",
            ),
            OpenApiParameter(
                "q",
                OpenApiTypes.STR,
                description="Search query across title, summary, and stack",
            ),
        ],
        responses={200: ProjectSummarySerializer(many=True)},
    )
    def get(self, request):
        qs = (
            Project.objects.filter(is_published=True)
            .prefetch_related("stack")
            .order_by("order", "id")
        )

        project_type = request.query_params.get("type")
        if project_type and project_type.lower() != "all":
            qs = qs.filter(type__iexact=project_type)

        tier = request.query_params.get("tier")
        if tier:
            qs = qs.filter(tier__iexact=tier)

        q = request.query_params.get("q")
        if q:
            term = q.strip()
            qs = qs.filter(
                Q(title__icontains=term)
                | Q(one_liner__icontains=term)
                | Q(description__icontains=term)
                | Q(stack__name__icontains=term)
            ).distinct()

        serializer = ProjectSummarySerializer(qs, many=True)
        return Response(serializer.data)


class ProjectDetailView(APIView):
    """
    Fetch full project detail by unique slug with prefetched galleries, feature groups, and challenges.
    """

    permission_classes = [AllowAny]

    @extend_schema(
        operation_id="api_v1_project_detail",
        summary="Retrieve detailed project case study",
        responses={200: ProjectDetailSerializer, 404: OpenApiTypes.OBJECT},
    )
    def get(self, request, slug):
        feature_group_qs = ProjectFeatureGroup.objects.prefetch_related(
            Prefetch("items", queryset=ProjectFeature.objects.order_by("order", "id"))
        ).order_by("order", "id")

        try:
            project = (
                Project.objects.filter(slug=slug, is_published=True)
                .prefetch_related(
                    "stack",
                    "images",
                    Prefetch("feature_groups", queryset=feature_group_qs),
                    "challenges",
                )
                .get()
            )
        except Project.DoesNotExist:
            return Response(
                {"detail": f"Project with slug '{slug}' not found or is unpublished."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = ProjectDetailSerializer(project)
        return Response(serializer.data)


class ProfileDetailView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(
        summary="Retrieve Fenil's profile", responses={200: ProfileSerializer}
    )
    def get(self, request):
        profile = Profile.load()
        return Response(ProfileSerializer(profile).data)


class SiteSettingsDetailView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(
        summary="Retrieve site configuration", responses={200: SiteSettingsSerializer}
    )
    def get(self, request):
        site_settings = SiteSettings.load()
        return Response(SiteSettingsSerializer(site_settings).data)


class SkillsListView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(
        summary="List grouped skills", responses={200: SkillGroupSerializer(many=True)}
    )
    def get(self, request):
        groups = SkillGroup.objects.prefetch_related("skills").order_by("order", "id")
        return Response(SkillGroupSerializer(groups, many=True).data)


class CompetenciesListView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(
        summary="List core competencies",
        responses={200: CompetencySerializer(many=True)},
    )
    def get(self, request):
        items = Competency.objects.filter(is_visible=True).order_by("order", "id")
        return Response(CompetencySerializer(items, many=True).data)



class ExperienceListView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(
        summary="List work experiences",
        responses={200: ExperienceSerializer(many=True)},
    )
    def get(self, request):
        exp = Experience.objects.prefetch_related("bullets").order_by("order", "id")
        return Response(ExperienceSerializer(exp, many=True).data)


class EducationListView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(
        summary="List education credentials",
        responses={200: EducationSerializer(many=True)},
    )
    def get(self, request):
        edu = Education.objects.order_by("order", "id")
        return Response(EducationSerializer(edu, many=True).data)


class LeadershipListView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(
        summary="List campus leadership roles",
        responses={200: LeadershipSerializer(many=True)},
    )
    def get(self, request):
        items = Leadership.objects.filter(is_visible=True).order_by("order", "id")
        return Response(LeadershipSerializer(items, many=True).data)


class CertificatesListView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(
        summary="List certifications", responses={200: CertificateSerializer(many=True)}
    )
    def get(self, request):
        items = Certificate.objects.filter(is_visible=True).order_by("order", "id")
        return Response(CertificateSerializer(items, many=True).data)


class HackathonsListView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(
        summary="List hackathon achievements",
        responses={200: HackathonSerializer(many=True)},
    )
    def get(self, request):
        items = Hackathon.objects.filter(is_visible=True).order_by("order", "id")
        return Response(HackathonSerializer(items, many=True).data)


class AchievementsListView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(
        summary="List competitive achievements",
        responses={200: AchievementSerializer(many=True)},
    )
    def get(self, request):
        items = Achievement.objects.filter(is_visible=True).order_by("order", "id")
        return Response(AchievementSerializer(items, many=True).data)


class TestimonialsListView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(
        summary="List mentor testimonials",
        responses={200: TestimonialSerializer(many=True)},
    )
    def get(self, request):
        items = Testimonial.objects.filter(is_visible=True).order_by("order", "id")
        return Response(TestimonialSerializer(items, many=True).data)


class ResumeStreamView(APIView):
    """
    Stream active PDF resume with Content-Disposition attachment Fenil_Rami_Resume.pdf.
    Passing ?inline=1 serves the document inline in the browser.
    """

    permission_classes = [AllowAny]

    @extend_schema(
        summary="Stream active resume PDF",
        parameters=[
            OpenApiParameter(
                "inline",
                OpenApiTypes.STR,
                description="Set to 1 to view in browser instead of downloading",
            )
        ],
        responses={200: OpenApiTypes.BINARY, 404: OpenApiTypes.OBJECT},
    )
    def get(self, request):
        active = ResumeVersion.get_active()
        if not active or not active.file:
            return Response(
                {"detail": "No resume document is currently available for download."},
                status=status.HTTP_404_NOT_FOUND,
            )

        as_inline = request.query_params.get("inline") == "1"
        disposition = "inline" if as_inline else "attachment"

        try:
            active.file.open("rb")
            response = FileResponse(active.file, content_type="application/pdf")
            response["Content-Disposition"] = (
                f'{disposition}; filename="Fenil_Rami_Resume.pdf"'
            )
            return response
        except Exception as exc:
            logger.error("Error streaming resume file: %s", exc)
            return Response(
                {"detail": "Unable to open resume file."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class ContactSubmitView(APIView):
    """
    Receives public contact inquiries, validates input, verifies Turnstile, enforces rate limits,
    records message with hashed IP, and dispatches an email notification.
    """

    permission_classes = [AllowAny]
    throttle_classes = [ContactHourlyThrottle, ContactDailyThrottle]

    @extend_schema(
        summary="Submit contact message",
        request=ContactSubmissionSerializer,
        responses={201: OpenApiTypes.OBJECT, 400: OpenApiTypes.OBJECT},
    )
    def post(self, request):
        serializer = ContactSubmissionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data

        # 1. Silent honeypot rejection for automated bots
        if data.get("website_hp"):
            return Response(
                {
                    "success": True,
                    "message": "Thank you! Your message has been sent successfully.",
                },
                status=status.HTTP_201_CREATED,
            )

        # 2. Cloudflare Turnstile Verification
        remote_ip = request.META.get("REMOTE_ADDR")
        turnstile_token = data.get("turnstile_token")
        if not verify_turnstile_token(turnstile_token, remote_ip=remote_ip):
            return Response(
                {
                    "detail": "Security check failed. Please refresh the page and try again."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # 3. Privacy-preserving SHA-256 IP hash
        ip_hash = ContactMessage.hash_ip(remote_ip)
        user_agent = request.META.get("HTTP_USER_AGENT", "")[:500]

        # 4. Save message to inbox
        message_obj = ContactMessage.objects.create(
            name=data["name"].strip(),
            email=data["email"].strip(),
            message=data["message"].strip(),
            ip_hash=ip_hash,
            user_agent=user_agent,
        )

        # 5. Dispatch notification email to Fenil Rami
        email_sent = False
        try:
            subject = f"New Portfolio Inquiry from {message_obj.name}"
            body = (
                f"You received a new inquiry on your portfolio website:\n\n"
                f"Name: {message_obj.name}\n"
                f"Email: {message_obj.email}\n"
                f"Date: {message_obj.created_at.strftime('%Y-%m-%d %H:%M:%S')}\n\n"
                f"Message:\n{message_obj.message}\n\n"
                f"---\n"
                f"View in admin: {request.build_absolute_uri('/admin/inbox/contactmessage/')}{message_obj.pk}/change/"
            )
            recipient = getattr(
                settings, "CONTACT_NOTIFICATION_EMAIL", "fenilrami1266@gmail.com"
            )
            send_mail(
                subject=subject,
                message=body,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[recipient],
                fail_silently=False,
            )
            email_sent = True
        except Exception as exc:
            logger.warning("Contact email notification failed to send: %s", exc)

        if email_sent:
            message_obj.email_sent = True
            message_obj.save(update_fields=["email_sent"])

        return Response(
            {
                "success": True,
                "message": "Thank you! Your message has been sent successfully.",
            },
            status=status.HTTP_201_CREATED,
        )


class HealthCheckView(APIView):
    """
    Lightweight health probe verifying database connectivity.
    """

    permission_classes = [AllowAny]

    @extend_schema(summary="Health check", responses={200: OpenApiTypes.OBJECT})
    def get(self, request):
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
            return Response({"status": "ok", "database": "healthy"})
        except Exception as exc:
            return Response(
                {"status": "error", "database": str(exc)},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
