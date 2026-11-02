"""
Content models covering site settings, focus areas, stats, skills, career, and recognition.
"""

from datetime import date

from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.core.models import SingletonModel
from apps.core.validators import validate_https_url, validate_image_file


class SiteSettings(SingletonModel):
    """
    Singleton model managing global metadata, SEO, and static copy.
    """

    site_title = models.CharField(
        max_length=150,
        default="Fenil Rami | Portfolio",
        verbose_name=_("Site title"),
        help_text=_("Default browser title."),
    )
    seo_title = models.CharField(
        max_length=255,
        default="Fenil Rami | Python Backend & Full Stack Developer",
        verbose_name=_("SEO title"),
        help_text=_("Optimized SEO title for search engines and social shares."),
    )
    seo_description = models.TextField(
        default="Portfolio of Fenil Rami, Python Backend & Full Stack Developer building role-based business web apps with Django and React.",
        verbose_name=_("SEO description"),
        help_text=_("Search engine meta description."),
    )
    og_image = models.ImageField(
        upload_to="seo/",
        validators=[validate_image_file],
        blank=True,
        null=True,
        verbose_name=_("OpenGraph share image"),
        help_text=_("Image preview shown on social cards (1200x630 recommended)."),
    )
    canonical_url = models.CharField(
        max_length=255,
        blank=True,
        validators=[validate_https_url],
        verbose_name=_("Canonical site URL"),
        help_text=_("Canonical production URL (must start with https://)."),
    )
    contact_heading = models.CharField(
        max_length=255,
        default="Let's build something reliable.",
        verbose_name=_("Contact section heading"),
        help_text=_("Title on the public contact form section."),
    )
    contact_text = models.TextField(
        default="Open to Python Backend and Full Stack roles. The fastest way to reach me is email or LinkedIn.",
        verbose_name=_("Contact section text"),
        help_text=_("Subtitle / description on the contact section."),
    )
    footer_text = models.TextField(
        default="Python Backend & Full Stack Developer specializing in role-based business web applications with Django and React. Focused on clean database models, robust REST APIs, and crisp user interfaces.",
        verbose_name=_("Footer brand description"),
        help_text=_("Short bio block rendered in the footer."),
    )
    currently_building_title = models.CharField(
        max_length=255,
        default="HR University Django Backend",
        verbose_name=_("Currently building title"),
        help_text=_("Title of the featured active sprint in Overview bento grid."),
    )
    currently_building_text = models.TextField(
        default="Building a robust backend with Django 5, Django REST Framework, and PostgreSQL. Spans 11 decoupled apps, 32 relational models, and 38 endpoints supporting dynamic campus admissions, event schedules, and placement statistics.",
        verbose_name=_("Currently building description"),
        help_text=_("Overview bento card text describing active sprint."),
    )
    currently_building_status = models.CharField(
        max_length=100,
        default="In progress",
        verbose_name=_("Currently building status"),
        help_text=_("Status badge text (e.g. In progress, In development)."),
    )
    experience_start_date = models.DateField(
        default=date(2026, 6, 1),
        verbose_name=_("Experience start date"),
        help_text=_(
            "Start date for calculating months of experience metric automatically."
        ),
    )
    analytics_id = models.CharField(
        max_length=100,
        blank=True,
        verbose_name=_("Analytics tracking ID"),
        help_text=_("Optional Google Analytics or Plausible measurement tag."),
    )

    class Meta:
        verbose_name = _("Site Settings")
        verbose_name_plural = _("Site Settings")

    def __str__(self):
        return f"{self.site_title} Settings"


class FocusArea(models.Model):
    """
    Items for the 'What I do' section in the Overview bento card.
    """

    title = models.CharField(
        max_length=150,
        verbose_name=_("Title"),
        help_text=_("Area title (e.g. Role-based apps, Workflow systems)."),
    )
    description = models.TextField(
        verbose_name=_("Description"),
        help_text=_("Description of what you do in this area."),
    )
    icon_key = models.CharField(
        max_length=50,
        default="LuShieldCheck",
        verbose_name=_("Icon identifier"),
        help_text=_("Icon identifier (e.g. LuShieldCheck, LuGitFork, LuPrinter)."),
    )
    order = models.PositiveIntegerField(
        default=0,
        verbose_name=_("Display order"),
        help_text=_("Sorting order (lowest appears first)."),
    )
    is_visible = models.BooleanField(
        default=True,
        verbose_name=_("Is visible"),
        help_text=_("Whether this item is shown on the public site."),
    )

    class Meta:
        ordering = ["order", "id"]
        verbose_name = _("Focus Area (What I do)")
        verbose_name_plural = _("Focus Areas (What I do)")

    def __str__(self):
        return self.title


