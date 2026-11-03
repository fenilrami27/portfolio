# Fenil Rami - Portfolio Full-Stack Application

Production-grade portfolio and case study platform for **Fenil Rami**, Python Backend & Full Stack Developer.

Architected with **React 19 + Vite** on the frontend, **Django 5 + Django REST Framework** on the backend, a **Django Unfold** content administration panel, automated PDF resume versioning, and zero-configuration local development.

---

## ⚡ Architecture & Tech Stack

```
Portfolio/
├── backend/                  # Django 5 + DRF Backend Engine
│   ├── config/               # Settings, WSGI/ASGI, URLs, Security
│   ├── apps/
│   │   ├── core/             # Singletons, Validators, Cache, Import & Export Commands
│   │   ├── profiles/         # Profile, RoleSought, SocialLink, ResumeVersion
│   │   ├── content/          # FocusArea, Stat, SkillGroup, Experience, Education, Journey, Leadership
│   │   ├── projects/         # Project, FeatureGroup, Challenge, ProjectImage, QuickAddProject
│   │   ├── inbox/            # ContactMessage (SHA-256 IP Hashing, Honeypot, Turnstile)
│   │   └── api/              # Serializers, Views, Throttling, ETag, Cache
│   ├── tests/                # 44 automated pytest test cases
│   └── requirements.txt      # Production Python dependencies
├── frontend/                 # React 19 + Vite Frontend Application
│   ├── src/
│   │   ├── components/       # Layout, Sections, UI tokens, Company Banner
│   │   ├── pages/            # Home, Projects, ProjectDetail, Resume, NotFound
│   │   ├── hooks/            # TanStack Query custom hooks with fallback caching
│   │   ├── services/         # portfolioService.js (REST API & Local Fallback bridge)
│   │   └── styles/           # tokens.css, base.css, print.css (1-page A4 layout)
│   ├── public/               # Favicons, Web Manifest, OG Images, QR codes, Resume
│   ├── scripts/              # prerender.js (Route-level static HTML prerendering)
│   └── vercel.json           # SPA rewrites, security headers, /resume.pdf rewrite
├── portfolio-assets/         # Real media, resume.pdf, project notes & case-study.json
├── scripts/
│   └── smoke_test.py         # Live URL & endpoint verification suite
├── ADMIN-GUIDE.md            # Plain English guide for Fenil to manage the site
├── CONTENT-CHECKLIST.md      # Assets inventory and missing screenshots tracker
├── DEPLOYMENT.md             # Complete step-by-step production hosting guide
└── RESUME-UPDATE.md          # Guide for QR codes, links, GitHub README & LinkedIn
```

---

## 🚀 Quickstart: Running Locally

### One-Command Startup (Frontend + Backend)
From the `Portfolio` root directory:
```powershell
# Using PowerShell
.\start_dev.ps1

# Or using Command Prompt / Double-click
start_dev.bat
```
Both servers launch in their respective environments:
- **Public Portfolio:** `http://localhost:5173/`
- **Frontend Admin Panel:** `http://localhost:5173/admin/`
- **Django Unfold Admin:** `http://127.0.0.1:8000/admin/`
  - **Username:** `fenil`
  - **Password:** *(Configured during setup / createsuperuser)*
- **Backend Portal & API Docs:** `http://127.0.0.1:8000/`

> **Resilient Fallback Mode:** If the backend is ever stopped, the React frontend automatically and gracefully switches to `src/data/fallback.json` without breaking or showing blank screens.

---

### Manual Startup (Individual Terminals)

#### Step 1: Start Django Backend (Port 8000)
```powershell
cd Portfolio/backend

# Activate virtual environment
.venv\Scripts\Activate.ps1

# Start development server
python manage.py runserver 127.0.0.1:8000
```
- **Backend API:** `http://127.0.0.1:8000/api/v1/portfolio/`
- **Health Check:** `http://127.0.0.1:8000/api/health/`
- **Admin Panel:** `http://127.0.0.1:8000/admin/`
- **Swagger Documentation:** `http://127.0.0.1:8000/api/docs/`

#### Step 2: Start React Frontend (Port 5173)
```bash
cd Portfolio/frontend
npm run dev
```

---

## 🧪 Testing & Code Quality

### Backend Pytest Suite (51 tests passing)
```powershell
cd Portfolio/backend
.venv\Scripts\pytest.exe tests -v
```

### Backend Linter (Ruff)
```powershell
cd Portfolio/backend
.venv\Scripts\ruff.exe check .
```

### Django Deployment Security Check (0 issues)
```powershell
$env:SECRET_KEY="production-secret-key-1234567890"
$env:DEBUG="False"
python manage.py check --deploy
```

### Frontend Linter & Build
```bash
cd Portfolio/frontend
npm run lint
npm run build
```

### Live Smoke Test
```powershell
python scripts/smoke_test.py --backend-url http://127.0.0.1:8000 --frontend-url http://localhost:5173
```

---

## 📄 Handover Documentation

- **[ADMIN-GUIDE.md](./ADMIN-GUIDE.md):** Plain English numbered guide on adding projects, uploading resumes, reading inbox messages, and editing content.
- **[CONTENT-CHECKLIST.md](./CONTENT-CHECKLIST.md):** Inventory of all imported assets and missing screenshots for Fenil to provide.
- **[DEPLOYMENT.md](./DEPLOYMENT.md):** Exact instructions for deploying to Neon, Render, Cloudinary, Cloudflare Turnstile, and Vercel.
- **[RESUME-UPDATE.md](./RESUME-UPDATE.md):** How to integrate QR codes and project links into your resume, plus ready-to-use GitHub README and LinkedIn copy.
