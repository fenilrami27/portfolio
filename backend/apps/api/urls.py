"""
URL routing for /api/v1/ REST endpoints.
"""

from django.urls import path

from apps.api.views import (
    AchievementsListView,
    CertificatesListView,
    ContactSubmitView,
    EducationListView,
    ExperienceListView,
    HackathonsListView,
    HealthCheckView,
    LeadershipListView,
    PortfolioBundleView,
    ProfileDetailView,
    ProjectDetailView,
    ProjectListView,
    ResumeStreamView,
    SiteSettingsDetailView,
    SkillsListView,
    TestimonialsListView,
)

urlpatterns = [
    path("portfolio/", PortfolioBundleView.as_view(), name="portfolio-bundle"),
    path("projects/", ProjectListView.as_view(), name="project-list"),
    path("projects/<slug:slug>/", ProjectDetailView.as_view(), name="project-detail"),
    path("profile/", ProfileDetailView.as_view(), name="profile-detail"),
    path("settings/", SiteSettingsDetailView.as_view(), name="settings-detail"),
    path("skills/", SkillsListView.as_view(), name="skills-list"),
    path("experience/", ExperienceListView.as_view(), name="experience-list"),
    path("education/", EducationListView.as_view(), name="education-list"),
    path("leadership/", LeadershipListView.as_view(), name="leadership-list"),
    path("certificates/", CertificatesListView.as_view(), name="certificates-list"),
    path("hackathons/", HackathonsListView.as_view(), name="hackathons-list"),
    path("achievements/", AchievementsListView.as_view(), name="achievements-list"),
    path("testimonials/", TestimonialsListView.as_view(), name="testimonials-list"),
    path("resume/", ResumeStreamView.as_view(), name="resume-stream"),
    path("contact/", ContactSubmitView.as_view(), name="contact-submit"),
    path("health/", HealthCheckView.as_view(), name="health-check"),
]
