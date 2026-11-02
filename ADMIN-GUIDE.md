# Fenil Rami Portfolio - Admin Guide

Welcome to your portfolio administration guide! This document explains how you can manage every piece of text, project, photo, and resume on your website directly through the admin panel without touching code.

---

## 1. How to Log In

1. Open your browser and navigate to:
   - **Local:** `http://127.0.0.1:8000/admin/`
   - **Production:** `https://api.fenilrami.com/admin/` (or your custom `ADMIN_URL` path)
2. Enter your credentials:
   - **Username:** `fenil`
   - **Password:** *(Your configured password; locally defaults to `FenilPortfolio2026!`)*
3. Click **Log In**. You will arrive at the **Content Overview & Dashboard**.

---

## 2. Managing Your Profile & Bio

1. In the sidebar under **Profile and site**, click **Profile**.
2. Click on the single **Fenil Rami** row.
3. You can edit:
   - **Full name** & **Headline**
   - **Professional Summary / About** (your main bio paragraph)
   - **Location** & **Contact details** (email and phone number toggle)
   - **Availability Status** (*Open to work*, *Freelance*, or *Not available*)
4. **Roles Sought:** Scroll down to the **Roles Sought** table to add or reorder target job titles (e.g. *Python Backend Developer*, *Django Developer*).
5. **Social Links:** Update your LinkedIn, GitHub, or portfolio links in the **Social Links** section.
6. Click **Save** at the bottom.

---

## 3. Changing Your Profile Photo

1. On the **Profile** page, locate the **Profile photo** field.
2. Click **Choose file** and select your portrait photograph (supports `.jpg`, `.png`, or `.webp`, up to 8 MB).
3. Ensure **Photo alt description** is filled in (e.g. *"Fenil Rami - Python Backend & Full Stack Developer"*).
4. Click **Save**. The website header and overview portrait update immediately.

---

## 4. Uploading a New Resume PDF

The site's **"Download resume"** button always serves your active resume as `Fenil_Rami_Resume.pdf`.

1. In the sidebar under **Profile and site**, click **Resume versions**.
2. Click **Add Resume Version** in the top right.
3. Choose your new `.pdf` file (max 5 MB).
4. Add an optional note (e.g. *"Updated with Semester 6 results"*).
5. Click **Save**.
6. **Automatic Activation:**
   - The system automatically marks your newly uploaded resume as **Active** and deactivates earlier versions.
   - The system automatically retains your 10 most recent versions for safety and prunes older ones.
7. To revert to an earlier resume:
   - Select the checkbox next to that version and choose the action **"Make this version active"**, then click **Run**.

---

## 5. Adding Projects

### Option A: Quick Add Project (Takes Under 1 Minute)
For smaller builds, utilities, or hackathon projects:
1. In the sidebar under **Work**, click **Quick Add Project**.
2. Enter:
   - **Project title** (the URL slug is generated automatically)
   - **One-liner** summary
   - **Project status** & **Category**
   - **Stack** technologies (select 2–4 tools)
   - **GitHub repository URL**
3. Click **Save**. The project immediately appears in your catalog under `/projects` as a clean compact card.

### Option B: Full Case Study Project
For major enterprise systems (like CMHP Pharma ERP or HR University):
1. In the sidebar under **Work**, click **Projects** -> **Add Project**.
2. Fill in:
   - **Title**, **Slug**, and **One-liner**.
   - **Project description:** Plain text paragraphs. Separate paragraphs with an empty blank line.
   - **Tier:** Select **Featured** to give it a hero showcase on the home page.
   - **Cover Image:** Upload a visual banner or screenshot.
   - **Feature Groups (Inlines):** Click *Add another Feature Group* to create sections (e.g. *"Digital BMR & Compliance"*).
   - **Challenges & Solutions (Inlines):** Click *Add another Project Challenge* to describe technical problems and trade-offs.
   - **Employer Project Warning:** If you toggle **Is employer project**, verify you have clearance from Vibe Tech Labs before setting **Is published** to active.
3. Click **Save**.

---

## 6. Reordering and Publishing Projects

1. Navigate to **Work** -> **Projects**.
2. **Instant Toggle:** The **Published** and **Featured** columns have clickable toggles. Toggle a checkbox and click **Save** at the bottom to publish or unpublish instantly.
3. **Reordering:** Change the integer number in the **Order** column (lower numbers appear first on the site) and click **Save**.
4. **Bulk Actions:** Select multiple projects using checkboxes, then select **Publish selected projects** or **Feature selected projects** from the action dropdown.

---

## 7. Reading Contact Messages (Inbox)

1. In the sidebar under **Inbox**, click **Messages**.
2. Click on any inquiry to read the sender's name, email, and message.
3. Notice that IP addresses are strictly stored as privacy-friendly **SHA-256 hashes** (never raw IP).
4. You can mark messages as **Read**, mark as **Spam**, or add private notes to track follow-ups.

---

## 8. Editing Counters & "What I Do" Focus Areas

1. In the sidebar under **What I do and numbers**:
   - **Stats:** Edit your milestone counters (e.g. *Years of hands-on Python*, *Production systems delivered*).
     - *Derived Stats:* Stats with kind **Projects Count** or **Experience Months** update automatically based on published projects and your internship start date!
   - **Focus Areas:** Edit the cards displayed under "What I focus on" (Title, description, and icon).

---

## 9. Content Health Checklist

The admin home dashboard includes a dynamic **Content Health** card that automatically alerts you if:
- Profile photo is missing.
- No active resume PDF exists.
- Bio or statement is too short (< 40 characters).
- Published projects lack descriptions or cover images.
- Unread client messages are awaiting response.

Click on any highlighted checklist item to jump directly to the page that fixes it.

---

## 10. Troubleshooting

- **The public website shows old text after I saved changes:**
  - The API uses high-performance edge caching (`Cache-Control: public, max-age=60`).
  - Cache invalidation signals automatically purge the server cache whenever you click Save.
  - Hard-refresh your browser tab using `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac) to bypass local browser cache.
- **I was locked out after multiple failed login attempts:**
  - `django-axes` enforces login security. If locked out, wait 15 minutes or have an administrator run:
    ```bash
    python manage.py axes_reset
    ```
