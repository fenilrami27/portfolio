# Project Notes: Interior Design Studio - Website

<!--
Fenil: You can fill out or adjust these guided questions in Gujarati or English.
-->

### 1. What the project is for (Core Purpose)
- **Problem:** Small design studios need dynamic project catalogs and client inquiry authentication without relying on brittle third-party CMS builders.
- **Solution:** A clean, custom Django website with authentication, OTP-based password recovery, dynamic gallery management, and categorized portfolios.

### 2. My exact role, duration & team size
- **Role:** Python/Django Developer.
- **Duration:** 2026.
- **Team Size:** Solo developer (built as a learning replica with sample data).

### 3. The main features built
- Product showcase and categorized architectural project pages.
- Client authentication (login, signup, session management).
- OTP-verified email password recovery flow.
- Admin-managed dynamic image gallery and portfolio tags.

### 4. Three hardest problems and how I solved them
- **Challenge 1: Secure OTP Password Recovery:**
  - *Problem:* Preventing replay attacks or expired OTP usage.
  - *Solution:* Implemented timed tokens with server-side expiry and single-use invalidation flags.
- **Challenge 2: Responsive Gallery Grid:**
  - *Problem:* Varied aspect-ratio design photos breaking layout grids.
  - *Solution:* Applied CSS Grid auto-fit with object-fit cover and lazy loading.
- **Challenge 3: Database Session Hygiene:**
  - *Problem:* Managing active user sessions securely.
  - *Solution:* Configured secure session cookies with CSRF validation across all forms.

### 5. What I learned
- Django auth lifecycle, email backend integrations, and custom admin model customization.

### 6. What I would improve
- Add client consultation scheduling calendar integration.

### 7. Links & Assets
- **Repository:** https://github.com/fenilrami27
- **Note:** Built during internship as a learning replica of a commercial website; all images and logos are sample data.
