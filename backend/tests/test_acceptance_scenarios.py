import io

import pytest
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from PIL import Image

from apps.content.models import FocusArea, Stat
from apps.inbox.models import ContactMessage
from apps.profiles.models import Profile, ResumeVersion
from apps.projects.models import Project, QuickAddProject, Technology


@pytest.mark.django_db
class TestAcceptanceScenarios:
    """
    Automated verification of Section 13 Acceptance Tests:
    1. Admin login as fenil.
    2. Edit profile name, headline, bio; verify changes in portfolio bundle API.
    3. Upload profile photo; verify it updates in API.
    4. Upload new resume PDF; verify download endpoint serves Fenil_Rami_Resume.pdf.
    5. Quick add project, then promote to featured; verify listing and detail.
    6. Reorder projects; verify order in API.
    7. Unpublish project; verify it disappears from list and slug returns 404.
    8. Contact form submission: hashed IP, inbox message, console email dispatch.
    9. Edit counters and focus areas ("What I do"); verify bundle payload reflects updates.
    """

    def test_01_admin_login_as_fenil(self, client):
        User = get_user_model()
        user = User.objects.create_superuser("fenil", "fenil@test.com", "TestSuperUserPass123!")

        client.force_login(user)
        res = client.get("/admin/")
        assert res.status_code == 200
        assert "Fenil Rami" in res.content.decode()

    def test_02_edit_profile_name_headline_bio(self, client):
        profile = Profile.load()
        profile.full_name = "Fenil Rami Updated"
        profile.headline = "Lead Backend Architect"
        profile.about = "Updated about section detailing 5+ years of Python expertise."
        profile.save()

        res = client.get("/api/v1/portfolio/")
        assert res.status_code == 200
        data = res.json()
        assert data["profile"]["name"] == "Fenil Rami Updated"
        assert data["profile"]["headline"] == "Lead Backend Architect"
        assert "5+ years of Python expertise" in data["profile"]["about"]

    def test_03_upload_profile_photo(self, client):
        img_buffer = io.BytesIO()
        img = Image.new("RGB", (200, 200), color="blue")
        img.save(img_buffer, format="JPEG")
        photo_file = SimpleUploadedFile(
            "portrait.jpg", img_buffer.getvalue(), content_type="image/jpeg"
        )

        profile = Profile.load()
        profile.photo = photo_file
        profile.save()

        res = client.get("/api/v1/portfolio/")
        assert res.status_code == 200
        data = res.json()
        assert data["profile"]["photo"] is not None
        assert "portrait" in data["profile"]["photo"]["url"]

    def test_04_resume_upload_and_download(self, client):
        valid_pdf_bytes = b"%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF"
        pdf_file = SimpleUploadedFile("v1.pdf", valid_pdf_bytes, content_type="application/pdf")

        ResumeVersion.objects.create(file=pdf_file, note="First version")

        # Stream download
        res = client.get("/api/v1/resume/")
        assert res.status_code == 200
        assert res["Content-Type"] == "application/pdf"
        assert 'filename="Fenil_Rami_Resume.pdf"' in res["Content-Disposition"]

    def test_05_quick_add_project_and_feature_promotion(self, client):
        t1, _ = Technology.objects.get_or_create(name="FastAPI", slug="fastapi")
        t2, _ = Technology.objects.get_or_create(name="Redis", slug="redis")
        t3, _ = Technology.objects.get_or_create(name="Docker", slug="docker")

        # Quick add compact project
        proj = QuickAddProject.objects.create(
            title="Microservice Cache Engine",
            slug="microservice-cache-engine",
            one_liner="Distributed Redis caching engine for high throughput.",
            tier=Project.ProjectTier.COMPACT,
            type=Project.ProjectType.BACKEND,
            status=Project.ProjectStatus.COMPLETED,
            is_published=True,
            order=1,
        )
        proj.stack.set([t1, t2, t3])

        # Verify listed in /projects/
        res = client.get("/api/v1/projects/")
        assert res.status_code == 200
        slugs = [p["slug"] for p in res.json()]
        assert "microservice-cache-engine" in slugs

        # Promote to featured with 2 paragraphs in Project admin
        full_proj = Project.objects.get(id=proj.id)
        full_proj.tier = Project.ProjectTier.FEATURED
        full_proj.is_featured = True
        full_proj.description = (
            "Paragraph 1: High-throughput caching proxy built in Python.\n\n"
            "Paragraph 2: Features sub-millisecond retrieval benchmarks."
        )
        full_proj.save()

        # Check detail endpoint
        res = client.get("/api/v1/projects/microservice-cache-engine/")
        assert res.status_code == 200
        detail = res.json()
        assert detail["tier"] == "featured"
        assert len(detail["description"]) == 2
        assert "FastAPI" in detail["stack"]

    def test_06_reorder_projects(self, client):
        p1, _ = Project.objects.update_or_create(
            slug="proj-a", defaults={"title": "Proj A", "is_published": True, "order": 10}
        )
        p2, _ = Project.objects.update_or_create(
            slug="proj-b", defaults={"title": "Proj B", "is_published": True, "order": 20}
        )

        res = client.get("/api/v1/projects/")
        items = res.json()
        a_idx = next(i for i, x in enumerate(items) if x["slug"] == "proj-a")
        b_idx = next(i for i, x in enumerate(items) if x["slug"] == "proj-b")
        assert a_idx < b_idx

        # Reverse ordering
        p1.order = 30
        p1.save()

        res2 = client.get("/api/v1/projects/")
        items2 = res2.json()
        a_idx2 = next(i for i, x in enumerate(items2) if x["slug"] == "proj-a")
        b_idx2 = next(i for i, x in enumerate(items2) if x["slug"] == "proj-b")
        assert b_idx2 < a_idx2

    def test_07_unpublish_project_disappears_and_returns_404(self, client):
        p, _ = Project.objects.update_or_create(
            slug="secret-prototype",
            defaults={"title": "Secret", "is_published": True, "order": 1},
        )

        res1 = client.get("/api/v1/projects/secret-prototype/")
        assert res1.status_code == 200

        # Unpublish
        p.is_published = False
        p.save()

        res2 = client.get("/api/v1/projects/")
        assert "secret-prototype" not in [x["slug"] for x in res2.json()]

        res3 = client.get("/api/v1/projects/secret-prototype/")
        assert res3.status_code == 404

    def test_08_contact_submission_hashes_ip_and_records_inbox(self, client, mailoutbox):
        payload = {
            "name": "Recruiter Jane",
            "email": "jane@techcorp.com",
            "message": "We have an exceptional Senior Django role for you.",
            "website_hp": "",
        }

        res = client.post("/api/v1/contact/", payload, content_type="application/json")
        assert res.status_code == 201

        msg = ContactMessage.objects.filter(email="jane@techcorp.com").first()
        assert msg is not None
        assert msg.ip_hash != "127.0.0.1"  # Never raw IP
        assert len(msg.ip_hash) == 64  # SHA-256 hex string
        assert msg.is_spam is False
        assert msg.email_sent is True
        assert len(mailoutbox) == 1
        assert "Recruiter Jane" in mailoutbox[0].body

    def test_09_edit_counters_and_what_i_do(self, client):
        stat = Stat.objects.filter(kind=Stat.StatKind.MANUAL).first()
        if not stat:
            stat = Stat.objects.create(label="Code Reviews", value=150, kind=Stat.StatKind.MANUAL)
        stat.label = "Production Deployments"
        stat.value = 42
        stat.save()

        fa = FocusArea.objects.first()
        if not fa:
            fa = FocusArea.objects.create(title="Microservices", description="Distributed architectures")
        fa.title = "High Availability Systems"
        fa.save()

        res = client.get("/api/v1/portfolio/")
        assert res.status_code == 200
        bundle = res.json()
        stat_labels = [s["label"] for s in bundle["stats"]]
        assert "Production Deployments" in stat_labels

        focus_titles = [f["title"] for f in bundle["focusAreas"]]
        assert "High Availability Systems" in focus_titles
