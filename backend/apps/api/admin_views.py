"""
Admin API views for the frontend back-office management portal.
Provides full CRUD, authentication, file handling, dashboard statistics,
and immediate cache invalidation.
"""

import json

from django.contrib.auth import authenticate, get_user_model, update_session_auth_hash
from django.contrib.auth import login as django_login
from django.contrib.auth import logout as django_logout
from django.utils.text import slugify
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.api.admin_serializers import (
    AdminAchievementSerializer,
    AdminCertificateSerializer,
    AdminContactMessageSerializer,
    AdminEducationSerializer,
    AdminExperienceSerializer,
    AdminHackathonSerializer,
    AdminLeadershipSerializer,
    AdminProfileSerializer,
    AdminProjectSerializer,
    AdminResumeVersionSerializer,
    AdminSiteSettingsSerializer,
    AdminSkillGroupSerializer,
    AdminSkillSerializer,
    AdminUserSerializer,
)
from apps.content.models import (
    Achievement,
    Certificate,
    Education,
    Experience,
    ExperienceBullet,
    Hackathon,
    Leadership,
    SiteSettings,
    Skill,
    SkillGroup,
    Technology,
)
from apps.core.cache import clear_portfolio_cache
from apps.core.validators import validate_image_file, validate_pdf_file
from apps.inbox.models import ContactMessage
from apps.profiles.models import Profile, ResumeVersion, RoleSought, SocialLink
from apps.projects.models import (
    Project,
    ProjectChallenge,
    ProjectFeature,
    ProjectFeatureGroup,
)

User = get_user_model()


