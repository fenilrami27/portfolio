/**
 * Privacy-Friendly Analytics Helper
 * Zero cookies, fully compliant with GDPR/CCPA without cookie banner.
 * Configured via VITE_ANALYTICS_ID or VITE_VERCEL_ANALYTICS.
 */

export const ANALYTICS_ID = import.meta.env.VITE_ANALYTICS_ID || ''
export const ENABLE_VERCEL_ANALYTICS = import.meta.env.VITE_VERCEL_ANALYTICS === 'true'

/**
 * Track custom events (e.g. resume_download, contact_submit)
 */
export function trackEvent(name, data = {}) {
  try {
    // 1. Vercel Web Analytics
    if (window.va) {
      window.va('event', { name, data })
    }

    // 2. Plausible Analytics
    if (window.plausible) {
      window.plausible(name, { props: data })
    }

    // 3. Fallback debug log in dev mode
    if (import.meta.env.DEV) {
      console.log(`[Analytics Event: ${name}]`, data)
    }
  } catch {
    // Silent fail so analytics never interrupts user workflow
  }
}
