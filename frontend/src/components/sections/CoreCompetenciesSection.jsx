import React from 'react'
import {
  LuBrain,
  LuCpu,
  LuBoxes,
  LuEye,
  LuNetwork,
  LuUsers,
  LuKanban,
  LuSparkles,
  LuShieldCheck,
  LuCode,
  LuLayers,
} from 'react-icons/lu'
import { Section } from '../ui/Section'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { competenciesData } from '../../data/competencies'

const ICON_MAP = {
  LuBrain,
  LuCpu,
  LuBoxes,
  LuEye,
  LuNetwork,
  LuUsers,
  LuKanban,
  LuShieldCheck,
  LuCode,
  LuLayers,
}

// Full name lookup for acronym cards
const FULL_NAME_MAP = {
  AI: 'Artificial Intelligence',
  AML: 'Advanced Machine Learning',
  ML: 'Machine Learning',
  CN: 'Computer Networks',
}

export function CoreCompetenciesSection({ competencies = [] }) {
  const itemsToRender =
    competencies && competencies.length > 0 ? competencies : competenciesData

  return (
    <Section
      id="competencies"
      eyebrow="Knowledge &amp; Specialization"
      title="Core Competencies."
      description="Foundational and specialized domains across intelligent systems, network architectures, and software engineering leadership."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {itemsToRender.map((item, idx) => {
          const iconKey = item.icon_key || item.iconKey || 'LuBrain'
          const IconComp = ICON_MAP[iconKey] || LuBrain
          const code = item.code || ''
          const fullName = item.full_name || item.fullName || FULL_NAME_MAP[code] || item.title

          return (
            <Card
              key={item.id || idx}
              className="competency-card p-6 flex flex-col justify-between bg-surface/90 border border-border group rounded-2xl transition-all duration-300"
            >
              <div>
                {/* Header: Icon & Code Badge */}
                <div className="flex items-start justify-between gap-3 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-accent-1/10 dark:bg-accent-1/20 border border-accent-1/20 text-accent-1 dark:text-accent-2 flex items-center justify-center shrink-0 competency-icon transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-sm">
                    <IconComp className="w-6 h-6" aria-hidden="true" />
                  </div>
                  {code && (
                    <Badge variant="accent" className="font-mono text-xs px-2.5 py-1">
                      {code}
                    </Badge>
                  )}
                </div>

                {/* Title & Full Name */}
                <h3 className="font-heading font-bold text-lg text-text mb-1 group-hover:text-accent-1 dark:group-hover:text-accent-2 transition-colors">
                  {fullName}
                </h3>
                {code && fullName !== code && (
                  <p className="font-mono text-xs text-text-subtle mb-3 uppercase tracking-wider">
                    {code}
                  </p>
                )}

                {/* One-line objective description of the area */}
                <p className="text-sm text-text-muted leading-relaxed mt-2">
                  {item.description}
                </p>
              </div>

              {/* Bottom accent indicator */}
              <div className="pt-4 mt-4 border-t border-border/60 flex items-center justify-between text-xs font-mono text-text-subtle">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-1 dark:bg-accent-2" />
                  Technical Area
                </span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-accent-1 dark:text-accent-2">
                  Verified &bull;
                </span>
              </div>
            </Card>
          )
        })}
      </div>
    </Section>
  )
}
