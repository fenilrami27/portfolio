import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { LuX, LuSparkles } from 'react-icons/lu'

/**
 * Strict sanitizer: allow only letters, numbers, spaces, hyphens, and ampersands.
 * Max length 40 chars. Returns empty string if invalid or exceeds limits.
 */
function sanitizeInput(str) {
  if (!str || typeof str !== 'string') return ''
  const trimmed = str.trim()
  if (trimmed.length > 40) return ''
  // Whitelist pattern
  if (/^[A-Za-z0-9\s\-&]+$/.test(trimmed)) {
    return trimmed
  }
  return ''
}

export function CompanyBanner() {
  const [searchParams] = useSearchParams()
  const rawCompany = searchParams.get('for')
  const rawRole = searchParams.get('role')

  const company = sanitizeInput(rawCompany)
  const role = sanitizeInput(rawRole)

  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!company) {
      setIsVisible(false)
      return
    }

    try {
      const storageKey = `dismiss_banner_${company}_${role || 'default'}`
      const isDismissed = sessionStorage.getItem(storageKey)
      if (!isDismissed) {
        setIsVisible(true)
      }
    } catch {
      // If sessionStorage is unavailable, display banner without persistence
      setIsVisible(true)
    }
  }, [company, role])

  const handleDismiss = () => {
    setIsVisible(false)
    try {
      const storageKey = `dismiss_banner_${company}_${role || 'default'}`
      sessionStorage.setItem(storageKey, 'true')
    } catch {
      // Ignore storage errors
    }
  }

  if (!isVisible || !company) return null

  return (
    <aside
      aria-label="Personalized welcome message"
      className="company-banner relative z-40 bg-accent-1/10 dark:bg-accent-2/15 border-b border-accent-1/25 dark:border-accent-2/30 px-4 py-3 text-text transition-all duration-300"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <LuSparkles className="w-4 h-4 text-accent-1 dark:text-accent-2 shrink-0 animate-pulse" aria-hidden="true" />
          <p className="text-xs sm:text-sm font-medium truncate">
            <span>Hi <strong className="font-semibold text-text">{company}</strong>, here is my portfolio</span>
            {role ? (
              <span> for the <strong className="font-semibold text-text">{role}</strong> role.</span>
            ) : (
              <span>.</span>
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          className="p-1 rounded-lg hover:bg-surface-2 text-text-muted hover:text-text transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-1"
          aria-label="Dismiss personalized welcome banner"
        >
          <LuX className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </aside>
  )
}
