"""
Signal handlers to invalidate portfolio cache on any content model updates.
"""

from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from apps.content.models import (
    Achievement,
    Certificate,
    Education,
    Experience,
    ExperienceBullet,
    FocusArea,
    Hackathon,
    JourneyItem,
    Leadership,
    SiteSettings,
    Skill,
    SkillGroup,
    Stat,
    Technology,
    Testimonial,
)
from apps.core.cache import invalidate_portfolio_cache


@receiver([post_save, post_delete], sender=SiteSettings)
@receiver([post_save, post_delete], sender=FocusArea)
@receiver([post_save, post_delete], sender=Stat)
@receiver([post_save, post_delete], sender=SkillGroup)
@receiver([post_save, post_delete], sender=Skill)
@receiver([post_save, post_delete], sender=Experience)
@receiver([post_save, post_delete], sender=ExperienceBullet)
@receiver([post_save, post_delete], sender=Education)
@receiver([post_save, post_delete], sender=JourneyItem)
@receiver([post_save, post_delete], sender=Leadership)
@receiver([post_save, post_delete], sender=Certificate)
@receiver([post_save, post_delete], sender=Hackathon)
@receiver([post_save, post_delete], sender=Achievement)
@receiver([post_save, post_delete], sender=Testimonial)
@receiver([post_save, post_delete], sender=Technology)
def clear_cache_on_content_change(sender, **kwargs):
    invalidate_portfolio_cache()
