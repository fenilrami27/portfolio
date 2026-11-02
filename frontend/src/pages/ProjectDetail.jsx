import React, { useMemo } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  LuArrowLeft,
  LuArrowRight,
  LuImage,
  LuExternalLink,
  LuInfo,
  LuUser,
  LuLayers,
} from 'react-icons/lu'
import { SiGithub } from 'react-icons/si'
import { useProject, useProjects } from '../hooks/usePortfolio'
import { Container } from '../components/ui/Container'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Chip } from '../components/ui/Chip'
import { Button } from '../components/ui/Button'
import { Skeleton } from '../components/ui/Skeleton'
import { TechIcon } from '../components/ui/TechIcon'

export default function ProjectDetail() {
  const { slug } = useParams()
  const { data: project, isLoading, error } = useProject(slug)
  const { data: allProjects = [] } = useProjects()

  // Calculate Previous and Next project links
  const { prevProject, nextProject } = useMemo(() => {
    if (!allProjects.length || !project) return { prevProject: null, nextProject: null }
    const currentIndex = allProjects.findIndex((p) => p.slug === project.slug)
    if (currentIndex === -1) return { prevProject: null, nextProject: null }

    const prev = currentIndex > 0 ? allProjects[currentIndex - 1] : null
    const next = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null
    return { prevProject: prev, nextProject: next }
  }, [allProjects, project])

  if (isLoading) {
    return (
      <Container className="py-20 space-y-8">
        <Skeleton className="h-6 w-48 rounded-lg" />
        <Skeleton className="h-16 w-3/4 rounded-xl" />
        <Skeleton className="h-6 w-1/2 rounded-lg" />
        <Skeleton className="h-72 w-full rounded-2xl" />
      </Container>
    )
  }

  // Handle 404
  if (error || !project) {
    return <Navigate to="/404" replace />
  }

  const getStatusVariant = (status) => {
    if (!status) return 'default'
    const s = status.toLowerCase()
    if (s.includes('complete') || s.includes('hand')) return 'success'
    if (s.includes('progress') || s.includes('dev')) return 'warning'
    return 'default'
  }

    const ogImageUrl = `https://fenilrami.com/og-${project.slug}.png`
    const pageUrl = `https://fenilrami.com/projects/${project.slug}`
    const pageTitle = `${project.title} - Fenil Rami`
    const truncatedDesc = project.oneLiner ? project.oneLiner.slice(0, 150) : ''

    const projectSchema = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: project.title,
      description: project.oneLiner,
      applicationCategory: project.type,
      operatingSystem: 'Web',
      author: {
        '@type': 'Person',
        name: 'Fenil Rami',
        url: 'https://fenilrami.com/',
      },
    }

    return (
      <>
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={truncatedDesc} />
          <link rel="canonical" href={pageUrl} />
          <meta property="og:title" content={pageTitle} />
          <meta property="og:description" content={truncatedDesc} />
          <meta property="og:url" content={pageUrl} />
          <meta property="og:image" content={ogImageUrl} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={pageTitle} />
          <meta name="twitter:description" content={truncatedDesc} />
          <meta name="twitter:image" content={ogImageUrl} />
          <script type="application/ld+json">{JSON.stringify(projectSchema)}</script>
        </Helmet>

      {/* Breadcrumb & Navigation Back */}
      <section className="pt-8 pb-4 border-b border-border/60 bg-surface/20">
        <Container>
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-text-subtle mb-4">
            <Link to="/" className="hover:text-text transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/projects" className="hover:text-text transition-colors">
              Projects
            </Link>
            <span>/</span>
            <span className="text-text font-medium truncate max-w-xs">{project.title}</span>
          </nav>
        </Container>
      </section>

      {/* Project Header & Meta */}
      <section className="py-12 md:py-16 border-b border-border/80">
        <Container>
          <div className="max-w-4xl">
            {/* Type & Status */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="font-mono text-xs uppercase tracking-wider text-accent-1 dark:text-accent-2 font-semibold">
                {project.type}
              </span>
              <Badge variant={getStatusVariant(project.status)} showDot={true}>
                {project.status}
              </Badge>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text mb-4">
              {project.title}
            </h1>

            {/* One-liner */}
            <p className="text-lg sm:text-xl text-text-muted leading-relaxed mb-8">
              {project.oneLiner}
            </p>

            {/* Meta Row Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-surface border border-border">
              <div>
                <p className="text-xs uppercase font-mono text-text-subtle mb-1 flex items-center gap-1.5">
                  <LuUser className="w-3.5 h-3.5" aria-hidden="true" />
                  Role
                </p>
                <p className="text-sm font-semibold text-text">{project.role}</p>
              </div>

              <div>
                <p className="text-xs uppercase font-mono text-text-subtle mb-1 flex items-center gap-1.5">
                  <LuLayers className="w-3.5 h-3.5" aria-hidden="true" />
                  Category
                </p>
                <p className="text-sm font-semibold text-text">{project.type}</p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-xs uppercase font-mono text-text-subtle mb-1.5">Technologies</p>
                <div className="flex flex-wrap gap-1.5">
                  {project.stack?.map((tech) => (
                    <Chip key={tech} size="sm">
                      {tech}
                    </Chip>
                  ))}
                </div>
              </div>
            </div>

            {/* Live or GitHub Links if present */}
            {(project.liveUrl || project.githubUrl) && (
              <div className="flex items-center gap-4 mt-6">
                {project.liveUrl && (
                  <Button
                    href={project.liveUrl}
                    variant="primary"
                    size="md"
                    rightIcon={<LuExternalLink className="w-4 h-4" aria-hidden="true" />}
                  >
                    Open Live Project
                  </Button>
                )}
                {project.githubUrl && (
                  <Button
                    href={project.githubUrl}
                    variant="secondary"
                    size="md"
                    leftIcon={<SiGithub className="w-4 h-4" aria-hidden="true" />}
                  >
                    View Source Code
                  </Button>
                )}
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* Visual Cover / Screenshots Gallery */}
      <section className="py-12 md:py-16 bg-surface/30 border-b border-border/80">
        <Container>
          <div className="max-w-4xl mx-auto">
            {project.gallery && project.gallery.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.gallery.map((img, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl overflow-hidden border border-border shadow-md bg-surface"
                  >
                    <img
                      src={img.src}
                      alt={img.alt || `${project.title} screenshot ${idx + 1}`}
                      width="600"
                      height="400"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-auto object-cover"
                    />
                    {img.caption && (
                      <p className="p-3 text-xs text-text-muted border-t border-border/60">
                        {img.caption}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              /* Refined Empty State for screenshots */
              <div className="rounded-card border border-dashed border-border p-8 sm:p-12 text-center bg-surface/60">
                <div className="w-16 h-16 rounded-2xl bg-surface-2 border border-border flex items-center justify-center mx-auto mb-4 text-accent-1 dark:text-accent-2">
                  <LuImage className="w-8 h-8" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-text mb-2">Screenshots coming soon</h3>
                <p className="text-sm text-text-muted max-w-md mx-auto leading-relaxed mb-4">
                  Interface previews, audit log views, and digital batch record sheets are being
                  prepared for publication following handover authorization.
                </p>
                <span className="font-mono text-xs text-text-subtle">
                  {/* TODO(Fenil): add screenshots to public/assets/projects/{project.slug}/ */}
                  Asset directory: /assets/projects/{project.slug}/
                </span>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* Main Body: Overview, Note & Feature Groups */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="max-w-4xl mx-auto space-y-16">
            {/* Note alert if present */}
            {project.note && (
              <div className="p-4 sm:p-5 rounded-2xl bg-surface-2 border border-border flex items-start gap-3.5">
                <LuInfo className="w-5 h-5 text-accent-1 dark:text-accent-2 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-xs uppercase font-mono tracking-wider text-text-subtle mb-1">
                    Project Context
                  </p>
                  <p className="text-sm text-text font-medium leading-relaxed">
                    {project.note}
                  </p>
                </div>
              </div>
            )}

            {/* Overview paragraphs */}
            <div>
              <h2 className="text-2xl font-bold text-text mb-6">System overview</h2>
              <div className="space-y-4 text-base text-text-muted leading-relaxed">
                {(Array.isArray(project.description)
                  ? project.description
                  : typeof project.description === 'string'
                  ? project.description.split('\n\n').filter(Boolean)
                  : []
                ).map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            </div>

            {/* Feature Groups */}
            {project.featureGroups && project.featureGroups.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-text mb-6">Key modules &amp; architecture</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {project.featureGroups.map((group, idx) => (
                    <Card key={idx} className="p-6 bg-surface/90">
                      <h3 className="font-heading font-semibold text-base text-accent-1 dark:text-accent-2 mb-3">
                        {group.group}
                      </h3>
                      <ul className="space-y-2.5 text-sm text-text-muted">
                        {group.items.map((item, itemIdx) => (
                          <li key={itemIdx} className="flex items-start gap-2.5 leading-relaxed">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent-1 dark:bg-accent-2 shrink-0 mt-2" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Tech Stack deep dive */}
            <div>
              <h2 className="text-2xl font-bold text-text mb-6">Technologies utilized</h2>
              <div className="flex flex-wrap gap-2.5">
                {project.stack?.map((tech) => (
                  <Chip
                    key={tech}
                    size="md"
                    icon={<TechIcon name={tech} className="w-4 h-4" />}
                    className="p-3"
                  >
                    {tech}
                  </Chip>
                ))}
              </div>
            </div>

            {/* Challenges and solutions (rendered only when data exists) */}
            {project.challenges && project.challenges.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-text mb-6">Challenges &amp; engineering solutions</h2>
                <div className="space-y-4">
                  {project.challenges.map((c, idx) => (
                    <Card key={idx} className="p-6">
                      <h3 className="font-semibold text-lg text-text mb-2">{c.title}</h3>
                      <p className="text-sm text-text-muted leading-relaxed">{c.body}</p>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Project Navigation (Previous / Next) */}
            <div className="pt-10 border-t border-border flex items-center justify-between gap-4">
              {prevProject ? (
                <Link
                  to={`/projects/${prevProject.slug}`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-2 transition-colors max-w-[45%]"
                >
                  <LuArrowLeft className="w-5 h-5 text-text-muted shrink-0" aria-hidden="true" />
                  <div className="text-left min-w-0">
                    <p className="text-xs uppercase font-mono text-text-subtle">Previous</p>
                    <p className="text-sm font-semibold text-text truncate">{prevProject.title}</p>
                  </div>
                </Link>
              ) : (
                <div />
              )}

              {nextProject ? (
                <Link
                  to={`/projects/${nextProject.slug}`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-2 transition-colors max-w-[45%] text-right ml-auto"
                >
                  <div className="min-w-0">
                    <p className="text-xs uppercase font-mono text-text-subtle">Next</p>
                    <p className="text-sm font-semibold text-text truncate">{nextProject.title}</p>
                  </div>
                  <LuArrowRight className="w-5 h-5 text-text-muted shrink-0" aria-hidden="true" />
                </Link>
              ) : (
                <div />
              )}
            </div>

            {/* Contact CTA */}
            <Card className="p-8 sm:p-10 text-center bg-surface-2/60 border border-border">
              <h3 className="text-xl sm:text-2xl font-bold text-text mb-2">
                Interested in this technical workflow?
              </h3>
              <p className="text-sm text-text-muted max-w-lg mx-auto mb-6">
                I would be delighted to discuss the architecture, database schema, or frontend
                state management strategies used in this build.
              </p>
              <Button
                to="/#contact"
                variant="primary"
                size="md"
              >
                Discuss this project with Fenil
              </Button>
            </Card>
          </div>
        </Container>
      </section>
    </>
  )
}
