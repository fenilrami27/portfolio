"""
Custom throttling classes for public contact submissions.
"""

from rest_framework.throttling import SimpleRateThrottle


class ContactIPRateThrottle(SimpleRateThrottle):
    """
    Base throttle that derives rate limit cache keys from client IP.
    """

    def get_cache_key(self, request, view):
        if request.user and request.user.is_authenticated:
            return None  # Do not rate limit authenticated admins

        ident = self.get_ident(request)
        return self.cache_format % {
            "scope": self.scope,
            "ident": ident,
        }


class ContactHourlyThrottle(ContactIPRateThrottle):
    scope = "contact_hourly"
    rate = "5/hour"


class ContactDailyThrottle(ContactIPRateThrottle):
    scope = "contact_daily"
    rate = "20/day"
