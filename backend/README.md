# Fenil Rami Portfolio - Backend & Administration Engine

Production-grade Django 5 & Django REST Framework (DRF) backend powering Fenil Rami's portfolio website. Includes a modern Unfold admin panel, dynamic content dashboard, automated PDF resume management, Cloudflare Turnstile anti-spam verification, and a high-performance REST API.

---

## 1. Architecture & Tech Stack

- **Framework:** Python 3.12+, Django 5.1.x, Django REST Framework 3.15.x
- **Admin Dashboard:** `django-unfold` (Tailwind CSS admin theme with responsive mobile layout and custom KPI dashboard)
- **Database:** PostgreSQL (Neon / Supabase) in production; zero-configuration local SQLite for development
- **Security & Lockout:** `django-axes` (login brute-force lockout), HTTPS-only validation, SHA-256 IP hashing
- **Media & Assets:** Cloudinary storage (`django-cloudinary-storage` + `cloudinary`) with automatic responsive `srcset` generation; local filesystem fallback
- **API Formatting:** `djangorestframework-camel-case` (automatic snake_case <-> camelCase serialization for React)
- **API Specification:** `drf-spectacular` (OpenAPI 3.0 schema generation, Swagger UI, and Redoc)
- **Static Assets:** WhiteNoise with compressed manifest storage
- **Testing & Quality:** `pytest`, `pytest-django`, `ruff`

---

## 2. Directory Structure

```
Portfolio/backend/
├── config/                  # Project configuration
│   ├── settings.py          # Environment-driven settings (local & production)
│   ├── urls.py              # Root routing (Admin, API v1, OpenAPI docs)
│   ├── wsgi.py              # WSGI entrypoint for Gunicorn
│   └── asgi.py              # ASGI entrypoint
├── apps/
│   ├── core/                # Singleton base, validators, storage, cache invalidation, dashboard
│   ├── profiles/            # Profile, RoleSought, SocialLink, ResumeVersion
│   ├── content/             # SiteSettings, FocusArea, Stat, SkillGroup, Experience, Education, etc.
│   ├── projects/            # Project, ProjectImage, FeatureGroup, Challenges, QuickAdd proxy
│   ├── inbox/               # ContactMessage with hashed IP tracking
│   └── api/                 # Serializers, views, throttles, URLs
├── tests/                   # Pytest suite (models, validators, API, security, admin, query counts)
├── manage.py
├── requirements.txt         # Production dependencies
├── requirements-dev.txt     # Development and testing dependencies
├── .env.example             # Complete environment variables template
├── render.yaml              # Render.com infrastructure blueprint
├── pytest.ini               # Pytest configuration
└── pyproject.toml           # Ruff linter and formatter settings
```

---

## 3. Local Setup & Quickstart

Everything runs locally with **zero external cloud accounts**.

### Step 1: Create and Activate Virtual Environment
```bash
# Windows (PowerShell)
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1

# Linux / macOS
python3.12 -m venv .venv
source .venv/bin/activate
```

### Step 2: Install Dependencies
```bash
pip install -r requirements-dev.txt
```

### Step 3: Run Database Migrations
```bash
python manage.py migrate
```

### Step 4: Seed Portfolio Content
Populates all models (profile, experience, education, skills, leadership, focus areas, stats, journey, and projects) idempotently from verified data:
```bash
python manage.py seed_portfolio
```
*(Use `python manage.py seed_portfolio --reset` to wipe and re-seed from scratch)*

### Step 5: Export Frontend Fallback Payload
Generates `../frontend/src/data/fallback.json` to ensure cold-start resilience and zero layout shift on initial page loads:
```bash
python manage.py export_fallback
```

### Step 6: Create Admin Superuser
```bash
python manage.py createsuperuser
```
Follow prompts to enter your username, email, and password.

