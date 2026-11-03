"""
Serializers for portfolio API endpoints and bundled payloads.
Outputs camelCase JSON automatically via djangorestframework-camel-case.
"""

from datetime import date

from drf_spectacular.utils import OpenApiTypes, extend_schema_field
from rest_framework import serializers

from apps.content.models import (
    Achievement,
    Certificate,
    Competency,
    Education,
    Experience,
    ExperienceBullet,
    FocusArea,
    Hackathon,
    JourneyItem,
    Leadership,
    SiteSettings,
    Skill,
    SkillGroup,
    Stat,
    Technology,
    Testimonial,
)
from apps.core.storage import get_image_metadata
from apps.profiles.models import Profile, RoleSought, SocialLink
from apps.projects.models import (
    Project,
    ProjectChallenge,
    ProjectFeatureGroup,
    ProjectImage,
)


class ImageMetadataSerializer(serializers.Serializer):
    url = serializers.CharField()
    width = serializers.IntegerField(allow_null=True)
    height = serializers.IntegerField(allow_null=True)
    alt = serializers.CharField(allow_blank=True)
    srcset = serializers.CharField(allow_null=True, allow_blank=True)


class RoleSoughtSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoleSought
        fields = ["name", "order"]


class SocialLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialLink
        fields = ["platform", "label", "url", "order"]


class ProfileSerializer(serializers.ModelSerializer):
    roles = serializers.SerializerMethodField()
    socials = serializers.SerializerMethodField()
    availability = serializers.SerializerMethodField()
    photo = serializers.SerializerMethodField()
    resume_url = serializers.SerializerMethodField()
    name = serializers.CharField(source="full_name")

    class Meta:
        model = Profile
        fields = [
            "name",
            "headline",
            "statement",
            "supporting_line",
            "about",
            "location",
            "email",
            "show_email",
            "phone",
            "show_phone",
            "photo",
            "availability",
            "roles",
            "socials",
            "resume_url",
        ]

    @extend_schema_field(serializers.ListField(child=serializers.CharField()))
    def get_roles(self, obj):
        return list(
            obj.roles_sought.order_by("order", "id").values_list("name", flat=True)
        )

    @extend_schema_field(SocialLinkSerializer(many=True))
    def get_socials(self, obj):
        links = obj.social_links.filter(is_visible=True).order_by("order", "id")
        return SocialLinkSerializer(links, many=True).data

    @extend_schema_field(OpenApiTypes.OBJECT)
    def get_availability(self, obj):
        return {
            "status": obj.get_availability_status_display(),
            "roles": list(
                obj.roles_sought.order_by("order", "id").values_list("name", flat=True)
            ),
            "note": obj.availability_note,
        }

    @extend_schema_field(ImageMetadataSerializer)
    def get_photo(self, obj):
        if not obj.photo:
            return None
        return get_image_metadata(obj.photo, alt=obj.photo_alt)

    @extend_schema_field(OpenApiTypes.STR)
    def get_resume_url(self, obj):
        return "/api/v1/resume/"


class SiteSettingsSerializer(serializers.ModelSerializer):
    og_image = serializers.SerializerMethodField()

    class Meta:
        model = SiteSettings
        fields = [
            "site_title",
            "seo_title",
            "seo_description",
            "og_image",
            "canonical_url",
            "contact_heading",
            "contact_text",
            "footer_text",
            "currently_building_title",
            "currently_building_text",
            "currently_building_status",
            "experience_start_date",
            "analytics_id",
        ]

    @extend_schema_field(ImageMetadataSerializer)
    def get_og_image(self, obj):
        if not obj.og_image:
            return None
        return get_image_metadata(obj.og_image, alt=obj.site_title)


class FocusAreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = FocusArea
        fields = ["id", "title", "description", "icon_key", "order"]


class CompetencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Competency
        fields = [
            "id",
            "title",
            "code",
            "full_name",
            "description",
            "icon_key",
            "order",
            "is_visible",
        ]



