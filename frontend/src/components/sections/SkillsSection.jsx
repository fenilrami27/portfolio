import React from 'react'
import { Section } from '../ui/Section'
import { Card } from '../ui/Card'
import { Chip } from '../ui/Chip'
import { TechIcon } from '../ui/TechIcon'

export function SkillsSection({ skills = [] }) {
  return (
    <Section
      id="skills"
      eyebrow="Technical Stack"
      title="Technologies &amp; core competencies."
      description="Hands-on expertise across backend architectures, database schemas, frontend frameworks, and business logic."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skillGroup) => (
          <Card
            key={skillGroup.group}
            className="p-6 flex flex-col justify-between bg-surface/80"
          >
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-border/80">
                <h3 className="font-heading font-semibold text-base text-text">
                  {skillGroup.group}
                </h3>
                <span className="font-mono text-[11px] text-text-subtle">
                  {skillGroup.items?.length} skills
                </span>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {skillGroup.items?.map((item) => (
                  <Chip
                    key={item.name}
                    size="md"
                    level={item.level}
                    icon={<TechIcon name={item.name} iconName={item.icon} className="w-4 h-4" />}
                    className="hover:border-accent-1/50 transition-colors"
                  >
                    {item.name}
                  </Chip>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  )
}
