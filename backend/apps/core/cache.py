"""
Cache management and invalidation helpers for public portfolio payloads.
"""

import hashlib
import json
import logging

from django.core.cache import cache

logger = logging.getLogger(__name__)

PORTFOLIO_CACHE_KEY = "portfolio_bundle_payload_v1"
PORTFOLIO_ETAG_KEY = "portfolio_bundle_etag_v1"


def get_cached_portfolio():
    """
    Retrieve cached bundled payload and its associated ETag.
    """
    return cache.get(PORTFOLIO_CACHE_KEY), cache.get(PORTFOLIO_ETAG_KEY)


def set_cached_portfolio(data, timeout=300):
    """
    Store bundled portfolio payload in cache and generate a deterministic ETag.
    """
    try:
        # Deterministic JSON representation for MD5 ETag
        json_bytes = json.dumps(data, sort_keys=True, default=str).encode("utf-8")
        etag = f'"{hashlib.md5(json_bytes).hexdigest()}"'
        cache.set(PORTFOLIO_CACHE_KEY, data, timeout=timeout)
        cache.set(PORTFOLIO_ETAG_KEY, etag, timeout=timeout)
        return etag
    except Exception as exc:
        logger.warning("Failed to cache portfolio payload: %s", exc)
        return None


def invalidate_portfolio_cache():
    """
    Invalidate cached bundled portfolio payload and ETag.
    Called on model save / delete signals.
    """
    try:
        cache.delete(PORTFOLIO_CACHE_KEY)
        cache.delete(PORTFOLIO_ETAG_KEY)
        logger.info("Portfolio cache invalidated successfully.")
    except Exception as exc:
        logger.warning("Error while invalidating portfolio cache: %s", exc)