class StatSerializer(serializers.ModelSerializer):
    computed_value = serializers.SerializerMethodField()

    class Meta:
        model = Stat
        fields = [
            "id",
            "label",
            "value",
            "computed_value",
            "suffix",
            "note",
            "kind",
            "order",
        ]

    def get_computed_value(self, obj):
        if obj.kind == Stat.StatKind.PROJECTS_COUNT:
            return Project.objects.filter(is_published=True).count()
        elif obj.kind == Stat.StatKind.EXPERIENCE_MONTHS:
            settings_obj = SiteSettings.load()
            start = settings_obj.experience_start_date or date(2026, 6, 1)
            today = date.today()
            months = max(
                1, (today.year - start.year) * 12 + (today.month - start.month) + 1
            )
            return months
        return obj.value


class SkillSerializer(serializers.ModelSerializer):
    icon = serializers.CharField(source="icon_key")

    class Meta:
        model = Skill
        fields = ["name", "icon", "level", "order"]


class SkillGroupSerializer(serializers.ModelSerializer):
    group = serializers.CharField(source="name")
    items = serializers.SerializerMethodField()

    class Meta:
        model = SkillGroup
        fields = ["group", "order", "items"]

    @extend_schema_field(SkillSerializer(many=True))
    def get_items(self, obj):
        return SkillSerializer(
            [s for s in obj.skills.all() if s.is_visible], many=True
        ).data


class ExperienceBulletSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExperienceBullet
        fields = ["text", "order"]


class ExperienceSerializer(serializers.ModelSerializer):
    start = serializers.CharField(source="start_date")
    end = serializers.CharField(source="end_date")
    current = serializers.BooleanField(source="is_current")
    bullets = serializers.SerializerMethodField()

    class Meta:
        model = Experience
        fields = [
            "id",
            "company",
            "role",
            "location",
            "start",
            "end",
            "current",
            "bullets",
            "order",
        ]

    @extend_schema_field(serializers.ListField(child=serializers.CharField()))
    def get_bullets(self, obj):
        return [b.text for b in obj.bullets.all()]


class EducationSerializer(serializers.ModelSerializer):
    start = serializers.CharField(source="start_year")
    end = serializers.CharField(source="end_year")
    grade = serializers.CharField(source="grade_label")

    class Meta:
        model = Education
        fields = ["id", "institution", "degree", "start", "end", "grade", "order"]


class JourneyItemSerializer(serializers.ModelSerializer):
    period = serializers.CharField(source="date_label")

    class Meta:
        model = JourneyItem
        fields = ["id", "title", "description", "period", "kind", "order"]


class LeadershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Leadership
        fields = [
            "id",
            "title",
            "organization",
            "description",
            "start_label",
            "end_label",
            "order",
        ]


class CertificateSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="title")
    date = serializers.CharField(source="issued_on")

    class Meta:
        model = Certificate
        fields = ["id", "name", "issuer", "date", "credential_url", "order"]


class HackathonSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="event")

    class Meta:
        model = Hackathon
        fields = ["id", "name", "date", "result", "link", "description", "order"]


class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = ["id", "title", "description", "date", "link", "order"]


class TestimonialSerializer(serializers.ModelSerializer):
    photo = serializers.SerializerMethodField()

    class Meta:
        model = Testimonial
        fields = ["id", "name", "role", "company", "quote", "photo", "order"]

    @extend_schema_field(ImageMetadataSerializer)
    def get_photo(self, obj):
        if not obj.photo:
            return None
        return get_image_metadata(obj.photo, alt=obj.name)


class TechnologySerializer(serializers.ModelSerializer):
    class Meta:
        model = Technology
        fields = ["id", "name", "slug", "icon_key", "category"]


class ProjectImageSerializer(serializers.ModelSerializer):
    src = serializers.SerializerMethodField()

    class Meta:
        model = ProjectImage
        fields = ["src", "alt", "caption", "order"]

    @extend_schema_field(OpenApiTypes.STR)
    def get_src(self, obj):
        return obj.image.url if obj.image else ""


