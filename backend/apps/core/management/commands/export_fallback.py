"""
Management command to export the bundled portfolio payload as fallback.json for the frontend.
"""

from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand
from rest_framework.test import APIRequestFactory

from apps.api.views import PortfolioBundleView


class Command(BaseCommand):
    help = (
        "Exports the bundled portfolio payload to ../frontend/src/data/fallback.json."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "--output",
            type=str,
            default="",
            help="Custom output path for the JSON payload.",
        )

    def handle(self, *args, **options):
        output_arg = options.get("output")
        if output_arg:
            dest_path = Path(output_arg)
        else:
            dest_path = (
                settings.BASE_DIR.parent / "frontend" / "src" / "data" / "fallback.json"
            )

        factory = APIRequestFactory()
        request = factory.get("/api/v1/portfolio/")
        view = PortfolioBundleView.as_view()
        response = view(request)

        # Render response data through the camelCase JSON renderer
        response.render()
        content = response.content.decode("utf-8")

        dest_path.parent.mkdir(parents=True, exist_ok=True)
        with open(dest_path, "w", encoding="utf-8") as f:
            f.write(content)

        self.stdout.write(
            self.style.SUCCESS(f"Successfully exported fallback data to {dest_path}")
        )
