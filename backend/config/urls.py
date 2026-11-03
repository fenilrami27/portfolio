"""
Root URL configuration for Fenil Rami portfolio backend.
"""

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.http import HttpResponse, JsonResponse
from django.urls import include, path, re_path
from django.views.static import serve
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

admin_url_path = getattr(settings, "ADMIN_URL", "admin/").strip("/") + "/"


def root_view(request):
    """
    User-friendly backend root view.
    Renders clean HTML dashboard or JSON info based on Accept header.
    """
    if "application/json" in request.headers.get("Accept", ""):
        return JsonResponse({
            "service": "Fenil Rami Portfolio API & Engine",
            "status": "healthy",
            "version": "1.0.0",
            "endpoints": {
                "admin": f"/{admin_url_path}",
                "portfolio_api": "/api/v1/portfolio/",
                "docs": "/api/docs/",
                "health": "/api/health/",
            },
        })

    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Portfolio Backend Engine - Fenil Rami</title>
  <style>
    :root {{
      --bg: #0b0f17;
      --card: #121824;
      --border: #1f2937;
      --text: #f9fafb;
      --text-muted: #9ca3af;
      --accent: #3b82f6;
      --accent-hover: #2563eb;
      --success: #10b981;
    }}
    body {{
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: var(--bg);
      color: var(--text);
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 1.5rem;
      box-sizing: border-box;
    }}
    .card {{
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 1rem;
      max-width: 620px;
      width: 100%;
      padding: 2.5rem;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5);
    }}
    .badge {{
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(16, 185, 129, 0.15);
      color: var(--success);
      border: 1px solid rgba(16, 185, 129, 0.3);
      padding: 0.35rem 0.85rem;
      border-radius: 9999px;
      font-size: 0.825rem;
      font-weight: 600;
      letter-spacing: 0.025em;
      margin-bottom: 1.25rem;
    }}
    .badge-dot {{
      width: 8px;
      height: 8px;
      background: var(--success);
      border-radius: 50%;
      box-shadow: 0 0 8px var(--success);
    }}
    h1 {{
      margin: 0 0 0.5rem 0;
      font-size: 1.75rem;
      font-weight: 700;
      letter-spacing: -0.02em;
    }}
    p {{
      color: var(--text-muted);
      line-height: 1.6;
      margin: 0 0 2rem 0;
      font-size: 0.95rem;
    }}
    .links-grid {{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }}
    .btn {{
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      padding: 1rem 1.25rem;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border);
      border-radius: 0.75rem;
      color: var(--text);
      text-decoration: none;
      transition: all 0.2s ease;
    }}
    .btn:hover {{
      background: rgba(59, 130, 246, 0.08);
      border-color: var(--accent);
      transform: translateY(-2px);
    }}
    .btn-title {{
      font-weight: 600;
      font-size: 0.95rem;
      color: var(--text);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }}
    .btn-desc {{
      font-size: 0.8rem;
      color: var(--text-muted);
    }}
    .meta-box {{
      padding-top: 1.5rem;
      border-top: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.8rem;
      color: var(--text-muted);
    }}
    .meta-box a {{
      color: var(--accent);
      text-decoration: none;
    }}
    .meta-box a:hover {{
      text-decoration: underline;
    }}
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">
      <span class="badge-dot"></span>
      Backend Engine Live &amp; Healthy
    </div>
    <h1>Fenil Rami Portfolio Backend</h1>
    <p>
      High-performance Django 5 REST engine powering the portfolio website, content administration, dynamic media pipeline, and automated resume distribution.
    </p>

    <div class="links-grid">
      <a href="/{admin_url_path}" class="btn">
        <span class="btn-title">Django Admin Portal &rarr;</span>
        <span class="btn-desc">Manage profile, projects, competencies &amp; inbox</span>
      </a>
      <a href="/api/v1/portfolio/" class="btn">
        <span class="btn-title">REST API Bundle &rarr;</span>
        <span class="btn-desc">Complete JSON schema for frontend consumption</span>
      </a>
      <a href="/api/docs/" class="btn">
        <span class="btn-title">Swagger Documentation &rarr;</span>
        <span class="btn-desc">Interactive OpenAPI 3 endpoint explorer</span>
      </a>
      <a href="http://localhost:5173" class="btn">
        <span class="btn-title">Public Frontend Site &rarr;</span>
        <span class="btn-desc">React 19 visitor portfolio application</span>
      </a>
    </div>

    <div class="meta-box">
      <span>Django 5.1 &bull; SQLite &bull; Python 3.12</span>
      <span>Credentials in <a href="/{admin_url_path}">Admin Guide</a></span>
    </div>
  </div>
</body>
</html>
"""
    return HttpResponse(html_content)


def health_view(request):
    """Simple JSON health status check."""
    return JsonResponse({
        "status": "healthy",
        "service": "portfolio-backend",
        "time": "ok",
    })


urlpatterns = [
    # Root dashboard landing
    path("", root_view, name="backend-root"),
    path("api/health/", health_view, name="api-health"),
    path("health/", health_view, name="health"),
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

# Serve media files in local development and production fallback
urlpatterns += [
    re_path(
        r"^media/(?P<path>.*)$",
        serve,
        {"document_root": settings.MEDIA_ROOT},
    )
]
