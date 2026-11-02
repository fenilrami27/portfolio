# Production Deployment & Hosting Guide

This guide provides exact, step-by-step instructions for deploying Fenil Rami's portfolio to production with zero ongoing hosting costs (leveraging free tiers on **Neon**, **Render**, **Cloudinary**, **Cloudflare**, and **Vercel**).

---

## Architecture Overview

```
                      ┌──────────────────────────────────────┐
                      │          Custom Domain DNS           │
                      │           fenilrami.com              │
                      └──────────────────┬───────────────────┘
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 │                                               │
                 ▼                                               ▼
      ┌─────────────────────┐                         ┌─────────────────────┐
      │   Vercel (Frontend) │                         │   Render (Backend)  │
      │   React 19 + Vite   │ ── API & Media Proxies ──▶ Django 5 + DRF     │
      │   fenilrami.com     │                         │ api.fenilrami.com   │
      └─────────────────────┘                         └──────────┬──────────┘
                                                                 │
                                     ┌───────────────────────────┼───────────────────────────┐
                                     │                           │                           │
                                     ▼                           ▼                           ▼
                          ┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
                          │   Neon PostgreSQL   │     │  Cloudinary Assets  │     │ Cloudflare Turnstile│
                          │   Database          │     │  Media Storage CDN  │     │ Bot Protection      │
                          └─────────────────────┘     └─────────────────────┘     └─────────────────────┘
```

---

## Step 1: Provision Neon Serverless PostgreSQL