class Stat(models.Model):
    """
    Numeric statistics and counters on the portfolio overview.
    Supports manual values or auto-derived values (projects count, experience months).
    """

    class StatKind(models.TextChoices):
        MANUAL = "manual", _("Manual value")
        PROJECTS_COUNT = "projects_count", _("Derived: Published projects count")
        EXPERIENCE_MONTHS = "experience_months", _("Derived: Experience months")

    label = models.CharField(
        max_length=150,
        verbose_name=_("Metric label"),
        help_text=_(
            "Label shown under the counter (e.g. Projects showcased, Months experience)."
        ),
    )
    value = models.IntegerField(
        null=True,
        blank=True,
        verbose_name=_("Manual value"),
        help_text=_("Static numeric count (leave blank if derived automatically)."),
    )
    suffix = models.CharField(
        max_length=20,
        blank=True,
        default="",
        verbose_name=_("Counter suffix"),
        help_text=_("Optional suffix string attached to counter (e.g. +)."),
    )
    note = models.CharField(
        max_length=255,
        blank=True,
        verbose_name=_("Metric note"),
        help_text=_("Optional note or subtitle."),
    )
    kind = models.CharField(
        max_length=50,
        choices=StatKind.choices,
        default=StatKind.MANUAL,
        verbose_name=_("Metric computation kind"),
        help_text=_(
            "Whether this metric is computed dynamically by the API or uses manual value."
        ),
    )
    order = models.PositiveIntegerField(
        default=0,
        verbose_name=_("Display order"),
    )
    is_visible = models.BooleanField(
        default=True,
        verbose_name=_("Is visible"),
    )

    class Meta:
        ordering = ["order", "id"]
        verbose_name = _("Stat / Counter")
        verbose_name_plural = _("Stats & Counters")

    def __str__(self):
        return f"{self.label} ({self.get_kind_display()})"


class SkillGroup(models.Model):
    """
    Grouping for skills (e.g. Programming, Backend, Frontend, Databases, Development).
    """

    name = models.CharField(
        max_length=100,
        verbose_name=_("Group name"),
        help_text=_("Skill category name (e.g. Programming, Backend)."),
    )
    order = models.PositiveIntegerField(
        default=0,
        verbose_name=_("Display order"),
    )

    class Meta:
        ordering = ["order", "id"]
        verbose_name = _("Skill Group")
        verbose_name_plural = _("Skill Groups")

    def __str__(self):
        return self.name


class Skill(models.Model):
    """
    Individual technical skill item with icon key and proficiency level.
    """

    class Level(models.TextChoices):
        DAILY = "daily", _("Daily use")
        COMFORTABLE = "comfortable", _("Comfortable")
        LEARNING = "learning", _("Currently learning")

    group = models.ForeignKey(
        SkillGroup,
        on_delete=models.CASCADE,
        related_name="skills",
        verbose_name=_("Skill group"),
    )
    name = models.CharField(
        max_length=100,
        verbose_name=_("Skill name"),
        help_text=_("Name of technology or competency (e.g. Python, Django, RBAC)."),
    )
    icon_key = models.CharField(
        max_length=50,
        blank=True,
        verbose_name=_("Icon key"),
        help_text=_("React icon identifier (e.g. SiPython, SiDjango, LuShieldCheck)."),
    )
    level = models.CharField(
        max_length=50,
        choices=Level.choices,
        blank=True,
        null=True,
        verbose_name=_("Proficiency level"),
        help_text=_("Optional proficiency indicator (daily, comfortable, learning)."),
    )
    order = models.PositiveIntegerField(
        default=0,
        verbose_name=_("Display order"),
    )
    is_visible = models.BooleanField(
        default=True,
        verbose_name=_("Is visible"),
    )

    class Meta:
        ordering = ["order", "id"]
        verbose_name = _("Skill")
        verbose_name_plural = _("Skills")

    def __str__(self):
        return f"{self.name} ({self.group.name})"


class Experience(models.Model):
    """
    Work experience and internships.
    """

    company = models.CharField(
        max_length=150,
        verbose_name=_("Company name"),
    )
    role = models.CharField(
        max_length=150,
        verbose_name=_("Role title"),
    )
    location = models.CharField(
        max_length=150,
        default="Ahmedabad",
        verbose_name=_("Location"),
    )
    start_date = models.CharField(
        max_length=50,
        default="Jun 2026",
        verbose_name=_("Start date label"),
        help_text=_("Text date representation (e.g. Jun 2026)."),
    )
    end_date = models.CharField(
        max_length=50,
        default="Present",
        blank=True,
        verbose_name=_("End date label"),
        help_text=_("Text date representation or Present."),
    )
    is_current = models.BooleanField(
        default=True,
        verbose_name=_("Is currently employed here"),
    )
    order = models.PositiveIntegerField(
        default=0,
        verbose_name=_("Display order"),
    )

    class Meta:
        ordering = ["order", "id"]
        verbose_name = _("Experience")
        verbose_name_plural = _("Experiences")

    def __str__(self):
        return f"{self.role} at {self.company}"


