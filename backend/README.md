# Fenil Rami Portfolio - Backend (Reserved for Part 2)

This directory is reserved for Part 2 of the portfolio project.

## Planned Stack & Architecture
- **Framework:** Python / Django 5 + Django REST Framework (DRF)
- **Database:** PostgreSQL
- **Key Apps & Modules:**
  - `profile_app`: Profile, social links, availability status, resume management
  - `projects_app`: Projects, feature groups, galleries, challenges & solutions
  - `skills_app`: Grouped skill taxonomy & proficiency levels
  - `experience_app`: Work experience & milestones
  - `contact_app`: Contact form submissions, spam protection (honeypot + rate limits), email notifications
  - `settings_app`: Site-wide settings, SEO metadata, toggles
- **Authentication & Admin:** Django Admin with customized dashboards & token/session auth

The React frontend (`../frontend`) is designed with a service data layer (`src/services/portfolioService.js`) that will seamlessly switch from local mock data to this REST API via `VITE_API_BASE_URL`.
