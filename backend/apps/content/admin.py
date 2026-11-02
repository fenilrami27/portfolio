"""
Unfold admin configuration for content models.
"""

from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from unfold.admin import ModelAdmin, TabularInline

from apps.content.models import (
    Achievement,
    Certificate,
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
from apps.core.admin import SingletonModelAdmin, display_thumbnail


@admin.register(SiteSettings)
class SiteSettingsAdmin(SingletonModelAdmin):
    fieldsets = (
        (
            _("Global SEO & Metadata"),
            {
                "fields": (
                    "site_title",
                    "seo_title",
                    "seo_description",
                    "og_image",
                    "canonical_url",
                    "analytics_id",
                ),
            },
        ),
        (
            _("Public Contact Section Copy"),
            {
                "fields": (
                    "contact_heading",
                    "contact_text",
                ),
            },
        ),
        (
            _("Footer Information"),
            {
                "fields": ("footer_text",),
            },
        ),
        (
            _('Active Sprint ("Currently Building")'),
            {
                "fields": (
                    "currently_building_title",
                    "currently_building_status",
                    "currently_building_text",
                ),
            },
        ),
        (
            _("Metrics Configuration"),
            {
                "fields": ("experience_start_date",),
                "description": _(
                    "Used to dynamically calculate experience months for overview metrics."
                ),
            },
        ),
    )


@admin.register(FocusArea)
class FocusAreaAdmin(ModelAdmin):
    list_display = ("title", "icon_key", "order", "is_visible")
    list_editable = ("order", "is_visible")
    search_fields = ("title", "description")


@admin.register(Stat)
class StatAdmin(ModelAdmin):
    list_display = ("label", "value", "suffix", "kind", "order", "is_visible")
    list_editable = ("order", "is_visible")
    list_filter = ("kind", "is_visible")
    search_fields = ("label", "note")


class SkillInline(TabularInline):
    model = Skill
    extra = 1
    fields = ("name", "icon_key", "level", "order", "is_visible")


@admin.register(SkillGroup)
class SkillGroupAdmin(ModelAdmin):
    list_display = ("name", "order", "skills_count")
    list_editable = ("order",)
    search_fields = ("name",)
    inlines = [SkillInline]

    def skills_count(self, obj):
        return obj.skills.count()

    skills_count.short_description = _("Total Skills")


class ExperienceBulletInline(TabularInline):
    model = ExperienceBullet
    extra = 2
    fields = ("text", "order")


@admin.register(Experience)
class ExperienceAdmin(ModelAdmin):
    list_display = (
        "role",
        "company",
        "location",
        "start_date",
        "end_date",
        "is_current",
        "order",
    )
    list_editable = ("order", "is_current")
    search_fields = ("role", "company", "location")
    inlines = [ExperienceBulletInline]


@admin.register(Education)
class EducationAdmin(ModelAdmin):
    list_display = (
        "degree",
        "institution",
        "start_year",
        "end_year",
        "grade_label",
        "order",
    )
    list_editable = ("order",)
    search_fields = ("degree", "institution")


@admin.register(JourneyItem)
class JourneyItemAdmin(ModelAdmin):
    list_display = ("title", "date_label", "kind", "order", "is_visible")
    list_editable = ("order", "is_visible")
    list_filter = ("kind", "is_visible")
    search_fields = ("title", "description")


@admin.register(Leadership)
class LeadershipAdmin(ModelAdmin):
    list_display = (
        "title",
        "organization",
        "start_label",
        "end_label",
        "order",
        "is_visible",
    )
    list_editable = ("order", "is_visible")
    search_fields = ("title", "organization", "description")


@admin.register(Certificate)
class CertificateAdmin(ModelAdmin):
    list_display = ("title", "issuer", "issued_on", "order", "is_visible")
    list_editable = ("order", "is_visible")
    search_fields = ("title", "issuer")


@admin.register(Hackathon)
class HackathonAdmin(ModelAdmin):
    list_display = ("event", "date", "result", "order", "is_visible")
    list_editable = ("order", "is_visible")
    search_fields = ("event", "description")


@admin.register(Achievement)
class AchievementAdmin(ModelAdmin):
    list_display = ("title", "date", "order", "is_visible")
    list_editable = ("order", "is_visible")
    search_fields = ("title", "description")


@admin.register(Testimonial)
class TestimonialAdmin(ModelAdmin):
    list_display = ("name", "company", "role", "photo_preview", "order", "is_visible")
    list_editable = ("order", "is_visible")
    search_fields = ("name", "company", "quote")

    def photo_preview(self, obj):
        return display_thumbnail(obj.photo, width=36, height=36, border_radius=18)

    photo_preview.short_description = _("Photo")


@admin.register(Technology)
class TechnologyAdmin(ModelAdmin):
    list_display = ("name", "slug", "category", "icon_key")
    list_filter = ("category",)
    search_fields = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}
