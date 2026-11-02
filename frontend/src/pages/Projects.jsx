import React, { useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { LuSearch } from 'react-icons/lu'
import { useProjects } from '../hooks/usePortfolio'
import { Container } from '../components/ui/Container'
import { ProjectCard } from '../components/ui/ProjectCard'
import { EmptyState } from '../components/ui/EmptyState'
import { Skeleton } from '../components/ui/Skeleton'
import { Button } from '../components/ui/Button'

const FILTER_TYPES = ['All', 'Full Stack', 'Frontend', 'Backend', 'Website']

export default function Projects() {
  const { data: projects = [], isLoading } = useProjects()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('All')
  const [sortBy, setSortBy] = useState('featured') // 'featured' or 'newest'

  const filteredProjects = useMemo(() => {
    return projects
      .filter((project) => {
        // Only published
        if (!project.isPublished) return false

        // Type filter
        if (selectedType !== 'All' && project.type !== selectedType) {
          return false
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim()
          const matchesTitle = project.title.toLowerCase().includes(q)
          const matchesOneLiner = project.oneLiner.toLowerCase().includes(q)
          const matchesStack = project.stack?.some((s) => s.toLowerCase().includes(q))
          return matchesTitle || matchesOneLiner || matchesStack
        }

        return true
      })
      .sort((a, b) => {
        if (sortBy === 'featured') {
          if (a.isFeatured && !b.isFeatured) return -1
          if (!a.isFeatured && b.isFeatured) return 1
          return (a.order || 0) - (b.order || 0)
        }
        // 'newest'
        return (a.order || 0) - (b.order || 0)
      })
  }, [projects, selectedType, searchQuery, sortBy])

  return (
    <>
      <Helmet>
        <title>Projects - Fenil Rami</title>
        <meta
          name="description"
          content="Explore enterprise ERP systems, university portals, and full-stack projects engineered by Fenil Rami with Django and React."
        />
        <link rel="canonical" href="https://fenilrami.com/projects" />
        <meta property="og:title" content="Projects - Fenil Rami" />
        <meta
          property="og:description"
          content="Explore enterprise ERP systems, university portals, and full-stack projects engineered by Fenil Rami with Django and React."
        />
        <meta property="og:url" content="https://fenilrami.com/projects" />
        <meta property="og:image" content="https://fenilrami.com/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Projects - Fenil Rami" />
        <meta
          name="twitter:description"
          content="Explore enterprise ERP systems, university portals, and full-stack projects engineered by Fenil Rami with Django and React."
        />
        <meta name="twitter:image" content="https://fenilrami.com/og-image.png" />
      </Helmet>

      <section className="py-14 sm:py-20 border-b border-border/80 bg-surface/30">
        <Container>
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-wider text-accent-1 dark:text-accent-2 mb-2">
              Work &amp; Case Studies
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text mb-4">
              All projects
            </h1>
            <p className="text-base sm:text-lg text-text-muted leading-relaxed">
              A complete catalog of business systems, frontend applications, and full-stack
              solutions built with Django, React, and PostgreSQL.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-12 md:py-16">
        <Container>
          {/* Controls: Search, Type filter, Sort */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-10">
            {/* Search input */}
            <div className="relative flex-1 max-w-md">
              <label htmlFor="project-search" className="sr-only">
                Search projects by keyword, technology or title
              </label>
              <LuSearch
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-subtle"
                aria-hidden="true"
              />
              <input
                id="project-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects (e.g. Django, ERP, React)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface border border-border text-text placeholder:text-text-subtle text-sm transition-colors focus-visible:outline-none min-h-[44px]"
              />
            </div>

            {/* Sort & Filter Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Type Filter Chips */}
              <div
                className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-surface border border-border"
                role="group"
                aria-label="Filter projects by technology type"
              >
                {FILTER_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedType(type)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all min-h-[36px] flex items-center ${
                      selectedType === type
                        ? 'accent-gradient-bg text-white shadow-sm'
                        : 'text-text-muted hover:text-text hover:bg-surface-2'
                    }`}
                    aria-pressed={selectedType === type}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Sort Dropdown */}
              <div className="relative inline-flex items-center">
                <label htmlFor="project-sort" className="sr-only">
                  Sort projects
                </label>
                <select
                  id="project-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-surface border border-border text-text text-xs font-medium focus-visible:outline-none min-h-[44px] cursor-pointer"
                >
                  <option value="featured">Sort: Featured first</option>
                  <option value="newest">Sort: Chronological</option>
                </select>
              </div>
            </div>
          </div>

          {/* Project Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="rounded-card border border-border p-6 space-y-4">
                  <Skeleton className="h-44 w-full rounded-xl" />
                  <Skeleton className="h-6 w-3/4 rounded-lg" />
                  <Skeleton className="h-16 w-full rounded-lg" />
                </div>
              ))}
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  tier={project.tier || 'featured'}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No projects match your criteria"
              description="Try adjusting your search terms or clearing the selected type filter."
              action={
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedType('All')
                  }}
                >
                  Clear filters
                </Button>
              }
            />
          )}
        </Container>
      </section>
    </>
  )
}
