import React from 'react'
import { LuShieldCheck, LuGitFork, LuPrinter, LuArrowUpRight, LuSparkles } from 'react-icons/lu'
import { Section } from '../ui/Section'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Counter } from '../ui/Counter'

const FOCUS_ICON_MAP = {
  LuShieldCheck,
  LuGitFork,
  LuPrinter,
}

export function OverviewSection({ profile, projects = [], settings, focusAreas = [], stats = [] }) {
  // Compute months of experience fallback if stats not yet derived
  const metrics = settings?.metricsConfig || {}
  const startDateStr = settings?.experienceStartDate || metrics.experienceStartDate || '2026-06-01'
  let calculatedMonths = metrics.overrideExperienceMonths
  if (!calculatedMonths) {
    const start = new Date(startDateStr)
    const now = new Date()
    calculatedMonths = Math.max(
      1,
      (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth()) + 1
    )
  }

  const publishedProjectsCount = projects.filter((p) => p.isPublished).length
  const printReadyFormsCount = metrics.printReadyFormsCount || 4
  const endpointsDesignedCount = metrics.endpointsDesignedCount || 38

  // Fallback focus areas if API array is empty
  const focusAreasToRender =
    focusAreas && focusAreas.length > 0
      ? focusAreas
      : [
          {
            title: 'Role-based apps',
            description:
              'Admin, Manager, Store Manager, and employee workspaces with strict data isolation and permission controls built right into the schema and UI.',
            iconKey: 'LuShieldCheck',
          },
          {
            title: 'Workflow systems',
            description:
              'End-to-end operational pipelines: order intake, raw material checks, QC/QA verifications, multi-stage production, packaging, dispatch, and billing.',
            iconKey: 'LuGitFork',
          },
          {
            title: 'Print-ready documents',
            description:
              'Digital batch manufacturing records (BMR) and GST tax invoices that mirror physical master templates pixel-for-pixel and print cleanly to paper or PDF.',
            iconKey: 'LuPrinter',
          },
        ]

  // Fallback stats if API array is empty
  const statsToRender =
    stats && stats.length > 0
      ? stats
      : [
          { label: 'Projects showcased', value: publishedProjectsCount, suffix: '' },
          { label: 'Months experience', value: calculatedMonths, suffix: '+' },
          { label: 'Print production forms (BMR)', value: printReadyFormsCount, suffix: '' },
          { label: 'REST endpoints designed', value: endpointsDesignedCount, suffix: '' },
        ]

  return (
    <Section
      id="overview"
      eyebrow="Architecture &amp; Capabilities"
      title="Engineering business software that operates reliably."
      description="I bridge complex real-world workflows with clean relational data models and responsive interfaces."
    >
      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Card 1: What I do (7 cols) */}
        <Card className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-surface/90">
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="font-mono text-xs uppercase tracking-wider text-accent-1 dark:text-accent-2 font-semibold">
                Core Specialization
              </span>
              <Badge variant="accent">Full Stack &amp; Backend</Badge>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-text mb-6">What I do</h3>
            <div className="space-y-5">
              {focusAreasToRender.map((fa, idx) => {
                const IconComp = FOCUS_ICON_MAP[fa.iconKey] || LuShieldCheck
                return (
                  <div key={fa.id || idx} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-surface-2 border border-border flex items-center justify-center shrink-0 mt-0.5 text-accent-1 dark:text-accent-2">
                      <IconComp className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-text mb-1">{fa.title}</h4>
                      <p className="text-sm text-text-muted leading-relaxed">{fa.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </Card>

        {/* Card 2: Numbers Card (5 cols) */}
        <Card className="md:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-surface/90">
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="font-mono text-xs uppercase tracking-wider text-accent-1 dark:text-accent-2 font-semibold">
                Metrics
              </span>
              <LuSparkles className="w-4 h-4 text-accent-2" aria-hidden="true" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-text mb-6">Proven deliverables</h3>

            <div className="grid grid-cols-2 gap-5">
              {statsToRender.map((st, idx) => {
                const targetVal =
                  st.computedValue !== undefined && st.computedValue !== null
                    ? st.computedValue
                    : st.value || 0
                return (
                  <div
                    key={st.id || idx}
                    className="p-4 rounded-xl bg-surface-2/60 border border-border/80"
                  >
                    <div className="text-2xl sm:text-3xl font-bold font-heading text-text mb-1">
                      <Counter target={targetVal} suffix={st.suffix || ''} />
                    </div>
                    <p className="text-xs text-text-muted leading-snug">{st.label}</p>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border/80 flex items-center justify-between text-xs text-text-subtle font-mono">
            <span>SGPA 8.77 / 10</span>
            <span>Gandhinagar University</span>
          </div>
        </Card>

        {/* Card 3: Currently Building (6 cols) */}
        <Card className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between bg-surface/90">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs uppercase tracking-wider text-text-subtle">
                Current Sprint
              </span>
              <Badge variant="warning" showDot={true}>
                {settings?.currentlyBuildingStatus || 'In progress'}
              </Badge>
            </div>
            <h3 className="text-xl font-bold text-text mb-2">
              {settings?.currentlyBuildingTitle || 'HR University Django Backend'}
            </h3>
            <p className="text-sm text-text-muted leading-relaxed mb-4">
              {settings?.currentlyBuildingText ||
                'Building a robust backend with Django 5, Django REST Framework, and PostgreSQL. Spans 11 decoupled apps, 32 relational models, and 38 endpoints supporting dynamic campus admissions, event schedules, and placement statistics.'}
            </p>
          </div>
          <div className="pt-4 border-t border-border/80 flex items-center justify-between">
            <span className="text-xs font-mono text-text-subtle">Django 5 · DRF · PostgreSQL</span>
            <Button
              to="/projects/hr-university"
              variant="ghost"
              size="sm"
              rightIcon={<LuArrowUpRight className="w-4 h-4" aria-hidden="true" />}
              className="text-accent-1 dark:text-accent-2 p-0 hover:bg-transparent"
            >
              Explore project
            </Button>
          </div>
        </Card>

        {/* Card 4: Open to Work (6 cols) */}
        <Card className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between bg-surface/90">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs uppercase tracking-wider text-text-subtle">
                Career Availability
              </span>
              <Badge variant="success" showDot={true}>
                {profile?.availability?.status || 'Open to work'}
              </Badge>
            </div>
            <h3 className="text-xl font-bold text-text mb-2">Ready for immediate impact</h3>
            <p className="text-sm text-text-muted leading-relaxed mb-3">
              Actively seeking full-time roles or internship transitions as a Python Backend
              Developer, Django Developer, or Full Stack Developer based in Ahmedabad or remote.
            </p>
            {profile?.availability?.note && (
              <p className="text-xs text-text-subtle italic mb-4">{profile.availability.note}</p>
            )}
          </div>
          <div className="pt-4 border-t border-border/80 flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                const el = document.getElementById('contact')
                if (el) el.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Get in touch
            </Button>
            <Button to="/resume" variant="secondary" size="sm">
              Review full resume
            </Button>
          </div>
        </Card>
      </div>
    </Section>
  )
}
