import React from 'react'
import { Section } from '../ui/Section'
import { Card } from '../ui/Card'
import { LuAward, LuTrophy, LuQuote } from 'react-icons/lu'

export function CertificatesSection({ certificates = [] }) {
  if (!certificates || certificates.length === 0) return null

  return (
    <Section
      id="certificates"
      eyebrow="Credentials"
      title="Certificates &amp; specializations."
      description="Professional certifications verifying technical mastery and software principles."
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {certificates.map((cert, idx) => (
          <Card key={idx} className="p-6 bg-surface/90">
            <LuAward className="w-8 h-8 text-accent-1 dark:text-accent-2 mb-4" />
            <h3 className="font-heading font-semibold text-lg text-text mb-1">{cert.title || cert.name}</h3>
            <p className="text-sm text-text-muted">{cert.issuer}</p>
            {(cert.issuedOn || cert.date) && (
              <p className="text-xs font-mono text-text-subtle mt-2">{cert.issuedOn || cert.date}</p>
            )}
          </Card>
        ))}
      </div>
    </Section>
  )
}

export function HackathonsSection({ hackathons = [] }) {
  if (!hackathons || hackathons.length === 0) return null

  return (
    <Section
      id="hackathons"
      eyebrow="Competitions"
      title="Hackathons &amp; sprints."
      description="Rapid prototyping and technical problem-solving under tight timeframes."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hackathons.map((h, idx) => (
          <Card key={idx} className="p-6 bg-surface/90">
            <LuTrophy className="w-8 h-8 text-accent-1 dark:text-accent-2 mb-4" />
            <h3 className="font-heading font-semibold text-lg text-text mb-1">{h.event || h.name}</h3>
            <p className="text-sm text-text-muted">{h.description}</p>
          </Card>
        ))}
      </div>
    </Section>
  )
}

export function AchievementsSection({ achievements = [] }) {
  if (!achievements || achievements.length === 0) return null

  return (
    <Section
      id="achievements"
      eyebrow="Recognition"
      title="Key achievements."
      description="Notable milestones and competitive performance."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {achievements.map((item, idx) => (
          <Card key={idx} className="p-6 bg-surface/90">
            <h3 className="font-heading font-semibold text-lg text-text mb-1">{item.title}</h3>
            <p className="text-sm text-text-muted">{item.description}</p>
          </Card>
        ))}
      </div>
    </Section>
  )
}

export function TestimonialsSection({ testimonials = [] }) {
  if (!testimonials || testimonials.length === 0) return null

  return (
    <Section
      id="testimonials"
      eyebrow="Recommendations"
      title="Colleague &amp; mentor testimonials."
      description="What team leads and peers say about collaborating with me."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((t, idx) => (
          <Card key={idx} className="p-6 bg-surface/90">
            <LuQuote className="w-6 h-6 text-accent-1 dark:text-accent-2 mb-3" />
            <p className="text-sm text-text-muted italic mb-4">&ldquo;{t.quote}&rdquo;</p>
            <div className="flex items-center gap-3">
              {t.photo && (
                <img
                  src={t.photo}
                  alt={t.name}
                  width="40"
                  height="40"
                  decoding="async"
                  loading="lazy"
                  className="w-10 h-10 rounded-full object-cover"
                />
              )}
              <div>
                <p className="text-sm font-semibold text-text">{t.name}</p>
                <p className="text-xs text-text-subtle">
                  {t.role} {t.company ? `· ${t.company}` : ''}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  )
}
