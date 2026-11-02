# Fenil Rami - Portfolio Frontend (Part 1 of 3)

Modern, high-performance public portfolio website for **Fenil Rami**, Python Backend & Full Stack Developer (Django + React).

Built with React, Vite, Tailwind CSS with CSS-variable design tokens, Framer Motion, TanStack Query, and self-hosted fonts.

---

## ⚡ Tech Stack & Architecture

- **Framework:** React 19 + Vite 6
- **Routing:** React Router v7 (`createBrowserRouter`) with route-level code splitting (`React.lazy`)
- **Styling & Tokens:** Tailwind CSS powered by strict CSS-variable design tokens (`tokens.css`) supporting smooth dark and light themes (WCAG AA compliant)
- **Typography:** Self-hosted fonts via `@fontsource` with `font-display: swap`
  - Headings: **Sora** (600, 700)
  - Body & UI: **Inter** (400, 500, 600)
  - Code & Tags: **JetBrains Mono** (400, 500)
- **State & Data Layer:** TanStack Query (`@tanstack/react-query`) with an abstracted API service layer ready for Part 2
- **Motion:** Framer Motion (respects `prefers-reduced-motion` across all components)
- **Icons:** `lucide-react` (UI icons) and `react-icons` (technology & brand glyphs)
- **SEO & Meta:** `react-helmet-async` with per-route titles and rich Schema.org Person JSON-LD

---

## 📂 Project Directory Structure

```text
Portfolio/
├── backend/                       # Reserved for Part 2 (Django + DRF)
│   └── README.md
├── frontend/                      # React Frontend application
│   ├── public/
│   │   ├── favicon.svg            # Branded FR monogram SVG icon
│   │   ├── Fenil_Rami_Resume.pdf  # Downloadable resume file
│   │   └── assets/
│   │       ├── personal/          # Profile portrait and OG previews
│   │       └── projects/          # Screenshots for each project slug
│   ├── src/
│   │   ├── app/                   # App root, providers, router configuration
│   │   ├── components/
│   │   │   ├── layout/            # Navbar, Footer, ScrollProgress, Layout
│   │   │   ├── sections/          # Hero, Overview, FeaturedWork, Skills, Journey, etc.
│   │   │   └── ui/                # Button, IconButton, Card, Chip, Badge, Skeleton, etc.
│   │   ├── context/               # ThemeContext (Dark/Light persistence)
│   │   ├── data/                  # Profile, projects, skills, experience, education, etc.
│   │   ├── hooks/                 # TanStack Query custom hooks
│   │   ├── lib/                   # Motion variants and utility helpers
│   │   ├── pages/                 # Home, Projects, ProjectDetail, Resume, NotFound
│   │   ├── services/              # portfolioService.js (Mock -> REST API bridge)
│   │   └── styles/                # tokens.css, base.css, print.css
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── TODO.md                    # Consolidated action items
│   └── vite.config.js
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation
```bash
# Navigate to the frontend directory
cd Portfolio/frontend

# Install dependencies
npm install
```

### Development Server
```bash
npm run dev
```
Open `http://localhost:5173` to view the application in your browser.

### Linting & Formatting
```bash
# Check code with ESLint
npm run lint

# Format code with Prettier
npm run format
```

### Production Build & Preview
```bash
# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## ✏️ How to Edit Content & Data

All profile information, project details, skills, and work history live in `src/data/`:

1. **Profile & Contact Details:** Edit `src/data/profile.js` to change headlines, availability status, and social profiles.
2. **Projects:** Add or edit projects in `src/data/projects.js`.
   - To publish/unpublish a project, toggle `isPublished: true / false`.
   - To feature a project on the homepage, set `isFeatured: true`.
   - Supports two card tiers: `tier: 'featured'` (large) and `tier: 'compact'` (dense).
3. **Skills & Groupings:** Edit `src/data/skills.js`. To show a skill level in the future, set `level: 'Advanced'` instead of `null`.
4. **Experience & Education:** Edit `src/data/experience.js` and `src/data/education.js`.
5. **Certificates & Testimonials:** Populate the arrays in `src/data/emptySections.js`. Sections and their nav items will automatically appear when entries exist.

---

## 🖼️ How to Add Images & Screenshots

1. **Profile Photo:** Place a portrait image at `public/assets/personal/photo-main.jpg`.
2. **Project Screenshots:**
   - Create a folder matching the project slug under `public/assets/projects/<slug>/`.
   - Place your `.jpg` or `.png` screenshots there.
   - Reference them in `src/data/projects.js` under the project's `gallery` array:
     ```js
     gallery: [
       {
         src: '/assets/projects/cmhp-pharma-erp/bmr-sheet.png',
         alt: 'Batch manufacturing record screen',
         caption: 'Digital 19-page tablet BMR preview'
       }
     ]
     ```

---

## 🔌 Part 2 (Django Backend) Integration

The frontend is fully connected to the Django REST API backend (`Portfolio/backend`) built in Part 2.

### Local Development Setup
1. **Start the Django Backend** (runs on port 8000):
   ```bash
   cd Portfolio/backend
   # Activate venv (.venv\Scripts\activate on Windows)
   python manage.py runserver 8000
   ```
2. **Start the Vite Frontend** (runs on port 5173):
   ```bash
   cd Portfolio/frontend
   npm run dev
   ```
   Vite's development server automatically proxies `/api` and `/media` requests to `http://127.0.0.1:8000`.

### Cold-Start Resilience & Fallback Data
- **No White Screens:** If the backend is spinning up or unavailable, TanStack Query immediately renders data from `src/data/fallback.json` as placeholder data without flickering.
- **Exporting Fallback Data:** Run `python manage.py export_fallback` from `Portfolio/backend/` whenever the database is seeded or updated to keep `fallback.json` up to date.

### Environment Configuration (.env)
Copy `.env.example` to `.env` to customize settings:
```env
# Backend API Base URL (leave blank for local Vite proxy to port 8000)
VITE_API_BASE_URL=

# Standalone Local Mode Toggle (set 'true' to bypass network requests entirely)
VITE_USE_LOCAL_DATA=false

# Cloudflare Turnstile Site Key (optional; empty skips verification locally)
VITE_TURNSTILE_SITE_KEY=
```
