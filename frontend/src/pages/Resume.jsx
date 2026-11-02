import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { LuPrinter, LuDownload, LuArrowLeft, LuMail, LuMapPin } from 'react-icons/lu'
import { SiGithub } from 'react-icons/si'
import { FaLinkedin } from 'react-icons/fa6'
import {
  useProfile,
  useExperience,
  useEducation,
  useSkills,
  useProjects,
  useLeadership,
} from '../hooks/usePortfolio'
import { Container } from '../components/ui/Container'
import { Button } from '../components/ui/Button'
import { Skeleton } from '../components/ui/Skeleton'

export default function Resume() {
  const { data: profile, isLoading: isProfileLoading } = useProfile()
  const { data: experience = [] } = useExperience()
  const { data: education = [] } = useEducation()
  const { data: skills = [] } = useSkills()
  const { data: projects = [] } = useProjects()
  const { data: leadership = [] } = useLeadership()

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

  return (
    <>
      <Helmet>
        <title>Resume - Fenil Rami</title>
        <meta
          name="description"
          content="Printable resume of Fenil Rami, Python Backend & Full Stack Developer (Django, React, PostgreSQL)."
        />
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
              href={profile?.resumeUrl || '/Fenil_Rami_Resume.pdf'}
              download="Fenil_Rami_Resume.pdf"
              variant="primary"
              size="sm"
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
            <header className="border-b border-border pb-8 mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold font-heading text-text tracking-tight mb-2">
                {profile?.name}
              </h1>
              <p className="text-base sm:text-lg font-medium text-accent-1 dark:text-accent-2 mb-4">
                {profile?.headline}
              </p>

              {/* Contact meta strip - strictly NO phone number */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-text-muted">
                <span className="flex items-center gap-1.5">
                  <LuMapPin className="w-3.5 h-3.5 text-text-subtle" aria-hidden="true" />
                  {profile?.location}
                </span>
                <a
                  href={`mailto:${profile?.email}`}
                  className="flex items-center gap-1.5 hover:text-text transition-colors"
                >
                  <LuMail className="w-3.5 h-3.5 text-text-subtle" aria-hidden="true" />
                  {profile?.email}
                </a>
                <a
                  href="https://www.linkedin.com/in/fenil-rami-67303938a"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-text transition-colors"
                >
                  <FaLinkedin className="w-3.5 h-3.5 text-text-subtle" aria-hidden="true" />
                  linkedin.com/in/fenil-rami-67303938a
                </a>
                <a
                  href="https://github.com/fenilrami27"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-text transition-colors"
                >
                  <SiGithub className="w-3.5 h-3.5 text-text-subtle" aria-hidden="true" />
                  github.com/fenilrami27
                </a>
              </div>
            </header>

            {/* Profile Summary */}
            <section className="resume-section-item mb-8">
              <h2 className="text-xs uppercase font-mono font-bold tracking-widest text-text-subtle mb-3">
                Professional Summary
              </h2>
              <p className="text-sm leading-relaxed text-text-muted">
                {profile?.about}
              </p>
            </section>

            {/* Experience */}
            <section className="resume-section-item mb-8">
              <h2 className="text-xs uppercase font-mono font-bold tracking-widest text-text-subtle mb-4">
                Work Experience
              </h2>
              <div className="space-y-6">
                {experience.map((exp, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <h3 className="text-base font-bold text-text">
                        {exp.role} <span className="font-normal text-text-muted">· {exp.company}</span>
                      </h3>
                      <span className="font-mono text-xs text-text-subtle">
                        {exp.start} — {exp.end} | {exp.location}
                      </span>
                    </div>
                    <ul className="list-disc list-outside pl-4 space-y-1.5 text-sm text-text-muted">
                      {exp.bullets?.map((b, bIdx) => (
                        <li key={bIdx} className="leading-relaxed">
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Key Projects */}
            <section className="resume-section-item mb-8">
              <h2 className="text-xs uppercase font-mono font-bold tracking-widest text-text-subtle mb-4">
                Key Technical Projects
              </h2>
              <div className="space-y-5">
                {projects.map((proj) => (
                  <div key={proj.slug} className="space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <h3 className="text-sm font-bold text-text">
                        {proj.title}{' '}
                        <span className="font-normal text-xs text-text-subtle font-mono">
                          ({proj.stack?.join(', ')})
                        </span>
                      </h3>
                      <span className="font-mono text-xs text-accent-1 dark:text-accent-2 font-medium">
                        {proj.type}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                      {proj.oneLiner}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Technical Skills */}
            <section className="resume-section-item mb-8">
              <h2 className="text-xs uppercase font-mono font-bold tracking-widest text-text-subtle mb-3">
                Technical Skills
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {skills.map((grp) => (
                  <div key={grp.group} className="space-y-1">
                    <span className="font-semibold text-text text-xs uppercase font-mono">
                      {grp.group}:{' '}
                    </span>
                    <span className="text-text-muted text-xs">
                      {grp.items?.map((item) => item.name).join(', ')}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Education */}
            <section className="resume-section-item mb-8">
              <h2 className="text-xs uppercase font-mono font-bold tracking-widest text-text-subtle mb-3">
                Education
              </h2>
              {education.map((edu, idx) => (
                <div key={idx} className="flex flex-wrap items-baseline justify-between gap-1">
                  <div>
                    <h3 className="text-sm font-bold text-text">{edu.degree}</h3>
                    <p className="text-xs text-text-muted">{edu.institution}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-xs font-semibold text-text">{edu.grade}</p>
                    <p className="font-mono text-xs text-text-subtle">
                      {edu.start} — {edu.end}
                    </p>
                  </div>
                </div>
              ))}
            </section>

            {/* Leadership & Activities */}
            <section className="resume-section-item">
              <h2 className="text-xs uppercase font-mono font-bold tracking-widest text-text-subtle mb-3">
                Leadership &amp; Campus Activities
              </h2>
              <div className="space-y-3">
                {leadership.map((item, idx) => (
                  <div key={idx} className="text-xs sm:text-sm text-text-muted leading-relaxed">
                    <span className="font-bold text-text">{item.title}</span>, {item.organization}:{' '}
                    <span>{item.description}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </Container>
      </div>
    </>
  )
}