class ProjectFeatureGroupSerializer(serializers.ModelSerializer):
    items = serializers.SerializerMethodField()

    class Meta:
        model = ProjectFeatureGroup
        fields = ["group", "order", "items"]

    @extend_schema_field(serializers.ListField(child=serializers.CharField()))
    def get_items(self, obj):
        return [item.text for item in obj.items.all()]


class ProjectChallengeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectChallenge
        fields = ["title", "body", "order"]


class ProjectSummarySerializer(serializers.ModelSerializer):
    stack = serializers.SerializerMethodField()
    cover = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            "id",
            "title",
            "slug",
            "one_liner",
            "role",
            "status",
            "type",
            "tier",
            "stack",
            "live_url",
            "github_url",
            "video_url",
            "cover",
            "is_featured",
            "is_published",
            "order",
        ]

    @extend_schema_field(serializers.ListField(child=serializers.CharField()))
    def get_stack(self, obj):
        return [t.name for t in obj.stack.all()]

    @extend_schema_field(ImageMetadataSerializer)
    def get_cover(self, obj):
        if not obj.cover:
            return None
        return get_image_metadata(obj.cover, alt=obj.cover_alt or obj.title)


class ProjectDetailSerializer(serializers.ModelSerializer):
    stack = serializers.SerializerMethodField()
    cover = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    feature_groups = serializers.SerializerMethodField()
    gallery = serializers.SerializerMethodField()
    challenges = serializers.SerializerMethodField()
    note = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            "id",
            "title",
            "slug",
            "one_liner",
            "description",
            "role",
            "status",
            "type",
            "tier",
            "stack",
            "live_url",
            "github_url",
            "video_url",
            "cover",
            "gallery",
            "feature_groups",
            "challenges",
            "note",
            "is_featured",
            "is_published",
            "order",
            "started_on",
            "ended_on",
            "is_employer_project",
        ]

    @extend_schema_field(serializers.ListField(child=serializers.CharField()))
    def get_stack(self, obj):
        return [t.name for t in obj.stack.all()]

    @extend_schema_field(ImageMetadataSerializer)
    def get_cover(self, obj):
        if not obj.cover:
            return None
        return get_image_metadata(obj.cover, alt=obj.cover_alt or obj.title)

    @extend_schema_field(serializers.ListField(child=serializers.CharField()))
    def get_description(self, obj):
        return obj.get_description_paragraphs()

    @extend_schema_field(ProjectFeatureGroupSerializer(many=True))
    def get_feature_groups(self, obj):
        return ProjectFeatureGroupSerializer(obj.feature_groups.all(), many=True).data

    @extend_schema_field(ProjectImageSerializer(many=True))
    def get_gallery(self, obj):
        return ProjectImageSerializer(obj.images.all(), many=True).data

    @extend_schema_field(ProjectChallengeSerializer(many=True))
    def get_challenges(self, obj):
        return ProjectChallengeSerializer(obj.challenges.all(), many=True).data

    @extend_schema_field(OpenApiTypes.STR)
    def get_note(self, obj):
        if obj.is_employer_project:
            return "Built independently during internship at Vibe Tech Labs. Employer reference available."
        if "replica" in (obj.one_liner or "").lower() or "sample" in (obj.one_liner or "").lower():
            return "Built during my internship as a learning replica of a company website; all images and logos are sample data."
        return ""


class ContactSubmissionSerializer(serializers.Serializer):
    name = serializers.CharField(
        max_length=150,
        min_length=2,
        error_messages={
            "required": "Please enter your name.",
            "blank": "Please enter your name.",
        },
    )
    email = serializers.EmailField(
        error_messages={
            "required": "Please enter your email address.",
            "invalid": "Please enter a valid email address.",
        }
    )
    message = serializers.CharField(
        min_length=10,
        error_messages={
            "required": "Please enter a message.",
            "min_length": "Message must be at least 10 characters long.",
        },
    )
    website_hp = serializers.CharField(required=False, allow_blank=True, default="")
    turnstile_token = serializers.CharField(
        required=False, allow_blank=True, default=""
    )