### Step 7: Launch Development Server
```bash
python manage.py runserver 8000
```
- **Admin Panel:** [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/)
- **API Bundle:** [http://127.0.0.1:8000/api/v1/portfolio/](http://127.0.0.1:8000/api/v1/portfolio/)
- **Interactive Swagger Docs:** [http://127.0.0.1:8000/api/docs/](http://127.0.0.1:8000/api/docs/)

---

## 4. Environment Variables Reference

| Variable | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `DEBUG` | bool | `False` | Enables debug mode. Keep `False` in production. |
| `SECRET_KEY` | str | *(insecure dev default)* | Django cryptographic signing key. Generate a 50+ char random string in production. |
| `ALLOWED_HOSTS` | list | `localhost,127.0.0.1` | Comma-separated allowed hostnames and domain names. |
| `ADMIN_URL` | str | `admin/` | Admin panel URL path prefix. Use an unguessable path in production (e.g. `secret-portal/`). |
| `DATABASE_URL` | str | `""` | Database connection string. Empty defaults to local SQLite; in production use PostgreSQL (e.g. Neon). |
| `CONN_MAX_AGE` | int | `600` | Lifetime of database connections in seconds. |
| `CORS_ALLOWED_ORIGINS` | list | `http://localhost:5173,...` | Comma-separated frontend origins allowed to send cross-origin requests. |
| `CSRF_TRUSTED_ORIGINS` | list | `http://localhost:5173,...` | Origins trusted for safe cross-site form/CSRF submissions. |
| `CLOUDINARY_URL` | str | `""` | Cloudinary credentials (`cloudinary://key:secret@cloud_name`). Empty defaults to local media storage. |
| `EMAIL_HOST` | str | `""` | SMTP mail server hostname. Empty defaults to console backend (prints emails to terminal). |
| `EMAIL_PORT` | int | `587` | SMTP mail port. |
| `EMAIL_HOST_USER` | str | `""` | SMTP authentication username. |
| `EMAIL_HOST_PASSWORD` | str | `""` | SMTP authentication password or app token. |
| `EMAIL_USE_TLS` | bool | `True` | Enable TLS encryption for outgoing emails. |
| `DEFAULT_FROM_EMAIL` | str | `fenilrami1266@gmail.com` | Sender address on automated notifications. |
| `CONTACT_NOTIFICATION_EMAIL`| str | `fenilrami1266@gmail.com` | Target inbox where contact form notifications are delivered. |
| `TURNSTILE_SECRET_KEY` | str | `""` | Cloudflare Turnstile secret key. When empty, verification is skipped in development. |
| `ENABLE_API_DOCS` | bool | `True` | Exposes OpenAPI schema (`/api/schema/`) and Swagger/Redoc UI. |
| `SECURE_SSL_REDIRECT` | bool | `False` | Enforces HTTPS redirection when `DEBUG=False`. |
| `SESSION_COOKIE_SECURE` | bool | `False` | Marks session cookies as secure HTTPS-only. |
| `CSRF_COOKIE_SECURE` | bool | `False` | Marks CSRF cookies as secure HTTPS-only. |
| `SECURE_HSTS_SECONDS` | int | `0` | HTTP Strict Transport Security header age in seconds (e.g. `31536000`). |

---

## 5. REST API Endpoints (/api/v1/)

All endpoints return **camelCase JSON**:

- `GET /api/v1/portfolio/`: High-efficiency bundled payload (profile, settings, computed stats, focus areas, skills, experience, education, journey, leadership, credentials, published projects, active resume link). Cached in-memory with automatic signal-based invalidation and ETag HTTP 304 support.
- `GET /api/v1/projects/`: Published projects catalog. Supports filtering by `?type=`, `?tier=`, and search query `?q=`.
- `GET /api/v1/projects/<slug>/`: Detailed case study payload including paragraphs list, feature groups, gallery, and challenges.
- `GET /api/v1/profile/`: Fenil's personal profile, availability, roles, and socials.
- `GET /api/v1/settings/`: Site title, SEO metadata, contact headings, and currently building sprint.
- `GET /api/v1/skills/`: Grouped skill taxonomy with icons and proficiency levels.
- `GET /api/v1/experience/`: Work experience and internship records.
- `GET /api/v1/education/`: Academic degree, institution, and grade records.
- `GET /api/v1/leadership/`: Campus leadership and festival management history.
- `GET /api/v1/certificates/`: Professional credentials and certificates.
- `GET /api/v1/hackathons/`: Hackathons and technical competitions.
- `GET /api/v1/achievements/`: Key achievements and competitive milestones.
- `GET /api/v1/testimonials/`: Mentor, colleague, and client testimonials.
- `GET /api/v1/resume/`: Streams the active PDF resume (`Fenil_Rami_Resume.pdf`). Add `?inline=1` to preview in browser.
- `POST /api/v1/contact/`: Contact submission endpoint with honeypot rejection, Cloudflare Turnstile verification, rate limiting (5/hr, 20/day), SHA-256 IP hashing, and email dispatch.
- `GET /api/v1/health/`: Database connectivity check.

---

## 6. Running Tests & Code Quality

Run the automated pytest suite:
```bash
pytest
```
*Executes model lifecycle tests, singleton integrity checks, PDF validators, API contract verifications, rate limiting, and superuser admin smoke tests.*

Run Ruff linting and code formatting:
```bash
ruff check
ruff format --check
```

Verify deployment readiness:
```bash
python manage.py check --deploy
```
