import React from 'react'
import { LuUsers, LuSparkles } from 'react-icons/lu'
import { Section } from '../ui/Section'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'

export function LeadershipSection({ leadership = [] }) {
  if (!leadership || leadership.length === 0) return null

  return (
    <Section
      id="leadership"
      eyebrow="Beyond Code"
      title="Leadership &amp; team coordination."
      description="Collaborative management, event leadership, and resource coordination across campus initiatives."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {leadership.map((item, idx) => (
          <Card key={idx} className="p-6 sm:p-8 flex flex-col justify-between bg-surface/90">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs uppercase text-accent-1 dark:text-accent-2 font-medium">
                  {item.organization}
                </span>
                <Badge variant="accent">
                  {idx === 0 ? <LuSparkles className="w-3.5 h-3.5 mr-1" /> : <LuUsers className="w-3.5 h-3.5 mr-1" />}
                  Campus Leadership
                </Badge>
              </div>

              <h3 className="font-heading text-xl font-bold text-text mb-3">
                {item.title}
              </h3>

              <p className="text-sm text-text-muted leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-border/80 flex items-center justify-between text-xs text-text-subtle font-mono">
              <span>{item.organization}</span>
              <span>Team &amp; Operations</span>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  )
}
