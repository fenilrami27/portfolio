"""
Unfold admin configuration for ContactMessage inbox.
"""

from django.contrib import admin
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _
from unfold.admin import ModelAdmin

from apps.inbox.models import ContactMessage


@admin.register(ContactMessage)
class ContactMessageAdmin(ModelAdmin):
    list_display = (
        "name",
        "email",
        "message_snippet",
        "created_at",
        "read_badge",
        "spam_badge",
        "is_read",
        "is_spam",
    )
    list_editable = ("is_read", "is_spam")
    list_filter = ("is_read", "is_spam", "email_sent", "created_at")
    search_fields = ("name", "email", "message", "notes")
    actions = ["mark_as_read", "mark_as_spam", "mark_as_unread"]
    readonly_fields = (
        "name",
        "email",
        "message",
        "ip_hash",
        "user_agent",
        "created_at",
        "email_sent",
    )

    fieldsets = (
        (
            _("Inquiry Content (Read-Only)"),
            {
                "fields": (
                    ("name", "email"),
                    "message",
                    ("created_at", "email_sent"),
                ),
            },
        ),
        (
            _("Moderation & Follow-up"),
            {
                "fields": (
                    ("is_read", "is_spam"),
                    "notes",
                ),
            },
        ),
        (
            _("Privacy Audit Trail"),
            {
                "fields": (
                    "ip_hash",
                    "user_agent",
                ),
                "classes": ("collapse",),
            },
        ),
    )

    def has_add_permission(self, request):
        return False

    def message_snippet(self, obj):
        text = obj.message.replace("\n", " ")
        return text[:80] + ("..." if len(text) > 80 else "")

    message_snippet.short_description = _("Message")

    def read_badge(self, obj):
        if obj.is_read:
            return format_html(
                '<span style="color:#10b981; font-weight:600;">Read</span>'
            )
        return format_html(
            '<span style="background:#ef4444; color:#fff; padding:2px 6px; border-radius:10px; font-size:10px; font-weight:700;">NEW</span>'
        )

    read_badge.short_description = _("Status")

    def spam_badge(self, obj):
        if obj.is_spam:
            return format_html(
                '<span style="color:#ef4444; font-weight:600;">Spam</span>'
            )
        return format_html('<span style="color:#9ca3af;">Clean</span>')

    spam_badge.short_description = _("Spam")

    @admin.action(description=_("Mark selected messages as read"))
    def mark_as_read(self, request, queryset):
        count = queryset.update(is_read=True)
        self.message_user(request, _(f"{count} message(s) marked as read."))

    @admin.action(description=_("Mark selected messages as spam"))
    def mark_as_spam(self, request, queryset):
        count = queryset.update(is_spam=True)
        self.message_user(request, _(f"{count} message(s) flagged as spam."))

    @admin.action(description=_("Mark selected messages as unread"))
    def mark_as_unread(self, request, queryset):
        count = queryset.update(is_read=False)
        self.message_user(request, _(f"{count} message(s) marked as unread."))