1. Go to [Neon.tech](https://neon.tech/) and sign up / log in with GitHub.
2. Click **Create Project**:
   - **Project name:** `fenil-portfolio`
   - **Postgres version:** `16` (or `17`)
   - **Region:** `AWS Europe (Frankfurt)` or `AWS Asia Pacific (Singapore)`
3. Under **Dashboard** -> **Connection Details**:
   - Select **Connection string** and check **Pooled connection**.
   - Copy the URI. It will look like:
     ```text
     postgresql://neondb_owner:password@ep-xyz-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require
     ```
4. Save this as your `DATABASE_URL`.

---

## Step 2: Configure Cloudinary (Media & Image CDN)

1. Sign up at [Cloudinary.com](https://cloudinary.com/) (Free Tier).
2. From the **Cloudinary Dashboard**, locate your **API Environment Variable**:
   ```text
   CLOUDINARY_URL=cloudinary://<API_KEY>:<API_SECRET>@<CLOUD_NAME>
   ```
3. Copy this string. When set, Django automatically serves all uploaded photos, screenshots, and cover images from Cloudinary's fast global CDN with responsive `f_auto,q_auto` delivery.

---

## Step 3: Configure Cloudflare Turnstile (Anti-Spam)

1. Log into the [Cloudflare Dashboard](https://dash.cloudflare.com/) and navigate to **Turnstile**.
2. Click **Add Site**:
   - **Site name:** `Fenil Rami Portfolio`
   - **Domain:** `fenilrami.com` (and `localhost` for testing)
   - **Widget Mode:** `Managed` (Interactive only when suspicious)
3. You will receive:
   - **Site Key** (Public): Set as `VITE_TURNSTILE_SITE_KEY` on Vercel.
   - **Secret Key** (Private): Set as `TURNSTILE_SECRET_KEY` on Render.

---

## Step 4: Deploy Django Backend on Render

1. Log into [Render.com](https://render.com/).
2. Click **New +** -> **Blueprint**.
3. Connect your GitHub repository (`fenilrami27/Portfolio`).
4. Select the repository root. Render automatically detects `Portfolio/backend/render.yaml`.
5. Enter the required environment variables in Render:

| Variable | Recommended Production Value | Description |
| :--- | :--- | :--- |
| `SECRET_KEY` | *(Generate via `python -c "import secrets; print(secrets.token_urlsafe(50))"`)* | Cryptographic salt |
| `DEBUG` | `False` | Security critical |
| `ALLOWED_HOSTS` | `api.fenilrami.com,fenil-portfolio-api.onrender.com` | Hostname whitelist |
| `ADMIN_URL` | `admin/` (or unguessable e.g. `staff-portal/`) | URL path prefix for Django admin |
| `DATABASE_URL` | *(Paste your Neon pooled PostgreSQL connection string)* | Relational database |
| `CLOUDINARY_URL` | `cloudinary://key:secret@cloud_name` | Cloudinary asset storage |
| `CORS_ALLOWED_ORIGINS` | `https://fenilrami.com,http://localhost:5173` | Allowed frontend domains |
| `CSRF_TRUSTED_ORIGINS` | `https://fenilrami.com,https://api.fenilrami.com` | CSRF origin whitelist |
| `TURNSTILE_SECRET_KEY` | *(Your Cloudflare Turnstile secret key)* | Anti-spam verification |
| `EMAIL_HOST` | `smtp.resend.com` (or `smtp.gmail.com`) | Outbound email server |
| `EMAIL_PORT` | `587` | TLS port |
| `EMAIL_HOST_USER` | `resend` (or your SMTP username) | Email user |
| `EMAIL_HOST_PASSWORD` | *(Your SMTP API key or app password)* | Email secret |
| `DEFAULT_FROM_EMAIL` | `Portfolio <noreply@fenilrami.com>` | Sender address |
| `CONTACT_NOTIFICATION_EMAIL`| `fenilrami1266@gmail.com` | Destination inbox for contact form |
| `ENABLE_API_DOCS` | `True` (or `False` to hide Swagger in prod) | OpenAPI documentation |

6. Click **Apply Blueprint**. Render builds the service and executes:
   - `python manage.py migrate --noinput`
   - `python manage.py collectstatic --noinput`
   - `python manage.py seed_portfolio`
   - Gunicorn web server binds to `0.0.0.0:$PORT`
7. Health check: verify `https://<render-url>/api/v1/health/` returns `{"status":"healthy","database":"healthy"}`.

---

## Step 5: Deploy React Frontend on Vercel

1. Log into [Vercel.com](https://vercel.com/) and click **Add New...** -> **Project**.
2. Select your repository (`Portfolio`).
3. Configure **Project Settings**:
   - **Framework Preset:** `Vite`
   - **Root Directory:** Edit and select `frontend` (or `Portfolio/frontend`).
   - **Build Command:** `npm run build` (builds bundle and prerenders all routes).
   - **Output Directory:** `dist`
4. Add **Environment Variables**:
   - `VITE_API_BASE_URL` = `https://api.fenilrami.com`
   - `VITE_TURNSTILE_SITE_KEY` = *(Your Cloudflare Turnstile site key)*
   - `VITE_USE_LOCAL_DATA` = `false`
5. Click **Deploy**. Vercel will build the frontend, execute route prerendering, and deploy it to a global CDN.

---

## Step 6: Custom Domain & DNS Configuration

### 1. Root Domain (`fenilrami.com`) -> Point to Vercel
In your domain registrar (e.g., Namecheap, Cloudflare Registrar, GoDaddy):
- **A Record:** `@` -> `76.76.21.21` (Vercel IP)
- **CNAME Record:** `www` -> `cname.vercel-dns.com`

### 2. Backend Subdomain (`api.fenilrami.com`) -> Point to Render
- **CNAME Record:** `api` -> `<your-service-name>.onrender.com`

---

## Step 7: Verify Live Deployment (Smoke Test)

Run the included automated smoke test against your live URLs:
```powershell
python scripts/smoke_test.py --backend-url https://api.fenilrami.com --frontend-url https://fenilrami.com
```

The script verifies:
1. `GET /api/v1/health/` -> Status 200 (database healthy)
2. `GET /api/v1/portfolio/` -> Status 200 (bundled payload with ETag)
3. `GET /api/v1/resume/` -> Status 200 (active resume PDF attachment)
4. `POST /api/v1/contact/` -> Status 200 (honeypot test)
5. `GET /` -> Status 200 (homepage HTML with prerendered metadata)
6. `GET /projects/cmhp-pharma-erp` -> Status 200 (prerendered project case study)
7. `GET /resume` -> Status 200 (resume view)

---

## Step 8: Cold-Start Note & Uptime Pings

- **Render Free Tier Spin-Down:**
  - Free web services on Render sleep after 15 minutes of inactivity.
  - **Cold-Start Resilience:** Fenil's frontend is designed with TanStack Query placeholder data from `fallback.json`. Visitors see a fully populated portfolio instantly with **zero white-screen delay**.
  - **Optional Uptime Ping:** To keep the free backend awake 24/7 without paying, set up a free 5-minute ping monitor on [UptimeRobot.com](https://uptimerobot.com/) targeting `https://api.fenilrami.com/api/v1/health/`.
  - **Paid Upgrade:** When upgrading to Render Starter ($7/month), sleeping is permanently disabled.

---

## Step 9: Database Backups & Rollback Guide

### Automated Daily Backups (Neon)
Neon automatically performs point-in-time recovery (PITR) with continuous write-ahead logging (WAL) for up to 7 days on free tiers. To restore from a previous state, navigate to **Neon Dashboard** -> **Backups** -> **Restore**.

### Manual Snapshot Export
To export all database content into JSON:
```powershell
python manage.py dumpdata --natural-foreign --natural-primary -e contenttypes -e auth.Permission --indent 2 > backup.json
```

### Rollback Guide
If a bad deployment occurs:
1. **Frontend:** In Vercel, go to **Deployments** -> select the previous successful deployment -> click **Promote to Production** (instant 0-second rollback).
2. **Backend:** In Render, go to **Events** -> select the previous build -> click **Rollback to this deploy**.
