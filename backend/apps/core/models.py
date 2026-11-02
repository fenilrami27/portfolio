"""
Base models for singleton entities and reusable mixins.
"""

from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import gettext_lazy as _


class SingletonModel(models.Model):
    """
    Abstract base class ensuring only one row exists in the database.
    Prevents deletion and maintains a single authoritative record.
    """

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        if not self.pk and self.__class__.objects.exists():
            raise ValidationError(
                _("Only one instance of %(model)s is permitted."),
                params={"model": self.__class__.__name__},
            )
        return super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        raise ValidationError(
            _("Deleting the singleton %(model)s instance is prohibited."),
            params={"model": self.__class__.__name__},
        )

    @classmethod
    def load(cls):
        """
        Fetch the singleton row or create one with default values if it doesn't exist yet.
        """
        obj = cls.objects.first()
        if not obj:
            obj = cls.objects.create()
        return obj
