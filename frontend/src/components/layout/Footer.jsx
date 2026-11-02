import React from 'react'
import { Link } from 'react-router-dom'
import { LuArrowUp } from 'react-icons/lu'
import { SiGithub } from 'react-icons/si'
import { FaLinkedin } from 'react-icons/fa6'
import { LuMail } from 'react-icons/lu'
import { Container } from '../ui/Container'
import { IconButton } from '../ui/IconButton'

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-bg-elevated/60 transition-colors duration-200">
      <Container className="py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand col */}
          <div className="md:col-span-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 mb-4 group"
              onClick={scrollToTop}
            >
              <div className="w-8 h-8 rounded-lg accent-gradient-bg flex items-center justify-center font-bold text-white text-xs">
                FR
              </div>
              <span className="font-heading font-bold text-lg text-text">Fenil Rami</span>
            </Link>
            <p className="text-sm text-text-muted max-w-md leading-relaxed mb-6">
              Python Backend &amp; Full Stack Developer specializing in role-based business web
              applications with Django and React. Focused on clean database models, robust REST
              APIs, and crisp user interfaces.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-3">
              <IconButton
                href="https://github.com/fenilrami27"
                aria-label="GitHub profile of Fenil Rami"
                variant="secondary"
                size="sm"
              >
                <SiGithub className="w-4 h-4 text-text" aria-hidden="true" />
              </IconButton>
              <IconButton
                href="https://www.linkedin.com/in/fenil-rami-67303938a"
                aria-label="LinkedIn profile of Fenil Rami"
                variant="secondary"
                size="sm"
              >
                <FaLinkedin className="w-4 h-4 text-text" aria-hidden="true" />
              </IconButton>
              <IconButton
                href="mailto:fenilrami1266@gmail.com"
                aria-label="Send email to Fenil Rami"
                variant="secondary"
                size="sm"
              >
                <LuMail className="w-4 h-4 text-text" aria-hidden="true" />
              </IconButton>
            </div>
          </div>

          {/* Nav links */}
          <div>
            <h3 className="font-heading text-sm font-semibold text-text uppercase tracking-wider mb-4">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm text-text-muted">
              <li>
                <a href="/#overview" className="hover:text-text transition-colors">
                  Overview
                </a>
              </li>
              <li>
                <a href="/#work" className="hover:text-text transition-colors">
                  Featured Work
                </a>
              </li>
              <li>
                <Link to="/projects" className="hover:text-text transition-colors">
                  All Projects
                </Link>
              </li>
              <li>
                <a href="/#skills" className="hover:text-text transition-colors">
                  Skills &amp; Tech
                </a>
              </li>
              <li>
                <a href="/#journey" className="hover:text-text transition-colors">
                  Journey
                </a>
              </li>
              <li>
                <Link to="/resume" className="hover:text-text transition-colors">
                  Resume
                </Link>
              </li>
            </ul>
          </div>

          {/* Direct contact */}
          <div>
            <h3 className="font-heading text-sm font-semibold text-text uppercase tracking-wider mb-4">
              Location &amp; Contact
            </h3>
            <div className="space-y-2.5 text-sm text-text-muted">
              <p>Ahmedabad, Gujarat, India</p>
              <p>
                <a
                  href="mailto:fenilrami1266@gmail.com"
                  className="text-text hover:text-accent-1 dark:hover:text-accent-2 transition-colors break-all"
                >
                  fenilrami1266@gmail.com
                </a>
              </p>
              <p className="text-xs text-text-subtle pt-2">
                Available for Python Backend and Full Stack developer opportunities.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-subtle">
          <p>© {currentYear} Fenil Rami. Designed &amp; developed with React &amp; Django architecture.</p>
          <div className="flex items-center gap-4">
            <span>Ahmedabad · Open to work</span>
            <button
              id="back-to-top"
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-text-muted hover:text-text transition-colors p-2 -mr-2 min-h-[44px]"
              aria-label="Back to top of page"
            >
              <span>Back to top</span>
              <LuArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </Container>
    </footer>
  )
}
