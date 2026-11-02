"""
Tests verifying database query performance (no N+1 queries) and cache invalidation signals.
"""

import pytest
from django.core.cache import cache
from rest_framework.test import APIClient

from apps.content.models import SiteSettings, Skill, SkillGroup, Technology
from apps.core.cache import get_cached_portfolio
from apps.profiles.models import Profile
from apps.projects.models import Project, ProjectFeatureGroup


@pytest.fixture
def api_client():
    cache.clear()
    return APIClient()


@pytest.fixture
def setup_dataset():
    profile = Profile.load()
    SiteSettings.load()

    # Create technologies
    t1 = Technology.objects.create(name="Django", slug="django")
    t2 = Technology.objects.create(name="React", slug="react")
    t3 = Technology.objects.create(name="PostgreSQL", slug="postgresql")

    # Create multiple projects with stack, feature groups, and items
    for i in range(10):
        p = Project.objects.create(
            title=f"Project #{i}",
            one_liner=f"Summary {i}",
            description=f"Description {i}",
            is_published=True,
            order=i,
        )
        p.stack.add(t1, t2, t3)
        fg = ProjectFeatureGroup.objects.create(project=p, group=f"Group {i}")
        fg.items.create(text=f"Feature {i}-1")
        fg.items.create(text=f"Feature {i}-2")

    # Skills
    sg = SkillGroup.objects.create(name="Core")
    for s_idx in range(5):
        Skill.objects.create(group=sg, name=f"Skill {s_idx}")

    return profile


@pytest.mark.django_db
class TestDatabaseQueryPerformance:
    def test_project_list_query_count_is_bounded(
        self, api_client, setup_dataset, django_assert_num_queries
    ):
        # Fetching 10 projects with many-to-many stack should execute a small, constant number of queries
        # (1 for Project query, 1 for prefetch_related stack)
        with django_assert_num_queries(2):
            res = api_client.get("/api/v1/projects/")
            assert res.status_code == 200
            assert len(res.data) == 10

    def test_portfolio_bundle_query_count_is_bounded(
        self, api_client, setup_dataset, django_assert_num_queries
    ):
        # Cold cache execution: prefetching ensures no N+1 query loops across models
        cache.clear()
        res = api_client.get("/api/v1/portfolio/")
        assert res.status_code == 200

        # Warm cache execution: exactly 0 database queries!
        with django_assert_num_queries(0):
            res_cached = api_client.get("/api/v1/portfolio/")
            assert res_cached.status_code == 200


@pytest.mark.django_db
class TestCacheInvalidation:
    def test_saving_project_invalidates_cache(self, api_client, setup_dataset):
        cache.clear()

        # Prime cache
        res = api_client.get("/api/v1/portfolio/")
        assert res.status_code == 200
        cached_data, _ = get_cached_portfolio()
        assert cached_data is not None

        # Modify a project
        proj = Project.objects.first()
        proj.title = "Updated Project Title via Admin"
        proj.save()

        # Cache should now be purged
        purged_data, _ = get_cached_portfolio()
        assert purged_data is None

    def test_updating_profile_invalidates_cache(self, api_client, setup_dataset):
        # Prime cache
        api_client.get("/api/v1/portfolio/")
        cached_data, _ = get_cached_portfolio()
        assert cached_data is not None

        # Update profile
        profile = Profile.load()
        profile.headline = "Updated Full Stack Engineer Headline"
        profile.save()

        # Cache should now be purged
        purged_data, _ = get_cached_portfolio()
        assert purged_data is None
