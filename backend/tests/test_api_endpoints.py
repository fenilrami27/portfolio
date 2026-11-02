"""
Comprehensive tests for REST API endpoints and data payloads.
"""

from datetime import date

import pytest
from django.core.files.base import ContentFile
from rest_framework.test import APIClient

from apps.content.models import (
    Education,
    Experience,
    FocusArea,
    JourneyItem,
    Leadership,
    SiteSettings,
    Skill,
    SkillGroup,
    Stat,
)
from apps.profiles.models import Profile, ResumeVersion, RoleSought
from apps.projects.models import Project, Technology


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def seeded_portfolio():
    profile = Profile.load()
    profile.full_name = "Fenil Rami"
    profile.headline = "Python Backend & Full Stack Developer"
    profile.save()

    RoleSought.objects.create(profile=profile, name="Django Developer", order=1)

    settings_obj = SiteSettings.load()
    settings_obj.experience_start_date = date(2026, 6, 1)
    settings_obj.save()

    Stat.objects.create(
        label="Projects showcased", kind=Stat.StatKind.PROJECTS_COUNT, order=1
    )
    Stat.objects.create(
        label="Months experience",
        kind=Stat.StatKind.EXPERIENCE_MONTHS,
        suffix="+",
        order=2,
    )
    Stat.objects.create(
        label="Manual metric", kind=Stat.StatKind.MANUAL, value=42, order=3
    )

    FocusArea.objects.create(
        title="Role-based apps", description="Desc", icon_key="LuShieldCheck", order=1
    )

    sg = SkillGroup.objects.create(name="Backend", order=1)
    Skill.objects.create(group=sg, name="Python", icon_key="SiPython", order=1)

    exp = Experience.objects.create(company="Vibe Tech Labs", role="Developer", order=1)
    exp.bullets.create(text="Built ERP frontend", order=1)

    Education.objects.create(
        institution="Gandhinagar University", degree="B.Tech", order=1
    )
    JourneyItem.objects.create(
        title="University", date_label="2023 - 2027", kind="education", order=1
    )
    Leadership.objects.create(
        title="Cultural Head", organization="GU", description="Led events", order=1
    )

    # Tech
    t_django = Technology.objects.create(name="Django", slug="django")
    t_react = Technology.objects.create(name="React", slug="react")

    # Projects: 2 published, 1 unpublished
    p1 = Project.objects.create(
        title="CMHP Pharma ERP",
        slug="cmhp-pharma-erp",
        one_liner="Pharma ERP system",
        description="First paragraph.\n\nSecond paragraph.",
        role="Frontend developer",
        status="In development",
        type=Project.ProjectType.FRONTEND,
        tier=Project.ProjectTier.FEATURED,
        is_published=True,
        order=1,
    )
    p1.stack.add(t_react)

    p2 = Project.objects.create(
        title="HR University",
        slug="hr-university",
        one_liner="University website",
        description="University portal description.",
        role="Developer",
        status="In progress",
        type=Project.ProjectType.FULL_STACK,
        tier=Project.ProjectTier.FEATURED,
        is_published=True,
        order=2,
    )
    p2.stack.add(t_django, t_react)

    Project.objects.create(
        title="Internal VTL App",
        slug="vtl-app",
        one_liner="Internal proprietary system",
        description="Confidential workflow.",
        role="Full Stack",
        status="In development",
        type=Project.ProjectType.FULL_STACK,
        tier=Project.ProjectTier.COMPACT,
        is_published=False,  # UNPUBLISHED
        is_employer_project=True,
        order=3,
    )

    # Active Resume
    pdf_content = b"%PDF-1.4\n1 0 obj << >> endobj\n%%EOF"
    rv = ResumeVersion(note="Test Active Resume")
    rv.file.save("Fenil_Rami_Resume.pdf", ContentFile(pdf_content), save=True)

    return {
        "profile": profile,
        "published_count": 2,
        "published_slugs": ["cmhp-pharma-erp", "hr-university"],
        "unpublished_slug": "vtl-app",
    }


