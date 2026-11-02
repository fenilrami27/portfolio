"""
Signal handlers for profiles models to invalidate portfolio cache on change.
"""

from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from apps.core.cache import invalidate_portfolio_cache
from apps.profiles.models import Profile, ResumeVersion, RoleSought, SocialLink


@receiver([post_save, post_delete], sender=Profile)
@receiver([post_save, post_delete], sender=RoleSought)
@receiver([post_save, post_delete], sender=SocialLink)
@receiver([post_save, post_delete], sender=ResumeVersion)
def clear_cache_on_profile_change(sender, **kwargs):
    invalidate_portfolio_cache()
