"""
Custom dashboard callback and data aggregation for django-unfold.
Provides stat cards, content health checklists, recent projects, and messages.
"""

from django.urls import reverse
from django.utils.translation import gettext_lazy as _


def dashboard_callback(request, context):
    """
    Supplies context variables to Unfold's index dashboard template.
    """
    from apps.inbox.models import ContactMessage
    from apps.profiles.models import Profile, ResumeVersion
    from apps.projects.models import Project

    profile = Profile.load()
    active_resume = ResumeVersion.get_active()

    total_projects = Project.objects.count()
    published_projects = Project.objects.filter(is_published=True).count()
    draft_projects = total_projects - published_projects
    unread_messages = ContactMessage.objects.filter(is_read=False).count()

    # Content Health Checklist items
    health_issues = []

    # 1. Profile photo missing
    if not profile.photo:
        health_issues.append(
            {
                "label": _("Profile photo is missing"),
                "detail": _("Add a portrait photo to make your hero stand out."),
                "action_label": _("Upload photo"),
                "action_url": reverse(
                    "admin:profiles_profile_change", args=[profile.pk]
                ),
                "severity": "warning",
            }
        )

    # 2. No active resume
    if not active_resume:
        health_issues.append(
            {
                "label": _("No active resume PDF found"),
                "detail": _("Visitors cannot download your resume."),
                "action_label": _("Upload resume"),
                "action_url": reverse("admin:profiles_resumeversion_add"),
                "severity": "critical",
            }
        )

    # 3. Bio too short
    if not profile.about or len(profile.about.strip()) < 100:
        health_issues.append(
            {
                "label": _("Profile bio is brief or incomplete"),
                "detail": _(
                    "Expand your about paragraph to showcase your background and passions."
                ),
                "action_label": _("Edit bio"),
                "action_url": reverse(
                    "admin:profiles_profile_change", args=[profile.pk]
                ),
                "severity": "info",
            }
        )

    # 4. No social links
    if profile.social_links.filter(is_visible=True).count() == 0:
        health_issues.append(
            {
                "label": _("No visible social links configured"),
                "detail": _("Ensure LinkedIn and GitHub links are populated."),
                "action_label": _("Configure socials"),
                "action_url": reverse(
                    "admin:profiles_profile_change", args=[profile.pk]
                ),
                "severity": "warning",
            }
        )

    # 5. Published projects without cover or description
    incomplete_projects = (
        Project.objects.filter(is_published=True).filter(
            models_description_or_cover=True  # will check below
        )
        if False
        else [
            p
            for p in Project.objects.filter(is_published=True)
            if not p.cover or not p.description or len(p.description.strip()) < 20
        ]
    )

    for p in incomplete_projects:
        health_issues.append(
            {
                "label": _(
                    f"Published project '{p.title}' lacks cover or detailed description"
                ),
                "detail": _(
                    "Add high-resolution screenshots or expand system overview text."
                ),
                "action_label": _("Complete case study"),
                "action_url": reverse("admin:projects_project_change", args=[p.pk]),
                "severity": "info",
            }
        )

    # 6. Draft projects
    if draft_projects > 0:
        health_issues.append(
            {
                "label": _(
                    f"{draft_projects} draft project(s) awaiting review or authorization"
                ),
                "detail": _("Review employer permissions and publish when ready."),
                "action_label": _("Review projects"),
                "action_url": reverse("admin:projects_project_changelist")
                + "?is_published__exact=0",
                "severity": "info",
            }
        )

    # 7. Unread messages
    if unread_messages > 0:
        health_issues.append(
            {
                "label": _(f"{unread_messages} unread inquiry in your inbox"),
                "detail": _(
                    "Potential clients and employers are awaiting your response."
                ),
                "action_label": _("Open inbox"),
                "action_url": reverse("admin:inbox_contactmessage_changelist")
                + "?is_read__exact=0",
                "severity": "critical",
            }
        )

    recent_projects = Project.objects.order_by("-id")[:5]
    recent_messages = ContactMessage.objects.order_by("-created_at")[:5]

    context.update(
        {
            "stat_cards": [
                {
                    "title": _("Total Projects"),
                    "metric": total_projects,
                    "footer": _(
                        f"{published_projects} published · {draft_projects} drafts"
                    ),
                },
                {
                    "title": _("Published Projects"),
                    "metric": published_projects,
                    "footer": _("Visible on public site"),
                },
                {
                    "title": _("Draft Projects"),
                    "metric": draft_projects,
                    "footer": _("Awaiting publishing or NDA confirmation"),
                },
                {
                    "title": _("Unread Inquiries"),
                    "metric": unread_messages,
                    "footer": _("Inbound contact messages"),
                },
            ],
            "quick_actions": [
                {
                    "title": _("Quick Add Project"),
                    "url": reverse("admin:projects_quickaddproject_add"),
                    "icon": "add",
                },
                {
                    "title": _("Upload New Resume"),
                    "url": reverse("admin:profiles_resumeversion_add"),
                    "icon": "upload_file",
                },
            ],
            "content_health": health_issues,
            "recent_projects": recent_projects,
            "recent_messages": recent_messages,
        }
    )
    return context
