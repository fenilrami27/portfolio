"""
Tests for singleton base models, custom validators, and resume version pruning logic.
"""

import io

import pytest
from django.core.exceptions import ValidationError
from django.core.files.base import ContentFile
from django.core.files.uploadedfile import SimpleUploadedFile
from PIL import Image

from apps.content.models import SiteSettings
from apps.core.validators import (
    validate_https_url,
    validate_image_file,
    validate_pdf_file,
)
from apps.profiles.models import Profile, ResumeVersion
from apps.projects.models import Project


@pytest.mark.django_db
class TestValidators:
    def test_https_url_validation_success(self):
        validate_https_url("https://fenilrami.com")
        validate_https_url("https://github.com/fenilrami27")
        validate_https_url("mailto:fenilrami1266@gmail.com")
        validate_https_url("")
        validate_https_url(None)

    def test_https_url_validation_rejects_insecure_http(self):
        with pytest.raises(ValidationError) as exc:
            validate_https_url("http://insecure-site.com")
        assert "URL must start with https://" in str(exc.value)

    def test_pdf_validation_accepts_valid_pdf(self):
        valid_pdf_content = b"%PDF-1.4\n1 0 obj\n<< /Title (Test) >>\nendobj\n%%EOF"
        pdf_file = SimpleUploadedFile(
            "resume.pdf", valid_pdf_content, content_type="application/pdf"
        )
        validate_pdf_file(pdf_file)

    def test_pdf_validation_rejects_fake_extension(self):
        fake_content = b"This is not a real PDF document."
        fake_file = SimpleUploadedFile(
            "fake.pdf", fake_content, content_type="application/pdf"
        )
        with pytest.raises(ValidationError) as exc:
            validate_pdf_file(fake_file)
        assert "missing '%PDF-' signature" in str(exc.value)

    def test_pdf_validation_rejects_non_pdf_extension(self):
        valid_content = b"%PDF-1.4\n..."
        doc_file = SimpleUploadedFile(
            "document.docx", valid_content, content_type="application/msword"
        )
        with pytest.raises(ValidationError) as exc:
            validate_pdf_file(doc_file)
        assert "Only PDF documents are allowed" in str(exc.value)

    def test_image_validation_accepts_valid_image(self):
        img_io = io.BytesIO()
        img = Image.new("RGB", (100, 100), color=(73, 109, 137))
        img.save(img_io, format="JPEG")
        img_file = SimpleUploadedFile(
            "test.jpg", img_io.getvalue(), content_type="image/jpeg"
        )
        validate_image_file(img_file)

    def test_image_validation_rejects_corrupted_file(self):
        corrupted = SimpleUploadedFile(
            "corrupted.png", b"not-a-png-file", content_type="image/png"
        )
        with pytest.raises(ValidationError):
            validate_image_file(corrupted)


@pytest.mark.django_db
class TestSingletonModels:
    def test_profile_singleton_enforcement(self):
        p1 = Profile.load()
        assert p1.pk is not None

        # Attempting to manually create a second instance should raise ValidationError
        p2 = Profile(full_name="Second Fenil")
        with pytest.raises(ValidationError):
            p2.save()

        # Deleting the singleton must fail
        with pytest.raises(ValidationError):
            p1.delete()

    def test_site_settings_singleton_enforcement(self):
        s1 = SiteSettings.load()
        assert s1.pk is not None

        s2 = SiteSettings(site_title="Duplicate Title")
        with pytest.raises(ValidationError):
            s2.save()

        with pytest.raises(ValidationError):
            s1.delete()


@pytest.mark.django_db
class TestResumeVersionLifecycle:
    def test_new_upload_auto_activates_and_deactivates_previous(self):
        pdf_content = b"%PDF-1.4\n1 0 obj << >> endobj\n%%EOF"
        v1 = ResumeVersion(note="Version 1")
        v1.file.save("v1.pdf", ContentFile(pdf_content), save=True)
        assert v1.is_active is True

        v2 = ResumeVersion(note="Version 2")
        v2.file.save("v2.pdf", ContentFile(pdf_content), save=True)
        assert v2.is_active is True

        v1.refresh_from_db()
        assert v1.is_active is False
        assert ResumeVersion.get_active() == v2

    def test_pruning_keeps_maximum_10_versions(self):
        pdf_content = b"%PDF-1.4\n1 0 obj << >> endobj\n%%EOF"
        for i in range(15):
            rv = ResumeVersion(note=f"Revision {i}")
            rv.file.save(f"v_{i}.pdf", ContentFile(pdf_content), save=True)

        assert ResumeVersion.objects.count() == 10


@pytest.mark.django_db
class TestProjectModel:
    def test_auto_slug_generation(self):
        proj = Project.objects.create(
            title="Automated Test Project",
            one_liner="A test project summary.",
            description="Paragraph 1.\n\nParagraph 2.",
        )
        assert proj.slug == "automated-test-project"

    def test_description_paragraphs_split(self):
        proj = Project.objects.create(
            title="Multi Paragraph Build",
            one_liner="Summary",
            description="Paragraph 1.\n\nParagraph 2.\n\nParagraph 3.",
        )
        paragraphs = proj.get_description_paragraphs()
        assert len(paragraphs) == 3
        assert paragraphs[0] == "Paragraph 1."
        assert paragraphs[1] == "Paragraph 2."
        assert paragraphs[2] == "Paragraph 3."
