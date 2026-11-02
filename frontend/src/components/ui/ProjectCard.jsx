import React from 'react'
import { Link } from 'react-router-dom'
import { LuExternalLink, LuArrowRight } from 'react-icons/lu'
import { SiGithub } from 'react-icons/si'
import { Card } from './Card'
import { Badge } from './Badge'
import { Chip } from './Chip'
import { Button } from './Button'
import { ProjectCover } from './ProjectCover'

export function ProjectCard({ project, tier = 'featured' }) {
  const isCompact = tier === 'compact' || project.tier === 'compact'
  const stack = project.stack || []
  const visibleStack = stack.slice(0, 5)
  const remainingCount = stack.length - visibleStack.length

  const getStatusVariant = (status) => {
    if (!status) return 'default'
    const s = status.toLowerCase()
    if (s.includes('hand') || s.includes('complete')) return 'success'
    if (s.includes('progress') || s.includes('dev')) return 'warning'
    return 'default'
  }

  return (
    <Card
      as="article"
      className="group flex flex-col justify-between overflow-hidden bg-surface/90 border border-border"
    >
      <div>
        {/* Cover visual */}
        <Link
          to={`/projects/${project.slug}`}
          tabIndex={-1}
          aria-hidden="true"
          className="block"
        >
          <ProjectCover
            slug={project.slug}
            title={project.title}
            height={isCompact ? 'h-36 sm:h-40' : 'h-48 sm:h-56'}
          />
        </Link>

        {/* Content body */}
        <div className="p-5 sm:p-6">
          {/* Header Row: Status & Type */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="font-mono text-xs uppercase text-accent-1 dark:text-accent-2 font-medium">
              {project.type}
            </span>
            <Badge variant={getStatusVariant(project.status)}>
              {project.status}
            </Badge>
          </div>

          {/* Title */}
          <h3 className="font-heading text-lg sm:text-xl font-bold text-text group-hover:text-accent-1 dark:group-hover:text-accent-2 transition-colors mb-2">
            <Link
              to={`/projects/${project.slug}`}
              className="focus-visible:outline-none focus-visible:underline"
            >
              {project.title}
            </Link>
          </h3>

          {/* One-liner */}
          <p className="text-sm text-text-muted leading-relaxed line-clamp-3 mb-5">
            {project.oneLiner}
          </p>

          {/* Stack Chips */}
          <div className="flex flex-wrap items-center gap-1.5 mb-6">
            {visibleStack.map((tech) => (
              <Chip key={tech} size="sm">
                {tech}
              </Chip>
            ))}
            {remainingCount > 0 && (
              <span className="text-xs font-mono text-text-subtle px-1">
                +{remainingCount}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-5 sm:p-6 pt-0 border-t border-border/60 flex items-center justify-between gap-3 mt-auto">
        <Button
          to={`/projects/${project.slug}`}
          variant="secondary"
          size="sm"
          rightIcon={<LuArrowRight className="w-3.5 h-3.5" aria-hidden="true" />}
          aria-label={`View details and case study for ${project.title}`}
        >
          Case study
        </Button>

        <div className="flex items-center gap-2">
          {project.githubUrl && (
            <Button
              href={project.githubUrl}
              variant="ghost"
              size="sm"
              leftIcon={<SiGithub className="w-4 h-4" aria-hidden="true" />}
              aria-label={`GitHub repository for ${project.title}`}
            >
              GitHub
            </Button>
          )}

          {project.liveUrl && (
            <Button
              href={project.liveUrl}
              variant="ghost"
              size="sm"
              leftIcon={<LuExternalLink className="w-4 h-4" aria-hidden="true" />}
              aria-label={`Live site for ${project.title}`}
            >
              Live
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
