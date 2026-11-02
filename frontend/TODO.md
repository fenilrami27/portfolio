# Fenil Rami Portfolio - Action Items & TODO Tracker

This file tracks all placeholders, missing assets, content requirements, and upcoming integrations reserved for Fenil Rami and subsequent project phases.

---

## 1. Assets & Media (For Fenil / Part 3)
- [ ] **Main Profile Photo:**
  - File path: `/public/assets/personal/photo-main.jpg`
  - *Status:* A portrait has been placed from the initial upload. Confirm whether this remains the primary photo or should be updated with an alternate high-resolution studio shot.
- [ ] **Resume PDF:**
  - File path: `/public/Fenil_Rami_Resume.pdf`
  - *Action:* Replace placeholder PDF with the official, signed/formatted resume export.
- [ ] **Social Media Preview Images (OG / Twitter):**
  - File path: `/public/assets/personal/og-image.png`
  - *Action:* Design and add a 1200x630px branded social preview card for LinkedIn and Twitter sharing.
- [ ] **CMHP Pharma ERP Screenshots:**
  - File path: `/public/assets/projects/cmhp-pharma-erp/`
  - *Needed:* Real UI screenshots covering Workspaces, HRMS, BMR production forms (Drops, Tablet, Syrup, Mother Tincture), QC/QA approvals, and GST Tax Invoicing.
- [ ] **HR University Screenshots:**
  - File path: `/public/assets/projects/hr-university/`
  - *Needed:* Screen captures of the animated intro, live counters, admission popup, and department directories.
- [ ] **Interior Design Studio Screenshots:**
  - File path: `/public/assets/projects/interior-design-studio/`
  - *Needed:* Screen captures of product catalog, project pages, OTP reset interface, and Django admin gallery.

---

## 2. Project Permissions & Publication (For Fenil)
- [ ] **VTL Project (slug: `vtl`):**
  - Current status: `isPublished: false`
  - *Requirement:* Confirm formal clearance/permission from employer (Vibe Tech Labs) before switching `isPublished: true`.

---

## 3. Empty Sections (For Fenil - Render automatically once data is added)
- [ ] **Certificates (`src/data/emptySections.js`):**
  - Add certificates and accreditation details as they are completed.
- [ ] **Hackathons (`src/data/emptySections.js`):**
  - Add hackathons, datathons, or competitive sprints participated in.
- [ ] **Achievements (`src/data/emptySections.js`):**
  - Add academic, coding, or inter-college awards.
- [ ] **Testimonials (`src/data/emptySections.js`):**
  - Collect quotes from project managers, mentors, or professors at Gandhinagar University or Vibe Tech Labs.

---

## 4. Backend & API Integration (Part 2)
- [ ] **Django REST Framework Backend (`../backend`):**
  - Implement Django 5 project with apps: `profile_app`, `projects_app`, `skills_app`, `experience_app`, `contact_app`.
- [ ] **Database Setup:**
  - Set up PostgreSQL schema mirroring data models in `src/data/`.
- [ ] **Switch Data Services (`src/services/portfolioService.js`):**
  - Switch async service functions to fetch from `import.meta.env.VITE_API_BASE_URL`.
- [ ] **Live Contact Form API:**
  - Replace mock delay in `submitContact` with `POST /api/contact/`, email alerts, and rate limiting.

---

## 5. Deployment & SEO Polish (Part 3)
- [ ] **Production Domain & Canonical URL:**
  - Update `https://fenilrami.dev/` placeholders in `index.html` with real registered domain.
- [ ] **Lighthouse Performance & Core Web Vitals Audits:**
  - Run continuous audits on production preview build.
