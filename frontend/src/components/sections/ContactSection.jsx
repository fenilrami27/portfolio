import React, { useState, useEffect, useRef } from 'react'
import { SiGithub } from 'react-icons/si'
import { FaLinkedin } from 'react-icons/fa6'
import { LuMail, LuSend, LuFileDown, LuCircleCheck, LuCircleAlert } from 'react-icons/lu'
import { Section } from '../ui/Section'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { useContactMutation } from '../../hooks/usePortfolio'

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || ''

export function ContactSection({ profile = {}, settings = {} }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    website_hp: '', // Honeypot
  })

  const [turnstileToken, setTurnstileToken] = useState('')
  const [errors, setErrors] = useState({})
  const [statusMessage, setStatusMessage] = useState(null)
  const turnstileContainerRef = useRef(null)
  const turnstileWidgetIdRef = useRef(null)

  const mutation = useContactMutation()

  // Load and initialize Cloudflare Turnstile if site key is configured
  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return

    let isMounted = true

    const initTurnstile = () => {
      if (window.turnstile && turnstileContainerRef.current && turnstileWidgetIdRef.current === null) {
        try {
          turnstileWidgetIdRef.current = window.turnstile.render(turnstileContainerRef.current, {
            sitekey: TURNSTILE_SITE_KEY,
            callback: (token) => {
              if (isMounted) setTurnstileToken(token)
            },
            'expired-callback': () => {
              if (isMounted) setTurnstileToken('')
            },
            'error-callback': () => {
              if (isMounted) setTurnstileToken('')
            },
            theme: 'auto',
          })
        } catch {
          // Silent fallback if render fails
        }
      }
    }

    if (window.turnstile) {
      initTurnstile()
    } else {
      const existingScript = document.querySelector('script[src*="turnstile"]')
      if (!existingScript) {
        const script = document.createElement('script')
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
        script.async = true
        script.defer = true
        script.onload = initTurnstile
        document.head.appendChild(script)
      }
    }

    return () => {
      isMounted = false
      if (window.turnstile && turnstileWidgetIdRef.current !== null) {
        try {
          window.turnstile.remove(turnstileWidgetIdRef.current)
        } catch {
          // ignore
        }
        turnstileWidgetIdRef.current = null
      }
    }
  }, [])

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your name.'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email address.'
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please enter a message.'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatusMessage(null)

    if (!validate()) {
      return
    }

    try {
      const payload = {
        ...formData,
        turnstile_token: turnstileToken,
        turnstileToken: turnstileToken,
      }
      const res = await mutation.mutateAsync(payload)
      setStatusMessage({ type: 'success', text: res.message || 'Message sent successfully!' })
      setFormData({ name: '', email: '', message: '', website_hp: '' })
      setTurnstileToken('')
      if (window.turnstile && turnstileWidgetIdRef.current !== null) {
        try {
          window.turnstile.reset(turnstileWidgetIdRef.current)
        } catch {
          // ignore
        }
      }
      setErrors({})
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Failed to send message. Please try again or reach out directly by email.',
      })
    }
  }

  const heading = settings?.contactHeading || "Let's build something reliable."
  const description =
    settings?.contactText ||
    'Open to Python Backend and Full Stack roles. The fastest way to reach me is email or LinkedIn.'

  return (
    <Section
      id="contact"
      eyebrow="Get In Touch"
      title={heading}
      description={description}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Direct channels & Quick Action */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <Card className="p-6 sm:p-8 bg-surface/90">
            <h3 className="text-xl font-bold text-text mb-3">Direct channels</h3>
            <p className="text-sm text-text-muted leading-relaxed mb-6">
              Whether you are discussing an open backend role, reviewing my pharmaceutical ERP
              codebase, or planning full-stack development, feel free to connect directly.
            </p>

            <div className="space-y-4">
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-surface-2 border border-border/80 text-text hover:border-accent-1/50 transition-colors group"
                aria-label={`Send email to ${profile.email}`}
              >
                <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center text-accent-1 dark:text-accent-2 group-hover:scale-105 transition-transform">
                  <LuMail className="w-5 h-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs uppercase font-mono text-text-subtle">Email directly</p>
                  <p className="text-sm font-semibold truncate">{profile.email}</p>
                </div>
              </a>

              <a
                href={profile.socials?.find((s) => s.platform === 'LinkedIn')?.url || 'https://www.linkedin.com/in/fenil-rami-67303938a'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3.5 rounded-xl bg-surface-2 border border-border/80 text-text hover:border-accent-1/50 transition-colors group"
                aria-label="Connect with Fenil Rami on LinkedIn"
              >
                <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center text-accent-1 dark:text-accent-2 group-hover:scale-105 transition-transform">
                  <FaLinkedin className="w-5 h-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs uppercase font-mono text-text-subtle">LinkedIn message</p>
                  <p className="text-sm font-semibold truncate">fenil-rami-67303938a</p>
                </div>
              </a>

              <a
                href={profile.socials?.find((s) => s.platform === 'GitHub')?.url || 'https://github.com/fenilrami27'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3.5 rounded-xl bg-surface-2 border border-border/80 text-text hover:border-accent-1/50 transition-colors group"
                aria-label="Inspect Fenil Rami's GitHub code"
              >
                <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center text-accent-1 dark:text-accent-2 group-hover:scale-105 transition-transform">
                  <SiGithub className="w-5 h-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs uppercase font-mono text-text-subtle">GitHub repositories</p>
                  <p className="text-sm font-semibold truncate">fenilrami27</p>
                </div>
              </a>
            </div>

            <div className="mt-8 pt-6 border-t border-border flex flex-col gap-3">
              <Button
                to="/resume"
                variant="secondary"
                size="md"
                leftIcon={<LuFileDown className="w-4 h-4" aria-hidden="true" />}
                className="w-full justify-center"
              >
                Download printable resume
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-7">
          <Card className="p-6 sm:p-8 bg-surface/90">
            <h3 className="text-xl font-bold text-text mb-2">Send a message</h3>
            <p className="text-sm text-text-muted mb-6">
              Fill in your inquiry details below. I usually respond within 24 hours.
            </p>

            {/* Aria-live feedback box */}
            <div aria-live="polite" className="mb-5">
              {statusMessage && (
                <div
                  className={`p-4 rounded-xl flex items-start gap-3 border ${
                    statusMessage.type === 'success'
                      ? 'bg-success/10 border-success/30 text-success'
                      : 'bg-danger/10 border-danger/30 text-danger'
                  }`}
                  role="status"
                >
                  {statusMessage.type === 'success' ? (
                    <LuCircleCheck className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
                  ) : (
                    <LuCircleAlert className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
                  )}
                  <p className="text-sm font-medium">{statusMessage.text}</p>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Hidden honeypot field for bot suppression */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website_hp">Website</label>
                <input
                  type="text"
                  id="website_hp"
                  name="website_hp"
                  value={formData.website_hp}
                  onChange={handleChange}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {/* Name */}
              <div>
                <label
                  htmlFor="contact-name"
                  className="block text-xs uppercase font-mono tracking-wider text-text mb-2"
                >
                  Your Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="contact-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'contact-name-error' : undefined}
                  required
                  placeholder="e.g. Alex Morgan"
                  className={`w-full px-4 py-3 rounded-xl bg-surface-2 border text-text placeholder:text-text-subtle transition-colors focus-visible:outline-none min-h-[44px] ${
                    errors.name ? 'border-danger focus-visible:ring-danger' : 'border-border'
                  }`}
                />
                {errors.name && (
                  <p id="contact-name-error" className="mt-1.5 text-xs text-danger font-medium">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-xs uppercase font-mono tracking-wider text-text mb-2"
                >
                  Email Address <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  id="contact-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'contact-email-error' : undefined}
                  required
                  placeholder="name@company.com"
                  className={`w-full px-4 py-3 rounded-xl bg-surface-2 border text-text placeholder:text-text-subtle transition-colors focus-visible:outline-none min-h-[44px] ${
                    errors.email ? 'border-danger focus-visible:ring-danger' : 'border-border'
                  }`}
                />
                {errors.email && (
                  <p id="contact-email-error" className="mt-1.5 text-xs text-danger font-medium">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-xs uppercase font-mono tracking-wider text-text mb-2"
                >
                  Message <span className="text-danger">*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? 'contact-message-error' : undefined}
                  required
                  placeholder="Share details about your team, role requirements, or project..."
                  className={`w-full px-4 py-3 rounded-xl bg-surface-2 border text-text placeholder:text-text-subtle transition-colors focus-visible:outline-none resize-y min-h-[120px] ${
                    errors.message ? 'border-danger focus-visible:ring-danger' : 'border-border'
                  }`}
                />
                {errors.message && (
                  <p id="contact-message-error" className="mt-1.5 text-xs text-danger font-medium">
                    {errors.message}
                  </p>
                )}
              </div>

              {/* Turnstile Widget (rendered when TURNSTILE_SITE_KEY is configured) */}
              {TURNSTILE_SITE_KEY && (
                <div className="pt-2">
                  <div ref={turnstileContainerRef} className="cf-turnstile min-h-[65px]" />
                </div>
              )}

              {/* Submit CTA */}
              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={mutation.isPending}
                  rightIcon={<LuSend className="w-4 h-4" aria-hidden="true" />}
                  className="w-full sm:w-auto"
                >
                  Send message
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </Section>
  )
}
