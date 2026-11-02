"""
Models for portfolio projects, galleries, feature groups, and engineering challenges.
"""

from django.db import models
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _

from apps.content.models import Technology
from apps.core.validators import validate_https_url, validate_image_file


class Project(models.Model):
    """
    Core project model for case studies and portfolio builds.
    """

    class ProjectStatus(models.TextChoices):
        PLANNED = "Planned", _("Planned")
        IN_PROGRESS = "In progress", _("In progress")
        IN_DEVELOPMENT = (
            "In development (not yet handed over)",
            _("In development (not yet handed over)"),
        )
        IN_DEV_SHORT = "In development", _("In development")
        COMPLETED = "Completed", _("Completed")
        LIVE = "Live", _("Live")
        LEARNING_PROJECT = "Learning project", _("Learning project")
        ARCHIVED = "Archived", _("Archived")

    class ProjectType(models.TextChoices):
        FULL_STACK = "Full Stack", _("Full Stack")
        FRONTEND = "Frontend", _("Frontend")
        BACKEND = "Backend", _("Backend")
        WEBSITE = "Website", _("Website")
        OTHER = "Other", _("Other")

    class ProjectTier(models.TextChoices):
        FEATURED = "featured", _("Featured (Comprehensive case study)")
        COMPACT = "compact", _("Compact (Quick project overview)")

    title = models.CharField(
        max_length=200,
        verbose_name=_("Project title"),
        help_text=_("Title of the application or system."),
    )
    slug = models.SlugField(
        max_length=200,
        unique=True,
        blank=True,
        verbose_name=_("Slug identifier"),
        help_text=_("URL path slug (auto-generated from title, editable)."),
    )
    one_liner = models.TextField(
        verbose_name=_("One-liner summary"),
        help_text=_(
            "Concise headline pitch describing the core business problem and solution."
        ),
    )
    description = models.TextField(
        verbose_name=_("Project description (plain text)"),
        help_text=_("System overview text. Separate paragraphs with blank lines."),
    )
    role = models.CharField(
        max_length=150,
        default="Developer",
        verbose_name=_("Your role"),
        help_text=_(
            "Your role on the project (e.g. Frontend developer (independent), Full Stack Developer)."
        ),
    )
    status = models.CharField(
        max_length=100,
        choices=ProjectStatus.choices,
        default=ProjectStatus.IN_PROGRESS,
        verbose_name=_("Project status"),
        help_text=_("Current development status badge."),
    )
    type = models.CharField(
        max_length=50,
        choices=ProjectType.choices,
        default=ProjectType.FULL_STACK,
        verbose_name=_("Project category / type"),
    )
    tier = models.CharField(
        max_length=50,
        choices=ProjectTier.choices,
        default=ProjectTier.FEATURED,
        verbose_name=_("Display tier"),
        help_text=_(
            "Featured projects get priority placement and full layout treatment."
        ),
    )
    stack = models.ManyToManyField(
        Technology,
        blank=True,
        related_name="projects",
        verbose_name=_("Technology stack"),
        help_text=_("Technologies and libraries used in this project."),
    )
    live_url = models.CharField(
        max_length=500,
        blank=True,
        null=True,
        validators=[validate_https_url],
        verbose_name=_("Live URL"),
        help_text=_("Production or demo website link (HTTPS only)."),
    )
    github_url = models.CharField(
        max_length=500,
        blank=True,
        null=True,
        validators=[validate_https_url],
        verbose_name=_("GitHub repository URL"),
        help_text=_("Public source code repository (HTTPS only)."),
    )
    video_url = models.CharField(
        max_length=500,
        blank=True,
        null=True,
        validators=[validate_https_url],
        verbose_name=_("Demo video URL"),
        help_text=_("Video walkthrough link (Loom, YouTube, etc. HTTPS only)."),
    )
    cover = models.ImageField(
        upload_to="projects/covers/",
        validators=[validate_image_file],
        blank=True,
        null=True,
        width_field="cover_width",
        height_field="cover_height",
        verbose_name=_("Cover image"),
        help_text=_(
            "Hero or thumbnail cover graphic (max 8 MB). Falls back to styled CSS banner if omitted."
        ),
    )
    cover_width = models.PositiveIntegerField(null=True, blank=True, editable=False)
    cover_height = models.PositiveIntegerField(null=True, blank=True, editable=False)
    cover_alt = models.CharField(
        max_length=255,
        blank=True,
        verbose_name=_("Cover image alt text"),
        help_text=_("Descriptive alt text for cover image."),
    )
    is_featured = models.BooleanField(
        default=False,
        verbose_name=_("Is featured on homepage"),
        help_text=_(
            "Displays this project in the Featured Work section on the homepage."
        ),
    )
    is_published = models.BooleanField(
        default=True,
        verbose_name=_("Is published publicly"),
        help_text=_(
            "Only published projects appear on the public site and in API queries."
        ),
    )
    order = models.PositiveIntegerField(
        default=0,
        verbose_name=_("Display order"),
        help_text=_("Sorting order (lowest numbers display first)."),
    )
    started_on = models.DateField(
        null=True,
        blank=True,
        verbose_name=_("Started on date"),
    )
    ended_on = models.DateField(
        null=True,
        blank=True,
        verbose_name=_("Ended on date"),
    )
    is_employer_project = models.BooleanField(
        default=False,
        verbose_name=_("Is employer / proprietary project"),
        help_text=_(
            "Flags work done under NDA or employment requiring authorization before public release."
        ),
    )

    class Meta:
        ordering = ["order", "id"]
        verbose_name = _("Project")
        verbose_name_plural = _("Projects")

    def __str__(self):
        status_badge = "PUBLISHED" if self.is_published else "DRAFT"
        return f"{self.title} [{status_badge}]"

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title) or "project"
            slug = base_slug
            counter = 1
            while Project.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def get_description_paragraphs(self):
        """
        Split plain text description into paragraph array separated by blank lines.
        """
        if not self.description:
            return []
        lines = [
            p.strip()
            for p in self.description.replace("\r\n", "\n").split("\n\n")
            if p.strip()
        ]
        return lines


