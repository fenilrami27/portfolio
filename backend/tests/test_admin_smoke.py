"""
Smoke tests verifying that every admin changelist, change, and add form renders cleanly for a superuser.
"""

import pytest
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APIClient

from apps.content.models import (
    Achievement,
    Certificate,
    Education,
    Experience,
    FocusArea,
    Hackathon,
    JourneyItem,
    Leadership,
    SiteSettings,
    SkillGroup,
    Stat,
    Technology,
    Testimonial,
)
from apps.inbox.models import ContactMessage
from apps.profiles.models import Profile
from apps.projects.models import Project, ProjectFeatureGroup


@pytest.fixture
def superuser_client():
    client = APIClient()
    user = User.objects.create_superuser(
        username="fenil_admin",
        email="fenilrami1266@gmail.com",
        password="SuperSecureAdminPassword123!",
    )
    client.force_login(user)
    return client


@pytest.mark.django_db
class TestAdminSmoke:
    def test_admin_index_dashboard_renders(self, superuser_client):
        res = superuser_client.get(reverse("admin:index"))
        assert res.status_code == 200
        assert b"Content Overview & Dashboard" in res.content

    def test_all_admin_views_render_cleanly(self, superuser_client):
        # Create minimal instances for models
        profile = Profile.load()
        site_settings = SiteSettings.load()

        fa = FocusArea.objects.create(title="Test Area", description="Desc")
        stat = Stat.objects.create(label="Test Stat", value=10)
        sg = SkillGroup.objects.create(name="Backend")
        exp = Experience.objects.create(company="Test Corp", role="Intern")
        edu = Education.objects.create(institution="Uni", degree="IT")
        journey = JourneyItem.objects.create(title="Milestone", date_label="Now")
        lead = Leadership.objects.create(
            title="Lead", organization="Org", description="Desc"
        )
        cert = Certificate.objects.create(title="AWS Certified", issuer="Amazon")
        hack = Hackathon.objects.create(event="HackFest", description="Desc")
        ach = Achievement.objects.create(title="Winner", description="Desc")
        testim = Testimonial.objects.create(
            name="Mentor", role="Lead", company="Tech", quote="Great work"
        )
        tech = Technology.objects.create(name="Django", slug="django")
        proj = Project.objects.create(
            title="Admin Test Project", one_liner="Summary", description="Body"
        )
        fg = ProjectFeatureGroup.objects.create(project=proj, group="Core")
        msg = ContactMessage.objects.create(
            name="Inquirer", email="inq@test.com", message="Inquiry message content"
        )

        # Models with changelist and change view
        models_to_test = [
            ("profiles_profile", profile.pk, False),  # Singleton (no add)
            ("content_sitesettings", site_settings.pk, False),  # Singleton (no add)
            ("content_focusarea", fa.pk, True),
            ("content_stat", stat.pk, True),
            ("content_skillgroup", sg.pk, True),
            ("content_experience", exp.pk, True),
            ("content_education", edu.pk, True),
            ("content_journeyitem", journey.pk, True),
            ("content_leadership", lead.pk, True),
            ("content_certificate", cert.pk, True),
            ("content_hackathon", hack.pk, True),
            ("content_achievement", ach.pk, True),
            ("content_testimonial", testim.pk, True),
            ("content_technology", tech.pk, True),
            ("projects_project", proj.pk, True),
            ("projects_projectfeaturegroup", fg.pk, True),
            ("inbox_contactmessage", msg.pk, False),  # No add
        ]

        for model_prefix, pk, has_add in models_to_test:
            # Changelist view (singletons may redirect with 302 to their change view)
            changelist_url = reverse(f"admin:{model_prefix}_changelist")
            res_cl = superuser_client.get(changelist_url)
            assert res_cl.status_code in [200, 302], (
                f"Failed on {model_prefix} changelist"
            )

            # Change view
            change_url = reverse(f"admin:{model_prefix}_change", args=[pk])
            res_ch = superuser_client.get(change_url)
            assert res_ch.status_code == 200, f"Failed on {model_prefix} change view"

            # Add view
            if has_add:
                add_url = reverse(f"admin:{model_prefix}_add")
                res_add = superuser_client.get(add_url)
                assert res_add.status_code == 200, f"Failed on {model_prefix} add view"
