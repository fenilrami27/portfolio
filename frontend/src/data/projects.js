export const projectsData = [
  {
    slug: 'cmhp-pharma-erp',
    title: 'CMHP Pharma ERP',
    oneLiner:
      'A two-company pharmaceutical ERP: orders, inventory, production (BMR), QC/QA and GST invoicing in one role-based system.',
    description: [
      'CMHP Pharma ERP is a multi-company enterprise platform engineered to streamline pharmaceutical operations across CMHP Pharma and Tej Biocare, with a shared Common Inventory environment.',
      'The system delivers strict workspace data isolation, ensuring customer databases are unified while inventory lots, manufacturing orders, invoices, and employee records remain segregated per company.',
      'Key operational workflows include multi-role order pipelines with live raw-material checks, digital batch manufacturing records (BMR) matching official standard templates pixel-for-pixel, dual-ledger inventory with CSV imports, and a full-featured HRMS suite covering attendance, shifts, leave tracking, and payroll.',
    ],
    role: 'Frontend Developer (Independent)',
    status: 'In development (not yet handed over)',
    type: 'Frontend',
    tier: 'featured',
    stack: ['React', 'Redux', 'JavaScript', 'HTML5', 'CSS3'],
    featureGroups: [
      {
        group: 'Workspaces',
        items: [
          'Company and Common Inventory workspace selection after login.',
          'Strict data isolation ensuring each workspace renders only its own records.',
        ],
      },
      {
        group: 'HRMS',
        items: [
          'HR dashboard, employee records, and daily attendance with check in/out.',
          'Leave tracking, holiday schedules, shifts, and designation hierarchies.',
          'Payroll with monthly filters and printable salary slips.',
          'Audit logs, comprehensive HR reports, and role-restricted views.',
          'Adding a user synchronizes automatically into employees, payroll, and shifts.',
        ],
      },
      {
        group: 'Orders',
        items: [
          'Role-specific order forms tailored for Admin, Manager, and Store Manager.',
          'Product selection from the existing catalog with automated detail auto-fetching.',
          'Live raw-material availability check for Store Managers before dispatching orders.',
        ],
      },
      {
        group: 'Inventory',
        items: [
          'Product catalog and raw materials repository.',
          'Dual-entry stock ledger for inward and outward item tracking.',
          'Real-time stock lots, batch tracking, and sample management.',
          'Inward receipt generation and CSV bulk import.',
        ],
      },
      {
        group: 'Production',
        items: [
          'Digital batch manufacturing records (BMR) matching master production PDFs.',
          'Dedicated multi-page records for Drops (19 pages), Syrup (19 pages), Tablet (19 pages), and Mother Tincture (6 pages).',
          'Print-ready output with live tracking of production, packaging, and dispatch stages.',
        ],
      },
      {
        group: 'QC / QA',
        items: [
          'Formula approval workflows prior to manufacturing runs.',
          'Dedicated QA inspector view displaying Approved / Issue status per production order.',
        ],
      },
      {
        group: 'Invoicing',
        items: [
          'GST tax invoice layout strictly mirroring the original PDF standard.',
          'Editable item rows, real-time total calculations, and automated amount in words.',
          'Print functionality, payment status flow, and monthly billing filters.',
        ],
      },
      {
        group: 'System Extras',
        items: [
          'Role-wise notification bell for order and approval alerts.',
          'Comprehensive audit logging across critical workflows.',
          'Fully mobile-responsive layout for operational tablets and mobile devices.',
        ],
      },
    ],
    cover: '/assets/projects/cmhp-pharma-erp/cover.webp',
    gallery: [
      {
        src: '/assets/projects/cmhp-pharma-erp/01-cmhp-login.webp',
        alt: 'Secure Login Portal',
        caption: 'Role-based authentication portal with pharmaceutical branding and validation',
      },
      {
        src: '/assets/projects/cmhp-pharma-erp/02-cmhp-workspace.webp',
        alt: 'Workspace Selection',
        caption: 'Multi-company workspace switcher isolating CMHP Pharma, Tej Biocare, and Common Inventory',
      },
      {
        src: '/assets/projects/cmhp-pharma-erp/03-cmhp-dashboard-company.webp',
        alt: 'Company Dashboard',
        caption: 'Real-time KPI metrics, dispatch status, orders summary, and inventory counters',
      },
      {
        src: '/assets/projects/cmhp-pharma-erp/04-cmhp-dashboard-common-inventory.webp',
        alt: 'Common Inventory Dashboard',
        caption: 'Shared inventory workspace tracking cross-company raw materials and lot availability',
      },
      {
        src: '/assets/projects/cmhp-pharma-erp/05-cmhp-hrms-dashboard.webp',
        alt: 'HRMS Dashboard',
        caption: 'Human resource overview monitoring staff attendance, leave balances, and departmental shifts',
      },
      {
        src: '/assets/projects/cmhp-pharma-erp/06-cmhp-hrms-attendance.webp',
        alt: 'Daily Attendance Logs',
        caption: 'Employee attendance tracking with daily punch logs, in/out timestamps, and status filters',
      },
      {
        src: '/assets/projects/cmhp-pharma-erp/07-cmhp-hrms-payroll.webp',
        alt: 'Payroll & Salary Slips',
        caption: 'Monthly payroll calculation engine with tax breakdown and print-ready salary slips',
      },
      {
        src: '/assets/projects/cmhp-pharma-erp/08-cmhp-hrms-employees.webp',
        alt: 'Employee Directory',
        caption: 'Central employee directory synchronized with designation hierarchies and shift allocations',
      },
      {
        src: '/assets/projects/cmhp-pharma-erp/09-cmhp-inventory-products.webp',
        alt: 'Products & Stock Lots',
        caption: 'Finished products repository with dual-entry stock ledger, batch tracking, and CSV bulk import',
      },
      {
        src: '/assets/projects/cmhp-pharma-erp/10-cmhp-orders.webp',
        alt: 'Operations Orders Flow',
        caption: 'Role-tailored order intake with automated product lookups and raw-material check',
      },
      {
        src: '/assets/projects/cmhp-pharma-erp/11-cmhp-production-bmr.webp',
        alt: 'Digital BMR Batch Records',
        caption: 'Print-ready Batch Manufacturing Records matching master PDFs for Drops, Syrup, Tablet, and Tincture',
      },
      {
        src: '/assets/projects/cmhp-pharma-erp/12-cmhp-invoicing.webp',
        alt: 'GST Tax Invoicing',
        caption: 'Compliant GST tax invoice generation strictly mirroring physical standard invoices',
      },
      {
        src: '/assets/projects/cmhp-pharma-erp/13-cmhp-mobile-dashboard.webp',
        alt: 'Mobile View',
        caption: 'Fully responsive layout optimized for operational tablets and mobile devices',
      },
    ],
    challenges: [],
    liveUrl: null,
    githubUrl: null,
    videoUrl: null,
    isFeatured: true,
    isPublished: true,
    order: 1,
  },
  {
    slug: 'hr-university',
    title: 'HR University',
    oneLiner:
      'A Gen-Z styled university portal with an animated intro, dynamic live counters, departments, placements, events, and an admission workflow; Django backend architecture.',
    description: [
      'HR University is a modern campus web portal combining visual design with architectural backend rigor.',
      'Designed to captivate prospective students and streamline administrative workflows, the portal features a cinematic animated intro, dynamic achievement metrics, departmental showcases spanning AI to Sports Science, cultural and technical festival calendars, and step-by-step admissions application workflows.',
      'The backend architecture is built with Django 5 and Django REST Framework, comprising 11 modular applications, 32 relational models, and 38 REST endpoints with role-based access for admissions staff, content editors, and auditors.',
    ],
    role: 'Frontend Developer; Django Backend Developer',
    status: 'In progress',
    type: 'Full Stack',
    tier: 'featured',
    stack: ['React', 'JavaScript', 'Django', 'PostgreSQL', 'HTML5', 'CSS3'],
    featureGroups: [
      {
        group: 'Interactive Experience',
        items: [
          'Animated intro sequence with dynamic live counters.',
          'Hero video background with refined typography.',
          'High-polish hover interactions across campus exploration cards.',
          'Automated enquiry/admission modal prompt after 60 seconds.',
        ],
      },
      {
        group: 'Campus & Academic Hub',
        items: [
          'Festival, cultural, and technical competition event showcase.',
          'Placement records with animated achievement metrics.',
          'Campus news updates and press releases.',
          'Academic department portals (AI, Sports, Pharmacy, Design).',
          'Campus life and student activities gallery.',
        ],
      },
      {
        group: 'Backend Architecture',
        items: [
          'Built with Django 5 and Django REST Framework.',
          'PostgreSQL relational schema with private media document vault.',
          '11 modular applications handling admissions, faculties, placements, events, and media.',
          '32 relational database models with 38 REST endpoints designed and verified.',
        ],
      },
    ],
    cover: '/assets/projects/hr-university/cover.webp',
    gallery: [
      {
        src: '/assets/projects/hr-university/01-hr-university-intro.webp',
        alt: 'Cinematic Intro Sequence',
        caption: 'Interactive Framer Motion preloader with animated counter and reveal wipe',
      },
      {
        src: '/assets/projects/hr-university/02-hr-university-home-hero.webp',
        alt: 'Campus Hero & Live Counters',
        caption: 'Dynamic live counters highlighting campus enrollment, patent filings, and placement rates',
      },
      {
        src: '/assets/projects/hr-university/03-hr-university-departments.webp',
        alt: 'Academic Departments',
        caption: 'Department portals covering AI, Pharmaceutical Sciences, Sports Science, and Design',
      },
      {
        src: '/assets/projects/hr-university/04-hr-university-placements.webp',
        alt: 'Placements & Recruiters',
        caption: 'Placement statistics, student package percentiles, and top recruiting partner directories',
      },
      {
        src: '/assets/projects/hr-university/05-hr-university-events.webp',
        alt: 'Campus Events Calendar',
        caption: 'Cultural, sports, and technical event showcase including HackHRU hackathons and conclaves',
      },
      {
        src: '/assets/projects/hr-university/06-hr-university-news.webp',
        alt: 'Student Updates Hub',
        caption: 'Campus announcements, academic schedules, and real-time press bulletins',
      },
      {
        src: '/assets/projects/hr-university/07-hr-university-admissions.webp',
        alt: 'Admissions Application',
        caption: 'Step-by-step admissions flow with validation, scholarship criteria, and document uploads',
      },
      {
        src: '/assets/projects/hr-university/08-hr-university-admin.webp',
        alt: 'Django Unfold Admin Portal',
        caption: 'Modern Django Unfold back-office managing departments, applications, events, and staff notes',
      },
      {
        src: '/assets/projects/hr-university/09-hr-university-mobile.webp',
        alt: 'Mobile Campus View',
        caption: 'Fluid, responsive mobile interface engineered for prospective students',
      },
    ],
    challenges: [],
    liveUrl: 'https://university-ten-drab.vercel.app',
    githubUrl: 'https://github.com/fenilrami27/hr-university',
    videoUrl: null,
    isFeatured: true,
    isPublished: true,
    order: 2,
  },
  {
    slug: 'interior-design-studio',
    title: 'Interior Design Studio',
    oneLiner:
      'A Django website with product and project pages, login/signup, OTP password reset and an admin-managed gallery.',
    note: 'Built during my internship as a learning replica of a company website; all images and logos are sample data.',
    description: [
      'A Django website with product and project pages, login/signup, OTP password reset and an admin-managed gallery.',
      'Built during my internship as a learning replica of a company website; all images and logos are sample data.',
    ],
    role: 'Developer',
    status: 'Learning project',
    type: 'Website',
    tier: 'compact',
    stack: ['Python', 'Django', 'HTML5', 'CSS3'],
    featureGroups: [
      {
        group: 'Key Features',
        items: [
          'Product catalogs and interior design project showcases.',
          'Full authentication system: secure login, registration, and session management.',
          'OTP-verified password recovery workflow.',
          'Django Admin-managed dynamic gallery for client project portfolios.',
        ],
      },
    ],
    cover: '/assets/projects/interior-design-studio/cover.webp',
    gallery: [
      {
        src: '/assets/projects/interior-design-studio/01-interior-home.webp',
        alt: 'Homepage & Studio Showcase',
        caption: 'Modern architectural interior hero and portfolio preview',
      },
      {
        src: '/assets/projects/interior-design-studio/02-interior-projects.webp',
        alt: 'Projects Portfolio',
        caption: 'Completed residential and commercial interior showcases with category filters',
      },
      {
        src: '/assets/projects/interior-design-studio/03-interior-process.webp',
        alt: 'Design Process Workflow',
        caption: 'Consultation, 3D modeling, material sourcing, and handover phases',
      },
      {
        src: '/assets/projects/interior-design-studio/04-interior-about-best.webp',
        alt: 'About Studio & Philosophy',
        caption: 'Studio background, team expertise, craftsmanship, and client commitments',
      },
      {
        src: '/assets/projects/interior-design-studio/05-interior-products.webp',
        alt: 'Furniture & Decor Catalog',
        caption: 'Curated interior products catalog with specifications and finishes',
      },
      {
        src: '/assets/projects/interior-design-studio/06-interior-contact.webp',
        alt: 'Consultation & Contact',
        caption: 'Direct client inquiry and consultation appointment booking form',
      },
      {
        src: '/assets/projects/interior-design-studio/07-interior-whyus.webp',
        alt: 'Why Choose Us',
        caption: 'Key client differentiators, architectural awards, and satisfaction metrics',
      },
      {
        src: '/assets/projects/interior-design-studio/08-interior-mobile-home.webp',
        alt: 'Mobile Experience',
        caption: 'Mobile-optimized responsive browsing across all project portfolios',
      },
    ],
    challenges: [],
    liveUrl: null,
    githubUrl: null,
    videoUrl: null,
    isFeatured: false,
    isPublished: true,
    order: 3,
  },
]
