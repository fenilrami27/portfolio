"""
Profile and Resume models.
"""

from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.core.models import SingletonModel
from apps.core.validators import (
    validate_https_url,
    validate_image_file,
    validate_pdf_file,
)


class Profile(SingletonModel):
    """
    Singleton model storing Fenil Rami's public profile information.
    """

    class Availability(models.TextChoices):
        OPEN_TO_WORK = "open_to_work", _("Open to work")
        FREELANCE = "freelance", _("Available for freelance")
        NOT_AVAILABLE = "not_available", _("Not available")

    full_name = models.CharField(
        max_length=150,
        default="Fenil Rami",
        verbose_name=_("Full name"),
        help_text=_("Full personal name displayed across the site."),
    )
    headline = models.CharField(
        max_length=255,
        default="Python Backend & Full Stack Developer (React, Django, PostgreSQL)",
        verbose_name=_("Headline"),
        help_text=_("Primary professional title displayed in hero and meta tags."),
    )
    statement = models.TextField(
        default="I build role-based business web applications with Django and React, from the REST API to the interface.",
        verbose_name=_("Statement"),
        help_text=_("High-impact hero statement summarizing core capabilities."),
    )
    supporting_line = models.TextField(
        default="Python Developer Intern at Vibe Tech Labs. I turn real business workflows (orders, approvals, production, invoicing) into clean, reliable software.",
        verbose_name=_("Supporting line"),
        help_text=_(
            "Secondary descriptive sentence elaborating on current role and impact."
        ),
    )
    about = models.TextField(
        blank=True,
        default=(
            "I'm a final-year Information Technology student at Gandhinagar University and a Python Developer "
            "Intern at Vibe Tech Labs. I independently built the complete React frontend of a multi-company "
            "pharmaceutical ERP covering HRMS, orders, inventory, production, QC/QA and invoicing, and I'm "
            "working on the Django backend of a university website. Outside code, I've led university cultural "
            "events as Cultural Head and coordinated a tech fest arena."
        ),
        verbose_name=_("About bio"),
        help_text=_("Comprehensive bio used in about and overview sections."),
    )
    location = models.CharField(
        max_length=150,
        default="Ahmedabad, Gujarat, India",
        verbose_name=_("Location"),
        help_text=_("City and region displayed in header/footer and hero badge."),
    )
    email = models.EmailField(
        default="fenilrami1266@gmail.com",
        verbose_name=_("Email address"),
        help_text=_("Primary contact email address for direct communications."),
    )
    show_email = models.BooleanField(
        default=True,
        verbose_name=_("Show email publicly"),
        help_text=_(
            "When enabled, the email address is displayed publicly on the portfolio."
        ),
    )
    phone = models.CharField(
        max_length=50,
        blank=True,
        verbose_name=_("Phone number (optional)"),
        help_text=_(
            "Private contact phone number; kept hidden unless explicitly enabled."
        ),
    )
    show_phone = models.BooleanField(
        default=False,
        verbose_name=_("Show phone publicly"),
        help_text=_("Keep False to keep phone number private on public pages."),
    )
    photo = models.ImageField(
        upload_to="profiles/photos/",
        validators=[validate_image_file],
        blank=True,
        null=True,
        width_field="photo_width",
        height_field="photo_height",
        verbose_name=_("Profile photo"),
        help_text=_("High-resolution portrait photo for the hero section (max 8 MB)."),
    )
    photo_width = models.PositiveIntegerField(null=True, blank=True, editable=False)
    photo_height = models.PositiveIntegerField(null=True, blank=True, editable=False)
    photo_alt = models.CharField(
        max_length=255,
        default="Fenil Rami - Python Backend & Full Stack Developer",
        verbose_name=_("Photo alt text"),
        help_text=_("Accessible text describing the profile image for screen readers."),
    )
    availability_status = models.CharField(
        max_length=50,
        choices=Availability.choices,
        default=Availability.OPEN_TO_WORK,
        verbose_name=_("Availability status"),
        help_text=_("Current job search and availability status pill."),
    )
    availability_note = models.CharField(
        max_length=255,
        default="Available for full-time opportunities and internships.",
        verbose_name=_("Availability note"),
        help_text=_("Additional context on employment preferences and availability."),
    )

    class Meta:
        verbose_name = _("Profile")
        verbose_name_plural = _("Profile")

    def __str__(self):
        return f"{self.full_name} ({self.get_availability_status_display()})"


