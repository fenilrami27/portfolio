import os
import sys
import time
from pathlib import Path
from PIL import Image
from playwright.sync_api import sync_playwright

BASE_MEDIA = Path(r"C:\Users\HP\Portfolio\backend\media\projects")
BASE_PUBLIC = Path(r"C:\Users\HP\Portfolio\frontend\public\assets\projects")
BASE_ASSETS = Path(r"C:\Users\HP\Portfolio\portfolio-assets\02-projects")

for d in [BASE_MEDIA, BASE_PUBLIC, BASE_ASSETS]:
    d.mkdir(parents=True, exist_ok=True)

def save_and_optimize(temp_path, dest_paths, quality=85):
    """Save webp optimized version to all destination directories."""
    img = Image.open(temp_path)
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")
    for dest in dest_paths:
        dest.parent.mkdir(parents=True, exist_ok=True)
        img.save(dest, "WEBP", quality=quality, optimize=True)
    if os.path.exists(temp_path):
        os.remove(temp_path)

def sanitize_page(page):
    """Mask any sensitive numbers or real customer data if present."""
    try:
        page.evaluate("""() => {
            const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
            let node;
            while ((node = walker.nextNode())) {
                if (/\\b[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}\\b/.test(node.nodeValue)) {
                    node.nodeValue = node.nodeValue.replace(/\\b[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}\\b/, '24ABCDE1234F1Z5');
                }
            }
        }""")
    except Exception as e:
        pass

