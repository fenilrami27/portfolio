"""
Storage helpers and responsive image metadata utilities.
Supports local media storage and Cloudinary transformations.
"""

from django.conf import settings


def get_image_metadata(image_field, alt=""):
    """
    Build structured image metadata for API responses:
    - url: absolute or media URL
    - width: original width if accessible
    - height: original height if accessible
    - alt: accessible alt description
    - srcset: responsive srcset variants if hosted on Cloudinary
    """
    if not image_field:
        return None

    try:
        url = image_field.url
    except Exception:
        return None

    width = getattr(image_field, "width", None)
    height = getattr(image_field, "height", None)

    # Cloudinary responsive transformation support
    srcset = None
    is_cloudinary = "res.cloudinary.com" in url or getattr(
        settings, "CLOUDINARY_URL", None
    )

    if is_cloudinary and "res.cloudinary.com" in url and "/upload/" in url:
        widths = [390, 600, 800, 1200]
        srcset_parts = []
        base, path = url.split("/upload/", 1)
        for w in widths:
            transform = f"f_auto,q_auto,w_{w},c_limit"
            transformed_url = f"{base}/upload/{transform}/{path}"
            srcset_parts.append(f"{transformed_url} {w}w")
        srcset = ", ".join(srcset_parts)

    return {
        "url": url,
        "width": width,
        "height": height,
        "alt": alt or "",
        "srcset": srcset,
    }
