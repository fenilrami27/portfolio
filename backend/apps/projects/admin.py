"""
Unfold admin configuration for Projects, Gallery Images, Feature Groups, and QuickAdd proxy.
"""

from django.contrib import admin
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _
from unfold.admin import ModelAdmin, StackedInline, TabularInline

from apps.core.admin import display_thumbnail
from apps.projects.models import (
    Project,
    ProjectChallenge,
    ProjectFeature,
    ProjectFeatureGroup,
    ProjectImage,
    QuickAddProject,
)


class ProjectImageInline(TabularInline):
    model = ProjectImage
    extra = 1
    fields = ("image", "alt", "caption", "order", "preview")
    readonly_fields = ("preview",)

    def preview(self, obj):
        return display_thumbnail(obj.image, width=48, height=36)

    preview.short_description = _("Preview")


class ProjectFeatureInline(TabularInline):
    model = ProjectFeature
    extra = 2
    fields = ("text", "order")


@admin.register(ProjectFeatureGroup)
class ProjectFeatureGroupAdmin(ModelAdmin):
    list_display = ("group", "project", "order", "items_count")
    list_filter = ("project",)
    search_fields = ("group", "project__title")
    inlines = [ProjectFeatureInline]

    def items_count(self, obj):
        return obj.items.count()

    items_count.short_description = _("Feature Count")


class ProjectFeatureGroupInline(StackedInline):
    model = ProjectFeatureGroup
    extra = 1
    fields = ("group", "order")
    show_change_link = True


class ProjectChallengeInline(StackedInline):
    model = ProjectChallenge
    extra = 1
    fields = ("title", "body", "order")


@admin.register(Project)
class ProjectAdmin(ModelAdmin):
    list_display = (
        "cover_preview",
        "title",
        "type",
        "status_pill",
        "tier",
        "is_featured",
        "is_published",
        "order",
        "view_site_link",
    )
    list_display_links = ("title",)
    list_editable = ("is_featured", "is_published", "order")
    list_filter = (
        "status",
        "type",
        "tier",
        "is_published",
        "is_featured",
        "is_employer_project",
    )
    search_fields = ("title", "one_liner", "description", "slug")
    prepopulated_fields = {"slug": ("title",)}
    filter_horizontal = ("stack",)
    actions = [
        "publish_projects",
        "unpublish_projects",
        "feature_projects",
        "unfeature_projects",
    ]
    readonly_fields = ("cover_preview", "employer_warning_banner")
    inlines = [ProjectImageInline, ProjectFeatureGroupInline, ProjectChallengeInline]

    fieldsets = (
        (
            None,
            {
                "fields": ("employer_warning_banner",),
            },
        ),
        (
            _("Identity & URLs"),
            {
                "fields": (
                    "title",
                    "slug",
                    "one_liner",
                    "role",
                    ("type", "tier", "status"),
                    "stack",
                ),
            },
        ),
        (
            _("Visual Cover & Assets"),
            {
                "fields": (
                    "cover",
                    "cover_preview",
                    "cover_alt",
                ),
            },
        ),
        (
            _("External Links"),
            {
                "fields": (
                    "live_url",
                    "github_url",
                    "video_url",
                ),
            },
        ),
        (
            _("System Overview Body"),
            {
                "fields": ("description",),
                "description": _("Separate paragraphs by inserting a blank line."),
            },
        ),
        (
            _("Publishing Controls & Timeline"),
            {
                "fields": (
                    ("is_published", "is_featured"),
                    "order",
                    ("started_on", "ended_on"),
                    "is_employer_project",
                ),
            },
        ),
    )

    def cover_preview(self, obj):
        return display_thumbnail(obj.cover, width=64, height=44, border_radius=6)

    cover_preview.short_description = _("Cover")

    def status_pill(self, obj):
        color = "#0284c7"  # blue
        s = obj.status.lower()
        if "hand" in s or "complete" in s or "live" in s:
            color = "#10b981"  # green
        elif "dev" in s or "progress" in s:
            color = "#f59e0b"  # amber
        return format_html(
            '<span style="background:{}; color:#fff; padding:2px 8px; border-radius:10px; font-size:11px; font-weight:600;">{}</span>',
            color,
            obj.status,
        )

    status_pill.short_description = _("Status")

    def view_site_link(self, obj):
        if obj.is_published:
            return format_html(
                '<a href="/projects/{}" target="_blank" style="color:#2563eb; font-weight:600;">View on site &rarr;</a>',
                obj.slug,
            )
        return format_html('<span style="color:#9ca3af; font-size:11px;">Draft</span>')

    view_site_link.short_description = _("Live Page")

    def employer_warning_banner(self, obj):
        if obj and obj.is_employer_project:
            return format_html(
                '<div style="background:#fffbeb; border:1px solid #fef3c7; border-left:4px solid #f59e0b; padding:12px 16px; border-radius:6px; margin-bottom:12px;">'
                '<strong style="color:#92400e;">⚠️ Employer Project Warning:</strong> '
                '<span style="color:#b45309;">Confirm permission before publishing this project publicly. Keep unpublished until authorization is secured.</span>'
                "</div>"
            )
        return format_html(
            '<span style="color:#6b7280; font-size:12px;">Standard project without external employer restrictions.</span>'
        )

    employer_warning_banner.short_description = _("Authorization Notice")

    @admin.action(description=_("Publish selected projects"))
    def publish_projects(self, request, queryset):
        count = queryset.update(is_published=True)
        self.message_user(request, _(f"{count} project(s) published successfully."))

    @admin.action(description=_("Unpublish selected projects"))
    def unpublish_projects(self, request, queryset):
        count = queryset.update(is_published=False)
        self.message_user(request, _(f"{count} project(s) moved to draft."))

    @admin.action(description=_("Feature selected projects on homepage"))
    def feature_projects(self, request, queryset):
        count = queryset.update(is_featured=True)
        self.message_user(request, _(f"{count} project(s) marked as featured."))

    @admin.action(description=_("Remove selected projects from featured"))
    def unfeature_projects(self, request, queryset):
        count = queryset.update(is_featured=False)
        self.message_user(request, _(f"{count} project(s) removed from featured."))


@admin.register(QuickAddProject)
class QuickAddProjectAdmin(ModelAdmin):
    """
    Streamlined admin interface to add a compact project in under 60 seconds.
    """

    fields = (
        "title",
        "one_liner",
        "role",
        "status",
        "type",
        "stack",
        "live_url",
        "github_url",
        "is_published",
    )
    filter_horizontal = ("stack",)
    list_display = ("title", "type", "status", "is_published")

    def save_model(self, request, obj, form, change):
        obj.tier = Project.ProjectTier.COMPACT
        super().save_model(request, obj, form, change)
