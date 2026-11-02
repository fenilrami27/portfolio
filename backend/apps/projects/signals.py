"""
Signal handlers to invalidate portfolio cache when projects or components change.
"""

from django.db.models.signals import m2m_changed, post_delete, post_save
from django.dispatch import receiver

from apps.core.cache import invalidate_portfolio_cache
from apps.projects.models import (
    Project,
    ProjectChallenge,
    ProjectFeature,
    ProjectFeatureGroup,
    ProjectImage,
)


@receiver([post_save, post_delete], sender=Project)
@receiver([post_save, post_delete], sender=ProjectImage)
@receiver([post_save, post_delete], sender=ProjectFeatureGroup)
@receiver([post_save, post_delete], sender=ProjectFeature)
@receiver([post_save, post_delete], sender=ProjectChallenge)
def clear_cache_on_project_change(sender, **kwargs):
    invalidate_portfolio_cache()


@receiver(m2m_changed, sender=Project.stack.through)
def clear_cache_on_project_m2m(sender, **kwargs):
    invalidate_portfolio_cache()