@pytest.mark.django_db
class TestPortfolioAPI:
    def test_portfolio_bundled_payload(self, api_client, seeded_portfolio):
        res = api_client.get("/api/v1/portfolio/")
        assert res.status_code == 200
        data = res.json()

        # Check required root bundle keys (camelCase)
        assert "profile" in data
        assert "settings" in data
        assert "stats" in data
        assert "focusAreas" in data
        assert "skills" in data
        assert "experience" in data
        assert "education" in data
        assert "journey" in data
        assert "leadership" in data
        assert "projects" in data
        assert "activeResumeUrl" in data

        # Check ETag and Cache-Control headers
        assert "ETag" in res.headers
        assert "public, max-age=60" in res.headers["Cache-Control"]

        # Verify only published projects are returned
        slugs = [p["slug"] for p in data["projects"]]
        assert "cmhp-pharma-erp" in slugs
        assert "hr-university" in slugs
        assert "vtl-app" not in slugs

    def test_conditional_etag_returns_304(self, api_client, seeded_portfolio):
        res = api_client.get("/api/v1/portfolio/")
        etag = res.headers.get("ETag")
        assert etag is not None

        # Repeat request with If-None-Match
        res_304 = api_client.get("/api/v1/portfolio/", HTTP_IF_NONE_MATCH=etag)
        assert res_304.status_code == 304

    def test_derived_stats_computation(self, api_client, seeded_portfolio):
        res = api_client.get("/api/v1/portfolio/")
        stats = res.json()["stats"]

        # Projects showcased stat should match 2 published projects
        projects_stat = next(s for s in stats if s["kind"] == "projects_count")
        assert projects_stat["computedValue"] == 2

        # Experience months should be >= 1
        months_stat = next(s for s in stats if s["kind"] == "experience_months")
        assert months_stat["computedValue"] >= 1
        assert months_stat["suffix"] == "+"

        # Manual stat should preserve manual value
        manual_stat = next(s for s in stats if s["kind"] == "manual")
        assert manual_stat["computedValue"] == 42

    def test_projects_list_published_only_and_filters(
        self, api_client, seeded_portfolio
    ):
        # List all
        res = api_client.get("/api/v1/projects/")
        assert res.status_code == 200
        assert len(res.data) == 2
        slugs = [p["slug"] for p in res.data]
        assert "vtl-app" not in slugs

        # Filter by type: Frontend
        res_type = api_client.get("/api/v1/projects/?type=Frontend")
        assert len(res_type.data) == 1
        assert res_type.data[0]["slug"] == "cmhp-pharma-erp"

        # Search query: Django
        res_search = api_client.get("/api/v1/projects/?q=Django")
        assert len(res_search.data) == 1
        assert res_search.data[0]["slug"] == "hr-university"

    def test_project_detail_paragraphs(self, api_client, seeded_portfolio):
        res = api_client.get("/api/v1/projects/cmhp-pharma-erp/")
        assert res.status_code == 200
        data = res.data
        assert isinstance(data["description"], list)
        assert len(data["description"]) == 2
        assert data["description"][0] == "First paragraph."
        assert data["description"][1] == "Second paragraph."

    def test_unpublished_project_returns_404(self, api_client, seeded_portfolio):
        res = api_client.get("/api/v1/projects/vtl-app/")
        assert res.status_code == 404
        assert "not found" in res.data["detail"].lower()

    def test_resume_download_attachment(self, api_client, seeded_portfolio):
        res = api_client.get("/api/v1/resume/")
        assert res.status_code == 200
        assert res["Content-Type"] == "application/pdf"
        assert (
            'attachment; filename="Fenil_Rami_Resume.pdf"' in res["Content-Disposition"]
        )

    def test_resume_download_inline(self, api_client, seeded_portfolio):
        res = api_client.get("/api/v1/resume/?inline=1")
        assert res.status_code == 200
        assert 'inline; filename="Fenil_Rami_Resume.pdf"' in res["Content-Disposition"]

    def test_resume_404_when_no_active_version(self, api_client):
        ResumeVersion.objects.all().delete()
        res = api_client.get("/api/v1/resume/")
        assert res.status_code == 404
        assert "No resume document is currently available" in res.data["detail"]

    def test_individual_service_endpoints(self, api_client, seeded_portfolio):
        endpoints = [
            "/api/v1/profile/",
            "/api/v1/settings/",
            "/api/v1/skills/",
            "/api/v1/experience/",
            "/api/v1/education/",
            "/api/v1/leadership/",
            "/api/v1/certificates/",
            "/api/v1/hackathons/",
            "/api/v1/achievements/",
            "/api/v1/testimonials/",
            "/api/v1/health/",
        ]
        for ep in endpoints:
            res = api_client.get(ep)
            assert res.status_code == 200, (
                f"Endpoint {ep} failed with {res.status_code}"
            )
