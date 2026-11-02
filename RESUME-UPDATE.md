# Resume Update & Handover Guide

This guide explains how to enhance Fenil Rami's printed and PDF resume with portfolio links and vector QR codes, and how to update the resume on the live website.

---

## 1. Adding Portfolio Link & QR Code to the Resume

### Where the QR Code Files Are Located
- Vector SVG: `portfolio-assets/qr-portfolio.svg` (and `frontend/public/qr-portfolio.svg`)
- High-res PNG: `portfolio-assets/qr-portfolio.png` (and `frontend/public/qr-portfolio.png`)

Both encode the direct portfolio URL: `https://fenilrami.com`

### Recommended Header Update
In your resume editing tool (Canva, Word, or LaTeX):
1. **Header Metadata Row:** Add `Portfolio: fenilrami.com`:
   ```text
   Ahmedabad, Gujarat | fenilrami1266@gmail.com | 9978643380 | LinkedIn | GitHub | fenilrami.com
   ```
2. **Top-Right Corner QR Code:**
   - Insert `qr-portfolio.svg` or `qr-portfolio.png` in the top right corner of the resume header.
   - Size: `0.8 inches x 0.8 inches` (approx 20mm x 20mm).
   - Label underneath in 7pt font: *"Scan for live projects"*.
   - Recruiters reviewing printed paper resumes can immediately point their phone camera to open your live web case studies!

### Project-Specific Links to Add to Resume
Under the **SELECTED PROJECTS** section of your resume, you can link directly to the interactive case study:
- **CMHP – Pharmaceutical ERP:**
  - *Link:* `https://fenilrami.com/projects/cmhp-pharma-erp`
- **HR University – University Website:**
  - *Link:* `https://fenilrami.com/projects/hr-university`
- **Interior Design Studio:**
  - *Link:* `https://fenilrami.com/projects/interior-design-studio`

---

## 2. Replacing Your Resume PDF Through Django Admin

Whenever you update your resume:
1. Export your document as a PDF file named `Fenil_Rami_Resume.pdf`.
2. Log into your Django Admin panel (`https://api.fenilrami.com/admin/`).
3. Under **Profile and site**, click **Resume versions** -> **Add Resume Version**.
4. Select your newly generated `.pdf` file.
5. Add a note (e.g., *"Updated July 2026 with university project launch"*).
6. Click **Save**.
7. **Instant Live Update:**
   - The website's **Download Resume** buttons on the homepage and `/resume` page immediately serve the new file.
   - The `/resume.pdf` URL automatically redirects to this new version.
   - The system deactivates older resumes while retaining the 10 most recent versions in history.

---

## 3. Ready GitHub Profile README (`fenilrami27/README.md`)

Create a repository on GitHub named `fenilrami27` (matching your username) with this exact `README.md`:

```markdown
# Hi there, I'm Fenil Rami 👋

**Python Backend & Full Stack Developer** based in Ahmedabad, Gujarat, India.

I specialize in building role-based enterprise business web applications with clean relational database schemas in **Django / PostgreSQL** and responsive interfaces in **React**.

🌐 **Portfolio & Interactive Case Studies:** [fenilrami.com](https://fenilrami.com)  
📄 **Resume:** [fenilrami.com/resume.pdf](https://fenilrami.com/resume.pdf)  
📫 **Email:** [fenilrami1266@gmail.com](mailto:fenilrami1266@gmail.com)  
🔗 **LinkedIn:** [linkedin.com/in/fenil-rami-67303938a](https://www.linkedin.com/in/fenil-rami-67303938a)

---

### 🛠️ Core Technical Stack

- **Backend:** Python, Django 5, Django REST Framework (DRF), REST APIs, RBAC, Authentication
- **Frontend:** React.js, Redux, JavaScript (ES6+), Tailwind CSS, HTML5, CSS3
- **Databases:** PostgreSQL, SQLite
- **Architecture:** Role-Based Access Control, Modular Django Apps, Edge Caching, Database Management

---

### 🚀 Featured Engineering Projects

#### 1. [CMHP – Pharmaceutical ERP System](https://fenilrami.com/projects/cmhp-pharma-erp)
- Independently built the complete React frontend for a two-company pharmaceutical ERP (CMHP Pharma & Tej Biocare).
- Engineered role-scoped modules for HRMS, orders, stock ledgers, digital 19-stage Batch Manufacturing Records (BMR), QC/QA sign-offs, and GST invoicing.

#### 2. [HR University – Web Portal & Modular Django Backend](https://fenilrami.com/projects/hr-university)
- Building an institutional web portal with interactive admissions workflows, live statistics counters, and department directories.
- Architected the modular Django 5 backend: 11 decoupled apps, 32 relational models, and 38 REST endpoints.

#### 3. [Interior Design Studio](https://fenilrami.com/projects/interior-design-studio)
- Developed a dynamic showcase website with client authentication, OTP-based password recovery, and admin dynamic image curation.

---

### 🎓 Education & Experience
- **Python Developer Intern** at **Vibe Tech Labs** *(Jun 2026 – Present)*
- **Bachelor of Information Technology** at **Gandhinagar University** *(2023 – 2027 | SGPA: 8.77 / 10)*
- **Cultural Head** at Gandhinagar University & **Arena Coordinator** at University Tech Fest
```

---

## 4. LinkedIn "About" and "Featured" Suggestions

### LinkedIn "About" Section Copy
Copy and paste this into your LinkedIn profile:

> Information Technology undergraduate and Python Developer Intern at Vibe Tech Labs with hands-on experience building business web applications using Python, Django, and React.
>
> In my internship, I independently developed the complete React frontend for an enterprise pharmaceutical ERP supporting two manufacturing entities (CMHP Pharma & Tej Biocare) across inventory ledgers, digital Batch Manufacturing Records (BMR), QC/QA compliance, and GST invoicing. Concurrently, I am architecting a modular Django 5 REST backend for a university website spanning 11 decoupled apps, 32 relational models, and 38 REST endpoints.
>
> Core Competencies:
> • Backend: Python, Django, Django REST Framework, RESTful API design, Role-Based Access Control (RBAC), Authentication
> • Frontend: React.js, Redux, JavaScript, Tailwind CSS, Responsive UI architecture
> • Databases: PostgreSQL, SQLite, relational query optimization
>
> Seeking Python Backend and Full Stack Developer opportunities where I can solve real business workflow challenges with clean, reliable architecture.
>
> 🌐 Portfolio & Case Studies: https://fenilrami.com  
> ✉️ Email: fenilrami1266@gmail.com

### LinkedIn "Featured" Section Links
Add these 3 items to your LinkedIn profile's **Featured** section:
1. **Link 1: Personal Portfolio Website**
   - URL: `https://fenilrami.com`
   - Title: `Fenil Rami · Python Backend & Full Stack Developer Portfolio`
   - Description: `Interactive case studies for CMHP Pharma ERP and HR University portal, built with React and Django.`
2. **Link 2: Official Resume PDF**
   - URL: `https://fenilrami.com/resume.pdf`
   - Title: `Fenil Rami · Curriculum Vitae`
   - Description: `Printable 1-page engineering resume detailing internship experience, projects, and university coursework.`
3. **Link 3: CMHP Pharma ERP Case Study**
   - URL: `https://fenilrami.com/projects/cmhp-pharma-erp`
   - Title: `CMHP Pharmaceutical ERP System · Technical Breakdown`
   - Description: `Deep dive into the dual-entity inventory ledger and digital 19-stage Batch Manufacturing Record (BMR) architecture.`
