# Project Notes: HR University - University Website & Management Platform

<!--
Fenil: You can fill out or adjust these guided questions in Gujarati or English.
-->

### 1. What the project is for (Core Purpose)
- **Problem:** University departments, admissions, placements, and campus event calendars were siloed, making institutional data updates difficult for non-technical administrative staff.
- **Solution:** A modern, interactive web portal combined with a high-capacity Django REST backend (11 decoupled apps, 32 models, 38 API endpoints) for institutional data management.

### 2. My exact role, duration & team size
- **Role:** Full Stack Developer (Frontend React + Backend Django 5 / DRF).
- **Duration:** 2026.
- **Team Size:** Solo architectural design and full-stack implementation.

### 3. The main features built
- High-impact interactive landing experience (animated intro, hero video, live institutional statistics counters).
- Admissions pipeline with multi-step student enquiry form and status tracker.
- Academic department directories, faculty listings, and course catalogs.
- Campus event management and placement records metrics display.
- Decoupled Django 5 admin engine with role-based staff permissions.

### 4. Three hardest problems and how I solved them
- **Challenge 1: Scalable Multi-App Backend Architecture:**
  - *Problem:* University needs require separation of concerns across admissions, academics, events, and placements without circular dependencies.
  - *Solution:* Modularized into 11 decoupled Django apps with clean foreign key boundaries and unified DRF serializers.
- **Challenge 2: First-Load Performance with Rich Media:**
  - *Problem:* Hero video and animated transitions threatened Core Web Vitals on slower mobile networks.
  - *Solution:* Implemented lazy media loading, responsive video source fallbacks, and CSS-driven GPU transitions.
- **Challenge 3: Department Data Integrity:**
  - *Problem:* Ensuring non-technical staff cannot corrupt cross-department curriculum records.
  - *Solution:* Implemented Django model validators and permission-scoped administration groups.

### 5. What I learned
- Large-scale Django application design patterns, DRF pagination/filtering, and university workflow orchestration.

### 6. What I would improve
- Add an automated student email dispatch service on enquiry submission.

### 7. Links & Assets
- **Repository:** https://github.com/fenilrami27
- **Permission to show name:** Yes, university portal academic project.
