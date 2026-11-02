"""
Unfold admin configuration for Profile, Roles Sought, Social Links, and Resume Versions.
"""

from django.contrib import admin
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _
from unfold.admin import ModelAdmin, TabularInline

from apps.core.admin import SingletonModelAdmin, display_thumbnail
from apps.profiles.models import Profile, ResumeVersion, RoleSought, SocialLink


class RoleSoughtInline(TabularInline):
    model = RoleSought
    extra = 1
    fields = ("name", "order")


class SocialLinkInline(TabularInline):
    model = SocialLink
    extra = 1
    fields = ("platform", "label", "url", "order", "is_visible")


@admin.register(Profile)
class ProfileAdmin(SingletonModelAdmin):
    list_display = (
        "full_name",
        "photo_preview",
        "headline",
        "location",
        "availability_status",
        "show_email",
    )
    readonly_fields = ("photo_preview", "current_resume_info")
    inlines = [RoleSoughtInline, SocialLinkInline]

    fieldsets = (
        (
            _("Identity & Visuals"),
            {
                "fields": (
                    "full_name",
                    "headline",
                    "photo",
                    "photo_preview",
                    "photo_alt",
                ),
            },
        ),
        (
            _("Current Resume Status"),
            {
                "fields": ("current_resume_info",),
                "description": _(
                    "Quick preview of the currently active resume served to site visitors."
                ),
            },
        ),
        (
            _("Hero Messaging"),
            {
                "fields": (
                    "statement",
                    "supporting_line",
                    "about",
                ),
            },
        ),
        (
            _("Location & Contact"),
            {
                "fields": (
                    "location",
                    ("email", "show_email"),
                    ("phone", "show_phone"),
                ),
            },
        ),
        (
            _("Career Availability"),
            {
                "fields": (
                    "availability_status",
                    "availability_note",
                ),
            },
        ),
    )

    def photo_preview(self, obj):
        return display_thumbnail(obj.photo, width=64, height=64, border_radius=12)

    photo_preview.short_description = _("Photo Preview")

    def current_resume_info(self, obj):
        active = ResumeVersion.get_active()
        if not active:
            return format_html(
                '<span style="color:#e11d48; font-weight:600;">No active resume uploaded.</span>'
            )
        filename = active.file.name.split("/")[-1] if active.file else "file"
        date_str = (
            active.uploaded_at.strftime("%b %d, %Y at %H:%M")
            if active.uploaded_at
            else "N/A"
        )
        return format_html(
            '<div style="line-height:1.6;">'
            "<strong>Current active file:</strong> <code>{}</code><br>"
            "<strong>Uploaded:</strong> {}<br>"
            '<a href="{}" target="_blank" style="display:inline-block; margin-top:6px; color:#2563eb; font-weight:600; text-decoration:underline;">Preview / Download Current Resume &rarr;</a>'
            "</div>",
            filename,
            date_str,
            active.file.url,
        )

    current_resume_info.short_description = _("Active Resume Details")


@admin.register(ResumeVersion)
class ResumeVersionAdmin(ModelAdmin):
    list_display = ("file_link", "note", "uploaded_at", "status_badge", "is_active")
    list_filter = ("is_active", "uploaded_at")
    search_fields = ("note", "file")
    actions = ["make_active"]

    def file_link(self, obj):
        if not obj.file:
            return "-"
        name = obj.file.name.split("/")[-1]
        return format_html(
            '<a href="{}" target="_blank" style="color:#2563eb; font-weight:500;">{}</a>',
            obj.file.url,
            name,
        )

    file_link.short_description = _("Resume File")

    def status_badge(self, obj):
        if obj.is_active:
            return format_html(
                '<span style="background:#10b981; color:#fff; padding:2px 8px; border-radius:12px; font-size:11px; font-weight:700;">ACTIVE</span>'
            )
        return format_html(
            '<span style="background:#e5e7eb; color:#4b5563; padding:2px 8px; border-radius:12px; font-size:11px;">Archived</span>'
        )

    status_badge.short_description = _("Status")

    @admin.action(description=_("Make this version active"))
    def make_active(self, request, queryset):
        if queryset.count() != 1:
            self.message_user(
                request,
                _("Please select exactly one resume version to activate."),
                level="error",
            )
            return
        selected = queryset.first()
        ResumeVersion.objects.exclude(pk=selected.pk).update(is_active=False)
        selected.is_active = True
        selected.save()
        self.message_user(request, _(f"Version '{selected}' has been set as active."))
