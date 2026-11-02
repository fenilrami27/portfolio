"""
Admin base classes, mixins, and thumbnail formatting helpers.
"""

from django.shortcuts import redirect
from django.urls import reverse
from django.utils.html import format_html
from unfold.admin import ModelAdmin


class SingletonModelAdmin(ModelAdmin):
    """
    Admin configuration for singleton models.
    Redirects directly to change view if an instance exists and prevents multiple instances.
    """

    def has_add_permission(self, request):
        if self.model.objects.exists():
            return False
        return super().has_add_permission(request)

    def has_delete_permission(self, request, obj=None):
        return False

    def changelist_view(self, request, extra_context=None):
        obj = self.model.objects.first()
        if obj:
            opts = self.model._meta
            return redirect(
                reverse(
                    f"admin:{opts.app_label}_{opts.model_name}_change", args=[obj.pk]
                )
            )
        return super().changelist_view(request, extra_context=extra_context)


def display_thumbnail(image_field, width=48, height=48, border_radius=8):
    """
    Format thumbnail image preview for admin changelists and forms.
    """
    if not image_field:
        return format_html(
            '<div style="width:{}px; height:{}px; border-radius:{}px; background:rgba(150,150,150,0.15); display:flex; align-items:center; justify-content:center; color:#888; font-size:10px; font-family:monospace;">N/A</div>',
            width,
            height,
            border_radius,
        )
    return format_html(
        '<img src="{}" style="width:{}px; height:{}px; object-fit:cover; border-radius:{}px; border:1px solid rgba(150,150,150,0.25);" alt="Preview" />',
        image_field.url,
        width,
        height,
        border_radius,
    )