class ExperienceBullet(models.Model):
    """
    Accomplishment bullet points under an Experience record.
    """

    experience = models.ForeignKey(
        Experience,
        on_delete=models.CASCADE,
        related_name="bullets",
        verbose_name=_("Experience"),
    )
    text = models.TextField(
        verbose_name=_("Bullet text"),
    )
    order = models.PositiveIntegerField(
        default=0,
        verbose_name=_("Display order"),
    )

    class Meta:
        ordering = ["order", "id"]
        verbose_name = _("Experience Bullet")
        verbose_name_plural = _("Experience Bullets")

    def __str__(self):
        return self.text[:60]


class Education(models.Model):
    """
    Academic education and degree credentials.
    """

    institution = models.CharField(
        max_length=150,
        default="Gandhinagar University",
        verbose_name=_("Institution"),
    )
    degree = models.CharField(
        max_length=150,
        default="Bachelor of Information Technology",
        verbose_name=_("Degree title"),
    )
    start_year = models.CharField(
        max_length=50,
        default="2023",
        verbose_name=_("Start year"),
    )
    end_year = models.CharField(
        max_length=50,
        default="2027",
        verbose_name=_("End year"),
    )
    grade_label = models.CharField(
        max_length=150,
        default="Latest SGPA: 8.77 / 10 (Semester 6)",
        verbose_name=_("Grade / SGPA label"),
    )
    order = models.PositiveIntegerField(
        default=0,
        verbose_name=_("Display order"),
    )

    class Meta:
        ordering = ["order", "id"]
        verbose_name = _("Education")
        verbose_name_plural = _("Education")

    def __str__(self):
        return f"{self.degree} - {self.institution}"


class JourneyItem(models.Model):
    """
    Chronological journey milestones combining education, project breakthroughs, and experiences.
    """

    class JourneyKind(models.TextChoices):
        EDUCATION = "education", _("Education")
        PROJECT = "project", _("Project Milestone")
        EXPERIENCE = "experience", _("Experience")
        MILESTONE = "milestone", _("Active Development Milestone")

    title = models.CharField(
        max_length=150,
        verbose_name=_("Milestone title"),
    )
    description = models.TextField(
        verbose_name=_("Milestone description"),
    )
    date_label = models.CharField(
        max_length=100,
        verbose_name=_("Date label (free text)"),
        help_text=_(
            "Displayed milestone timeframe (e.g. 2023 - 2027, Jun 2026 - Present, Now)."
        ),
    )
    kind = models.CharField(
        max_length=50,
        choices=JourneyKind.choices,
        default=JourneyKind.PROJECT,
        verbose_name=_("Milestone kind"),
    )
    order = models.PositiveIntegerField(
        default=0,
        verbose_name=_("Display order"),
    )
    is_visible = models.BooleanField(
        default=True,
        verbose_name=_("Is visible"),
    )

    class Meta:
        ordering = ["order", "id"]
        verbose_name = _("Journey Item")
        verbose_name_plural = _("Journey Items")

    def __str__(self):
        return f"{self.title} ({self.date_label})"


class Leadership(models.Model):
    """
    Leadership roles and community contributions beyond code.
    """

    title = models.CharField(
        max_length=150,
        verbose_name=_("Title"),
        help_text=_("Leadership title (e.g. Cultural Head, Arena Coordinator)."),
    )
    organization = models.CharField(
        max_length=150,
        verbose_name=_("Organization / Event"),
        help_text=_("University or committee organization name."),
    )
    description = models.TextField(
        verbose_name=_("Description of responsibilities"),
    )
    start_label = models.CharField(
        max_length=50,
        blank=True,
        verbose_name=_("Start label"),
    )
    end_label = models.CharField(
        max_length=50,
        blank=True,
        verbose_name=_("End label"),
    )
    order = models.PositiveIntegerField(
        default=0,
        verbose_name=_("Display order"),
    )
    is_visible = models.BooleanField(
        default=True,
        verbose_name=_("Is visible"),
    )

    class Meta:
        ordering = ["order", "id"]
        verbose_name = _("Leadership")
        verbose_name_plural = _("Leadership")

    def __str__(self):
        return f"{self.title} ({self.organization})"


