import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LuSun, LuMoon, LuMenu, LuX } from 'react-icons/lu'
import { useTheme } from '../../context/ThemeContext'
import { Button } from '../ui/Button'
import { IconButton } from '../ui/IconButton'

const NAV_LINKS = [
  { id: 'overview', label: 'Overview' },
  { id: 'work', label: 'Work' },
  { id: 'skills', label: 'Skills' },
  { id: 'journey', label: 'Journey' },
  { id: 'contact', label: 'Contact' },
]

export function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const drawerRef = useRef(null)
  const closeButtonRef = useRef(null)

  const isHomePage = location.pathname === '/'

  // Active section tracking with IntersectionObserver on home page
  useEffect(() => {
    if (!isHomePage) {
      setActiveSection('')
      return
    }

    const sections = NAV_LINKS.map((link) => document.getElementById(link.id)).filter(Boolean)

    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0,
      }
    )

    sections.forEach((sec) => observer.observe(sec))

    return () => observer.disconnect()
  }, [isHomePage, location.hash])

  // Handle ESC and body scroll lock for mobile drawer
  useEffect(() => {
    if (!mobileMenuOpen) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false)
      }
      // Simple focus trap
      if (e.key === 'Tab' && drawerRef.current) {
        const focusableElements = drawerRef.current.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled])'
        )
        const first = focusableElements[0]
        const last = focusableElements[focusableElements.length - 1]

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    if (closeButtonRef.current) {
      closeButtonRef.current.focus()
    }

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [mobileMenuOpen])

  const handleNavClick = (sectionId, e) => {
    if (e) e.preventDefault()
    setMobileMenuOpen(false)

    if (isHomePage) {
      const el = document.getElementById(sectionId)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        window.history.pushState(null, '', `/#${sectionId}`)
        setActiveSection(sectionId)
      }
    } else {
      navigate(`/#${sectionId}`)
    }
  }

  const handleHireMeClick = (e) => {
    handleNavClick('contact', e)
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-bg/85 glass-nav transition-colors duration-200">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand / Monogram */}
        <Link
          to="/"
          className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-2 rounded-lg p-1"
          aria-label="Fenil Rami Home"
          onClick={() => {
            if (isHomePage) {
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }
          }}
        >
          <div className="w-9 h-9 rounded-xl accent-gradient-bg flex items-center justify-center font-bold text-white shadow-sm tracking-tight text-sm group-hover:scale-105 transition-transform">
            FR
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-semibold text-text text-sm sm:text-base leading-tight group-hover:text-accent-1 dark:group-hover:text-accent-2 transition-colors">
              Fenil Rami
            </span>
            <span className="text-[11px] text-text-subtle font-mono hidden sm:inline-block leading-none">
              Full Stack Developer
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden md:flex items-center gap-1 lg:gap-2"
          aria-label="Main Navigation"
        >
          {NAV_LINKS.map((link) => {
            const isActive = isHomePage && activeSection === link.id
            return (
              <a
                key={link.id}
                href={isHomePage ? `#${link.id}` : `/#${link.id}`}
                onClick={(e) => handleNavClick(link.id, e)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 relative min-h-[44px] flex items-center ${
                  isActive
                    ? 'text-accent-1 dark:text-accent-2'
                    : 'text-text-muted hover:text-text hover:bg-surface-2'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-1 left-3 right-3 h-[2px] accent-gradient-bg rounded-full" />
                )}
              </a>
            )
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle */}
          <IconButton
            variant="ghost"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            className="text-text-muted hover:text-text"
          >
            {theme === 'dark' ? (
              <LuSun className="w-5 h-5 text-warning" aria-hidden="true" />
            ) : (
              <LuMoon className="w-5 h-5 text-accent-1" aria-hidden="true" />
            )}
          </IconButton>

          {/* Resume link button */}
          <Button
            to="/resume"
            variant="secondary"
            size="sm"
            className="hidden sm:inline-flex"
            aria-label="View Resume"
          >
            Resume
          </Button>

          {/* Hire Me CTA */}
          <Button
            variant="primary"
            size="sm"
            onClick={handleHireMeClick}
            aria-label="Hire me - Navigate to contact form"
          >
            Hire me
          </Button>

          {/* Mobile Menu Trigger */}
          <div className="md:hidden">
            <IconButton
              variant="ghost"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open mobile navigation menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-drawer"
            >
              <LuMenu className="w-6 h-6 text-text" aria-hidden="true" />
            </IconButton>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className="fixed inset-0 z-50 md:hidden flex justify-end"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Content */}
          <div
            ref={drawerRef}
            className="relative w-full max-w-xs bg-bg-elevated border-l border-border h-full p-6 flex flex-col justify-between shadow-2xl z-10 overflow-y-auto"
          >
            <div>
              {/* Header inside drawer */}
              <div className="flex items-center justify-between pb-6 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg accent-gradient-bg flex items-center justify-center font-bold text-white text-xs">
                    FR
                  </div>
                  <span className="font-heading font-bold text-text text-base">Fenil Rami</span>
                </div>
                <IconButton
                  ref={closeButtonRef}
                  variant="ghost"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close navigation menu"
                >
                  <LuX className="w-5 h-5 text-text" aria-hidden="true" />
                </IconButton>
              </div>

              {/* Navigation links */}
              <nav className="flex flex-col gap-1 py-6" aria-label="Mobile Navigation Links">
                {NAV_LINKS.map((link) => {
                  const isActive = isHomePage && activeSection === link.id
                  return (
                    <a
                      key={link.id}
                      href={isHomePage ? `#${link.id}` : `/#${link.id}`}
                      onClick={(e) => handleNavClick(link.id, e)}
                      className={`px-4 py-3 rounded-lg text-base font-medium flex items-center justify-between min-h-[44px] ${
                        isActive
                          ? 'bg-accent-1/10 text-accent-1 dark:text-accent-2 font-semibold'
                          : 'text-text-muted hover:text-text hover:bg-surface-2'
                      }`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <span>{link.label}</span>
                      {isActive && (
                        <span className="w-2 h-2 rounded-full bg-accent-1 dark:bg-accent-2" />
                      )}
                    </a>
                  )
                })}
              </nav>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-border flex flex-col gap-3">
              <Button
                to="/resume"
                variant="secondary"
                size="md"
                className="w-full justify-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                View resume
              </Button>
              <Button
                variant="primary"
                size="md"
                className="w-full justify-center"
                onClick={handleHireMeClick}
              >
                Hire me
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
