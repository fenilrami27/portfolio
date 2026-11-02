import React from 'react'
import { LuGraduationCap, LuBriefcase, LuCode, LuRocket } from 'react-icons/lu'
import { Section } from '../ui/Section'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'

export function JourneySection({ experience = [], education = [] }) {
  const edu = education[0] || {}
  const exp = experience[0] || {}

  const timelineItems = [
    {
      period: '2023 - 2027',
      type: 'Education',
      title: edu.degree || 'Bachelor of Information Technology',
      organization: edu.institution || 'Gandhinagar University',
      icon: <LuGraduationCap className="w-5 h-5 text-accent-1 dark:text-accent-2" />,
      badge: <Badge variant="accent">Academic Foundation</Badge>,
      content: (
        <div className="space-y-2 text-sm text-text-muted">
          <p>
            Enrolled in Bachelor of Information Technology, establishing fundamental knowledge
            in software engineering, data structures, algorithms, and database management.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-2 border border-border text-xs font-mono font-semibold text-text">
            <span>{edu.grade || 'Latest SGPA: 8.77 / 10 (Semester 6)'}</span>
          </div>
        </div>
      ),
    },
    {
      period: 'Project Milestone',
      type: 'Project',
      title: 'Interior Design Studio',
      organization: 'Learning Project (Django)',
      icon: <LuCode className="w-5 h-5 text-accent-1 dark:text-accent-2" />,
      badge: <Badge variant="default">Django Project</Badge>,
      content: (
        <div className="text-sm text-text-muted space-y-2">
          <p>
            Developed a Django website with product and project showcase pages, user
            authentication, session handling, OTP-verified password recovery, and an
            admin-managed dynamic gallery.
          </p>
          <p className="text-xs text-text-subtle italic">
            Built as a learning replica of a commercial website with sample data.
          </p>
        </div>
      ),
    },
    {
      period: `${exp.start || 'Jun 2026'} - ${exp.end || 'Present'}`,
      type: 'Experience',
      title: exp.role || 'Python Developer Intern',
      organization: exp.company || 'Vibe Tech Labs',
      location: exp.location || 'Ahmedabad',
      icon: <LuBriefcase className="w-5 h-5 text-accent-1 dark:text-accent-2" />,
      badge: <Badge variant="success" showDot={true}>Active Internship</Badge>,
      content: (
        <div className="text-sm text-text-muted space-y-3">
          <ul className="space-y-2 list-disc list-outside pl-4 marker:text-accent-1 dark:marker:text-accent-2">
            {exp.bullets?.map((bullet, idx) => (
              <li key={idx} className="leading-relaxed">
                {bullet}
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      period: 'Project Milestone',
      type: 'Project',
      title: 'CMHP Pharma ERP Frontend',
      organization: 'Independent Build · Vibe Tech Labs',
      icon: <LuCode className="w-5 h-5 text-accent-1 dark:text-accent-2" />,
      badge: <Badge variant="accent">Enterprise Frontend</Badge>,
      content: (
        <div className="text-sm text-text-muted space-y-2">
          <p>
            Independently built the entire React frontend for a two-company pharmaceutical ERP
            (CMHP Pharma &amp; Tej Biocare), spanning workspaces, HRMS, multi-role orders, stock
            ledgers, BMR digital batch manufacturing records, QC/QA, and GST invoicing.
          </p>
        </div>
      ),
    },
    {
      period: 'Project Milestone',
      type: 'Project',
      title: 'HR University Portal',
      organization: 'University Platform',
      icon: <LuCode className="w-5 h-5 text-accent-1 dark:text-accent-2" />,
      badge: <Badge variant="warning">In Progress</Badge>,
      content: (
        <div className="text-sm text-text-muted space-y-2">
          <p>
            Constructed the interactive frontend with an animated intro, live counters, event
            directories, placement metrics, and admission workflows.
          </p>
        </div>
      ),
    },
    {
      period: 'Now',
      type: 'Milestone',
      title: 'HR University Django Backend',
      organization: 'Django 5 · DRF · PostgreSQL',
      icon: <LuRocket className="w-5 h-5 text-accent-1 dark:text-accent-2" />,
      badge: <Badge variant="warning" showDot={true}>Active Development</Badge>,
      content: (
        <div className="text-sm text-text-muted space-y-2">
          <p>
            Architecting and implementing the Django 5 backend with Django REST Framework and
            PostgreSQL: 11 decoupled apps, 32 models, and 38 REST API endpoints for complete
            university data management.
          </p>
        </div>
      ),
    },
  ]

  return (
    <Section
      id="journey"
      eyebrow="Chronology"
      title="Education &amp; engineering journey."
      description="A progression of hands-on software development, real enterprise applications, and academic rigour."
    >
      <div className="relative max-w-4xl mx-auto">
        {/* Central timeline line: left-aligned on mobile, centered on desktop */}
        <div
          className="absolute top-4 bottom-4 left-5 md:left-1/2 -translate-x-1/2 w-0.5 bg-border/80"
          aria-hidden="true"
        />

        <div className="space-y-8 md:space-y-12">
          {timelineItems.map((item, idx) => {
            const isEven = idx % 2 === 0
            return (
              <div
                key={idx}
                className="relative flex flex-col md:flex-row items-start md:items-center"
              >
                {/* Timeline node icon */}
                <div
                  className="absolute left-5 md:left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-surface border-2 border-accent-1 dark:border-accent-2 flex items-center justify-center shadow-md z-10"
                  aria-hidden="true"
                >
                  {item.icon}
                </div>

                {/* Content Card with alternating columns on desktop */}
                <div
                  className={`w-full pl-14 md:pl-0 md:w-1/2 ${
                    isEven ? 'md:pr-10 md:text-left' : 'md:ml-auto md:pl-10 md:text-left'
                  }`}
                >
                  <Card className="p-6 bg-surface/90">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <span className="font-mono text-xs font-semibold text-accent-1 dark:text-accent-2 uppercase">
                        {item.period}
                      </span>
                      {item.badge}
                    </div>

                    <h3 className="font-heading text-lg font-bold text-text mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs font-medium text-text-subtle mb-4">
                      {item.organization}
                      {item.location ? ` · ${item.location}` : ''}
                    </p>

                    {item.content}
                  </Card>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Section>
  )
}
