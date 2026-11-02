export const projectsData = [
  {
    slug: 'cmhp-pharma-erp',
    title: 'CMHP Pharma ERP',
    oneLiner:
      'A two-company pharmaceutical ERP: orders, inventory, production (BMR), QC/QA and GST invoicing in one role-based system.',
    description: [
      'Supports two companies (CMHP Pharma and Tej Biocare) and a shared Common Inventory. Only customers are shared between the companies; products, orders, invoices, employees and all other data stay separate per company.',
    ],
    role: 'Frontend developer (independent)',
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
    // TODO(Fenil): add screenshots to public/assets/projects/cmhp-pharma-erp/
    gallery: [],
    // Empty challenges array will gracefully hide challenges section
    challenges: [],
    liveUrl: null,
    githubUrl: null,
    videoUrl: null,
    cover: null, // Generated cover will be displayed
    isFeatured: true,
    isPublished: true,
    order: 1,
  },
  {
    slug: 'hr-university',
    title: 'HR University',
    oneLiner:
      'A Gen-Z university website with an animated intro, live counters, events, placements and an admission flow; Django backend in progress.',
    description: [
      'A Gen-Z university website with an animated intro, live counters, events, placements and an admission flow; Django backend in progress.',
      'Designed to deliver high visual engagement for prospective students while maintaining structural rigor on the backend for administrative workflows.',
    ],
    role: 'Frontend developer; Django backend in progress',
    status: 'In progress',
    type: 'Full Stack',
    tier: 'featured',
    stack: ['React', 'JavaScript', 'Django', 'HTML5', 'CSS3'],
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
        group: 'Backend Architecture (In Progress)',
        items: [
          'Built with Django 5 and Django REST Framework.',
          'PostgreSQL relational schema designed for scale.',
          '11 modular applications handling admissions, faculties, placements, events, and media.',
          '32 relational database models with 38 REST endpoints designed and currently in build.',
        ],
      },
    ],
    // TODO(Fenil): add screenshots to public/assets/projects/hr-university/
    gallery: [],
    challenges: [],
    liveUrl: null,
    githubUrl: null,
    videoUrl: null,
    cover: null,
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
    // TODO(Fenil): add screenshots to public/assets/projects/interior-design-studio/
    gallery: [],
    challenges: [],
    liveUrl: null,
    githubUrl: null,
    videoUrl: null,
    cover: null,
    isFeatured: false,
    isPublished: true,
    order: 3,
  },
  {
    slug: 'vtl',
    title: 'VTL',
    oneLiner:
      'Attendance and hiring app: candidate pipeline, hire flow, month-wise attendance and past-employee records.',
    description: [
      'Internal attendance and recruitment management platform streamlining candidate hiring workflows, monthly attendance reporting, and alumni records.',
    ],
    role: 'Full Stack Developer',
    status: 'In development',
    type: 'Full Stack',
    tier: 'compact',
    stack: ['Python', 'Django', 'React'],
    featureGroups: [
      {
        group: 'Core Workflows',
        items: [
          'Candidate evaluation and recruitment pipeline.',
          'Onboarding and hire conversion flows.',
          'Month-wise employee attendance and shift logs.',
          'Archive of past-employee historical records.',
        ],
      },
    ],
    gallery: [],
    challenges: [],
    liveUrl: null,
    githubUrl: null,
    videoUrl: null,
    cover: null,
    isFeatured: false,
    // TODO(Fenil): confirm permission from the employer before publishing.
    isPublished: false,
    order: 4,
  },
]