class ProjectImage(models.Model):
    """
    Visual gallery screenshots and diagram attachments for project case study.
    """

    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="images",
        verbose_name=_("Project"),
    )
    image = models.ImageField(
        upload_to="projects/gallery/",
        validators=[validate_image_file],
        width_field="width",
        height_field="height",
        verbose_name=_("Image file"),
    )
    width = models.PositiveIntegerField(null=True, blank=True, editable=False)
    height = models.PositiveIntegerField(null=True, blank=True, editable=False)
    alt = models.CharField(
        max_length=255,
        blank=True,
        verbose_name=_("Alt description"),
    )
    caption = models.CharField(
        max_length=255,
        blank=True,
        verbose_name=_("Caption note"),
    )
    order = models.PositiveIntegerField(
        default=0,
        verbose_name=_("Display order"),
    )

    class Meta:
        ordering = ["order", "id"]
        verbose_name = _("Project Gallery Image")
        verbose_name_plural = _("Project Gallery Images")

    def __str__(self):
        return f"Image for {self.project.title} (#{self.order})"


class ProjectFeatureGroup(models.Model):
    """
    Module groupings (e.g. Workspaces, HRMS, Orders, Inventory, Production, QC/QA, Invoicing).
    """

    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="feature_groups",
        verbose_name=_("Project"),
    )
    group = models.CharField(
        max_length=150,
        verbose_name=_("Group name"),
        help_text=_(
            "Feature cluster or module name (e.g. Workspaces, HRMS, Invoicing)."
        ),
    )
    order = models.PositiveIntegerField(
        default=0,
        verbose_name=_("Display order"),
    )

    class Meta:
        ordering = ["order", "id"]
        verbose_name = _("Project Feature Group")
        verbose_name_plural = _("Project Feature Groups")

    def __str__(self):
        return f"{self.group} ({self.project.title})"


class ProjectFeature(models.Model):
    """
    Specific feature or architectural point inside a feature group.
    """

    group = models.ForeignKey(
        ProjectFeatureGroup,
        on_delete=models.CASCADE,
        related_name="items",
        verbose_name=_("Feature group"),
    )
    text = models.TextField(
        verbose_name=_("Feature detail text"),
    )
    order = models.PositiveIntegerField(
        default=0,
        verbose_name=_("Display order"),
    )

    class Meta:
        ordering = ["order", "id"]
        verbose_name = _("Feature Item")
        verbose_name_plural = _("Feature Items")

    def __str__(self):
        return self.text[:60]


class ProjectChallenge(models.Model):
    """
    Engineering challenge and solution breakdown.
    """

    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="challenges",
        verbose_name=_("Project"),
    )
    title = models.CharField(
        max_length=200,
        verbose_name=_("Challenge title"),
    )
    body = models.TextField(
        verbose_name=_("Solution & architectural tradeoff"),
    )
    order = models.PositiveIntegerField(
        default=0,
        verbose_name=_("Display order"),
    )

    class Meta:
        ordering = ["order", "id"]
        verbose_name = _("Project Challenge & Solution")
        verbose_name_plural = _("Project Challenges & Solutions")

    def __str__(self):
        return f"{self.title} ({self.project.title})"


class QuickAddProject(Project):
    """
    Proxy model providing a streamlined admin form for quickly adding compact projects.
    """

    class Meta:
        proxy = True
        verbose_name = _("Quick Add Project")
        verbose_name_plural = _("Quick Add Projects")

    def save(self, *args, **kwargs):
        self.tier = Project.ProjectTier.COMPACT
        super().save(*args, **kwargs)
