"""
Tests for Admin Back-Office REST endpoints: authentication, dashboard stats,
profile management, projects CRUD, and inbox actions.
"""

import pytest
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APIClient

from apps.inbox.models import ContactMessage
from apps.profiles.models import Profile

User = get_user_model()


@pytest.fixture
def admin_user(db):
    user, _ = User.objects.get_or_create(
        username="Admin",
        defaults={
            "email": "fenilrami2704@gmail.com",
            "is_staff": True,
            "is_superuser": True,
        },
    )
    user.set_password("Fenil123")
    user.is_staff = True
    user.is_superuser = True
    user.save()

    Profile.objects.get_or_create(
        defaults={
            "full_name": "Fenil Rami",
            "headline": "Python Backend & Full Stack Developer",
            "location": "Ahmedabad, India",
        }
    )
    return user


@pytest.fixture
def auth_client(admin_user):
    client = APIClient()
    res = client.post("/api/v1/admin/auth/login/", {"username": "Admin", "password": "Fenil123"})
    assert res.status_code == status.HTTP_200_OK
    token = res.data["token"]
    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
    return client


@pytest.mark.django_db
class TestAdminAPI:
    def test_admin_login_success(self, db, admin_user):
        client = APIClient()
        res = client.post("/api/v1/admin/auth/login/", {"username": "Admin", "password": "Fenil123"})
        assert res.status_code == status.HTTP_200_OK
        assert "token" in res.data
        assert res.data["user"]["username"] == "Admin"

    def test_admin_login_invalid_credentials(self, db, admin_user):
        client = APIClient()
        res = client.post("/api/v1/admin/auth/login/", {"username": "Admin", "password": "WrongPassword"})
        assert res.status_code == status.HTTP_401_UNAUTHORIZED

    def test_admin_me_view(self, auth_client):
        res = auth_client.get("/api/v1/admin/auth/me/")
        assert res.status_code == status.HTTP_200_OK
        assert res.data["user"]["username"] == "Admin"

    def test_admin_dashboard_stats(self, auth_client):
        res = auth_client.get("/api/v1/admin/dashboard/")
        assert res.status_code == status.HTTP_200_OK
        assert "counts" in res.data
        assert "completeness" in res.data
        assert "recentMessages" in res.data or "recent_messages" in res.data
        assert "recentProjects" in res.data or "recent_projects" in res.data
        completeness = res.data["completeness"]
        assert "score" in completeness

    def test_admin_profile_get_and_patch(self, auth_client):
        # GET
        res = auth_client.get("/api/v1/admin/profile/")
        assert res.status_code == status.HTTP_200_OK
        name = res.data.get("fullName") or res.data.get("full_name")
        assert name == "Fenil Rami"

        # PATCH
        patch_res = auth_client.patch(
            "/api/v1/admin/profile/",
            {
                "headline": "Python Backend & Full Stack Developer (Updated)",
                "availability_status": "open_to_work",
                "availability_note": "Immediately available for engineering roles.",
                "roles": ["Python Developer", "Full Stack Engineer"],
            },
            format="json",
        )
        assert patch_res.status_code == status.HTTP_200_OK
        assert patch_res.data.get("headline") == "Python Backend & Full Stack Developer (Updated)"
        assert len(patch_res.data.get("roles", [])) == 2

    def test_admin_projects_crud(self, auth_client):
        # Create
        create_res = auth_client.post(
            "/api/v1/admin/projects/",
            {
                "title": "Automated Cloud Dispatcher",
                "one_liner": "Event-driven microservice dispatching webhooks.",
                "role": "Backend Lead",
                "type": "Backend",
                "tier": "featured",
                "is_published": True,
                "stack": ["Python", "FastAPI", "Redis"],
            },
            format="json",
        )
        assert create_res.status_code == status.HTTP_201_CREATED
        project_id = create_res.data["id"]

        # Detail GET
        detail_res = auth_client.get(f"/api/v1/admin/projects/{project_id}/")
        assert detail_res.status_code == status.HTTP_200_OK
        assert detail_res.data["title"] == "Automated Cloud Dispatcher"

        # PATCH
        patch_res = auth_client.patch(
            f"/api/v1/admin/projects/{project_id}/",
            {"status": "Shipped", "is_featured": True},
            format="json",
        )
        assert patch_res.status_code == status.HTTP_200_OK
        assert patch_res.data["status"] == "Shipped"
        is_feat = patch_res.data.get("isFeatured") if "isFeatured" in patch_res.data else patch_res.data.get("is_featured")
        assert is_feat is True

        # DELETE
        del_res = auth_client.delete(f"/api/v1/admin/projects/{project_id}/")
        assert del_res.status_code == status.HTTP_204_NO_CONTENT

    def test_admin_inbox_messages(self, auth_client, db):
        msg = ContactMessage.objects.create(
            name="Alice Tech",
            email="alice@techcorp.com",
            message="Hi Fenil, we would love to connect with you regarding a developer role.",
            is_read=False,
        )

        # List
        list_res = auth_client.get("/api/v1/admin/messages/")
        assert list_res.status_code == status.HTTP_200_OK
        assert len(list_res.data) >= 1

        # Mark read
        patch_res = auth_client.patch(
            f"/api/v1/admin/messages/{msg.id}/",
            {"is_read": True},
            format="json",
        )
        assert patch_res.status_code == status.HTTP_200_OK
        is_read_val = patch_res.data.get("isRead") if "isRead" in patch_res.data else patch_res.data.get("is_read")
        assert is_read_val is True

        # Delete
        del_res = auth_client.delete(f"/api/v1/admin/messages/{msg.id}/")
        assert del_res.status_code == status.HTTP_204_NO_CONTENT
        assert not ContactMessage.objects.filter(id=msg.id).exists()
