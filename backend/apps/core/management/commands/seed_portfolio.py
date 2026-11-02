"""
Management command to seed the portfolio database idempotently from frontend data assets.
"""

from datetime import date

from django.conf import settings
from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand
from django.utils.text import slugify

from apps.content.models import (
    Education,
    Experience,
    ExperienceBullet,
    FocusArea,
    JourneyItem,
    Leadership,
    SiteSettings,
    Skill,
    SkillGroup,
    Stat,
    Technology,
)
from apps.core.cache import invalidate_portfolio_cache
from apps.profiles.models import Profile, ResumeVersion, RoleSought, SocialLink
from apps.projects.models import (
    Project,
    ProjectFeature,
    ProjectFeatureGroup,
)


class Command(BaseCommand):
    help = "Idempotently seed the portfolio database with Fenil Rami's portfolio data."

    def add_arguments(self, parser):
        parser.add_argument(
            "--reset",
            action="store_true",
            help="Wipe existing portfolio data and re-seed from scratch.",
        )

    def handle(self, *args, **options):
        reset = options.get("reset", False)
        if reset:
            self.stdout.write(
                self.style.WARNING("Resetting existing portfolio records...")
            )
            Project.objects.all().delete()
            SkillGroup.objects.all().delete()
            Experience.objects.all().delete()
            Education.objects.all().delete()
            JourneyItem.objects.all().delete()
            Leadership.objects.all().delete()
            FocusArea.objects.all().delete()
            Stat.objects.all().delete()
            Technology.objects.all().delete()
            RoleSought.objects.all().delete()
            SocialLink.objects.all().delete()

        self.stdout.write("Seeding Site Settings...")
        settings_obj = SiteSettings.load()
        settings_obj.site_title = "Fenil Rami | Portfolio"
        settings_obj.seo_title = "Fenil Rami | Python Backend & Full Stack Developer"
        settings_obj.seo_description = (
            "Portfolio of Fenil Rami, Python Backend & Full Stack Developer building role-based "
            "business web apps with Django and React."
        )
        settings_obj.contact_heading = "Let's build something reliable."
        settings_obj.contact_text = "Open to Python Backend and Full Stack roles. The fastest way to reach me is email or LinkedIn."
        settings_obj.footer_text = (
            "Python Backend & Full Stack Developer specializing in role-based business web "
            "applications with Django and React. Focused on clean database models, robust REST APIs, "
            "and crisp user interfaces."
        )
        settings_obj.currently_building_title = "HR University Django Backend"
        settings_obj.currently_building_text = (
            "Building a robust backend with Django 5, Django REST Framework, and PostgreSQL. "
            "Spans 11 decoupled apps, 32 relational models, and 38 endpoints supporting dynamic campus "
            "admissions, event schedules, and placement statistics."
        )
        settings_obj.currently_building_status = "In progress"
        settings_obj.experience_start_date = date(2026, 6, 1)
        settings_obj.save()

        self.stdout.write("Seeding Profile & Socials...")
        profile = Profile.load()
        profile.full_name = "Fenil Rami"
        profile.headline = (
            "Python Backend & Full Stack Developer (React, Django, PostgreSQL)"
        )
        profile.statement = "I build role-based business web applications with Django and React, from the REST API to the interface."
        profile.supporting_line = (
            "Python Developer Intern at Vibe Tech Labs. I turn real business workflows "
            "(orders, approvals, production, invoicing) into clean, reliable software."
        )
        profile.about = (
            "I'm a final-year Information Technology student at Gandhinagar University and a Python Developer "
            "Intern at Vibe Tech Labs. I independently built the complete React frontend of a multi-company "
            "pharmaceutical ERP covering HRMS, orders, inventory, production, QC/QA and invoicing, and I'm "
            "working on the Django backend of a university website. Outside code, I've led university cultural "
            "events as Cultural Head and coordinated a tech fest arena."
        )
        profile.location = "Ahmedabad, Gujarat, India"
        profile.email = "fenilrami1266@gmail.com"
        profile.show_email = True
        profile.availability_status = Profile.Availability.OPEN_TO_WORK
        profile.availability_note = (
            "Available for full-time opportunities and internships."
        )
        profile.save()

        # Roles Sought
        roles = ["Python Backend Developer", "Django Developer", "Full Stack Developer"]
        for idx, role_name in enumerate(roles, 1):
            RoleSought.objects.update_or_create(
                profile=profile,
                name=role_name,
                defaults={"order": idx},
            )

        # Social Links
        socials = [
            {
                "platform": "LinkedIn",
                "label": "LinkedIn Profile",
                "url": "https://www.linkedin.com/in/fenil-rami-67303938a",
                "order": 1,
            },
            {
                "platform": "GitHub",
                "label": "GitHub Profile",
                "url": "https://github.com/fenilrami27",
                "order": 2,
            },
            {
                "platform": "Email",
                "label": "Email Fenil Rami",
                "url": "mailto:fenilrami1266@gmail.com",
                "order": 3,
            },
        ]
        for s in socials:
            SocialLink.objects.update_or_create(
                profile=profile,
                platform=s["platform"],
                defaults={
                    "label": s["label"],
                    "url": s["url"],
                    "order": s["order"],
                    "is_visible": True,
                },
            )

        # Resume Version
        if not ResumeVersion.objects.exists():
            pdf_path = (
                settings.BASE_DIR.parent
                / "frontend"
                / "public"
                / "Fenil_Rami_Resume.pdf"
            )
            if pdf_path.exists():
                with open(pdf_path, "rb") as f:
                    content = f.read()
                resume = ResumeVersion(
                    note="Initial active resume from frontend public directory"
                )
                resume.file.save(
                    "Fenil_Rami_Resume.pdf", ContentFile(content), save=True
                )
                self.stdout.write(
                    self.style.SUCCESS(f"Seeded active resume from {pdf_path.name}")
                )

        self.stdout.write("Seeding Focus Areas (What I do)...")
        focus_areas = [
            {
                "title": "Role-based apps",
                "description": (
                    "Admin, Manager, Store Manager, and employee workspaces with strict data "
                    "isolation and permission controls built right into the schema and UI."
                ),
                "icon_key": "LuShieldCheck",
                "order": 1,
            },
            {
                "title": "Workflow systems",
                "description": (
                    "End-to-end operational pipelines: order intake, raw material checks, QC/QA "
                    "verifications, multi-stage production, packaging, dispatch, and billing."
                ),
                "icon_key": "LuGitFork",
                "order": 2,
            },
            {
                "title": "Print-ready documents",
                "description": (
                    "Digital batch manufacturing records (BMR) and GST tax invoices that mirror "
                    "physical master templates pixel-for-pixel and print cleanly to paper or PDF."
                ),
                "icon_key": "LuPrinter",
                "order": 3,
            },
        ]
        for fa in focus_areas:
            FocusArea.objects.update_or_create(
                title=fa["title"],
                defaults={
                    "description": fa["description"],
                    "icon_key": fa["icon_key"],
                    "order": fa["order"],
                    "is_visible": True,
                },
            )

        self.stdout.write("Seeding Stats & Counters...")
        stats_data = [
            {
                "label": "Projects showcased",
                "kind": Stat.StatKind.PROJECTS_COUNT,
                "suffix": "",
                "value": None,
                "order": 1,
            },
            {
                "label": "Months experience",
                "kind": Stat.StatKind.EXPERIENCE_MONTHS,
                "suffix": "+",
                "value": None,
                "order": 2,
            },
            {
                "label": "Print production forms (BMR)",
                "kind": Stat.StatKind.MANUAL,
                "suffix": "",
                "value": 4,
                "order": 3,
            },
            {
                "label": "REST endpoints designed",
                "kind": Stat.StatKind.MANUAL,
                "suffix": "",
                "value": 38,
                "order": 4,
            },
        ]
        for s in stats_data:
            Stat.objects.update_or_create(
                label=s["label"],
                defaults={
                    "kind": s["kind"],
                    "suffix": s["suffix"],
                    "value": s["value"],
                    "order": s["order"],
                    "is_visible": True,
                },
            )

        self.stdout.write("Seeding Skill Groups and Skills...")
        skills_structure = [
            {
                "group": "Programming",
                "order": 1,
                "items": [
                    {"name": "Python", "icon": "SiPython"},
                    {"name": "JavaScript", "icon": "SiJavascript"},
                ],
            },
            {
                "group": "Backend",
                "order": 2,
                "items": [
                    {"name": "Django", "icon": "SiDjango"},
                    {"name": "Django REST Framework", "icon": "SiDjango"},
                    {"name": "REST API development", "icon": "TbApi"},
                    {"name": "Authentication", "icon": "LuKeyRound"},
                    {"name": "CRUD", "icon": "LuDatabase"},
                ],
            },
            {
                "group": "Frontend",
                "order": 3,
                "items": [
                    {"name": "React.js", "icon": "SiReact"},
                    {"name": "Redux", "icon": "SiRedux"},
                    {"name": "HTML5", "icon": "SiHtml5"},
                    {"name": "CSS3", "icon": "SiCss"},
                ],
            },
            {
                "group": "Databases",
                "order": 4,
                "items": [
                    {"name": "PostgreSQL", "icon": "SiPostgresql"},
                    {"name": "SQLite", "icon": "SiSqlite"},
                ],
            },
            {
                "group": "Development",
                "order": 5,
                "items": [
                    {
                        "name": "Role-Based Access Control (RBAC)",
                        "icon": "LuShieldCheck",
                    },
                    {"name": "API Integration", "icon": "LuWorkflow"},
                    {"name": "Database Management", "icon": "LuServer"},
                ],
            },
        ]
        for g_data in skills_structure:
            group_obj, _ = SkillGroup.objects.update_or_create(
                name=g_data["group"],
                defaults={"order": g_data["order"]},
            )
            for idx, item in enumerate(g_data["items"], 1):
                Skill.objects.update_or_create(
                    group=group_obj,
                    name=item["name"],
                    defaults={
                        "icon_key": item["icon"],
                        "order": idx,
                        "is_visible": True,
                    },
                )

        self.stdout.write("Seeding Experience...")
        exp_obj, _ = Experience.objects.update_or_create(
            company="Vibe Tech Labs",
            defaults={
                "role": "Python Developer Intern",
                "location": "Ahmedabad",
                "start_date": "Jun 2026",
                "end_date": "Present",
                "is_current": True,
                "order": 1,
            },
        )
        bullets = [
            "Developing business web applications using Python and Django, with hands-on work across backend functionality and frontend integration.",
            "Independently built the complete React frontend for CMHP, a pharmaceutical ERP project; the project is currently in development and has not yet been handed over.",
            "Working on the Django backend for an ongoing university website project, contributing to full-stack application development.",
            "Worked with authentication, role-based access control, CRUD workflows, database models and REST API integration.",
        ]
        for idx, text in enumerate(bullets, 1):
            ExperienceBullet.objects.update_or_create(
                experience=exp_obj,
                order=idx,
                defaults={"text": text},
            )

        self.stdout.write("Seeding Education...")
        Education.objects.update_or_create(
            institution="Gandhinagar University",
            defaults={
                "degree": "Bachelor of Information Technology",
                "start_year": "2023",
                "end_year": "2027",
                "grade_label": "Latest SGPA: 8.77 / 10 (Semester 6)",
                "order": 1,
            },
        )

        self.stdout.write("Seeding Journey Items...")
        journey_data = [
            {
                "title": "Bachelor of Information Technology",
                "date_label": "2023 - 2027",
                "kind": JourneyItem.JourneyKind.EDUCATION,
                "description": (
                    "Enrolled in Bachelor of Information Technology, establishing fundamental knowledge in "
                    "software engineering, data structures, algorithms, and database management. Latest SGPA: 8.77 / 10 (Semester 6)."
                ),
                "order": 1,
            },
            {
                "title": "Interior Design Studio",
                "date_label": "Project Milestone",
                "kind": JourneyItem.JourneyKind.PROJECT,
                "description": (
                    "Developed a Django website with product and project showcase pages, user authentication, "
                    "session handling, OTP-verified password recovery, and an admin-managed dynamic gallery."
                ),
                "order": 2,
            },
            {
                "title": "Python Developer Intern",
                "date_label": "Jun 2026 - Present",
                "kind": JourneyItem.JourneyKind.EXPERIENCE,
                "description": (
                    "Developing business web applications using Python and Django at Vibe Tech Labs, "
                    "with hands-on work across backend functionality and frontend integration."
                ),
                "order": 3,
            },
            {
                "title": "CMHP Pharma ERP Frontend",
                "date_label": "Project Milestone",
                "kind": JourneyItem.JourneyKind.PROJECT,
                "description": (
                    "Independently built the entire React frontend for a two-company pharmaceutical ERP "
                    "(CMHP Pharma & Tej Biocare), spanning workspaces, HRMS, multi-role orders, stock ledgers, "
                    "BMR digital batch manufacturing records, QC/QA, and GST invoicing."
                ),
                "order": 4,
            },
            {
                "title": "HR University Portal",
                "date_label": "Project Milestone",
                "kind": JourneyItem.JourneyKind.PROJECT,
                "description": (
                    "Constructed the interactive frontend with an animated intro, live counters, "
                    "event directories, placement metrics, and admission workflows."
                ),
                "order": 5,
            },
            {
                "title": "HR University Django Backend",
                "date_label": "Now",
                "kind": JourneyItem.JourneyKind.MILESTONE,
                "description": (
                    "Architecting and implementing the Django 5 backend with Django REST Framework and PostgreSQL: "
                    "11 decoupled apps, 32 models, and 38 REST API endpoints for complete university data management."
                ),
                "order": 6,
            },
        ]
        for j in journey_data:
            JourneyItem.objects.update_or_create(
                title=j["title"],
                date_label=j["date_label"],
                defaults={
                    "kind": j["kind"],
                    "description": j["description"],
                    "order": j["order"],
                    "is_visible": True,
                },
            )

        self.stdout.write("Seeding Leadership...")
        leadership_data = [
            {
                "title": "Cultural Head",
                "organization": "Gandhinagar University",
                "description": (
                    "Led university cultural events, coordinated student teams, delegated responsibilities, "
                    "and worked with faculty and external vendors on budgets and schedules."
                ),
                "order": 1,
            },
            {
                "title": "Arena Coordinator",
                "organization": "University Tech Fest",
                "description": (
                    "Coordinated arena activities, participant scheduling and on-ground operations with the organizing team."
                ),
                "order": 2,
            },
        ]
        for lead_item in leadership_data:
            Leadership.objects.update_or_create(
                title=lead_item["title"],
                organization=lead_item["organization"],
                defaults={
                    "description": lead_item["description"],
                    "order": lead_item["order"],
                    "is_visible": True,
                },
            )

        self.stdout.write("Seeding Technologies...")
        tech_list = [
            ("Python", "backend", "SiPython"),
            ("Django", "backend", "SiDjango"),
            ("Django REST Framework", "backend", "SiDjango"),
            ("React", "frontend", "SiReact"),
            ("Redux", "frontend", "SiRedux"),
            ("JavaScript", "frontend", "SiJavascript"),
            ("HTML5", "frontend", "SiHtml5"),
            ("CSS3", "frontend", "SiCss"),
            ("PostgreSQL", "database", "SiPostgresql"),
            ("SQLite", "database", "SiSqlite"),
            ("RBAC", "concepts", "LuShieldCheck"),
        ]
        tech_map = {}
        for name, category, icon in tech_list:
            slug = slugify(name) or name.lower().replace(".", "")
            t, _ = Technology.objects.update_or_create(
                name=name,
                defaults={"slug": slug, "category": category, "icon_key": icon},
            )
            tech_map[name] = t

        self.stdout.write("Seeding Projects & Feature Groups...")
        projects_seed = [
            {
                "slug": "cmhp-pharma-erp",
                "title": "CMHP Pharma ERP",
                "one_liner": "A two-company pharmaceutical ERP: orders, inventory, production (BMR), QC/QA and GST invoicing in one role-based system.",
                "description": "Supports two companies (CMHP Pharma and Tej Biocare) and a shared Common Inventory. Only customers are shared between the companies; products, orders, invoices, employees and all other data stay separate per company.",
                "role": "Frontend developer (independent)",
                "status": "In development (not yet handed over)",
                "type": Project.ProjectType.FRONTEND,
                "tier": Project.ProjectTier.FEATURED,
                "stack": ["React", "Redux", "JavaScript", "HTML5", "CSS3"],
                "is_featured": True,
                "is_published": True,
                "is_employer_project": False,
                "order": 1,
                "feature_groups": [
                    {
                        "group": "Workspaces",
                        "items": [
                            "Company and Common Inventory workspace selection after login.",
                            "Strict data isolation ensuring each workspace renders only its own records.",
                        ],
                    },
                    {
                        "group": "HRMS",
                        "items": [
                            "HR dashboard, employee records, and daily attendance with check in/out.",
                            "Leave tracking, holiday schedules, shifts, and designation hierarchies.",
                            "Payroll with monthly filters and printable salary slips.",
                            "Audit logs, comprehensive HR reports, and role-restricted views.",
                            "Adding a user synchronizes automatically into employees, payroll, and shifts.",
                        ],
                    },
                    {
                        "group": "Orders",
                        "items": [
                            "Role-specific order forms tailored for Admin, Manager, and Store Manager.",
                            "Product selection from the existing catalog with automated detail auto-fetching.",
                            "Live raw-material availability check for Store Managers before dispatching orders.",
                        ],
                    },
                    {
                        "group": "Inventory",
                        "items": [
                            "Product catalog and raw materials repository.",
                            "Dual-entry stock ledger for inward and outward item tracking.",
                            "Real-time stock lots, batch tracking, and sample management.",
                            "Inward receipt generation and CSV bulk import.",
                        ],
                    },
                    {
                        "group": "Production",
                        "items": [
                            "Digital batch manufacturing records (BMR) matching master production PDFs.",
                            "Dedicated multi-page records for Drops (19 pages), Syrup (19 pages), Tablet (19 pages), and Mother Tincture (6 pages).",
                            "Print-ready output with live tracking of production, packaging, and dispatch stages.",
                        ],
                    },
                    {
                        "group": "QC / QA",
                        "items": [
                            "Formula approval workflows prior to manufacturing runs.",
                            "Dedicated QA inspector view displaying Approved / Issue status per production order.",
                        ],
                    },
                    {
                        "group": "Invoicing",
                        "items": [
                            "GST tax invoice layout strictly mirroring the original PDF standard.",
                            "Editable item rows, real-time total calculations, and automated amount in words.",
                            "Print functionality, payment status flow, and monthly billing filters.",
                        ],
                    },
                    {
                        "group": "System Extras",
                        "items": [
                            "Role-wise notification bell for order and approval alerts.",
                            "Comprehensive audit logging across critical workflows.",
                            "Fully mobile-responsive layout for operational tablets and mobile devices.",
                        ],
                    },
                ],
            },
            {
                "slug": "hr-university",
                "title": "HR University",
                "one_liner": "A Gen-Z university website with an animated intro, live counters, events, placements and an admission flow; Django backend in progress.",
                "description": (
                    "A Gen-Z university website with an animated intro, live counters, events, placements and an admission flow; Django backend in progress.\n\n"
                    "Designed to deliver high visual engagement for prospective students while maintaining structural rigor on the backend for administrative workflows."
                ),
                "role": "Frontend developer; Django backend in progress",
                "status": "In progress",
                "type": Project.ProjectType.FULL_STACK,
                "tier": Project.ProjectTier.FEATURED,
                "stack": ["React", "JavaScript", "Django", "HTML5", "CSS3"],
                "is_featured": True,
                "is_published": True,
                "is_employer_project": False,
                "order": 2,
                "feature_groups": [
                    {
                        "group": "Interactive Experience",
                        "items": [
                            "Animated intro sequence with dynamic live counters.",
                            "Hero video background with refined typography.",
                            "High-polish hover interactions across campus exploration cards.",
                            "Automated enquiry/admission modal prompt after 60 seconds.",
                        ],
                    },
                    {
                        "group": "Campus & Academic Hub",
                        "items": [
                            "Festival, cultural, and technical competition event showcase.",
                            "Placement records with animated achievement metrics.",
                            "Campus news updates and press releases.",
                            "Academic department portals (AI, Sports, Pharmacy, Design).",
                            "Campus life and student activities gallery.",
                        ],
                    },
                    {
                        "group": "Backend Architecture (In Progress)",
                        "items": [
                            "Built with Django 5 and Django REST Framework.",
                            "PostgreSQL relational schema designed for scale.",
                            "11 modular applications handling admissions, faculties, placements, events, and media.",
                            "32 relational database models with 38 REST endpoints designed and currently in build.",
                        ],
                    },
                ],
            },
            {
                "slug": "interior-design-studio",
                "title": "Interior Design Studio",
                "one_liner": "A Django website with product and project pages, login/signup, OTP password reset and an admin-managed gallery.",
                "description": (
                    "A Django website with product and project pages, login/signup, OTP password reset and an admin-managed gallery.\n\n"
                    "Built during my internship as a learning replica of a company website; all images and logos are sample data."
                ),
                "role": "Developer",
                "status": "Learning project",
                "type": Project.ProjectType.WEBSITE,
                "tier": Project.ProjectTier.COMPACT,
                "stack": ["Python", "Django", "HTML5", "CSS3"],
                "is_featured": False,
                "is_published": True,
                "is_employer_project": False,
                "order": 3,
                "feature_groups": [
                    {
                        "group": "Key Features",
                        "items": [
                            "Product catalogs and interior design project showcases.",
                            "Full authentication system: secure login, registration, and session management.",
                            "OTP-verified password recovery workflow.",
                            "Django Admin-managed dynamic gallery for client project portfolios.",
                        ],
                    },
                ],
            },
            {
                "slug": "vtl",
                "title": "VTL",
                "one_liner": "Attendance and hiring app: candidate pipeline, hire flow, month-wise attendance and past-employee records.",
                "description": (
                    "Internal attendance and recruitment management platform streamlining candidate hiring workflows, "
                    "monthly attendance reporting, and alumni records."
                ),
                "role": "Full Stack Developer",
                "status": "In development",
                "type": Project.ProjectType.FULL_STACK,
                "tier": Project.ProjectTier.COMPACT,
                "stack": ["Python", "Django", "React"],
                "is_featured": False,
                # Explicit requirement: The VTL project stays unpublished with the employer-project flag on
                "is_published": False,
                "is_employer_project": True,
                "order": 4,
                "feature_groups": [
                    {
                        "group": "Core Workflows",
                        "items": [
                            "Candidate evaluation and recruitment pipeline.",
                            "Onboarding and hire conversion flows.",
                            "Month-wise employee attendance and shift logs.",
                            "Archive of past-employee historical records.",
                        ],
                    },
                ],
            },
        ]

        for p_data in projects_seed:
            project_obj, _ = Project.objects.update_or_create(
                slug=p_data["slug"],
                defaults={
                    "title": p_data["title"],
                    "one_liner": p_data["one_liner"],
                    "description": p_data["description"],
                    "role": p_data["role"],
                    "status": p_data["status"],
                    "type": p_data["type"],
                    "tier": p_data["tier"],
                    "is_featured": p_data["is_featured"],
                    "is_published": p_data["is_published"],
                    "is_employer_project": p_data["is_employer_project"],
                    "order": p_data["order"],
                },
            )

            # Associate stack technologies
            project_techs = [tech_map[t] for t in p_data["stack"] if t in tech_map]
            project_obj.stack.set(project_techs)

            # Feature groups
            for fg_idx, fg_data in enumerate(p_data.get("feature_groups", []), 1):
                group_obj, _ = ProjectFeatureGroup.objects.update_or_create(
                    project=project_obj,
                    group=fg_data["group"],
                    defaults={"order": fg_idx},
                )
                for item_idx, text in enumerate(fg_data.get("items", []), 1):
                    ProjectFeature.objects.update_or_create(
                        group=group_obj,
                        order=item_idx,
                        defaults={"text": text},
                    )

        invalidate_portfolio_cache()
        self.stdout.write(
            self.style.SUCCESS(
                "Portfolio successfully seeded! All models and relations are up to date."
            )
        )