def run():
    print("Starting Playwright capture...")
    temp_file = Path("temp_shot.png")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        
        # -------------------------------------------------------------
        # 1. CMHP PHARMA ERP (http://localhost:5174)
        # -------------------------------------------------------------
        print("\n--- Capturing CMHP ERP ---")
        cmhp_dir_media = BASE_MEDIA / "cmhp-pharma-erp"
        cmhp_dir_public = BASE_PUBLIC / "cmhp-pharma-erp"
        cmhp_dir_assets = BASE_ASSETS / "cmhp-pharma-erp"

        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()

        # 1.1 Login Page
        page.goto("http://localhost:5174/login")
        page.wait_for_load_state("networkidle")
        time.sleep(1)
        page.screenshot(path=temp_file)
        save_and_optimize(temp_file, [
            cmhp_dir_media / "01-cmhp-login.webp",
            cmhp_dir_public / "01-cmhp-login.webp",
            cmhp_dir_assets / "01-cmhp-login.webp"
        ])
        print("Captured: 01-cmhp-login")

        # Perform Login
        page.fill('input[type="text"], input[name="username"]', 'admin')
        page.fill('input[type="password"]', 'admin123')
        page.click('button[type="submit"]')
        page.wait_for_url("**/workspace-select**", timeout=10000)
        time.sleep(1.5)

        # 1.2 Workspace Selection
        page.screenshot(path=temp_file)
        save_and_optimize(temp_file, [
            cmhp_dir_media / "02-cmhp-workspace.webp",
            cmhp_dir_public / "02-cmhp-workspace.webp",
            cmhp_dir_assets / "02-cmhp-workspace.webp"
        ])
        print("Captured: 02-cmhp-workspace")

        # Click first company workspace (CMHP Pharma)
        page.locator('.workspace-card-1, .workspace-card').first.click()
        page.wait_for_url("**/dashboard**", timeout=10000)
        time.sleep(1.5)
        sanitize_page(page)

        # 1.3 Company Dashboard
        page.screenshot(path=temp_file)
        save_and_optimize(temp_file, [
            cmhp_dir_media / "03-cmhp-dashboard-company.webp",
            cmhp_dir_public / "03-cmhp-dashboard-company.webp",
            cmhp_dir_assets / "03-cmhp-dashboard-company.webp",
            cmhp_dir_media / "cover.webp",
            cmhp_dir_public / "cover.webp",
            cmhp_dir_assets / "cover.webp"
        ])
        print("Captured: 03-cmhp-dashboard-company (and cover)")

        # 1.4 HRMS Dashboard
        page.goto("http://localhost:5174/hrms")
        page.wait_for_load_state("networkidle")
        time.sleep(1)
        sanitize_page(page)
        page.screenshot(path=temp_file)
        save_and_optimize(temp_file, [
            cmhp_dir_media / "05-cmhp-hrms-dashboard.webp",
            cmhp_dir_public / "05-cmhp-hrms-dashboard.webp",
            cmhp_dir_assets / "05-cmhp-hrms-dashboard.webp"
        ])
        print("Captured: 05-cmhp-hrms-dashboard")

        # 1.5 HRMS Attendance
        page.goto("http://localhost:5174/hrms/attendance")
        page.wait_for_load_state("networkidle")
        time.sleep(1)
        sanitize_page(page)
        page.screenshot(path=temp_file)
        save_and_optimize(temp_file, [
            cmhp_dir_media / "06-cmhp-hrms-attendance.webp",
            cmhp_dir_public / "06-cmhp-hrms-attendance.webp",
            cmhp_dir_assets / "06-cmhp-hrms-attendance.webp"
        ])
        print("Captured: 06-cmhp-hrms-attendance")

        # 1.6 HRMS Payroll
        page.goto("http://localhost:5174/hrms/payroll")
        page.wait_for_load_state("networkidle")
        time.sleep(1)
        sanitize_page(page)
        page.screenshot(path=temp_file)
        save_and_optimize(temp_file, [
            cmhp_dir_media / "07-cmhp-hrms-payroll.webp",
            cmhp_dir_public / "07-cmhp-hrms-payroll.webp",
            cmhp_dir_assets / "07-cmhp-hrms-payroll.webp"
        ])
        print("Captured: 07-cmhp-hrms-payroll")

        # 1.7 HRMS Employees
        page.goto("http://localhost:5174/hrms/employees")
        page.wait_for_load_state("networkidle")
        time.sleep(1)
        sanitize_page(page)
        page.screenshot(path=temp_file)
        save_and_optimize(temp_file, [
            cmhp_dir_media / "08-cmhp-hrms-employees.webp",
            cmhp_dir_public / "08-cmhp-hrms-employees.webp",
            cmhp_dir_assets / "08-cmhp-hrms-employees.webp"
        ])
        print("Captured: 08-cmhp-hrms-employees")

        # 1.8 Orders
        page.goto("http://localhost:5174/operations/orders")
        page.wait_for_load_state("networkidle")
        time.sleep(1)
        sanitize_page(page)
        page.screenshot(path=temp_file)
        save_and_optimize(temp_file, [
            cmhp_dir_media / "10-cmhp-orders.webp",
            cmhp_dir_public / "10-cmhp-orders.webp",
            cmhp_dir_assets / "10-cmhp-orders.webp"
        ])
        print("Captured: 10-cmhp-orders")

        # 1.9 Production / BMR View
        page.goto("http://localhost:5174/production")
        page.wait_for_load_state("networkidle")
        time.sleep(1)
        sanitize_page(page)
        page.screenshot(path=temp_file)
        save_and_optimize(temp_file, [
            cmhp_dir_media / "11-cmhp-production-bmr.webp",
            cmhp_dir_public / "11-cmhp-production-bmr.webp",
            cmhp_dir_assets / "11-cmhp-production-bmr.webp"
        ])
        print("Captured: 11-cmhp-production-bmr")

        # 1.10 Invoicing
        page.goto("http://localhost:5174/invoice")
        page.wait_for_load_state("networkidle")
        time.sleep(1)
        sanitize_page(page)
        page.screenshot(path=temp_file)
        save_and_optimize(temp_file, [
            cmhp_dir_media / "12-cmhp-invoicing.webp",
            cmhp_dir_public / "12-cmhp-invoicing.webp",
            cmhp_dir_assets / "12-cmhp-invoicing.webp"
        ])
        print("Captured: 12-cmhp-invoicing")

        # 1.11 Common Inventory Workspace
        page.goto("http://localhost:5174/workspace-select")
        time.sleep(1)
        common_card = page.locator('.workspace-card-common, button:has-text("Common Inventory"), button:has-text("SHARED")').first
        if common_card.count() > 0:
            common_card.click()
            time.sleep(1.5)
        else:
            page.goto("http://localhost:5174/inventory")
            time.sleep(1.5)
        sanitize_page(page)
        page.screenshot(path=temp_file)
        save_and_optimize(temp_file, [
            cmhp_dir_media / "04-cmhp-dashboard-common-inventory.webp",
            cmhp_dir_public / "04-cmhp-dashboard-common-inventory.webp",
            cmhp_dir_assets / "04-cmhp-dashboard-common-inventory.webp",
            cmhp_dir_media / "09-cmhp-inventory-products.webp",
            cmhp_dir_public / "09-cmhp-inventory-products.webp",
            cmhp_dir_assets / "09-cmhp-inventory-products.webp"
        ])
        print("Captured: 04-cmhp-dashboard-common-inventory")

        # 1.12 Mobile View
        context_mobile = browser.new_context(viewport={"width": 390, "height": 844}, is_mobile=True)
        page_m = context_mobile.new_page()
        page_m.goto("http://localhost:5174/login")
        time.sleep(1)
        page_m.fill('input[type="text"], input[name="username"]', 'admin')
        page_m.fill('input[type="password"]', 'admin123')
        page_m.click('button[type="submit"]')
        time.sleep(1.5)
        if "/workspace-select" in page_m.url:
            page_m.locator('.workspace-card').first.click()
            time.sleep(1.5)
        sanitize_page(page_m)
        page_m.screenshot(path=temp_file)
        save_and_optimize(temp_file, [
            cmhp_dir_media / "13-cmhp-mobile-dashboard.webp",
            cmhp_dir_public / "13-cmhp-mobile-dashboard.webp",
            cmhp_dir_assets / "13-cmhp-mobile-dashboard.webp"
        ])
        print("Captured: 13-cmhp-mobile-dashboard")
        context_mobile.close()
        context.close()

        # -------------------------------------------------------------
        # 2. INTERIOR DESIGN STUDIO (http://localhost:8001)
        # -------------------------------------------------------------
        print("\n--- Capturing Interior Design Studio ---")
        interior_dir_media = BASE_MEDIA / "interior-design-studio"
        interior_dir_public = BASE_PUBLIC / "interior-design-studio"
        interior_dir_assets = BASE_ASSETS / "interior-design-studio"

        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()

        # 2.1 Home Page
        page.goto("http://localhost:8001/")
        page.wait_for_load_state("networkidle")
        time.sleep(1)
        page.screenshot(path=temp_file)
        save_and_optimize(temp_file, [
            interior_dir_media / "01-interior-home.webp",
            interior_dir_public / "01-interior-home.webp",
            interior_dir_assets / "01-interior-home.webp",
            interior_dir_media / "cover.webp",
            interior_dir_public / "cover.webp",
            interior_dir_assets / "cover.webp"
        ])
        print("Captured: 01-interior-home (and cover)")

        # 2.2 Projects Page
        page.goto("http://localhost:8001/projects/")
        page.wait_for_load_state("networkidle")
        time.sleep(1)
        page.screenshot(path=temp_file)
        save_and_optimize(temp_file, [
            interior_dir_media / "02-interior-projects.webp",
            interior_dir_public / "02-interior-projects.webp",
            interior_dir_assets / "02-interior-projects.webp"
        ])
        print("Captured: 02-interior-projects")

        # 2.3 Process Page
        page.goto("http://localhost:8001/process/")
        page.wait_for_load_state("networkidle")
        time.sleep(1)
        page.screenshot(path=temp_file)
        save_and_optimize(temp_file, [
            interior_dir_media / "03-interior-process.webp",
            interior_dir_public / "03-interior-process.webp",
            interior_dir_assets / "03-interior-process.webp"
        ])
        print("Captured: 03-interior-process")

        # 2.4 About / Best Page
        page.goto("http://localhost:8001/best/")
        page.wait_for_load_state("networkidle")
        time.sleep(1)
        page.screenshot(path=temp_file)
        save_and_optimize(temp_file, [
            interior_dir_media / "04-interior-about-best.webp",
            interior_dir_public / "04-interior-about-best.webp",
            interior_dir_assets / "04-interior-about-best.webp"
        ])
        print("Captured: 04-interior-about-best")

        # 2.5 Products Page
        page.goto("http://localhost:8001/products/")
        page.wait_for_load_state("networkidle")
        time.sleep(1)
        page.screenshot(path=temp_file)
        save_and_optimize(temp_file, [
            interior_dir_media / "05-interior-products.webp",
            interior_dir_public / "05-interior-products.webp",
            interior_dir_assets / "05-interior-products.webp"
        ])
        print("Captured: 05-interior-products")

        # 2.6 Contact Page
        page.goto("http://localhost:8001/contact/")
        page.wait_for_load_state("networkidle")
        time.sleep(1)
        page.screenshot(path=temp_file)
        save_and_optimize(temp_file, [
            interior_dir_media / "06-interior-contact.webp",
            interior_dir_public / "06-interior-contact.webp",
            interior_dir_assets / "06-interior-contact.webp"
        ])
        print("Captured: 06-interior-contact")

        # 2.7 Why Us Page
        page.goto("http://localhost:8001/whyus/")
        page.wait_for_load_state("networkidle")
        time.sleep(1)
        page.screenshot(path=temp_file)
        save_and_optimize(temp_file, [
            interior_dir_media / "07-interior-whyus.webp",
            interior_dir_public / "07-interior-whyus.webp",
            interior_dir_assets / "07-interior-whyus.webp"
        ])
        print("Captured: 07-interior-whyus")

        # 2.8 Mobile View
        context_mobile = browser.new_context(viewport={"width": 390, "height": 844}, is_mobile=True)
        page_m = context_mobile.new_page()
        page_m.goto("http://localhost:8001/")
        time.sleep(1)
        page_m.screenshot(path=temp_file)
        save_and_optimize(temp_file, [
            interior_dir_media / "08-interior-mobile-home.webp",
            interior_dir_public / "08-interior-mobile-home.webp",
            interior_dir_assets / "08-interior-mobile-home.webp"
        ])
        print("Captured: 08-interior-mobile-home")
        context_mobile.close()
        context.close()

        # -------------------------------------------------------------
        # 3. HR UNIVERSITY (http://localhost:5175 and http://localhost:8002)
        # -------------------------------------------------------------
        print("\n--- Capturing HR University ---")
        hru_dir_media = BASE_MEDIA / "hr-university"
        hru_dir_public = BASE_PUBLIC / "hr-university"
        hru_dir_assets = BASE_ASSETS / "hr-university"

        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()

        # 3.1 Intro Screen (during preloader)
        page.goto("http://localhost:5175/")
        time.sleep(1.2)
        page.screenshot(path=temp_file)
        save_and_optimize(temp_file, [
            hru_dir_media / "01-hr-university-intro.webp",
            hru_dir_public / "01-hr-university-intro.webp",
            hru_dir_assets / "01-hr-university-intro.webp"
        ])
        print("Captured: 01-hr-university-intro")

        # Wait for preloader to finish and hero to settle
        time.sleep(3.5)
        # 3.2 Home Page Hero & Stats
        page.screenshot(path=temp_file)
        save_and_optimize(temp_file, [
            hru_dir_media / "02-hr-university-home-hero.webp",
            hru_dir_public / "02-hr-university-home-hero.webp",
            hru_dir_assets / "02-hr-university-home-hero.webp",
            hru_dir_media / "cover.webp",
            hru_dir_public / "cover.webp",
            hru_dir_assets / "cover.webp"
        ])
        print("Captured: 02-hr-university-home-hero (and cover)")

        # 3.3 Departments Section (or page)
        page.goto("http://localhost:5175/departments")
        time.sleep(1.5)
        page.screenshot(path=temp_file)
        save_and_optimize(temp_file, [
            hru_dir_media / "03-hr-university-departments.webp",
            hru_dir_public / "03-hr-university-departments.webp",
            hru_dir_assets / "03-hr-university-departments.webp"
        ])
        print("Captured: 03-hr-university-departments")

        # 3.4 Placements Section
        page.goto("http://localhost:5175/placements")
        time.sleep(1.5)
        page.screenshot(path=temp_file)
        save_and_optimize(temp_file, [
            hru_dir_media / "04-hr-university-placements.webp",
            hru_dir_public / "04-hr-university-placements.webp",
            hru_dir_assets / "04-hr-university-placements.webp"
        ])
        print("Captured: 04-hr-university-placements")

        # 3.5 Events Section
        page.goto("http://localhost:5175/events")
        time.sleep(1.5)
        page.screenshot(path=temp_file)
        save_and_optimize(temp_file, [
            hru_dir_media / "05-hr-university-events.webp",
            hru_dir_public / "05-hr-university-events.webp",
            hru_dir_assets / "05-hr-university-events.webp"
        ])
        print("Captured: 05-hr-university-events")

        # 3.6 News / Updates Section
        page.goto("http://localhost:5175/student-updates")
        time.sleep(1.5)
        page.screenshot(path=temp_file)
        save_and_optimize(temp_file, [
            hru_dir_media / "06-hr-university-news.webp",
            hru_dir_public / "06-hr-university-news.webp",
            hru_dir_assets / "06-hr-university-news.webp"
        ])
        print("Captured: 06-hr-university-news")

        # 3.7 Admissions Form
        page.goto("http://localhost:5175/admissions")
        time.sleep(1.5)
        page.screenshot(path=temp_file)
        save_and_optimize(temp_file, [
            hru_dir_media / "07-hr-university-admissions.webp",
            hru_dir_public / "07-hr-university-admissions.webp",
            hru_dir_assets / "07-hr-university-admissions.webp"
        ])
        print("Captured: 07-hr-university-admissions")

        # 3.8 Django Unfold Admin Dashboard (http://localhost:8002/admin/)
        page.goto("http://localhost:8002/admin/login/?next=/admin/")
        time.sleep(1)
        page.fill('input[name="username"]', 'admin')
        page.fill('input[name="password"]', 'Admin1234!')
        page.click('button[type="submit"], input[type="submit"]')
        page.wait_for_url("**/admin/**", timeout=10000)
        time.sleep(1.5)
        page.screenshot(path=temp_file)
        save_and_optimize(temp_file, [
            hru_dir_media / "08-hr-university-admin.webp",
            hru_dir_public / "08-hr-university-admin.webp",
            hru_dir_assets / "08-hr-university-admin.webp"
        ])
        print("Captured: 08-hr-university-admin")

        # 3.9 Mobile View
        context_mobile = browser.new_context(viewport={"width": 390, "height": 844}, is_mobile=True)
        page_m = context_mobile.new_page()
        page_m.goto("http://localhost:5175/?nointro")
        time.sleep(2)
        page_m.screenshot(path=temp_file)
        save_and_optimize(temp_file, [
            hru_dir_media / "09-hr-university-mobile.webp",
            hru_dir_public / "09-hr-university-mobile.webp",
            hru_dir_assets / "09-hr-university-mobile.webp"
        ])
        print("Captured: 09-hr-university-mobile")
        context_mobile.close()

        context.close()
        browser.close()

    print("\nAll screenshots successfully captured and optimized!")

if __name__ == "__main__":
    run()
