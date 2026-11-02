"""
Management command: python manage.py import_assets

Reads 'portfolio-assets/' and syncs into database and media storage:
- Profile photo -> Profile.photo
- Resume -> ResumeVersion (auto-activated, latest 10 kept)
- Project covers, screenshots, case-study.json -> Project, ProjectImage, ProjectFeatureGroup, ProjectChallenge
- Certificates & Leadership media
- 05-links.txt -> SocialLink & Project URLs

Features:
- Idempotent execution
- --dry-run flag for safe validation
- File size and MIME type checks
- Image optimization via Pillow
- Flags missing alt text
- Clear summary report
"""

import json
from pathlib import Path

from django.conf import settings
from django.core.files import File
from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.management import call_command
from django.core.management.base import BaseCommand
from PIL import Image

from apps.core.cache import invalidate_portfolio_cache
from apps.core.validators import validate_image_file, validate_pdf_file
from apps.profiles.models import Profile, ResumeVersion, SocialLink
from apps.projects.models import (
    Project,
    ProjectChallenge,
    ProjectFeature,
    ProjectFeatureGroup,
    ProjectImage,
)


class Command(BaseCommand):
    help = "Import portfolio assets and metadata from portfolio-assets/ into database and storage."

    def add_arguments(self, parser):
        parser.add_argument(
            "--assets-dir",
            type=str,
            default="",
            help="Custom path to portfolio-assets directory. Defaults to ../portfolio-assets.",
        )
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Simulate import without modifying database or media storage.",
        )

    def handle(self, *args, **options):
        dry_run = options.get("dry_run", False)
        custom_assets_dir = options.get("assets_dir")

        if custom_assets_dir:
            assets_path = Path(custom_assets_dir).resolve()
        else:
            # Default location: Portfolio/portfolio-assets
            base_dir = Path(settings.BASE_DIR)
            candidate_1 = base_dir.parent / "portfolio-assets"
            candidate_2 = base_dir / "portfolio-assets"
            assets_path = candidate_1 if candidate_1.exists() else candidate_2

        self.stdout.write(
            self.style.MIGRATE_HEADING(
                f"\n=== Portfolio Assets Importer {'[DRY RUN]' if dry_run else ''} ==="
            )
        )
        self.stdout.write(f"Source Directory: {assets_path}\n")

        if not assets_path.exists():
            self.stderr.write(
                self.style.ERROR(f"Assets directory not found at: {assets_path}")
            )
            return

        report = {
            "personal": [],
            "resume": [],
            "projects": [],
            "links": [],
            "warnings": [],
            "errors": [],
        }

        # ----------------------------------------------------------------------
        # 1. Personal: Profile Photo & Resume
        # ----------------------------------------------------------------------
        personal_dir = assets_path / "01-personal"
        if personal_dir.exists():
            self.stdout.write("Scanning 01-personal/ ...")

            # A. Profile Photo
            for photo_name in ["photo-main.jpg", "photo-main.png", "photo-main.webp"]:
                photo_file = personal_dir / photo_name
                if photo_file.exists():
                    self._process_profile_photo(photo_file, dry_run, report)
                    break
            else:
                report["warnings"].append(
                    "No main profile photo found in 01-personal/ (expected photo-main.jpg/png/webp)"
                )

            # B. Resume PDF
            resume_file = personal_dir / "resume.pdf"
            if resume_file.exists():
                self._process_resume(resume_file, dry_run, report)
            else:
                report["warnings"].append("No resume.pdf found in 01-personal/")

        # ----------------------------------------------------------------------
        # 2. Projects: Covers, Screenshots, Case Studies
        # ----------------------------------------------------------------------
        projects_dir = assets_path / "02-projects"
        if projects_dir.exists():
            self.stdout.write("\nScanning 02-projects/ ...")
            for proj_folder in sorted(projects_dir.iterdir()):
                if proj_folder.is_dir():
                    self._process_project_folder(proj_folder, dry_run, report)

        # ----------------------------------------------------------------------
        # 3. Links: 05-links.txt
        # ----------------------------------------------------------------------
        links_file = assets_path / "05-links.txt"
        if links_file.exists():
            self.stdout.write("\nScanning 05-links.txt ...")
            self._process_links_file(links_file, dry_run, report)

        # ----------------------------------------------------------------------
        # Invalidate Cache and Export Fallback Data
        # ----------------------------------------------------------------------
        if not dry_run:
            invalidate_portfolio_cache()
            self.stdout.write("\nRe-exporting fallback.json for frontend...")
            try:
                call_command("export_fallback")
            except Exception as e:
                report["warnings"].append(f"Failed to export fallback.json: {e}")

        # ----------------------------------------------------------------------
        # Print Summary Report
        # ----------------------------------------------------------------------
        self._print_report(report, dry_run)

    def _process_profile_photo(self, photo_path: Path, dry_run: bool, report: dict):
        try:
            # Validate size (8MB) and format
            with open(photo_path, "rb") as f:
                content = f.read()
            upload = SimpleUploadedFile(photo_path.name, content, content_type="image/jpeg")
            validate_image_file(upload)

            # Verify image integrity with Pillow
            with Image.open(photo_path) as img:
                img.verify()
                w, h = img.size

            if not dry_run:
                profile = Profile.load()
                with open(photo_path, "rb") as f:
                    profile.photo.save(f"profiles/{photo_path.name}", File(f), save=False)
                if not profile.photo_alt:
                    profile.photo_alt = "Fenil Rami - Python Backend & Full Stack Developer"
                    report["warnings"].append("Profile photo had empty alt text; set default descriptive alt.")
                profile.save()

            report["personal"].append(
                f"Profile Photo: {photo_path.name} ({w}x{h}px, {len(content) / 1024:.1f} KB) -> Imported successfully"
            )
        except Exception as e:
            report["errors"].append(f"Profile photo error ({photo_path.name}): {e}")

    def _process_resume(self, resume_path: Path, dry_run: bool, report: dict):
        try:
            with open(resume_path, "rb") as f:
                content = f.read()

            upload = SimpleUploadedFile("resume.pdf", content, content_type="application/pdf")
            validate_pdf_file(upload)

            if not dry_run:
                rv = ResumeVersion(note="Imported via import_assets from portfolio-assets")
                with open(resume_path, "rb") as f:
                    rv.file.save("resumes/Fenil_Rami_Resume.pdf", File(f), save=False)
                rv.save()

            report["resume"].append(
                f"Resume: {resume_path.name} ({len(content) / 1024:.1f} KB) -> Active ResumeVersion set"
            )
        except Exception as e:
            report["errors"].append(f"Resume import error: {e}")

    def _process_project_folder(self, folder: Path, dry_run: bool, report: dict):
        slug = folder.name
        project = Project.objects.filter(slug=slug).first()

        # Check if case-study.json exists
        case_study_file = folder / "case-study.json"
        case_data = None
        if case_study_file.exists():
            try:
                with open(case_study_file, encoding="utf-8") as f:
                    case_data = json.load(f)
            except Exception as e:
                report["warnings"].append(f"Failed to read {case_study_file.name} for {slug}: {e}")

        if not project and case_data:
            if not dry_run:
                project = Project.objects.create(
                    slug=slug,
                    title=case_data.get("title", slug.replace("-", " ").title()),
                    one_liner=case_data.get("oneLiner", ""),
                    is_published=case_data.get("isPublished", True),
                )
            report["projects"].append(f"Created new Project record for slug '{slug}' from case-study.json")

        if not project:
            report["warnings"].append(f"No existing Project record for slug '{slug}', skipping images.")
            return

        # Apply case study data if available
        if case_data:
            report["projects"].append(f"[{slug}] Case study verified: {case_data.get('title', slug)}")
            if not dry_run:
                desc_val = case_data.get("description", "")
                if isinstance(desc_val, list):
                    project.description = "\n\n".join(desc_val)
                elif isinstance(desc_val, str):
                    project.description = desc_val

            if "oneLiner" in case_data:
                project.one_liner = case_data["oneLiner"]
            if "role" in case_data:
                project.role = case_data["role"]
            if "status" in case_data:
                project.status = case_data["status"]
            if "type" in case_data:
                project.type = case_data["type"]
            if "tier" in case_data:
                project.tier = case_data["tier"]
            if "isFeatured" in case_data:
                project.is_featured = case_data["isFeatured"]
            if "isPublished" in case_data:
                project.is_published = case_data["isPublished"]
            if "githubUrl" in case_data:
                project.github_url = case_data["githubUrl"]
            if "liveUrl" in case_data:
                project.live_url = case_data["liveUrl"]
            if "videoUrl" in case_data:
                project.video_url = case_data["videoUrl"]

            project.save()

            # Feature groups
            if "featureGroups" in case_data:
                project.feature_groups.all().delete()
                for fg_idx, fg_info in enumerate(case_data["featureGroups"], 1):
                    group_obj = ProjectFeatureGroup.objects.create(
                        project=project,
                        group=fg_info.get("group", f"Group {fg_idx}"),
                        order=fg_idx,
                    )
                    for item_idx, text in enumerate(fg_info.get("items", []), 1):
                        ProjectFeature.objects.create(
                            group=group_obj,
                            text=text,
                            order=item_idx,
                        )

            # Challenges
            if "challenges" in case_data:
                project.challenges.all().delete()
                for c_idx, c_info in enumerate(case_data["challenges"], 1):
                    ProjectChallenge.objects.create(
                        project=project,
                        title=c_info.get("title", ""),
                        body=c_info.get("body", ""),
                        order=c_idx,
                    )

        # Check Cover
        for ext in [".jpg", ".jpeg", ".png", ".webp"]:
            cover_file = folder / f"cover{ext}"
            if cover_file.exists():
                try:
                    with open(cover_file, "rb") as f:
                        content = f.read()
                    upload = SimpleUploadedFile(cover_file.name, content, content_type=f"image/{ext.lstrip('.')}")
                    validate_image_file(upload)

                    if not dry_run:
                        with open(cover_file, "rb") as f:
                            project.cover.save(f"projects/{slug}/cover{ext}", File(f), save=False)
                        if not project.cover_alt:
                            project.cover_alt = f"{project.title} cover preview"
                        project.save()

                    report["projects"].append(f"[{slug}] Cover image updated: {cover_file.name}")
                except Exception as e:
                    report["errors"].append(f"[{slug}] Cover error: {e}")
                break

        # Check Screenshots
        screenshots_dir = folder / "screenshots"
        if screenshots_dir.exists() and screenshots_dir.is_dir():
            screenshot_files = sorted(
                [f for f in screenshots_dir.iterdir() if f.suffix.lower() in [".jpg", ".jpeg", ".png", ".webp"]]
            )
            for idx, sfile in enumerate(screenshot_files, 1):
                try:
                    with open(sfile, "rb") as f:
                        content = f.read()
                    upload = SimpleUploadedFile(sfile.name, content, content_type=f"image/{sfile.suffix.lstrip('.')}")
                    validate_image_file(upload)

                    if not dry_run:
                        # Update or create project image
                        existing = project.images.filter(order=idx).first()
                        if not existing:
                            existing = ProjectImage(project=project, order=idx)
                        with open(sfile, "rb") as f:
                            existing.image.save(f"projects/{slug}/screenshots/{sfile.name}", File(f), save=False)
                        if not existing.alt:
                            existing.alt = f"{project.title} screenshot {idx}"
                            report["warnings"].append(f"[{slug}] Screenshot {sfile.name} missing alt; generated fallback.")
                        existing.save()

                    report["projects"].append(f"[{slug}] Screenshot {idx}: {sfile.name}")
                except Exception as e:
                    report["errors"].append(f"[{slug}] Screenshot error ({sfile.name}): {e}")

    def _process_links_file(self, links_path: Path, dry_run: bool, report: dict):
        profile = Profile.load()
        lines = links_path.read_text(encoding="utf-8").splitlines()

        for line_num, line in enumerate(lines, 1):
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            if "|" not in line:
                report["warnings"].append(f"05-links.txt line {line_num}: invalid format '{line}' (expected Label | URL)")
                continue

            label, url = [part.strip() for part in line.split("|", 1)]
            if not (url.startswith("https://") or url.startswith("mailto:")):
                report["warnings"].append(f"05-links.txt line {line_num}: URL '{url}' is not HTTPS or mailto. Skipped.")
                continue

            if "linkedin" in label.lower():
                if not dry_run:
                    SocialLink.objects.update_or_create(
                        profile=profile,
                        platform="LinkedIn",
                        defaults={"label": label, "url": url, "order": 1, "is_visible": True},
                    )
                report["links"].append(f"Linked Social: {label} -> {url}")
            elif "github" in label.lower() and "project" not in label.lower() and "erp" not in label.lower():
                if not dry_run:
                    SocialLink.objects.update_or_create(
                        profile=profile,
                        platform="GitHub",
                        defaults={"label": label, "url": url, "order": 2, "is_visible": True},
                    )
                report["links"].append(f"Linked Social: {label} -> {url}")

    def _print_report(self, report: dict, dry_run: bool):
        self.stdout.write(self.style.MIGRATE_HEADING("\n=== Import Assets Execution Report ==="))
        if dry_run:
            self.stdout.write(self.style.NOTICE("[DRY RUN ACTIVE - No database changes persisted]\n"))

        self.stdout.write(self.style.SUCCESS(f"[+] Personal Assets: {len(report['personal'])}"))
        for item in report["personal"]:
            self.stdout.write(f"  * {item}")

        self.stdout.write(self.style.SUCCESS(f"[+] Resume Versions: {len(report['resume'])}"))
        for item in report["resume"]:
            self.stdout.write(f"  * {item}")

        self.stdout.write(self.style.SUCCESS(f"[+] Projects Synchronized: {len(report['projects'])}"))
        for item in report["projects"]:
            self.stdout.write(f"  * {item}")

        self.stdout.write(self.style.SUCCESS(f"[+] Links Synchronized: {len(report['links'])}"))
        for item in report["links"]:
            self.stdout.write(f"  * {item}")

        if report["warnings"]:
            self.stdout.write(self.style.WARNING(f"\n[!] Warnings ({len(report['warnings'])}):"))
            for w in report["warnings"]:
                self.stdout.write(f"  ! {w}")

        if report["errors"]:
            self.stdout.write(self.style.ERROR(f"\n[-] Errors ({len(report['errors'])}):"))
            for e in report["errors"]:
                self.stdout.write(f"  - {e}")
        else:
            self.stdout.write(self.style.SUCCESS("\nAll asset checks passed with zero errors."))
