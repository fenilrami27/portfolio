"""
Serializers for Admin Back-Office CRUD and Dashboard operations.
Supports full modification, file uploads, and inlines.
"""

from django.contrib.auth import get_user_model
from rest_framework import serializers

from apps.content.models import (
    Achievement,
    Certificate,
    Competency,
    Education,
    Experience,
    Hackathon,
    Leadership,
    SiteSettings,
    Skill,
    SkillGroup,
)
from apps.inbox.models import ContactMessage
from apps.profiles.models import Profile, ResumeVersion, RoleSought, SocialLink
from apps.projects.models import (
    Project,
)

User = get_user_model()


class AdminUserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    photo = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "username", "email", "is_staff", "is_superuser", "name", "photo"]

    def get_name(self, obj):
        profile = Profile.objects.first()
        return profile.full_name if profile else obj.get_full_name() or obj.username

    def get_photo(self, obj):
        profile = Profile.objects.first()
        if profile and profile.photo:
            return profile.photo.url
        return None


class AdminRoleSoughtSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoleSought
        fields = ["id", "name", "order"]


class AdminSocialLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialLink
        fields = ["id", "platform", "label", "url", "order", "is_visible"]


class AdminProfileSerializer(serializers.ModelSerializer):
    roles = serializers.SerializerMethodField()
    socials = serializers.SerializerMethodField()
    photo_url = serializers.SerializerMethodField()
    resume_info = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = [
            "id",
            "full_name",
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
            "photo_url",
            "photo_alt",
            "availability_status",
            "availability_note",
            "roles",
            "socials",
            "resume_info",
        ]
        read_only_fields = ["photo_url", "resume_info"]
        extra_kwargs = {
            "photo": {"required": False, "allow_null": True},
        }

    def get_roles(self, obj):
        return [r.name for r in obj.roles_sought.order_by("order", "id")]

    def get_socials(self, obj):
        return AdminSocialLinkSerializer(
            obj.social_links.order_by("order", "id"), many=True
        ).data

    def get_photo_url(self, obj):
        return obj.photo.url if obj.photo else None

    def get_resume_info(self, obj):
        active = ResumeVersion.objects.filter(is_active=True).first()
        if active:
            return {
                "id": active.id,
                "url": "/api/v1/resume/",
                "file_name": active.file.name.split("/")[-1],
                "uploaded_at": active.uploaded_at.isoformat(),
                "note": active.note,
            }
        return None


class AdminResumeVersionSerializer(serializers.ModelSerializer):
    file_name = serializers.SerializerMethodField()
    download_url = serializers.SerializerMethodField()

    class Meta:
        model = ResumeVersion
        fields = ["id", "file", "file_name", "download_url", "note", "uploaded_at", "is_active"]
        read_only_fields = ["uploaded_at", "file_name", "download_url"]

    def get_file_name(self, obj):
        return obj.file.name.split("/")[-1] if obj.file else ""

    def get_download_url(self, obj):
        return obj.file.url if obj.file else ""


class AdminProjectSerializer(serializers.ModelSerializer):
    stack = serializers.SerializerMethodField()
    cover_url = serializers.SerializerMethodField()
    feature_groups = serializers.SerializerMethodField()
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
            "type",
            "tier",
            "status",
            "started_on",
            "ended_on",
            "is_published",
            "is_featured",
            "is_employer_project",
            "github_url",
            "live_url",
            "video_url",
            "cover",
            "cover_url",
            "cover_alt",
            "order",
            "note",
            "stack",
            "feature_groups",
            "challenges",
        ]
        read_only_fields = ["cover_url", "note"]
        extra_kwargs = {
            "cover": {"required": False, "allow_null": True},
        }

    def get_note(self, obj):
        if obj.is_employer_project:
            return "Built independently during internship at Vibe Tech Labs. Employer reference available."
        return ""

    def get_stack(self, obj):
        return [t.name for t in obj.stack.all()]

    def get_cover_url(self, obj):
        return obj.cover.url if obj.cover else None

    def get_feature_groups(self, obj):
        res = []
        for g in obj.feature_groups.order_by("order", "id"):
            res.append({
                "id": g.id,
                "group": g.group,
                "order": g.order,
                "items": [item.text for item in g.items.order_by("order", "id")],
            })
        return res

    def get_challenges(self, obj):
        res = []
        for c in obj.challenges.order_by("order", "id"):
            res.append({
                "id": c.id,
                "title": c.title,
                "body": c.body,
                "order": c.order,
            })
        return res


class AdminSkillSerializer(serializers.ModelSerializer):
    group_name = serializers.CharField(source="group.name", read_only=True)

    class Meta:
        model = Skill
        fields = ["id", "group", "group_name", "name", "icon_key", "level", "order", "is_visible"]


class AdminSkillGroupSerializer(serializers.ModelSerializer):
    skills = serializers.SerializerMethodField()

    class Meta:
        model = SkillGroup
        fields = ["id", "name", "order", "skills"]

    def get_skills(self, obj):
        return AdminSkillSerializer(obj.skills.order_by("order", "id"), many=True).data


class AdminExperienceSerializer(serializers.ModelSerializer):
    bullets = serializers.SerializerMethodField()

    class Meta:
        model = Experience
        fields = [
            "id",
            "company",
            "role",
            "location",
            "start_date",
            "end_date",
            "is_current",
            "order",
            "bullets",
        ]

    def get_bullets(self, obj):
        return [b.text for b in obj.bullets.order_by("order", "id")]


class AdminEducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = ["id", "institution", "degree", "start_year", "end_year", "grade_label", "order"]


class AdminCertificateSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = Certificate
        fields = [
            "id",
            "title",
            "issuer",
            "issued_on",
            "credential_url",
            "file",
            "file_url",
            "order",
            "is_visible",
        ]
        read_only_fields = ["file_url"]
        extra_kwargs = {
            "file": {"required": False, "allow_null": True},
        }

    def get_file_url(self, obj):
        return obj.file.url if obj.file else None


class AdminAchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = ["id", "title", "organization", "issued_on", "description", "order", "is_visible"]


class AdminHackathonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hackathon
        fields = [
            "id",
            "event",
            "project_title",
            "result",
            "date",
            "link",
            "description",
            "order",
            "is_visible",
        ]


class AdminLeadershipSerializer(serializers.ModelSerializer):
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
            "is_visible",
        ]


class AdminContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = [
            "id",
            "name",
            "email",
            "message",
            "is_read",
            "created_at",
        ]
        read_only_fields = ["name", "email", "message", "created_at"]


class AdminSiteSettingsSerializer(serializers.ModelSerializer):
    og_image_url = serializers.SerializerMethodField()

    class Meta:
        model = SiteSettings
        fields = [
            "id",
            "site_title",
            "seo_title",
            "seo_description",
            "og_image",
            "og_image_url",
            "canonical_url",
            "contact_heading",
            "contact_text",
            "footer_text",
            "currently_building_title",
            "currently_building_text",
            "currently_building_status",
            "analytics_id",
        ]
        read_only_fields = ["og_image_url"]
        extra_kwargs = {
            "og_image": {"required": False, "allow_null": True},
        }

    def get_og_image_url(self, obj):
        return obj.og_image.url if obj.og_image else None


class AdminCompetencySerializer(serializers.ModelSerializer):
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

