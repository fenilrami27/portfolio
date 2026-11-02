"""
Django settings for the Fenil Rami portfolio backend.
Configured for production deployment with environment variables and local fallback.
"""

from pathlib import Path

import dj_database_url
import environ
from django.urls import reverse_lazy

BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env(
    DEBUG=(bool, False),
    SECRET_KEY=(str, "django-insecure-fenil-rami-portfolio-dev-secret-key-1234567890"),
    ALLOWED_HOSTS=(list, ["localhost", "127.0.0.1", "testserver"]),
    CORS_ALLOWED_ORIGINS=(
        list,
        [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:3000",
            "http://127.0.0.1:3000",
        ],
    ),
    CSRF_TRUSTED_ORIGINS=(
        list,
        [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:3000",
            "http://127.0.0.1:3000",
        ],
    ),
    ADMIN_URL=(str, "admin/"),
    DATABASE_URL=(str, ""),
    CLOUDINARY_URL=(str, ""),
    EMAIL_HOST=(str, ""),
    EMAIL_PORT=(int, 587),
    EMAIL_HOST_USER=(str, ""),
    EMAIL_HOST_PASSWORD=(str, ""),
    EMAIL_USE_TLS=(bool, True),
    DEFAULT_FROM_EMAIL=(str, "Fenil Rami <fenilrami1266@gmail.com>"),
    CONTACT_NOTIFICATION_EMAIL=(str, "fenilrami1266@gmail.com"),
    TURNSTILE_SECRET_KEY=(str, ""),
    ENABLE_API_DOCS=(bool, True),
    CONN_MAX_AGE=(int, 600),
    SECURE_SSL_REDIRECT=(bool, False),
    SESSION_COOKIE_SECURE=(bool, False),
    CSRF_COOKIE_SECURE=(bool, False),
    SECURE_HSTS_SECONDS=(int, 0),
)

# Read .env file if it exists
env_file = BASE_DIR / ".env"
if env_file.exists():
    environ.Env.read_env(env_file)

DEBUG = env("DEBUG")
SECRET_KEY = env("SECRET_KEY")
ALLOWED_HOSTS = env("ALLOWED_HOSTS")

ADMIN_URL = env("ADMIN_URL").strip("/") + "/"

INSTALLED_APPS = [
    # Modern admin theme (must come BEFORE django.contrib.admin)
    "unfold",
    "unfold.contrib.filters",
    "unfold.contrib.forms",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "whitenoise.runserver_nostatic",
    "django.contrib.staticfiles",
    # Third-party extensions
    "rest_framework",
    "corsheaders",
    "drf_spectacular",
    "axes",
    # Modular domain applications
    "apps.core.apps.CoreConfig",
    "apps.profiles.apps.ProfilesConfig",
    "apps.content.apps.ContentConfig",
    "apps.projects.apps.ProjectsConfig",
    "apps.inbox.apps.InboxConfig",
    "apps.api.apps.ApiConfig",
]

CLOUDINARY_URL = env("CLOUDINARY_URL")
if CLOUDINARY_URL:
    INSTALLED_APPS.insert(
        INSTALLED_APPS.index("django.contrib.staticfiles") + 1, "cloudinary_storage"
    )
    INSTALLED_APPS.insert(INSTALLED_APPS.index("cloudinary_storage") + 1, "cloudinary")
    DEFAULT_FILE_STORAGE = "cloudinary_storage.storage.MediaCloudinaryStorage"

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "axes.middleware.AxesMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"

# Database Configuration
DATABASE_URL = env("DATABASE_URL")
if DATABASE_URL:
    DATABASES = {
        "default": dj_database_url.config(
            default=DATABASE_URL,
            conn_max_age=env("CONN_MAX_AGE"),
            conn_health_checks=True,
        )
    }
    if "postgresql" in DATABASES["default"]["ENGINE"]:
        DATABASES["default"].setdefault("OPTIONS", {})
        DATABASES["default"]["OPTIONS"]["connect_timeout"] = 10
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
        "OPTIONS": {"min_length": 10},
    },
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# Authentication Backends & Login Lockout (Axes)
AUTHENTICATION_BACKENDS = [
    "axes.backends.AxesStandaloneBackend",
    "django.contrib.auth.backends.ModelBackend",
]

