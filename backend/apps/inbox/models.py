"""
Inbox models managing inbound contact messages with privacy-conscious hashing.
"""

import hashlib

from django.db import models
from django.utils.translation import gettext_lazy as _


class ContactMessage(models.Model):
    """
    Inbound message submitted via the public contact form.
    Stores privacy-preserving SHA-256 IP hash rather than raw IP.
    """

    name = models.CharField(
        max_length=150,
        verbose_name=_("Sender name"),
    )
    email = models.EmailField(
        verbose_name=_("Sender email"),
    )
    message = models.TextField(
        verbose_name=_("Message content"),
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_("Received at"),
    )
    ip_hash = models.CharField(
        max_length=64,
        blank=True,
        verbose_name=_("Hashed IP address"),
        help_text=_(
            "One-way cryptographic hash of submitter IP address for privacy compliance."
        ),
    )
    user_agent = models.CharField(
        max_length=500,
        blank=True,
        verbose_name=_("User agent"),
    )
    is_read = models.BooleanField(
        default=False,
        verbose_name=_("Is read"),
    )
    is_spam = models.BooleanField(
        default=False,
        verbose_name=_("Is marked as spam"),
    )
    notes = models.TextField(
        blank=True,
        verbose_name=_("Internal follow-up notes"),
        help_text=_("Internal admin notes regarding this inquiry."),
    )
    email_sent = models.BooleanField(
        default=False,
        verbose_name=_("Email notification delivered"),
        help_text=_("Indicates whether automated email dispatch to Fenil succeeded."),
    )

    class Meta:
        ordering = ["-created_at"]
        verbose_name = _("Contact Message")
        verbose_name_plural = _("Contact Messages")

    def __str__(self):
        status = "Read" if self.is_read else "UNREAD"
        return f"[{status}] Message from {self.name} <{self.email}>"

    @staticmethod
    def hash_ip(ip_address):
        """
        Produce a SHA-256 hash of the client's IP string.
        """
        if not ip_address:
            return ""
        return hashlib.sha256(ip_address.strip().encode("utf-8")).hexdigest()
