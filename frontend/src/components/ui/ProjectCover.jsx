import React from 'react'
import clsx from 'clsx'
import { SiReact, SiDjango, SiPython } from 'react-icons/si'
import { LuLayoutGrid } from 'react-icons/lu'

const GRADIENTS_BY_SLUG = {
  'cmhp-pharma-erp': 'from-indigo-900/40 via-cyan-950/30 to-surface-2',
  'hr-university': 'from-violet-900/40 via-purple-950/30 to-surface-2',
  'interior-design-studio': 'from-amber-950/40 via-slate-900/30 to-surface-2',
  vtl: 'from-blue-900/40 via-teal-950/30 to-surface-2',
}

const ICONS_BY_SLUG = {
  'cmhp-pharma-erp': SiReact,
  'hr-university': SiDjango,
  'interior-design-studio': SiDjango,
  vtl: SiPython,
}

export function ProjectCover({ slug, title, cover, className = '', height = 'h-48 sm:h-56' }) {
  const coverUrl = typeof cover === 'object' && cover !== null ? cover.url : cover

  if (coverUrl) {
    return (
      <div
        className={clsx(
          'relative w-full overflow-hidden bg-surface-2 border-b border-border/80',
          height,
          className
        )}
        aria-label={`Visual cover graphic for ${title}`}
      >
        <img
          src={coverUrl}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    )
  }

  const gradient =
    GRADIENTS_BY_SLUG[slug] || 'from-indigo-950/40 via-slate-900/30 to-surface-2'
  const IconComponent = ICONS_BY_SLUG[slug] || LuLayoutGrid

  return (
    <div
      className={clsx(
        'relative w-full overflow-hidden bg-surface-2 border-b border-border/80 flex items-center justify-center bg-grid-pattern',
        height,
        className
      )}
      aria-label={`Visual cover graphic for ${title}`}
    >
      {/* Background Gradient */}
      <div
        className={clsx(
          'absolute inset-0 bg-gradient-to-br opacity-80 transition-opacity duration-300 group-hover:opacity-100',
          gradient
        )}
      />

      {/* Decorative center element */}
      <div className="relative z-10 flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-surface/85 backdrop-blur-md border border-border/90 flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-105">
          <IconComponent
            className="w-8 h-8 sm:w-10 sm:h-10 text-accent-1 dark:text-accent-2"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  )
}
