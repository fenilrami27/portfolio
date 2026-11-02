# Project Notes: CMHP - Pharmaceutical ERP System

<!--
Fenil: You can fill out or adjust these guided questions in Gujarati or English.
This information directly powers your portfolio case study.
-->

### 1. What the project is for (Core Purpose)
- **Problem:** Pharmaceutical manufacturing requires stringent regulatory compliance, dual-entity production tracking (CMHP Pharma & Tej Biocare), and complex batch manufacturing records (BMR) that were previously trapped in paper logs or rigid legacy systems.
- **Solution:** A centralized web-based ERP platform supporting multi-company workflows, unified inventory ledgers, role-based manufacturing authorization, and digital QC/QA inspection workflows.

### 2. My exact role, duration & team size
- **Role:** Independent Frontend Engineer (Internship at Vibe Tech Labs).
- **Duration:** Jun 2026 – Present.
- **Team Size:** Worked independently on the entire React frontend architecture, coordinating with backend API developers and domain specialists.

### 3. The main features built
- Multi-company workspace switching (CMHP Pharma and Tej Biocare).
- Shared Common Inventory with company-wise stock ledger tracking.
- Digital 19-stage Batch Manufacturing Record (BMR) workflow with signature checkpoints.
- Quality Control / Quality Assurance (QC/QA) multi-stage inspection & batch release sign-offs.
- Role-based HRMS module with attendance logs, employee profiles, and shift rosters.
- Automated GST-compliant sales and purchase invoicing.

### 4. Three hardest problems and how I solved them
- **Challenge 1: Complex Multi-step Digital BMR State:**
  - *Problem:* Tablet BMR forms require 19 interconnected sections with dynamic validation per step.
  - *Solution:* Engineered centralized Redux state slices with serialized draft caching so floor operators never lose record progress during mid-stage verification.
- **Challenge 2: Dual-Entity Shared Inventory vs. Private Ledgers:**
  - *Problem:* Preventing cross-company ledger leaks while maintaining a unified common raw-material depot.
  - *Solution:* Implemented strict tenant scoping in React state and API request interceptors, preventing inadvertent cross-entity ledger entries.
- **Challenge 3: High-Density Table Performance:**
  - *Problem:* Stock ledger tables containing hundreds of raw chemicals caused sluggish rendering on lower-power factory tablets.
  - *Solution:* Optimized React re-renders with memoization, paginated data structures, and CSS hardware-accelerated layouts.

### 5. What I learned
- Deep domain knowledge of pharmaceutical compliance, GMP workflows, and role-based access control.
- How to architect robust state management for mission-critical enterprise systems.

### 6. What I would improve
- Add offline service worker synchronization for factory floors with intermittent Wi-Fi coverage.

### 7. Links & Assets
- **Repository:** https://github.com/fenilrami27
- **Demo / Handover Status:** Currently in active development; handover authorization pending.
- **Permission to show company name:** Yes, referenced as independent build during internship at Vibe Tech Labs.