class RoleSought(models.Model):
    """
    Job roles sought by Fenil, displayed as chips in the hero section.
    """

    profile = models.ForeignKey(
        Profile,
        on_delete=models.CASCADE,
        related_name="roles_sought",
        verbose_name=_("Profile"),
    )
    name = models.CharField(
        max_length=100,
        verbose_name=_("Role title"),
        help_text=_(
            "Target job title (e.g. Python Backend Developer, Django Developer)."
        ),
    )
    order = models.PositiveIntegerField(
        default=0,
        verbose_name=_("Display order"),
        help_text=_("Numeric sorting order (lowest numbers display first)."),
    )

    class Meta:
        ordering = ["order", "id"]
        verbose_name = _("Role Sought")
        verbose_name_plural = _("Roles Sought")

    def __str__(self):
        return self.name


class SocialLink(models.Model):
    """
    Social and communication channels displayed in header, hero, and footer.
    """

    profile = models.ForeignKey(
        Profile,
        on_delete=models.CASCADE,
        related_name="social_links",
        verbose_name=_("Profile"),
    )
    platform = models.CharField(
        max_length=50,
        verbose_name=_("Platform name"),
        help_text=_("Social platform name (e.g. LinkedIn, GitHub, Email)."),
    )
    label = models.CharField(
        max_length=150,
        verbose_name=_("Aria label"),
        help_text=_("Screen-reader friendly descriptive label."),
    )
    url = models.CharField(
        max_length=500,
        validators=[validate_https_url],
        verbose_name=_("Destination URL"),
        help_text=_("Target URL (must start with https://, or mailto: for email)."),
    )
    order = models.PositiveIntegerField(
        default=0,
        verbose_name=_("Display order"),
        help_text=_("Numeric sorting order (lowest numbers appear first)."),
    )
    is_visible = models.BooleanField(
        default=True,
        verbose_name=_("Is visible"),
        help_text=_("Whether this social link is visible on the public site."),
    )

    class Meta:
        ordering = ["order", "id"]
        verbose_name = _("Social Link")
        verbose_name_plural = _("Social Links")

    def __str__(self):
        return f"{self.platform} ({self.url})"


class ResumeVersion(models.Model):
    """
    Manages versioned PDF resumes.
    Uploading a new version automatically activates it and keeps the latest 10 versions.
    """

    file = models.FileField(
        upload_to="resumes/",
        validators=[validate_pdf_file],
        verbose_name=_("PDF resume file"),
        help_text=_("PDF document strictly under 5 MB with authentic PDF magic bytes."),
    )
    note = models.CharField(
        max_length=255,
        blank=True,
        verbose_name=_("Version note"),
        help_text=_("Brief changelog or notes regarding this resume revision."),
    )
    uploaded_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_("Uploaded at"),
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name=_("Is active version"),
        help_text=_("The active resume version served to public visitors."),
    )

    class Meta:
        ordering = ["-uploaded_at"]
        verbose_name = _("Resume Version")
        verbose_name_plural = _("Resume Versions")

    def __str__(self):
        status = "ACTIVE" if self.is_active else "inactive"
        filename = self.file.name.split("/")[-1] if self.file else "no-file"
        return f"{filename} [{status}] ({self.uploaded_at.strftime('%Y-%m-%d %H:%M') if self.uploaded_at else 'New'})"

    def clean(self):
        super().clean()
        if self.file:
            validate_pdf_file(self.file)

    def save(self, *args, **kwargs):
        is_new = self.pk is None

        # Automatically mark new uploads as active if none was explicitly specified as false
        if is_new and self.is_active:
            # Save first, then deactivate others
            super().save(*args, **kwargs)
            ResumeVersion.objects.exclude(pk=self.pk).update(is_active=False)
        else:
            if self.is_active:
                ResumeVersion.objects.exclude(pk=self.pk).update(is_active=False)
            super().save(*args, **kwargs)

        # Prune to keep only the last 10 versions
        all_ids = list(
            ResumeVersion.objects.order_by("-uploaded_at").values_list("pk", flat=True)
        )
        if len(all_ids) > 10:
            excess_ids = all_ids[10:]
            ResumeVersion.objects.filter(pk__in=excess_ids).delete()

    @classmethod
    def get_active(cls):
        """
        Return the currently active resume version, falling back to the most recent one.
        """
        active = cls.objects.filter(is_active=True).first()
        if not active:
            active = cls.objects.order_by("-uploaded_at").first()
        return active