class Certificate(models.Model):
    """
    Certificates and technical credentials. Hidden when collection is empty.
    """

    title = models.CharField(max_length=200, verbose_name=_("Certificate title"))
    issuer = models.CharField(max_length=150, verbose_name=_("Issuing organization"))
    issued_on = models.CharField(
        max_length=50, blank=True, verbose_name=_("Issued date label")
    )
    credential_url = models.CharField(
        max_length=500,
        blank=True,
        validators=[validate_https_url],
        verbose_name=_("Credential verification URL"),
    )
    file_or_image = models.FileField(
        upload_to="certificates/",
        blank=True,
        null=True,
        verbose_name=_("Certificate document or image"),
    )
    order = models.PositiveIntegerField(default=0, verbose_name=_("Display order"))
    is_visible = models.BooleanField(default=True, verbose_name=_("Is visible"))

    class Meta:
        ordering = ["order", "id"]
        verbose_name = _("Certificate")
        verbose_name_plural = _("Certificates")

    def __str__(self):
        return f"{self.title} ({self.issuer})"


class Hackathon(models.Model):
    """
    Hackathon participations and sprint competitions. Hidden when empty.
    """

    event = models.CharField(max_length=200, verbose_name=_("Event name"))
    date = models.CharField(max_length=50, blank=True, verbose_name=_("Date"))
    result = models.CharField(
        max_length=150, blank=True, verbose_name=_("Result / Standing")
    )
    link = models.CharField(
        max_length=500,
        blank=True,
        validators=[validate_https_url],
        verbose_name=_("Project or event link"),
    )
    description = models.TextField(verbose_name=_("Description of solution"))
    order = models.PositiveIntegerField(default=0, verbose_name=_("Display order"))
    is_visible = models.BooleanField(default=True, verbose_name=_("Is visible"))

    class Meta:
        ordering = ["order", "id"]
        verbose_name = _("Hackathon")
        verbose_name_plural = _("Hackathons")

    def __str__(self):
        return f"{self.event} ({self.result or 'Participant'})"


class Achievement(models.Model):
    """
    Honors, academic or technical awards. Hidden when empty.
    """

    title = models.CharField(max_length=200, verbose_name=_("Achievement title"))
    description = models.TextField(verbose_name=_("Description"))
    date = models.CharField(max_length=50, blank=True, verbose_name=_("Date"))
    link = models.CharField(
        max_length=500,
        blank=True,
        validators=[validate_https_url],
        verbose_name=_("Reference link"),
    )
    order = models.PositiveIntegerField(default=0, verbose_name=_("Display order"))
    is_visible = models.BooleanField(default=True, verbose_name=_("Is visible"))

    class Meta:
        ordering = ["order", "id"]
        verbose_name = _("Achievement")
        verbose_name_plural = _("Achievements")

    def __str__(self):
        return self.title


class Testimonial(models.Model):
    """
    Recommendations from mentors, managers, and peers. Hidden when empty.
    """

    __test__ = False

    name = models.CharField(max_length=150, verbose_name=_("Recommender name"))
    role = models.CharField(max_length=150, verbose_name=_("Role / Title"))
    company = models.CharField(max_length=150, verbose_name=_("Company / Organization"))
    quote = models.TextField(verbose_name=_("Testimonial quote"))
    photo = models.ImageField(
        upload_to="testimonials/",
        validators=[validate_image_file],
        blank=True,
        null=True,
        verbose_name=_("Photo"),
    )
    order = models.PositiveIntegerField(default=0, verbose_name=_("Display order"))
    is_visible = models.BooleanField(default=True, verbose_name=_("Is visible"))

    class Meta:
        ordering = ["order", "id"]
        verbose_name = _("Testimonial")
        verbose_name_plural = _("Testimonials")

    def __str__(self):
        return f"{self.name} - {self.company}"


class Technology(models.Model):
    """
    Normalized technology taxonomy tags used across projects.
    """

    class Category(models.TextChoices):
        BACKEND = "backend", _("Backend & Architecture")
        FRONTEND = "frontend", _("Frontend & UI")
        DATABASE = "database", _("Databases & ORM")
        TOOLS = "tools", _("Tools & DevOps")
        CONCEPTS = "concepts", _("Architectural Concepts")

    name = models.CharField(
        max_length=100,
        unique=True,
        verbose_name=_("Technology name"),
        help_text=_("Standardized name (e.g. Django, React, PostgreSQL)."),
    )
    slug = models.SlugField(
        max_length=100,
        unique=True,
        verbose_name=_("Slug identifier"),
    )
    icon_key = models.CharField(
        max_length=50,
        blank=True,
        verbose_name=_("Icon identifier"),
        help_text=_("React icon component name (e.g. SiDjango, SiReact)."),
    )
    category = models.CharField(
        max_length=50,
        choices=Category.choices,
        default=Category.BACKEND,
        verbose_name=_("Technology category"),
    )

    class Meta:
        ordering = ["name"]
        verbose_name = _("Technology")
        verbose_name_plural = _("Technologies")

    def __str__(self):
        return self.name
