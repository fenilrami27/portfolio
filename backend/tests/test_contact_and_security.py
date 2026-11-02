"""
Tests for contact form submissions, anti-spam protections, throttling, and IP hashing.
"""

from unittest.mock import patch

import pytest
from django.core.cache import cache
from rest_framework.test import APIClient

from apps.inbox.models import ContactMessage


@pytest.fixture
def api_client():
    cache.clear()
    return APIClient()


@pytest.mark.django_db
class TestContactSubmission:
    def test_valid_contact_submission_success(self, api_client):
        payload = {
            "name": "Aditi Shah",
            "email": "aditi@example.com",
            "message": "We are hiring a Python Backend Developer and would love to speak with you!",
        }
        res = api_client.post("/api/v1/contact/", payload, format="json")
        assert res.status_code == 201
        assert res.data["success"] is True

        # Verify saved message in inbox
        msg = ContactMessage.objects.filter(email="aditi@example.com").first()
        assert msg is not None
        assert msg.name == "Aditi Shah"
        assert msg.is_read is False
        assert msg.is_spam is False
        assert len(msg.ip_hash) == 64  # SHA-256 hash length

    def test_contact_validation_errors(self, api_client):
        # Empty name
        res = api_client.post(
            "/api/v1/contact/",
            {
                "name": "",
                "email": "valid@example.com",
                "message": "Valid message here.",
            },
        )
        assert res.status_code == 400
        assert "name" in res.data

        # Invalid email
        res = api_client.post(
            "/api/v1/contact/",
            {"name": "John", "email": "not-an-email", "message": "Valid message here."},
        )
        assert res.status_code == 400
        assert "email" in res.data

        # Message too short (<10 chars)
        res = api_client.post(
            "/api/v1/contact/",
            {"name": "John", "email": "john@example.com", "message": "short"},
        )
        assert res.status_code == 400
        assert "message" in res.data

    def test_honeypot_silently_rejects_bots(self, api_client):
        initial_count = ContactMessage.objects.count()
        payload = {
            "name": "Bot Spammer",
            "email": "bot@spammer.org",
            "message": "Buy cheap crypto now at our link here!",
            "website_hp": "https://bot-trap.com",  # Honeypot filled
        }
        res = api_client.post("/api/v1/contact/", payload, format="json")
        assert res.status_code == 201
        assert res.data["success"] is True

        # Ensure NO database record was created
        assert ContactMessage.objects.count() == initial_count

    def test_email_failure_does_not_abort_message_saving(self, api_client):
        with patch(
            "apps.api.views.send_mail", side_effect=Exception("SMTP Connection refused")
        ):
            payload = {
                "name": "Recruiter Test",
                "email": "recruiter@techfirm.io",
                "message": "Interested in scheduling a technical interview regarding your Django experience.",
            }
            res = api_client.post("/api/v1/contact/", payload, format="json")
            assert res.status_code == 201
            assert res.data["success"] is True

            # Verify saved message with email_sent=False
            saved = ContactMessage.objects.filter(email="recruiter@techfirm.io").first()
            assert saved is not None
            assert saved.email_sent is False

    def test_contact_rate_limiting_enforced(self, api_client):
        payload = {
            "name": "Rapid Sender",
            "email": "rapid@sender.com",
            "message": "This is a test message to evaluate the throttling system.",
        }

        # 5 allowed per hour from same IP
        for _ in range(5):
            res = api_client.post("/api/v1/contact/", payload, format="json")
            assert res.status_code == 201

        # 6th request should trigger 429 Too Many Requests
        res_throttled = api_client.post("/api/v1/contact/", payload, format="json")
        assert res_throttled.status_code == 429

    def test_turnstile_failure_returns_400(self, api_client, settings):
        settings.TURNSTILE_SECRET_KEY = "test-secret-key"

        with patch("apps.api.views.requests.post") as mock_post:
            mock_post.return_value.json.return_value = {
                "success": False,
                "error-codes": ["invalid-input-response"],
            }
            payload = {
                "name": "Turnstile Tester",
                "email": "turnstile@test.com",
                "message": "Evaluating Turnstile captcha failure responses.",
                "turnstile_token": "bad-token",
            }
            res = api_client.post("/api/v1/contact/", payload, format="json")
            assert res.status_code == 400
            assert "Security check failed" in res.data["detail"]
