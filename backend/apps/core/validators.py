"""
Custom validation utilities for URLs, files, images, and PDFs.
"""

import os

from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from PIL import Image


def validate_https_url(value):
    """
    Ensure URLs use the secure HTTPS protocol.
    Permits empty values or valid https:// URLs (and mailto: for email links).
    """
    if not value:
        return
    url_lower = value.strip().lower()
    if url_lower.startswith("mailto:") or url_lower.startswith("tel:"):
        return
    if not url_lower.startswith("https://"):
        raise ValidationError(
            _("URL must start with https:// for security (received: '%(val)s')."),
            params={"val": value},
            code="insecure_url",
        )


def validate_image_file(file_obj):
    """
    Validate uploaded image files:
    - Maximum size: 8 MB
    - Allowed extensions: .jpg, .jpeg, .png, .webp, .svg, .gif
    - Real image verification via Pillow (non-SVG)
    """
    if not file_obj:
        return

    max_size_mb = 8
    if file_obj.size > max_size_mb * 1024 * 1024:
        raise ValidationError(
            _(
                "Image file size must not exceed %(max)s MB (current size: %(size).2f MB)."
            ),
            params={"max": max_size_mb, "size": file_obj.size / (1024 * 1024)},
            code="file_too_large",
        )

    ext = os.path.splitext(file_obj.name)[1].lower()
    allowed_extensions = [".jpg", ".jpeg", ".png", ".webp", ".svg", ".gif"]
    if ext not in allowed_extensions:
        raise ValidationError(
            _(
                "File extension '%(ext)s' is not allowed. Supported formats: %(allowed)s."
            ),
            params={"ext": ext, "allowed": ", ".join(allowed_extensions)},
            code="invalid_extension",
        )

    # SVG files are vector XML; Pillow cannot verify them like raster images
    if ext == ".svg":
        return

    # Verify raster image integrity using Pillow
    try:
        # Seek to beginning if needed
        if hasattr(file_obj, "seek"):
            file_obj.seek(0)
        img = Image.open(file_obj)
        img.verify()
        if hasattr(file_obj, "seek"):
            file_obj.seek(0)
    except Exception as exc:
        raise ValidationError(
            _("The uploaded file is not a valid or readable image: %(error)s"),
            params={"error": str(exc)},
            code="corrupt_image",
        ) from exc


def validate_pdf_file(file_obj):
    """
    Validate uploaded PDF resumes:
    - Maximum size: 5 MB
    - Allowed extension: .pdf
    - Real PDF content validation (must begin with %PDF-)
    """
    if not file_obj:
        return

    max_size_mb = 5
    if file_obj.size > max_size_mb * 1024 * 1024:
        raise ValidationError(
            _(
                "PDF resume file size must not exceed %(max)s MB (current size: %(size).2f MB)."
            ),
            params={"max": max_size_mb, "size": file_obj.size / (1024 * 1024)},
            code="file_too_large",
        )

    ext = os.path.splitext(file_obj.name)[1].lower()
    if ext != ".pdf":
        raise ValidationError(
            _("Only PDF documents are allowed (file has extension '%(ext)s')."),
            params={"ext": ext},
            code="invalid_extension",
        )

    # Inspect magic bytes at the beginning of the file
    try:
        if hasattr(file_obj, "seek"):
            file_obj.seek(0)
        header = file_obj.read(1024)
        if hasattr(file_obj, "seek"):
            file_obj.seek(0)
        if not header.startswith(b"%PDF-"):
            raise ValidationError(
                _(
                    "The uploaded file does not contain valid PDF data (missing '%PDF-' signature)."
                ),
                code="invalid_pdf_content",
            )
    except Exception as exc:
        if isinstance(exc, ValidationError):
            raise
        raise ValidationError(
            _("Failed to verify PDF content: %(error)s"),
            params={"error": str(exc)},
            code="corrupt_pdf",
        ) from exc