AXES_FAILURE_LIMIT = 5
AXES_COOLOFF_TIME = 1  # 1 hour
AXES_RESET_ON_SUCCESS = True
AXES_LOCKOUT_CALLABLE = None

# Internationalization
LANGUAGE_CODE = "en-us"
TIME_ZONE = "Asia/Kolkata"
USE_I18N = True
USE_TZ = True

# Static & Media Storage
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# Cache Configuration
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "portfolio-cache",
    }
}

# CORS & CSRF
CORS_ALLOWED_ORIGINS = env("CORS_ALLOWED_ORIGINS")
CORS_ALLOW_CREDENTIALS = True
CSRF_TRUSTED_ORIGINS = env("CSRF_TRUSTED_ORIGINS")

# Django REST Framework
REST_FRAMEWORK = {
    "DEFAULT_RENDERER_CLASSES": [
        "djangorestframework_camel_case.render.CamelCaseJSONRenderer",
        "djangorestframework_camel_case.render.CamelCaseBrowsableAPIRenderer",
    ],
    "DEFAULT_PARSER_CLASSES": [
        "djangorestframework_camel_case.parser.CamelCaseJSONParser",
        "djangorestframework_camel_case.parser.CamelCaseFormParser",
        "djangorestframework_camel_case.parser.CamelCaseMultiPartParser",
    ],
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.AnonRateThrottle",
        "rest_framework.throttling.ScopedRateThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "anon": "120/minute",
        "contact_hourly": "5/hour",
        "contact_daily": "20/day",
    },
}

# OpenAPI Docs Configuration
SPECTACULAR_SETTINGS = {
    "TITLE": "Fenil Rami Portfolio API",
    "DESCRIPTION": "High-performance REST API powering the Fenil Rami portfolio website and content administration dashboard.",
    "VERSION": "1.0.0",
    "SERVE_INCLUDE_SCHEMA": False,
    "CAMELIZE_NAMES": True,
}
ENABLE_API_DOCS = env("ENABLE_API_DOCS")

# Email Configuration
EMAIL_HOST = env("EMAIL_HOST")
if EMAIL_HOST:
    EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
    EMAIL_PORT = env("EMAIL_PORT")
    EMAIL_HOST_USER = env("EMAIL_HOST_USER")
    EMAIL_HOST_PASSWORD = env("EMAIL_HOST_PASSWORD")
    EMAIL_USE_TLS = env("EMAIL_USE_TLS")
else:
    EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

DEFAULT_FROM_EMAIL = env("DEFAULT_FROM_EMAIL")
CONTACT_NOTIFICATION_EMAIL = env("CONTACT_NOTIFICATION_EMAIL")

# Cloudflare Turnstile Verification
TURNSTILE_SECRET_KEY = env("TURNSTILE_SECRET_KEY")

# Production Security Headers
if not DEBUG:
    SECURE_SSL_REDIRECT = env("SECURE_SSL_REDIRECT")
    SESSION_COOKIE_SECURE = env("SESSION_COOKIE_SECURE")
    CSRF_COOKIE_SECURE = env("CSRF_COOKIE_SECURE")
    SECURE_HSTS_SECONDS = env("SECURE_HSTS_SECONDS")
    if SECURE_HSTS_SECONDS > 0:
        SECURE_HSTS_INCLUDE_SUBDOMAINS = True
        SECURE_HSTS_PRELOAD = True
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = "DENY"

