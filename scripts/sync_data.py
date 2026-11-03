import os
import sys
import django

sys.path.insert(0, r"C:\Users\HP\Portfolio\backend")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from apps.profiles.models import Profile, RoleSought, SocialLink
from apps.content.models import SiteSettings, Competency, FocusArea, Stat, SkillGroup, Skill, Technology
from apps.projects.models import Project, ProjectImage, ProjectFeatureGroup, ProjectFeature, ProjectChallenge
from apps.core.cache import clear_portfolio_cache

print("Updating Profile...")
profile = Profile.load()
profile.phone = "+91 9978643380"
profile.show_phone = True
profile.headline = "Python Backend & Full Stack Developer (React & Django)"
profile.statement = "I build role-based business web applications and platforms with Django and React, from REST API design to production interfaces."
profile.supporting_line = "Developer behind the CMHP multi-company pharmaceutical ERP and the HR University academic platform. Turning real-world operational workflows into clean, reliable software."
profile.about = (
    "I'm a final-year Information Technology student and Python Backend & Full Stack Developer. "
    "I independently architected and built the complete React frontend for CMHP Pharma ERP—a multi-company "
    "pharmaceutical system covering HRMS, orders, dual-ledger inventory, digital BMR batch manufacturing records, "
    "and GST invoicing—and engineered the modern web platform and Django REST backend for HR University. "
    "My focus is on turning real operational workflows into clean, role-isolated, and reliable software. "
    "Additional work includes an Interior Design Studio web portal with OTP authentication and client portfolios, "
    "alongside attendance and recruitment pipelines."
)
profile.save()
print("Profile updated successfully.")

print("Updating Site Settings...")
settings_obj = SiteSettings.load()
settings_obj.site_title = "Fenil Rami | Python Backend & Full Stack Developer"
settings_obj.seo_title = "Fenil Rami | Python Backend & Full Stack Developer (CMHP ERP, HR University)"
settings_obj.seo_description = "Portfolio of Fenil Rami, Python Backend & Full Stack Developer. Featured projects include CMHP Pharma ERP and HR University platform."
settings_obj.footer_text = (
    "Python Backend & Full Stack Developer specializing in role-based business web applications with Django and React. "
    "Creator of CMHP Pharma ERP and the HR University academic web platform."
)
settings_obj.contact_heading = "Let's build something reliable."
settings_obj.contact_text = (
    "Open to Python Backend and Full Stack developer opportunities. "
    "Direct phone: +91 9978643380. The fastest way to reach me is phone, email, or LinkedIn."
)
settings_obj.currently_building_title = "HR University Platform & Django Backend"
settings_obj.currently_building_text = (
    "Engineering the production architecture with Django 5 and Django REST Framework, featuring 11 modular applications, "
    "32 relational models, and 38 REST endpoints supporting dynamic admissions, event schedules, and placement pipelines."
)
settings_obj.save()
print("Site settings updated.")

print("Seeding Core Competencies...")
competencies_data = [
    {
        "title": "Artificial Intelligence (AI)",
        "code": "AI",
        "full_name": "Artificial Intelligence",
        "icon_key": "LuBrain",
        "description": "Intelligent agent architectures, search heuristics, knowledge representation, and algorithmic reasoning systems.",
        "order": 1,
    },
    {
        "title": "Advanced Machine Learning (AML)",
        "code": "AML",
        "full_name": "Advanced Machine Learning",
        "icon_key": "LuCpu",
        "description": "Deep neural network architectures, hyperparameter optimization, ensemble strategies, and advanced predictive pipelines.",
        "order": 2,
    },
    {
        "title": "Machine Learning (ML)",
        "code": "ML",
        "full_name": "Machine Learning",
        "icon_key": "LuBoxes",
        "description": "Supervised and unsupervised learning paradigms, feature engineering, regression, and classification pipelines.",
        "order": 3,
    },
    {
        "title": "Computer Vision",
        "code": "Computer Vision",
        "full_name": "Computer Vision",
        "icon_key": "LuEye",
        "description": "Convolutional image processing, visual feature extraction, object detection, and spatial pattern classification.",
        "order": 4,
    },
    {
        "title": "Computer Networks (CN)",
        "code": "CN",
        "full_name": "Computer Networks",
        "icon_key": "LuNetwork",
        "description": "Layered protocol stacks, TCP/IP communication, routing architectures, socket programming, and packet flow.",
        "order": 5,
    },
    {
        "title": "Team Leadership",
        "code": "Team Leadership",
        "full_name": "Team Leadership",
        "icon_key": "LuUsers",
        "description": "Cross-functional team alignment, code review stewardship, pair programming, and engineering mentorship.",
        "order": 6,
    },
    {
        "title": "Project Management",
        "code": "Project Management",
        "full_name": "Project Management",
        "icon_key": "LuKanban",
        "description": "Agile sprint cycles, technical milestone scoping, backlog prioritization, and structured delivery schedules.",
        "order": 7,
    },
]

