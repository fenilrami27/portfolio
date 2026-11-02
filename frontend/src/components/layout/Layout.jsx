import React, { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { ScrollProgress } from './ScrollProgress'
import { CompanyBanner } from './CompanyBanner'

export function Layout() {
  const { pathname, hash } = useLocation()

  // Scroll restoration or hash navigation on route change
  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '')
      const element = document.getElementById(id)
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' })
        }, 80)
        return
      }
    }
    window.scrollTo(0, 0)

    // Move focus to main landmark or heading for screen readers
    const mainHeading = document.querySelector('main h1')
    if (mainHeading) {
      mainHeading.setAttribute('tabindex', '-1')
      mainHeading.focus({ preventScroll: true })
    }
  }, [pathname, hash])

  return (
    <div className="min-h-screen flex flex-col bg-bg text-text transition-colors duration-200">
      {/* Accessible skip link */}
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      {/* Progress indicator */}
      <ScrollProgress />

      {/* Personalized Welcome Banner (for=Company&role=Role) */}
      <CompanyBanner />

      {/* Header / Navbar */}
      <Navbar />

      {/* Main Content Landmark */}
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <Outlet />
      </main>

      {/* Footer Landmark */}
      <Footer />
    </div>
  )
}