# Unfold Theme Settings
UNFOLD = {
    "SITE_TITLE": "Fenil Rami · Portfolio Admin",
    "SITE_HEADER": "Fenil Rami · Portfolio admin",
    "SITE_SUBHEADER": "Professional Content Dashboard",
    "DASHBOARD_CALLBACK": "apps.core.dashboard.dashboard_callback",
    "SIDEBAR": {
        "show_search": True,
        "show_all_applications": False,
        "navigation": [
            {
                "title": "Overview",
                "separator": True,
                "items": [
                    {
                        "title": "Dashboard",
                        "icon": "dashboard",
                        "link": lambda request: reverse_lazy("admin:index"),
                    },
                ],
            },
            {
                "title": "Profile and site",
                "separator": True,
                "items": [
                    {
                        "title": "Profile",
                        "icon": "person",
                        "link": lambda request: reverse_lazy(
                            "admin:profiles_profile_changelist"
                        ),
                    },
                    {
                        "title": "Site settings",
                        "icon": "tune",
                        "link": lambda request: reverse_lazy(
                            "admin:content_sitesettings_changelist"
                        ),
                    },
                    {
                        "title": "Resume versions",
                        "icon": "description",
                        "link": lambda request: reverse_lazy(
                            "admin:profiles_resumeversion_changelist"
                        ),
                    },
                ],
            },
            {
                "title": "Work",
                "separator": True,
                "items": [
                    {
                        "title": "Projects",
                        "icon": "folder",
                        "link": lambda request: reverse_lazy(
                            "admin:projects_project_changelist"
                        ),
                    },
                    {
                        "title": "Quick add project",
                        "icon": "add_circle",
                        "link": lambda request: reverse_lazy(
                            "admin:projects_quickaddproject_add"
                        ),
                    },
                    {
                        "title": "Technologies",
                        "icon": "token",
                        "link": lambda request: reverse_lazy(
                            "admin:content_technology_changelist"
                        ),
                    },
                ],
            },
            {
                "title": "Skills",
                "separator": True,
                "items": [
                    {
                        "title": "Skill groups & skills",
                        "icon": "psychology",
                        "link": lambda request: reverse_lazy(
                            "admin:content_skillgroup_changelist"
                        ),
                    },
                ],
            },
            {
                "title": "Career",
                "separator": True,
                "items": [
                    {
                        "title": "Experience",
                        "icon": "work",
                        "link": lambda request: reverse_lazy(
                            "admin:content_experience_changelist"
                        ),
                    },
                    {
                        "title": "Education",
                        "icon": "school",
                        "link": lambda request: reverse_lazy(
                            "admin:content_education_changelist"
                        ),
                    },
                    {
                        "title": "Journey",
                        "icon": "route",
                        "link": lambda request: reverse_lazy(
                            "admin:content_journeyitem_changelist"
                        ),
                    },
                    {
                        "title": "Leadership",
                        "icon": "groups",
                        "link": lambda request: reverse_lazy(
                            "admin:content_leadership_changelist"
                        ),
                    },
                ],
            },
            {
                "title": "Recognition",
                "separator": True,
                "items": [
                    {
                        "title": "Certificates",
                        "icon": "verified",
                        "link": lambda request: reverse_lazy(
                            "admin:content_certificate_changelist"
                        ),
                    },
                    {
                        "title": "Hackathons",
                        "icon": "emoji_events",
                        "link": lambda request: reverse_lazy(
                            "admin:content_hackathon_changelist"
                        ),
                    },
                    {
                        "title": "Achievements",
                        "icon": "military_tech",
                        "link": lambda request: reverse_lazy(
                            "admin:content_achievement_changelist"
                        ),
                    },
                    {
                        "title": "Testimonials",
                        "icon": "format_quote",
                        "link": lambda request: reverse_lazy(
                            "admin:content_testimonial_changelist"
                        ),
                    },
                ],
            },
            {
                "title": "Inbox",
                "separator": True,
                "items": [
                    {
                        "title": "Messages",
                        "icon": "mail",
                        "link": lambda request: reverse_lazy(
                            "admin:inbox_contactmessage_changelist"
                        ),
                    },
                ],
            },
            {
                "title": "What I do and numbers",
                "separator": True,
                "items": [
                    {
                        "title": "Focus areas (What I do)",
                        "icon": "target",
                        "link": lambda request: reverse_lazy(
                            "admin:content_focusarea_changelist"
                        ),
                    },
                    {
                        "title": "Stats & counters",
                        "icon": "bar_chart",
                        "link": lambda request: reverse_lazy(
                            "admin:content_stat_changelist"
                        ),
                    },
                ],
            },
        ],
    },
}
