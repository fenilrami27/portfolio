import React from 'react'
import { LuArrowRight } from 'react-icons/lu'
import { Section } from '../ui/Section'
import { ProjectCard } from '../ui/ProjectCard'
import { Button } from '../ui/Button'

export function FeaturedWorkSection({ projects = [] }) {
  // Only published and featured projects
  const featuredProjects = projects.filter((p) => p.isPublished && p.isFeatured)

  return (
    <Section
      id="work"
      eyebrow="Portfolio"
      title="Featured enterprise &amp; web projects."
      description="Production-grade business systems solving complex inventory, workflow management, and institutional automation challenges."
      headerAction={
        <Button
          to="/projects"
          variant="ghost"
          size="sm"
          rightIcon={<LuArrowRight className="w-4 h-4" aria-hidden="true" />}
          className="text-accent-1 dark:text-accent-2"
        >
          View all projects ({projects.filter((p) => p.isPublished).length})
        </Button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {featuredProjects.map((project) => (
          <ProjectCard key={project.slug} project={project} tier="featured" />
        ))}
      </div>

      <div className="mt-12 text-center md:hidden">
        <Button
          to="/projects"
          variant="secondary"
          size="md"
          rightIcon={<LuArrowRight className="w-4 h-4" aria-hidden="true" />}
        >
          View all projects
        </Button>
      </div>
    </Section>
  )
}