Competency.objects.all().delete()
for comp in competencies_data:
    Competency.objects.create(
        title=comp["title"],
        code=comp["code"],
        full_name=comp["full_name"],
        icon_key=comp["icon_key"],
        description=comp["description"],
        order=comp["order"],
        is_visible=True,
    )
print(f"Seeded {Competency.objects.count()} Core Competencies.")

# Projects synchronization
print("Updating Projects and Gallery Images...")
projects_config = [
    {
        "slug": "cmhp-pharma-erp",
        "title": "CMHP Pharma ERP",
        "one_liner": "A two-company pharmaceutical ERP: orders, inventory, production (BMR), QC/QA and GST invoicing in one role-based system.",
        "description": (
            "CMHP Pharma ERP is a multi-company enterprise platform engineered to streamline pharmaceutical operations across CMHP Pharma and Tej Biocare, with a shared Common Inventory environment.\n\n"
            "The system delivers strict workspace data isolation, ensuring customer databases are unified while inventory lots, manufacturing orders, invoices, and employee records remain segregated per company.\n\n"
            "Key operational workflows include multi-role order pipelines with live raw-material checks, digital batch manufacturing records (BMR) matching official standard templates pixel-for-pixel, dual-ledger inventory with CSV imports, and a full-featured HRMS suite covering attendance, shifts, leave tracking, and payroll."
        ),
        "role": "Frontend Developer (Independent)",
        "status": "In development (not yet handed over)",
        "type": "Frontend",
        "tier": "featured",
        "cover": "projects/cmhp-pharma-erp/cover.webp",
        "cover_alt": "CMHP Pharma ERP Company Dashboard",
        "order": 1,
        "is_featured": True,
        "is_published": True,
        "gallery": [
            ("projects/cmhp-pharma-erp/01-cmhp-login.webp", "Secure Login Portal", "Role-based authentication portal with pharmaceutical branding and validation"),
            ("projects/cmhp-pharma-erp/02-cmhp-workspace.webp", "Workspace Selection", "Multi-company workspace switcher isolating CMHP Pharma, Tej Biocare, and Common Inventory"),
            ("projects/cmhp-pharma-erp/03-cmhp-dashboard-company.webp", "Company Dashboard", "Real-time KPI metrics, dispatch status, orders summary, and inventory counters"),
            ("projects/cmhp-pharma-erp/04-cmhp-dashboard-common-inventory.webp", "Common Inventory Dashboard", "Shared inventory workspace tracking cross-company raw materials and lot availability"),
            ("projects/cmhp-pharma-erp/05-cmhp-hrms-dashboard.webp", "HRMS Dashboard", "Human resource overview monitoring staff attendance, leave balances, and departmental shifts"),
            ("projects/cmhp-pharma-erp/06-cmhp-hrms-attendance.webp", "Daily Attendance Logs", "Employee attendance tracking with daily punch logs, in/out timestamps, and status filters"),
            ("projects/cmhp-pharma-erp/07-cmhp-hrms-payroll.webp", "Payroll & Salary Slips", "Monthly payroll calculation engine with tax breakdown and print-ready salary slips"),
            ("projects/cmhp-pharma-erp/08-cmhp-hrms-employees.webp", "Employee Directory", "Central employee directory synchronized with designation hierarchies and shift allocations"),
            ("projects/cmhp-pharma-erp/09-cmhp-inventory-products.webp", "Products & Stock Lots", "Finished products repository with dual-entry stock ledger, batch tracking, and CSV bulk import"),
            ("projects/cmhp-pharma-erp/10-cmhp-orders.webp", "Operations Orders Flow", "Role-tailored order intake with automated product lookups and raw-material check"),
            ("projects/cmhp-pharma-erp/11-cmhp-production-bmr.webp", "Digital BMR Batch Records", "Print-ready Batch Manufacturing Records matching master PDFs for Drops, Syrup, Tablet, and Tincture"),
            ("projects/cmhp-pharma-erp/12-cmhp-invoicing.webp", "GST Tax Invoicing", "Compliant GST tax invoice generation strictly mirroring physical standard invoices"),
            ("projects/cmhp-pharma-erp/13-cmhp-mobile-dashboard.webp", "Mobile View", "Fully responsive layout optimized for operational tablets and mobile devices"),
        ],
    },
    {
        "slug": "hr-university",
        "title": "HR University",
        "one_liner": "A Gen-Z styled university portal with an animated intro, dynamic live counters, departments, placements, events, and an admission workflow; Django backend architecture.",
        "description": (
            "HR University is a modern campus web portal combining visual design with architectural backend rigor.\n\n"
            "Designed to captivate prospective students and streamline administrative workflows, the portal features a cinematic animated intro, dynamic achievement metrics, departmental showcases spanning AI to Sports Science, cultural and technical festival calendars, and step-by-step admissions application workflows.\n\n"
            "The backend architecture is built with Django 5 and Django REST Framework, comprising 11 modular applications, 32 relational models, and 38 REST endpoints with role-based access for admissions staff, content editors, and auditors."
        ),
        "role": "Frontend Developer; Django Backend Developer",
        "status": "In progress",
        "type": "Full Stack",
        "tier": "featured",
        "cover": "projects/hr-university/cover.webp",
        "cover_alt": "HR University Campus Platform Hero View",
        "order": 2,
        "is_featured": True,
        "is_published": True,
        "gallery": [
            ("projects/hr-university/01-hr-university-intro.webp", "Cinematic Intro Sequence", "Interactive Framer Motion preloader with animated counter and reveal wipe"),
            ("projects/hr-university/02-hr-university-home-hero.webp", "Campus Hero & Live Counters", "Dynamic live counters highlighting campus enrollment, patent filings, and placement rates"),
            ("projects/hr-university/03-hr-university-departments.webp", "Academic Departments", "Department portals covering AI, Pharmaceutical Sciences, Sports Science, and Design"),
            ("projects/hr-university/04-hr-university-placements.webp", "Placements & Recruiters", "Placement statistics, student package percentiles, and top recruiting partner directories"),
            ("projects/hr-university/05-hr-university-events.webp", "Campus Events Calendar", "Cultural, sports, and technical event showcase including HackHRU hackathons and conclaves"),
            ("projects/hr-university/06-hr-university-news.webp", "Student Updates Hub", "Campus announcements, academic schedules, and real-time press bulletins"),
            ("projects/hr-university/07-hr-university-admissions.webp", "Admissions Application", "Step-by-step admissions flow with validation, scholarship criteria, and document uploads"),
            ("projects/hr-university/08-hr-university-admin.webp", "Django Unfold Admin Portal", "Modern Django Unfold back-office managing departments, applications, events, and staff notes"),
            ("projects/hr-university/09-hr-university-mobile.webp", "Mobile Campus View", "Fluid, responsive mobile interface engineered for prospective students"),
        ],
    },
    {
        "slug": "interior-design-studio",
        "title": "Interior Design Studio",
        "one_liner": "A Django website with product and project showcases, login/signup, OTP password reset and an admin-managed gallery.",
        "description": (
            "Interior Design Studio is a responsive web application built during my internship as a learning replica of a design agency website.\n\n"
            "The system includes product and project showcases, user authentication with OTP-verified password recovery, dynamic catalog browsing, and an admin-managed showcase gallery for portfolio presentation."
        ),
        "role": "Developer",
        "status": "Learning project",
        "type": "Website",
        "tier": "compact",
        "cover": "projects/interior-design-studio/cover.webp",
        "cover_alt": "Interior Design Studio Homepage",
        "order": 3,
        "is_featured": False,
        "is_published": True,
        "gallery": [
            ("projects/interior-design-studio/01-interior-home.webp", "Homepage & Studio Showcase", "Modern architectural interior hero and portfolio preview"),
            ("projects/interior-design-studio/02-interior-projects.webp", "Projects Portfolio", "Completed residential and commercial interior showcases with category filters"),
            ("projects/interior-design-studio/03-interior-process.webp", "Design Process Workflow", "Consultation, 3D modeling, material sourcing, and handover phases"),
            ("projects/interior-design-studio/04-interior-about-best.webp", "About Studio & Philosophy", "Studio background, team expertise, craftsmanship, and client commitments"),
            ("projects/interior-design-studio/05-interior-products.webp", "Furniture & Decor Catalog", "Curated interior products catalog with specifications and finishes"),
            ("projects/interior-design-studio/06-interior-contact.webp", "Consultation & Contact", "Direct client inquiry and consultation appointment booking form"),
            ("projects/interior-design-studio/07-interior-whyus.webp", "Why Choose Us", "Key client differentiators, architectural awards, and satisfaction metrics"),
            ("projects/interior-design-studio/08-interior-mobile-home.webp", "Mobile Experience", "Mobile-optimized responsive browsing across all project portfolios"),
        ],
    },
]

for p_data in projects_config:
    proj = Project.objects.filter(slug=p_data["slug"]).first()
    if not proj:
        proj = Project.objects.create(slug=p_data["slug"], title=p_data["title"])
    
    proj.title = p_data["title"]
    proj.one_liner = p_data["one_liner"]
    proj.description = p_data["description"]
    proj.role = p_data["role"]
    proj.status = p_data["status"]
    proj.type = p_data["type"]
    proj.tier = p_data["tier"]
    proj.cover = p_data["cover"]
    proj.cover_alt = p_data["cover_alt"]
    proj.order = p_data["order"]
    proj.is_featured = p_data["is_featured"]
    proj.is_published = p_data["is_published"]
    proj.save()
    
    # Refresh gallery
    proj.images.all().delete()
    for idx, (img_path, alt, caption) in enumerate(p_data["gallery"]):
        ProjectImage.objects.create(
            project=proj,
            image=img_path,
            alt=alt,
            caption=caption,
            order=idx + 1,
        )
    print(f"Project '{proj.title}' updated with cover and {proj.images.count()} gallery images.")

clear_portfolio_cache()
print("All portfolio database entries synchronized and cache cleared successfully!")
