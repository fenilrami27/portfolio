"""
Root URL configuration for Fenil Rami portfolio backend.
"""

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

admin_url_path = getattr(settings, "ADMIN_URL", "admin/").strip("/") + "/"

urlpatterns = [
    # Administration Portal
    path(admin_url_path, admin.site.urls),
    # REST API v1
    path("api/v1/", include("apps.api.urls")),
]

# OpenAPI documentation routes
if getattr(settings, "ENABLE_API_DOCS", True):
    urlpatterns += [
        path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
        path(
            "api/docs/",
            SpectacularSwaggerView.as_view(url_name="schema"),
            name="swagger-ui",
        ),
        path(
            "api/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"
        ),
    ]

# Local media storage file serving
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