class AdminAuthLoginView(APIView):
    permission_classes = [AllowAny]
    parser_classes = [JSONParser, FormParser, MultiPartParser]

    def post(self, request):
        username = request.data.get("username", "").strip()
        password = request.data.get("password", "")

        if not username or not password:
            return Response(
                {"detail": "Please provide both username and password."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Authenticate case-insensitively if needed
        user = authenticate(request, username=username, password=password)
        if not user:
            # Check if username exists in lowercase
            user_obj = User.objects.filter(username__iexact=username).first()
            if user_obj and user_obj.check_password(password):
                user = user_obj

        if not user:
            return Response(
                {"detail": "Invalid username or password. Please verify your credentials."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if not (user.is_staff or user.is_superuser):
            return Response(
                {"detail": "Access restricted to authorized administrative staff."},
                status=status.HTTP_403_FORBIDDEN,
            )

        token, _ = Token.objects.get_or_create(user=user)
        django_login(request, user)

        return Response({
            "token": token.key,
            "user": AdminUserSerializer(user).data,
        })


class AdminAuthMeView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        return Response({
            "user": AdminUserSerializer(request.user).data,
        })


class AdminAuthLogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        Token.objects.filter(user=request.user).delete()
        django_logout(request)
        return Response({"detail": "Successfully logged out."})


class AdminAuthChangePasswordView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        old_password = request.data.get("old_password", "")
        new_password = request.data.get("new_password", "")

        if not old_password or not new_password:
            return Response(
                {"detail": "Both old password and new password are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not request.user.check_password(old_password):
            return Response(
                {"detail": "Incorrect current password."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if len(new_password) < 6:
            return Response(
                {"detail": "New password must be at least 6 characters long."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        request.user.set_password(new_password)
        request.user.save()
        update_session_auth_hash(request, request.user)

        # Ensure active token is updated
        Token.objects.filter(user=request.user).delete()
        token = Token.objects.create(user=request.user)

        return Response({
            "detail": "Password updated successfully.",
            "token": token.key,
        })


class AdminDashboardStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        profile = Profile.objects.first()
        active_resume = ResumeVersion.objects.filter(is_active=True).first()

        # Counts
        projects_count = Project.objects.count()
        published_projects_count = Project.objects.filter(is_published=True).count()
        skills_count = Skill.objects.count()
        experience_count = Experience.objects.count()
        education_count = Education.objects.count()
        certificates_count = Certificate.objects.count()
        messages_count = ContactMessage.objects.count()
        unread_messages_count = ContactMessage.objects.filter(is_read=False).count()

        # Profile completeness checklist
        checklist = [
            {"key": "name", "label": "Full Name", "completed": bool(profile and profile.full_name), "points": 10},
            {"key": "headline", "label": "Professional Headline", "completed": bool(profile and profile.headline), "points": 10},
            {"key": "photo", "label": "Profile Photo", "completed": bool(profile and profile.photo), "points": 15},
            {"key": "about", "label": "About Bio", "completed": bool(profile and profile.about), "points": 10},
            {"key": "contact", "label": "Contact Email & Location", "completed": bool(profile and profile.email and profile.location), "points": 10},
            {"key": "resume", "label": "Active Resume PDF", "completed": bool(active_resume and active_resume.file), "points": 15},
            {"key": "projects", "label": "Published Projects (≥ 1)", "completed": published_projects_count >= 1, "points": 15},
            {"key": "skills", "label": "Key Skills (≥ 5)", "completed": skills_count >= 5, "points": 10},
            {"key": "experience", "label": "Work Experience (≥ 1)", "completed": experience_count >= 1, "points": 5},
        ]
        score = sum(item["points"] for item in checklist if item["completed"])

        # Recent messages
        recent_messages = ContactMessage.objects.order_by("-created_at")[:5]
        # Recent projects
        recent_projects = Project.objects.order_by("order", "id")[:5]

        return Response({
            "counts": {
                "projects": projects_count,
                "published_projects": published_projects_count,
                "skills": skills_count,
                "experience": experience_count,
                "education": education_count,
                "certificates": certificates_count,
                "messages": messages_count,
                "unread_messages": unread_messages_count,
            },
            "completeness": {
                "score": min(score, 100),
                "checklist": checklist,
            },
            "recent_messages": AdminContactMessageSerializer(recent_messages, many=True).data,
            "recent_projects": AdminProjectSerializer(recent_projects, many=True).data,
        })


class AdminProfileView(APIView):
    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request):
        profile = Profile.objects.first()
        if not profile:
            profile = Profile.objects.create(full_name="Fenil Rami")
        return Response(AdminProfileSerializer(profile).data)

    def put(self, request):
        return self.patch(request)

    def patch(self, request):
        profile = Profile.objects.first()
        if not profile:
            profile = Profile.objects.create(full_name="Fenil Rami")

        data = request.data.copy()

        # Handle photo remove
        if data.get("remove_photo") in [True, "true", "True", "1"]:
            if profile.photo:
                profile.photo.delete(save=False)
            profile.photo = None
            data.pop("photo", None)

        # Handle photo upload
        photo_file = request.FILES.get("photo")
        if photo_file:
            validate_image_file(photo_file)
            profile.photo = photo_file

        # Text fields
        for field in [
            "full_name",
            "headline",
            "statement",
            "supporting_line",
            "about",
            "location",
            "email",
            "phone",
            "availability_status",
            "availability_note",
            "photo_alt",
        ]:
            if field in data:
                setattr(profile, field, data.get(field, ""))

        if "show_email" in data:
            profile.show_email = data.get("show_email") in [True, "true", "True", "1"]
        if "show_phone" in data:
            profile.show_phone = data.get("show_phone") in [True, "true", "True", "1"]

        profile.save()

        # Handle roles sought
        roles_sought = data.get("roles") or data.get("roles_sought")
        if roles_sought is not None:
            if isinstance(roles_sought, str):
                try:
                    roles_sought = json.loads(roles_sought)
                except Exception:
                    roles_sought = [r.strip() for r in roles_sought.split(",") if r.strip()]
            profile.roles_sought.all().delete()
            for idx, r_name in enumerate(roles_sought):
                if isinstance(r_name, dict):
                    r_name = r_name.get("name", "")
                if str(r_name).strip():
                    RoleSought.objects.create(profile=profile, name=str(r_name).strip(), order=idx)

        # Handle social links
        social_links = data.get("socials") or data.get("social_links")
        if social_links is not None:
            if isinstance(social_links, str):
                try:
                    social_links = json.loads(social_links)
                except Exception:
                    social_links = []
            profile.social_links.all().delete()
            for idx, s in enumerate(social_links):
                if isinstance(s, dict) and s.get("url"):
                    SocialLink.objects.create(
                        profile=profile,
                        platform=s.get("platform", "website"),
                        label=s.get("label", s.get("platform", "Link")),
                        url=s.get("url"),
                        order=s.get("order", idx),
                        is_visible=s.get("is_visible", True),
                    )

        clear_portfolio_cache()
        return Response(AdminProfileSerializer(profile).data)


class AdminResumeUploadView(APIView):
    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        file = request.FILES.get("file")
        if not file:
            return Response(
                {"detail": "No resume PDF file uploaded."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        validate_pdf_file(file)
        note = request.data.get("note", "Uploaded via Admin Portal")

        # Create new resume version (automatically activates and keeps max 10)
        resume_version = ResumeVersion.objects.create(file=file, note=note)

        clear_portfolio_cache()
        return Response(
            AdminResumeVersionSerializer(resume_version).data,
            status=status.HTTP_201_CREATED,
        )


class AdminProjectsView(APIView):
    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request):
        projects = Project.objects.all().order_by("order", "id")
        return Response(AdminProjectSerializer(projects, many=True).data)

    def post(self, request):
        data = request.data.copy()
        title = data.get("title", "").strip()
        if not title:
            return Response({"detail": "Title is required."}, status=status.HTTP_400_BAD_REQUEST)

        slug = data.get("slug") or slugify(title)
        # Ensure unique slug
        base_slug = slug
        count = 1
        while Project.objects.filter(slug=slug).exists():
            slug = f"{base_slug}-{count}"
            count += 1

        cover_file = request.FILES.get("cover")
        if cover_file:
            validate_image_file(cover_file)

        project = Project.objects.create(
            title=title,
            slug=slug,
            one_liner=data.get("one_liner", data.get("oneLiner", "")),
            description=data.get("description", ""),
            role=data.get("role", "Developer"),
            type=data.get("type", "Full Stack"),
            tier=data.get("tier", "featured"),
            status=data.get("status", "Completed"),
            started_on=data.get("started_on") or data.get("startedOn") or None,
            ended_on=data.get("ended_on") or data.get("endedOn") or None,
            is_published=data.get("is_published") in [True, "true", "True", "1"],
            is_featured=data.get("is_featured") in [True, "true", "True", "1"],
            github_url=data.get("github_url") or data.get("githubUrl") or "",
            live_url=data.get("live_url") or data.get("liveUrl") or "",
            video_url=data.get("video_url") or data.get("videoUrl") or "",
            cover=cover_file,
            order=int(data.get("order", 0) or 0),
        )

        # Handle stack
        stack_items = data.get("stack")
        if stack_items:
            if isinstance(stack_items, str):
                try:
                    stack_items = json.loads(stack_items)
                except Exception:
                    stack_items = [s.strip() for s in stack_items.split(",") if s.strip()]
            for tech_name in stack_items:
                tech, _ = Technology.objects.get_or_create(
                    name=tech_name.strip(),
                    defaults={"slug": slugify(tech_name.strip())},
                )
                project.stack.add(tech)

        clear_portfolio_cache()
        return Response(AdminProjectSerializer(project).data, status=status.HTTP_201_CREATED)


class AdminProjectDetailView(APIView):
    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request, pk):
        project = Project.objects.filter(pk=pk).first() or Project.objects.filter(slug=pk).first()
        if not project:
            return Response({"detail": "Project not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(AdminProjectSerializer(project).data)

    def patch(self, request, pk):
        project = Project.objects.filter(pk=pk).first() or Project.objects.filter(slug=pk).first()
        if not project:
            return Response({"detail": "Project not found."}, status=status.HTTP_404_NOT_FOUND)

        data = request.data.copy()

        # Cover handling
        if data.get("remove_cover") in [True, "true", "True", "1"]:
            if project.cover:
                project.cover.delete(save=False)
            project.cover = None
            data.pop("cover", None)

        cover_file = request.FILES.get("cover")
        if cover_file:
            validate_image_file(cover_file)
            project.cover = cover_file

        for field in [
            "title",
            "slug",
            "role",
            "type",
            "tier",
            "status",
            "cover_alt",
            "github_url",
            "live_url",
            "video_url",
        ]:
            if field in data:
                setattr(project, field, data.get(field, ""))

        if "one_liner" in data or "oneLiner" in data:
            project.one_liner = data.get("one_liner", data.get("oneLiner", ""))

        if "description" in data:
            desc = data.get("description")
            if isinstance(desc, list):
                desc = "\n\n".join(str(p) for p in desc)
            project.description = desc

        if "is_published" in data:
            project.is_published = data.get("is_published") in [True, "true", "True", "1"]
        if "is_featured" in data:
            project.is_featured = data.get("is_featured") in [True, "true", "True", "1"]
        if "order" in data:
            try:
                project.order = int(data.get("order", 0))
            except (ValueError, TypeError):
                pass

        project.save()

        # Handle stack
        if "stack" in data:
            stack_items = data.get("stack")
            if isinstance(stack_items, str):
                try:
                    stack_items = json.loads(stack_items)
                except Exception:
                    stack_items = [s.strip() for s in stack_items.split(",") if s.strip()]
            project.stack.clear()
            for tech_name in stack_items:
                tech, _ = Technology.objects.get_or_create(
                    name=tech_name.strip(),
                    defaults={"slug": slugify(tech_name.strip())},
                )
                project.stack.add(tech)

        # Handle feature groups
        if "feature_groups" in data or "featureGroups" in data:
            fg_list = data.get("feature_groups") or data.get("featureGroups")
            if isinstance(fg_list, str):
                try:
                    fg_list = json.loads(fg_list)
                except Exception:
                    fg_list = []
            if isinstance(fg_list, list):
                project.feature_groups.all().delete()
                for g_idx, g_data in enumerate(fg_list):
                    if isinstance(g_data, dict) and g_data.get("group"):
                        group_obj = ProjectFeatureGroup.objects.create(
                            project=project,
                            group=g_data.get("group"),
                            order=g_data.get("order", g_idx),
                        )
                        items = g_data.get("items", [])
                        for i_idx, item_text in enumerate(items):
                            if str(item_text).strip():
                                ProjectFeature.objects.create(
                                    feature_group=group_obj,
                                    text=str(item_text).strip(),
                                    order=i_idx,
                                )

        # Handle challenges
        if "challenges" in data:
            ch_list = data.get("challenges")
            if isinstance(ch_list, str):
                try:
                    ch_list = json.loads(ch_list)
                except Exception:
                    ch_list = []
            if isinstance(ch_list, list):
                project.challenges.all().delete()
                for c_idx, c_data in enumerate(ch_list):
                    if isinstance(c_data, dict) and c_data.get("title"):
                        ProjectChallenge.objects.create(
                            project=project,
                            title=c_data.get("title"),
                            body=c_data.get("body", ""),
                            order=c_data.get("order", c_idx),
                        )

        clear_portfolio_cache()
        return Response(AdminProjectSerializer(project).data)

    def delete(self, request, pk):
        project = Project.objects.filter(pk=pk).first() or Project.objects.filter(slug=pk).first()
        if not project:
            return Response({"detail": "Project not found."}, status=status.HTTP_404_NOT_FOUND)
        project.delete()
        clear_portfolio_cache()
        return Response({"detail": "Project deleted successfully."}, status=status.HTTP_204_NO_CONTENT)


class AdminSkillsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        groups = SkillGroup.objects.all().order_by("order", "id")
        return Response(AdminSkillGroupSerializer(groups, many=True).data)

    def post(self, request):
        data = request.data
        group_id = data.get("group_id") or data.get("group")
        group_name = data.get("group_name", "General").strip()

        if group_id:
            group = SkillGroup.objects.filter(id=group_id).first()
        else:
            group, _ = SkillGroup.objects.get_or_create(name=group_name)

        name = data.get("name", "").strip()
        if not name:
            return Response({"detail": "Skill name is required."}, status=status.HTTP_400_BAD_REQUEST)

        skill = Skill.objects.create(
            group=group,
            name=name,
            icon_key=data.get("icon_key", data.get("iconKey", "LuCode")),
            level=data.get("level", "comfortable"),
            order=int(data.get("order", 0) or 0),
            is_visible=data.get("is_visible", True),
        )
        clear_portfolio_cache()
        return Response(AdminSkillSerializer(skill).data, status=status.HTTP_201_CREATED)


class AdminSkillDetailView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, pk):
        skill = Skill.objects.filter(pk=pk).first()
        if not skill:
            return Response({"detail": "Skill not found."}, status=status.HTTP_404_NOT_FOUND)

        data = request.data
        if "name" in data:
            skill.name = data["name"]
        if "icon_key" in data:
            skill.icon_key = data["icon_key"]
        if "level" in data:
            skill.level = data["level"]
        if "is_visible" in data:
            skill.is_visible = data["is_visible"] in [True, "true", "True", "1"]
        if "order" in data:
            skill.order = int(data["order"])
        if "group_id" in data:
            group = SkillGroup.objects.filter(id=data["group_id"]).first()
            if group:
                skill.group = group

        skill.save()
        clear_portfolio_cache()
        return Response(AdminSkillSerializer(skill).data)

    def delete(self, request, pk):
        skill = Skill.objects.filter(pk=pk).first()
        if not skill:
            return Response({"detail": "Skill not found."}, status=status.HTTP_404_NOT_FOUND)
        skill.delete()
        clear_portfolio_cache()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AdminExperienceView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        experiences = Experience.objects.all().order_by("order", "-start_date")
        return Response(AdminExperienceSerializer(experiences, many=True).data)

    def post(self, request):
        data = request.data
        company = data.get("company", "").strip()
        role = data.get("role", "").strip()
        if not company or not role:
            return Response({"detail": "Company and role are required."}, status=status.HTTP_400_BAD_REQUEST)

        exp = Experience.objects.create(
            company=company,
            role=role,
            location=data.get("location", ""),
            start_date=data.get("start_date") or data.get("start") or "",
            end_date=data.get("end_date") or data.get("end") or "",
            is_current=data.get("is_current", data.get("current", False)) in [True, "true", "True", "1"],
            order=int(data.get("order", 0) or 0),
        )

        bullets = data.get("bullets", [])
        if isinstance(bullets, str):
            try:
                bullets = json.loads(bullets)
            except Exception:
                bullets = [b.strip() for b in bullets.split("\n") if b.strip()]
        for b_idx, bullet in enumerate(bullets):
            if str(bullet).strip():
                ExperienceBullet.objects.create(experience=exp, text=str(bullet).strip(), order=b_idx)

        clear_portfolio_cache()
        return Response(AdminExperienceSerializer(exp).data, status=status.HTTP_201_CREATED)


class AdminExperienceDetailView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, pk):
        exp = Experience.objects.filter(pk=pk).first()
        if not exp:
            return Response({"detail": "Experience not found."}, status=status.HTTP_404_NOT_FOUND)

        data = request.data
        for field in ["company", "role", "location"]:
            if field in data:
                setattr(exp, field, data[field])

        if "start_date" in data or "start" in data:
            exp.start_date = data.get("start_date", data.get("start", ""))
        if "end_date" in data or "end" in data:
            exp.end_date = data.get("end_date", data.get("end", ""))
        if "is_current" in data or "current" in data:
            exp.is_current = data.get("is_current", data.get("current", False)) in [True, "true", "True", "1"]
        if "order" in data:
            exp.order = int(data["order"])

        exp.save()

        if "bullets" in data:
            bullets = data["bullets"]
            if isinstance(bullets, str):
                try:
                    bullets = json.loads(bullets)
                except Exception:
                    bullets = [b.strip() for b in bullets.split("\n") if b.strip()]
            exp.bullets.all().delete()
            for b_idx, bullet in enumerate(bullets):
                if str(bullet).strip():
                    ExperienceBullet.objects.create(experience=exp, text=str(bullet).strip(), order=b_idx)

        clear_portfolio_cache()
        return Response(AdminExperienceSerializer(exp).data)

    def delete(self, request, pk):
        exp = Experience.objects.filter(pk=pk).first()
        if not exp:
            return Response({"detail": "Experience not found."}, status=status.HTTP_404_NOT_FOUND)
        exp.delete()
        clear_portfolio_cache()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AdminEducationView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        items = Education.objects.all().order_by("order", "-start_year")
        return Response(AdminEducationSerializer(items, many=True).data)

    def post(self, request):
        data = request.data
        institution = data.get("institution", "").strip()
        degree = data.get("degree", "").strip()
        if not institution or not degree:
            return Response({"detail": "Institution and degree are required."}, status=status.HTTP_400_BAD_REQUEST)

        edu = Education.objects.create(
            institution=institution,
            degree=degree,
            start_year=data.get("start_year") or data.get("start") or "",
            end_year=data.get("end_year") or data.get("end") or "",
            grade_label=data.get("grade_label") or data.get("grade") or "",
            order=int(data.get("order", 0) or 0),
        )
        clear_portfolio_cache()
        return Response(AdminEducationSerializer(edu).data, status=status.HTTP_201_CREATED)


class AdminEducationDetailView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, pk):
        edu = Education.objects.filter(pk=pk).first()
        if not edu:
            return Response({"detail": "Education record not found."}, status=status.HTTP_404_NOT_FOUND)

        data = request.data
        for field in ["institution", "degree"]:
            if field in data:
                setattr(edu, field, data[field])

        if "start_year" in data or "start" in data:
            edu.start_year = data.get("start_year", data.get("start", ""))
        if "end_year" in data or "end" in data:
            edu.end_year = data.get("end_year", data.get("end", ""))
        if "grade_label" in data or "grade" in data:
            edu.grade_label = data.get("grade_label", data.get("grade", ""))
        if "order" in data:
            edu.order = int(data["order"])

        edu.save()
        clear_portfolio_cache()
        return Response(AdminEducationSerializer(edu).data)

    def delete(self, request, pk):
        edu = Education.objects.filter(pk=pk).first()
        if not edu:
            return Response({"detail": "Education record not found."}, status=status.HTTP_404_NOT_FOUND)
        edu.delete()
        clear_portfolio_cache()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AdminCertificatesView(APIView):
    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request):
        items = Certificate.objects.all().order_by("order", "id")
        return Response(AdminCertificateSerializer(items, many=True).data)

    def post(self, request):
        data = request.data
        title = data.get("title", data.get("name", "")).strip()
        issuer = data.get("issuer", "").strip()
        if not title:
            return Response({"detail": "Certificate title is required."}, status=status.HTTP_400_BAD_REQUEST)

        file = request.FILES.get("file")
        cert = Certificate.objects.create(
            title=title,
            issuer=issuer,
            issued_on=data.get("issued_on", data.get("date", "")),
            credential_url=data.get("credential_url", ""),
            file=file,
            order=int(data.get("order", 0) or 0),
            is_visible=data.get("is_visible", True) in [True, "true", "True", "1"],
        )
        clear_portfolio_cache()
        return Response(AdminCertificateSerializer(cert).data, status=status.HTTP_201_CREATED)


class AdminCertificateDetailView(APIView):
    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def patch(self, request, pk):
        cert = Certificate.objects.filter(pk=pk).first()
        if not cert:
            return Response({"detail": "Certificate not found."}, status=status.HTTP_404_NOT_FOUND)

        data = request.data
        if "title" in data or "name" in data:
            cert.title = data.get("title", data.get("name", ""))
        if "issuer" in data:
            cert.issuer = data["issuer"]
        if "issued_on" in data or "date" in data:
            cert.issued_on = data.get("issued_on", data.get("date", ""))
        if "credential_url" in data:
            cert.credential_url = data["credential_url"]
        if "is_visible" in data:
            cert.is_visible = data["is_visible"] in [True, "true", "True", "1"]
        if "order" in data:
            cert.order = int(data["order"])

        file = request.FILES.get("file")
        if file:
            cert.file = file

        cert.save()
        clear_portfolio_cache()
        return Response(AdminCertificateSerializer(cert).data)

    def delete(self, request, pk):
        cert = Certificate.objects.filter(pk=pk).first()
        if not cert:
            return Response({"detail": "Certificate not found."}, status=status.HTTP_404_NOT_FOUND)
        cert.delete()
        clear_portfolio_cache()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AdminAchievementsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        achievements = Achievement.objects.all().order_by("order", "id")
        hackathons = Hackathon.objects.all().order_by("order", "id")
        return Response({
            "achievements": AdminAchievementSerializer(achievements, many=True).data,
            "hackathons": AdminHackathonSerializer(hackathons, many=True).data,
        })

    def post(self, request):
        data = request.data
        kind = data.get("kind", "achievement")

        if kind == "hackathon":
            event = data.get("event", data.get("name", "")).strip()
            if not event:
                return Response({"detail": "Hackathon event name is required."}, status=status.HTTP_400_BAD_REQUEST)
            item = Hackathon.objects.create(
                event=event,
                project_title=data.get("project_title", data.get("title", "")),
                result=data.get("result", ""),
                date=data.get("date", ""),
                link=data.get("link", ""),
                description=data.get("description", ""),
                order=int(data.get("order", 0) or 0),
                is_visible=data.get("is_visible", True) in [True, "true", "True", "1"],
            )
            clear_portfolio_cache()
            return Response({"hackathon": AdminHackathonSerializer(item).data}, status=status.HTTP_201_CREATED)
        else:
            title = data.get("title", "").strip()
            if not title:
                return Response({"detail": "Achievement title is required."}, status=status.HTTP_400_BAD_REQUEST)
            item = Achievement.objects.create(
                title=title,
                organization=data.get("organization", ""),
                issued_on=data.get("issued_on", data.get("date", "")),
                description=data.get("description", ""),
                order=int(data.get("order", 0) or 0),
                is_visible=data.get("is_visible", True) in [True, "true", "True", "1"],
            )
            clear_portfolio_cache()
            return Response({"achievement": AdminAchievementSerializer(item).data}, status=status.HTTP_201_CREATED)


class AdminAchievementDetailView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, pk):
        item = Achievement.objects.filter(pk=pk).first()
        if not item:
            return Response({"detail": "Achievement not found."}, status=status.HTTP_404_NOT_FOUND)

        data = request.data
        for field in ["title", "organization", "description"]:
            if field in data:
                setattr(item, field, data[field])
        if "issued_on" in data or "date" in data:
            item.issued_on = data.get("issued_on", data.get("date", ""))
        if "is_visible" in data:
            item.is_visible = data["is_visible"] in [True, "true", "True", "1"]
        if "order" in data:
            item.order = int(data["order"])

        item.save()
        clear_portfolio_cache()
        return Response(AdminAchievementSerializer(item).data)

    def delete(self, request, pk):
        item = Achievement.objects.filter(pk=pk).first()
        if not item:
            return Response({"detail": "Achievement not found."}, status=status.HTTP_404_NOT_FOUND)
        item.delete()
        clear_portfolio_cache()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AdminHackathonDetailView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, pk):
        item = Hackathon.objects.filter(pk=pk).first()
        if not item:
            return Response({"detail": "Hackathon not found."}, status=status.HTTP_404_NOT_FOUND)

        data = request.data
        if "event" in data or "name" in data:
            item.event = data.get("event", data.get("name", ""))
        if "project_title" in data or "title" in data:
            item.project_title = data.get("project_title", data.get("title", ""))
        if "result" in data:
            item.result = data["result"]
        if "date" in data:
            item.date = data["date"]
        if "link" in data:
            item.link = data["link"]
        if "description" in data:
            item.description = data["description"]
        if "is_visible" in data:
            item.is_visible = data["is_visible"] in [True, "true", "True", "1"]
        if "order" in data:
            item.order = int(data["order"])

        item.save()
        clear_portfolio_cache()
        return Response(AdminHackathonSerializer(item).data)

    def delete(self, request, pk):
        item = Hackathon.objects.filter(pk=pk).first()
        if not item:
            return Response({"detail": "Hackathon not found."}, status=status.HTTP_404_NOT_FOUND)
        item.delete()
        clear_portfolio_cache()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AdminLeadershipView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        items = Leadership.objects.all().order_by("order", "id")
        return Response(AdminLeadershipSerializer(items, many=True).data)

    def post(self, request):
        data = request.data
        title = data.get("title", "").strip()
        org = data.get("organization", "").strip()
        if not title:
            return Response({"detail": "Title is required."}, status=status.HTTP_400_BAD_REQUEST)

        item = Leadership.objects.create(
            title=title,
            organization=org,
            description=data.get("description", ""),
            start_label=data.get("start_label", data.get("start", "")),
            end_label=data.get("end_label", data.get("end", "")),
            order=int(data.get("order", 0) or 0),
            is_visible=data.get("is_visible", True) in [True, "true", "True", "1"],
        )
        clear_portfolio_cache()
        return Response(AdminLeadershipSerializer(item).data, status=status.HTTP_201_CREATED)


class AdminLeadershipDetailView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, pk):
        item = Leadership.objects.filter(pk=pk).first()
        if not item:
            return Response({"detail": "Leadership entry not found."}, status=status.HTTP_404_NOT_FOUND)

        data = request.data
        for field in ["title", "organization", "description"]:
            if field in data:
                setattr(item, field, data[field])
        if "start_label" in data or "start" in data:
            item.start_label = data.get("start_label", data.get("start", ""))
        if "end_label" in data or "end" in data:
            item.end_label = data.get("end_label", data.get("end", ""))
        if "is_visible" in data:
            item.is_visible = data["is_visible"] in [True, "true", "True", "1"]
        if "order" in data:
            item.order = int(data["order"])

        item.save()
        clear_portfolio_cache()
        return Response(AdminLeadershipSerializer(item).data)

    def delete(self, request, pk):
        item = Leadership.objects.filter(pk=pk).first()
        if not item:
            return Response({"detail": "Leadership entry not found."}, status=status.HTTP_404_NOT_FOUND)
        item.delete()
        clear_portfolio_cache()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AdminMessagesView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        messages = ContactMessage.objects.all().order_by("-created_at")
        return Response(AdminContactMessageSerializer(messages, many=True).data)


class AdminMessageDetailView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, pk):
        msg = ContactMessage.objects.filter(pk=pk).first()
        if not msg:
            return Response({"detail": "Message not found."}, status=status.HTTP_404_NOT_FOUND)

        data = request.data
        if "is_read" in data:
            msg.is_read = data["is_read"] in [True, "true", "True", "1"]
            msg.save()

        return Response(AdminContactMessageSerializer(msg).data)

    def delete(self, request, pk):
        msg = ContactMessage.objects.filter(pk=pk).first()
        if not msg:
            return Response({"detail": "Message not found."}, status=status.HTTP_404_NOT_FOUND)
        msg.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AdminSiteSettingsView(APIView):
    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request):
        settings_obj = SiteSettings.objects.first()
        if not settings_obj:
            settings_obj = SiteSettings.objects.create(site_title="Fenil Rami · Portfolio")
        return Response(AdminSiteSettingsSerializer(settings_obj).data)

    def put(self, request):
        return self.patch(request)

    def patch(self, request):
        settings_obj = SiteSettings.objects.first()
        if not settings_obj:
            settings_obj = SiteSettings.objects.create(site_title="Fenil Rami · Portfolio")

        data = request.data
        for field in [
            "site_title",
            "seo_title",
            "seo_description",
            "canonical_url",
            "contact_heading",
            "contact_text",
            "footer_text",
            "currently_building_title",
            "currently_building_text",
            "currently_building_status",
            "analytics_id",
        ]:
            if field in data:
                setattr(settings_obj, field, data[field])

        og_file = request.FILES.get("og_image")
        if og_file:
            validate_image_file(og_file)
            settings_obj.og_image = og_file

        settings_obj.save()
        clear_portfolio_cache()
        return Response(AdminSiteSettingsSerializer(settings_obj).data)
