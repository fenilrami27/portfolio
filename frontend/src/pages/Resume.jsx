import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { LuPrinter, LuDownload, LuArrowLeft } from 'react-icons/lu'
import {
  useProfile,
  useExperience,
  useEducation,
} from '../hooks/usePortfolio'
import { Container } from '../components/ui/Container'
import { Button } from '../components/ui/Button'
import { Skeleton } from '../components/ui/Skeleton'
import { trackEvent } from '../lib/analytics'

export default function Resume() {
  const { data: profile, isLoading: isProfileLoading } = useProfile()
  const { data: experience = [] } = useExperience()
  const { data: education = [] } = useEducation()

  const handlePrint = () => {
    window.print()
  }

  if (isProfileLoading) {
    return (
      <Container className="py-16 space-y-6">
        <Skeleton className="h-10 w-48 rounded-lg" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </Container>
    )
  }

  const primaryExp = experience[0] || {}
  const primaryEdu = education[0] || {}

  return (
    <>
      <Helmet>
        <title>Resume - Fenil Rami</title>
        <meta
          name="description"
          content="Professional resume of Fenil Rami, Python Backend and Full Stack Developer (Django, React, PostgreSQL)."
        />
        <link rel="canonical" href="https://fenilrami.com/resume" />
        <meta property="og:title" content="Resume - Fenil Rami" />
        <meta
          property="og:description"
          content="Professional resume of Fenil Rami, Python Backend and Full Stack Developer (Django, React, PostgreSQL)."
        />
        <meta property="og:url" content="https://fenilrami.com/resume" />
        <meta property="og:image" content="https://fenilrami.com/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Resume - Fenil Rami" />
        <meta
          name="twitter:description"
          content="Professional resume of Fenil Rami, Python Backend and Full Stack Developer (Django, React, PostgreSQL)."
        />
        <meta name="twitter:image" content="https://fenilrami.com/og-image.png" />
      </Helmet>

      {/* Screen toolbar (hidden in print) */}
      <section className="no-print py-6 border-b border-border/80 bg-surface/40">
        <Container className="flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-text-muted hover:text-text transition-colors"
          >
            <LuArrowLeft className="w-4 h-4" aria-hidden="true" />
            Back to home
          </Link>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={handlePrint}
              leftIcon={<LuPrinter className="w-4 h-4" aria-hidden="true" />}
              aria-label="Print resume document"
            >
              Print resume
            </Button>

            <Button
              href={profile?.resumeUrl || '/api/v1/resume/'}
              download="Fenil_Rami_Resume.pdf"
              variant="primary"
              size="sm"
              onClick={() => trackEvent('resume_download', { location: 'resume_page' })}
              leftIcon={<LuDownload className="w-4 h-4" aria-hidden="true" />}
              aria-label="Download resume PDF"
            >
              Download PDF
            </Button>
          </div>
        </Container>
      </section>

      {/* Resume Document Sheet */}
      <div className="py-10 md:py-16 bg-bg-elevated/40">
        <Container className="max-w-4xl">
          <div className="resume-sheet rounded-card bg-surface border border-border p-8 sm:p-12 md:p-14 shadow-lg text-text">
            {/* Header */}
            <header className="border-b border-border/80 pb-5 mb-6">
              <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-text tracking-tight uppercase">
                {profile?.name || 'FENIL RAMI'}
              </h1>
              <p className="text-xs sm:text-sm font-semibold tracking-wider text-accent-1 dark:text-accent-2 uppercase mt-1 mb-3">
                {profile?.headline || 'PYTHON BACKEND & FULL STACK DEVELOPER'}
              </p>

              {/* Contact meta strip with pipes */}
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-text-muted font-normal">
                <span>{profile?.location || 'Ahmedabad, Gujarat'}</span>
                <span className="text-border" aria-hidden="true">|</span>
                <a
                  href={`mailto:${profile?.email || 'fenilrami1266@gmail.com'}`}
                  className="hover:text-text hover:underline transition-colors"
                >
                  {profile?.email || 'fenilrami1266@gmail.com'}
                </a>
                {(profile?.phone || profile?.showPhone) && (
                  <>
                    <span className="text-border" aria-hidden="true">|</span>
                    <a
                      href={`tel:${profile?.phone || '9978643380'}`}
                      className="hover:text-text hover:underline transition-colors"
                    >
                      {profile?.phone || '9978643380'}
                    </a>
                  </>
                )}
                <span className="text-border" aria-hidden="true">|</span>
                <a
                  href="https://www.linkedin.com/in/fenil-rami-67303938a"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-text hover:underline transition-colors"
                >
                  LinkedIn
                </a>
                <span className="text-border" aria-hidden="true">|</span>
                <a
                  href="https://github.com/fenilrami27"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-text hover:underline transition-colors"
                >
                  GitHub
                </a>
              </div>
            </header>

            {/* Two-Column Grid Body matching real resume layout */}
            <div className="resume-grid flex flex-col md:flex-row gap-8 items-start">
              {/* LEFT COLUMN: Education, Technical Skills, Leadership */}
              <div className="resume-left-col w-full md:w-[32%] shrink-0 space-y-6">
                {/* 1. Education */}
                <section className="resume-section-item">
                  <h2 className="text-xs uppercase font-bold tracking-wider text-text border-b border-border/80 pb-1 mb-2.5">
                    EDUCATION
                  </h2>
                  <div className="space-y-1 text-xs">
                    <p className="font-bold text-text leading-snug">
                      {primaryEdu.degree || 'Bachelor of Information Technology'}
                    </p>
                    <p className="text-text-muted">
                      {primaryEdu.institution || 'Gandhinagar University'}
                    </p>
                    <p className="text-text-subtle text-[11px]">
                      {primaryEdu.start && primaryEdu.end
                        ? `${primaryEdu.start} – ${primaryEdu.end}`
                        : '2023 – 2027'}
                    </p>
                    <p className="text-text font-medium text-[11.5px] pt-1">
                      {primaryEdu.grade || 'Latest SGPA: 8.77 / 10 (Semester 6)'}
                    </p>
                  </div>
                </section>

                {/* 2. Technical Skills */}
                <section className="resume-section-item">
                  <h2 className="text-xs uppercase font-bold tracking-wider text-text border-b border-border/80 pb-1 mb-2.5">
                    TECHNICAL SKILLS
                  </h2>
                  <div className="space-y-3 text-xs">
                    <div>
                      <p className="font-bold text-text mb-0.5">Programming</p>
                      <p className="text-text-muted leading-relaxed">Python, JavaScript</p>
                    </div>
                    <div>
                      <p className="font-bold text-text mb-0.5">Backend</p>
                      <p className="text-text-muted leading-relaxed">
                        Django, Django REST Framework, REST API Development, Authentication, CRUD
                      </p>
                    </div>
                    <div>
                      <p className="font-bold text-text mb-0.5">Frontend</p>
                      <p className="text-text-muted leading-relaxed">React.js, Redux, HTML5, CSS3</p>
                    </div>
                    <div>
                      <p className="font-bold text-text mb-0.5">Databases</p>
                      <p className="text-text-muted leading-relaxed">PostgreSQL, SQLite</p>
                    </div>
                    <div>
                      <p className="font-bold text-text mb-0.5">Development</p>
                      <p className="text-text-muted leading-relaxed">
                        Role-Based Access Control (RBAC), API Integration, Database Management
                      </p>
                    </div>
                  </div>
                </section>

                {/* 3. Leadership & Extracurricular Experience */}
                <section className="resume-section-item">
                  <h2 className="text-xs uppercase font-bold tracking-wider text-text border-b border-border/80 pb-1 mb-2.5">
                    LEADERSHIP &amp; EXTRACURRICULAR EXPERIENCE
                  </h2>
                  <div className="space-y-4 text-xs">
                    <div>
                      <p className="font-bold text-text">Cultural Head</p>
                      <p className="text-text-muted text-[11.5px] mb-1">Gandhinagar University</p>
                      <ul className="list-disc list-outside pl-3.5 space-y-1 text-text-muted text-[11px] leading-relaxed">
                        <li>
                          Led university cultural events, coordinated student teams, delegated
                          responsibilities and worked with faculty and external vendors on budgets and
                          schedules.
                        </li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-bold text-text">Arena Coordinator</p>
                      <p className="text-text-muted text-[11.5px] mb-1">University Tech Fest</p>
                      <ul className="list-disc list-outside pl-3.5 space-y-1 text-text-muted text-[11px] leading-relaxed">
                        <li>
                          Coordinated arena activities, participant scheduling and on-ground
                          operations with the organizing team.
                        </li>
                      </ul>
                    </div>
                  </div>
                </section>
              </div>

              {/* RIGHT COLUMN: Professional Summary, Experience, Selected Projects */}
              <div className="resume-right-col w-full md:w-[68%] space-y-6">
                {/* 1. Professional Summary */}
                <section className="resume-section-item">
                  <h2 className="text-xs uppercase font-bold tracking-wider text-text border-b border-border/80 pb-1 mb-2.5">
                    PROFESSIONAL SUMMARY
                  </h2>
                  <p className="text-xs text-text-muted leading-relaxed">
                    {profile?.about ||
                      profile?.statement ||
                      'Information Technology undergraduate and Python Developer Intern with hands-on experience building business web applications using Python, Django and React. Independently developed the frontend of a multi-company pharmaceutical ERP project and currently contributing to Django backend development for a university website. Familiar with REST APIs, role-based application workflows, database-driven features and collaborative software development. Seeking Python Backend / Full Stack Developer opportunities.'}
                  </p>
                </section>

                {/* 2. Experience */}
                <section className="resume-section-item">
                  <h2 className="text-xs uppercase font-bold tracking-wider text-text border-b border-border/80 pb-1 mb-2.5">
                    EXPERIENCE
                  </h2>
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-bold text-xs sm:text-sm text-text">
                        {primaryExp.role || 'Python Developer Intern'}
                      </h3>
                      <span className="text-text-subtle text-[11.5px] font-medium">
                        {primaryExp.start && primaryExp.end
                          ? `${primaryExp.start} – ${primaryExp.end}`
                          : 'Jun 2026 – Present'}
                      </span>
                    </div>
                    <p className="text-text-muted text-xs">
                      {primaryExp.company || 'Vibe Tech Labs'}, {primaryExp.location || 'Ahmedabad, Gujarat'}
                    </p>
                    <ul className="list-disc list-outside pl-4 space-y-1.5 text-xs text-text-muted leading-relaxed pt-1">
                      {primaryExp.bullets && primaryExp.bullets.length > 0 ? (
                        primaryExp.bullets.map((bullet, idx) => <li key={idx}>{bullet}</li>)
                      ) : (
                        <>
                          <li>
                            Developing business web applications using Python and Django, with
                            hands-on work across backend functionality and frontend integration.
                          </li>
                          <li>
                            Independently built the complete React frontend for CMHP, a
                            pharmaceutical ERP project; the project is currently in development and has
                            not yet been handed over.
                          </li>
                          <li>
                            Working on the Django backend for an ongoing university website project,
                            contributing to full-stack application development.
                          </li>
                          <li>
                            Worked with authentication, role-based access control, CRUD workflows,
                            database models and REST API integration.
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                </section>

                {/* 3. Selected Projects */}
                <section className="resume-section-item">
                  <h2 className="text-xs uppercase font-bold tracking-wider text-text border-b border-border/80 pb-1 mb-2.5">
                    SELECTED PROJECTS
                  </h2>
                  <div className="space-y-4">
                    {/* Project 1: CMHP */}
                    <div>
                      <h3 className="font-bold text-xs sm:text-sm text-text">
                        CMHP – Pharmaceutical ERP System
                      </h3>
                      <p className="text-text-subtle text-[11px] mb-1 font-mono">
                        React, Redux, JavaScript, HTML5, CSS3
                      </p>
                      <ul className="list-disc list-outside pl-4 space-y-1 text-xs text-text-muted leading-relaxed">
                        <li>
                          Independently developed the complete frontend for a pharmaceutical ERP
                          supporting two companies and a shared Common Inventory.
                        </li>
                        <li>
                          Built company-wise interfaces and role-based modules covering HRMS, orders,
                          inventory and stock ledger, production (BMR), QC/QA approval and invoicing.
                        </li>
                      </ul>
                    </div>

                    {/* Project 2: HR University */}
                    <div>
                      <h3 className="font-bold text-xs sm:text-sm text-text">
                        HR University – University Website
                      </h3>
                      <p className="text-text-subtle text-[11px] mb-1 font-mono">
                        React, JavaScript, Django, HTML5, CSS3
                      </p>
                      <ul className="list-disc list-outside pl-4 space-y-1 text-xs text-text-muted leading-relaxed">
                        <li>
                          Developing a university website covering admissions, events, placements and
                          department sections, with Django backend development in progress.
                        </li>
                        <li>
                          Designed interactive frontend experiences including an animated
                          introduction, live counters, hero video, hover effects and enquiry/admission
                          popup.
                        </li>
                      </ul>
                    </div>

                    {/* Project 3: Interior Design Studio */}
                    <div>
                      <h3 className="font-bold text-xs sm:text-sm text-text">
                        Interior Design Studio – Website
                      </h3>
                      <p className="text-text-subtle text-[11px] mb-1 font-mono">
                        Python, Django, HTML5, CSS3
                      </p>
                      <ul className="list-disc list-outside pl-4 space-y-1 text-xs text-text-muted leading-relaxed">
                        <li>
                          Built a website with product and project pages, login/signup, OTP-based
                          password reset and an admin-managed gallery.
                        </li>
                      </ul>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  )
}
