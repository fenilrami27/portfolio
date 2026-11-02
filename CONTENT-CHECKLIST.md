# Content & Media Checklist (Launch Preparation)

This checklist tracks all assets and content items for **Fenil Rami's Portfolio**.

---

## 1. Provided & Fully Imported Assets

| Asset / Content | Location | Status | Notes |
| :--- | :--- | :--- | :--- |
| **Official PDF Resume** | `portfolio-assets/01-personal/resume.pdf` | **Imported** | Real 1-page resume provided in chat, active in DB & served at `/api/v1/resume/` and `/resume.pdf`. |
| **Main Profile Portrait** | `portfolio-assets/01-personal/photo-main.jpg` | **Imported** | 682x1024 portrait photo verified and uploaded. |
| **Monogram Favicons** | `frontend/public/` | **Generated** | Generated SVG, 32x32 PNG, 180x180 Apple Touch, 192x192 & 512x512 icons + web manifest. |
| **Open Graph (OG) Images** | `frontend/public/og-*.png` | **Generated** | 1200x630 branded banners generated for root and per-project case studies. |
| **QR Codes for Portfolio** | `portfolio-assets/qr-portfolio.*` | **Generated** | SVG and PNG vector QR codes generated pointing to `https://fenilrami.com`. |
| **Real Case Study Data** | `portfolio-assets/02-projects/*/case-study.json` | **Imported** | Verified case studies generated from real internship notes (CMHP ERP, HR University, Interior Design Studio). |
| **Real Contact & Social Links** | `portfolio-assets/05-links.txt` | **Imported** | LinkedIn (`fenil-rami-67303938a`), GitHub (`fenilrami27`), email (`fenilrami1266@gmail.com`), phone (`9978643380`). |
| **Sitemap & Robots.txt** | `frontend/public/sitemap.xml`, `robots.txt` | **Configured**| Indexed all static and dynamic case study routes. |

---

## 2. Items Still Missing (To Be Provided by Fenil)

All missing items currently render with **clean, graceful empty states** on the website so the site looks complete and professional without placeholder errors or fake data.

### High Priority (Case Study Polish)
- [ ] **CMHP Pharma ERP Screenshots:**
  - Place 2–4 screenshots in `portfolio-assets/02-projects/cmhp-pharma-erp/screenshots/`
  - Recommended captures:
    1. `01-bmr-tablet-sheet.png` (Digital Batch Manufacturing Record)
    2. `02-stock-ledger.png` (Real-time dual-company inventory ledger)
    3. `03-qc-qa-checkpoints.png` (Quality control sign-off modal)
- [ ] **HR University Portal Screenshots:**
  - Place 2–4 screenshots in `portfolio-assets/02-projects/hr-university/screenshots/`
  - Recommended captures:
    1. `01-hero-live-counters.png` (Animated homepage intro & statistics)
    2. `02-admission-workflow.png` (Interactive student enquiry flow)
    3. `03-django-admin-models.png` (Decoupled Django 5 admin dashboard)
- [ ] **Interior Design Studio Screenshots:**
  - Place 1–2 screenshots in `portfolio-assets/02-projects/interior-design-studio/screenshots/`

### Medium Priority (Credentials & Recognition)
*Note: Sections for these automatically appear as soon as data is added.*
- [ ] **Technical Certifications (`03-education-experience/`):**
  - Add certificate PDFs or image badges (e.g. Python, Django, Cloud, Database certifications) via Django Admin -> **Recognition** -> **Certificates**.
- [ ] **Campus Leadership Event Photos (`04-leadership/`):**
  - Optional photos of university cultural events or tech fest arena operations.
- [ ] **Colleague & Mentor Testimonials:**
  - Add recommendations from your internship engineering mentor or university professors via Django Admin -> **Recognition** -> **Testimonials**.
- [ ] **Video Walkthrough Demos (Optional):**
  - If you record a 2-minute Loom, YouTube unlisted video, or `.mp4` for CMHP ERP, paste the URL in the project's **Video URL** field in Django admin.

### Employer Clearance (Vibe Tech Labs)
- [ ] **VTL Internal Tools Project:**
  - The project is marked `is_employer_project = True` and kept **unpublished** by default.
  - Before publishing, confirm permission with your team lead at Vibe Tech Labs.

---

## 3. How to Import New Assets in One Command

Whenever you drop new screenshots or files into `portfolio-assets/`, simply run:
```powershell
python manage.py import_assets
```
The command will automatically validate file dimensions, optimize images, attach screenshots in alphabetical order, update the database, and sync the frontend fallback data!
