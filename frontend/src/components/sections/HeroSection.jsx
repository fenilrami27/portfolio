import React, { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { SiGithub } from 'react-icons/si'
import { FaLinkedin } from 'react-icons/fa6'
import { LuMail, LuArrowDown, LuFileDown } from 'react-icons/lu'
import { Container } from '../ui/Container'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { IconButton } from '../ui/IconButton'
import { Chip } from '../ui/Chip'
import { TechIcon } from '../ui/TechIcon'
import { heroContainerVariants, heroItemVariants } from '../../lib/motion'

export function HeroSection({ profile }) {
  const shouldReduceMotion = useReducedMotion()
  const [imgError, setImgError] = useState(false)

  const techStackRow = [
    { name: 'Python', iconName: 'SiPython' },
    { name: 'Django', iconName: 'SiDjango' },
    { name: 'Django REST Framework', iconName: 'TbApi' },
    { name: 'React.js', iconName: 'SiReact' },
    { name: 'PostgreSQL', iconName: 'SiPostgresql' },
    { name: 'SQLite', iconName: 'SiSqlite' },
    { name: 'RBAC', iconName: 'LuShieldCheck' },
    { name: 'Redux', iconName: 'SiRedux' },
  ]

  const MotionDiv = shouldReduceMotion ? 'div' : motion.div

  return (
    <section
      id="hero"
      aria-label="Introduction and hero overview"
      className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-dot-pattern"
    >
      {/* Soft radial accent glows - CSS only */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] md:w-[700px] md:h-[400px] bg-accent-1/10 dark:bg-accent-1/15 rounded-full blur-[100px] pointer-events-none -z-10"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/3 right-10 w-[300px] h-[250px] bg-accent-2/10 dark:bg-accent-2/15 rounded-full blur-[90px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      <Container>
        <MotionDiv
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center"
          initial="hidden"
          animate="visible"
          variants={shouldReduceMotion ? {} : heroContainerVariants}
        >
          {/* Left Column: Content */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Status Badge */}
            <MotionDiv variants={heroItemVariants} className="mb-6">
              <Badge variant="success" showDot={true}>
                {profile.availability?.status || 'Open to work'} · {profile.location}
              </Badge>
            </MotionDiv>

            {/* H1 Name */}
            <MotionDiv variants={heroItemVariants} className="w-full">
              <h1 className="font-heading font-extrabold text-text tracking-tight mb-3">
                {profile.name}
              </h1>
            </MotionDiv>

            {/* Title / Headline */}
            <MotionDiv variants={heroItemVariants} className="w-full">
              <p className="font-heading text-lg sm:text-xl md:text-2xl font-semibold text-accent-1 dark:text-accent-2 mb-4">
                {profile.headline}
              </p>
            </MotionDiv>

            {/* Hero Statement */}
            <MotionDiv variants={heroItemVariants} className="w-full">
              <p className="text-lg sm:text-xl text-text font-normal leading-relaxed mb-3">
                {profile.statement}
              </p>
            </MotionDiv>

            {/* Hero Supporting Line */}
            <MotionDiv variants={heroItemVariants} className="w-full">
              <p className="text-base sm:text-lg text-text-muted leading-relaxed mb-6 max-w-2xl">
                {profile.supportingLine}
              </p>
            </MotionDiv>

            {/* Roles Sought Chips */}
            {profile.availability?.roles && (
              <MotionDiv variants={heroItemVariants} className="w-full mb-8">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs uppercase font-mono tracking-wider text-text-subtle mr-1">
                    Roles sought:
                  </span>
                  {profile.availability.roles.map((role) => (
                    <Chip key={role} size="sm" className="bg-surface border-border/80">
                      {role}
                    </Chip>
                  ))}
                </div>
              </MotionDiv>
            )}

            {/* Action Buttons & Socials */}
            <MotionDiv
              variants={heroItemVariants}
              className="w-full flex flex-wrap items-center gap-4 pt-2"
            >
              <Button
                variant="primary"
                size="lg"
                onClick={() => {
                  const el = document.getElementById('work')
                  if (el) el.scrollIntoView({ behavior: 'smooth' })
                }}
                rightIcon={<LuArrowDown className="w-4 h-4" aria-hidden="true" />}
                aria-label="View my featured work"
              >
                View my work
              </Button>

              <Button
                href={profile.resumeUrl || '/api/v1/resume/'}
                download="Fenil_Rami_Resume.pdf"
                variant="secondary"
                size="lg"
                leftIcon={<LuFileDown className="w-4 h-4" aria-hidden="true" />}
                aria-label="Download resume"
              >
                Download resume
              </Button>

              {/* Social icons */}
              <div className="flex items-center gap-2 sm:ml-2">
                <IconButton
                  href={profile.socials?.find((s) => s.platform === 'GitHub')?.url || 'https://github.com/fenilrami27'}
                  aria-label="Fenil Rami's GitHub profile"
                  variant="ghost"
                  size="md"
                >
                  <SiGithub className="w-5 h-5 text-text" aria-hidden="true" />
                </IconButton>

                <IconButton
                  href={profile.socials?.find((s) => s.platform === 'LinkedIn')?.url || 'https://www.linkedin.com/in/fenil-rami-67303938a'}
                  aria-label="Fenil Rami's LinkedIn profile"
                  variant="ghost"
                  size="md"
                >
                  <FaLinkedin className="w-5 h-5 text-text" aria-hidden="true" />
                </IconButton>

                <IconButton
                  href={`mailto:${profile.email}`}
                  aria-label="Send email to Fenil Rami"
                  variant="ghost"
                  size="md"
                >
                  <LuMail className="w-5 h-5 text-text" aria-hidden="true" />
                </IconButton>
              </div>
            </MotionDiv>
          </div>

          {/* Right Column: Profile Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <MotionDiv
              variants={heroItemVariants}
              className="w-full max-w-sm sm:max-w-md p-5 sm:p-6 rounded-card bg-surface/80 border border-border/90 shadow-xl backdrop-blur-sm relative bento-card"
            >
              {/* Profile Image with Monogram fallback */}
              <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-surface-2 border border-border/80 mb-5 flex items-center justify-center">
                {profile.photo && !imgError ? (
                  <img
                    src={typeof profile.photo === 'object' && profile.photo ? profile.photo.url : profile.photo}
                    alt={profile.photoAlt || (typeof profile.photo === 'object' && profile.photo?.alt) || 'Fenil Rami - Python Backend & Full Stack Developer'}
                    srcSet={typeof profile.photo === 'object' && profile.photo?.srcset ? profile.photo.srcset : undefined}
                    width="400"
                    height="500"
                    decoding="async"
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-[1.02]"
                  />
                ) : (
                  // Monogram avatar (initials FR on gradient)
                  <div className="w-full h-full accent-gradient-bg flex flex-col items-center justify-center p-6 text-center text-white">
                    <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center font-heading font-extrabold text-4xl mb-4 border border-white/20">
                      FR
                    </div>
                    <p className="font-heading font-bold text-xl">Fenil Rami</p>
                    <p className="text-xs uppercase tracking-widest text-white/80 font-mono mt-1">
                      Full Stack Engineer
                    </p>
                  </div>
                )}

                {/* Subtle availability pill inside photo */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-3.5 py-2 rounded-xl bg-bg-elevated/90 backdrop-blur-md border border-border/80 shadow-md">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                    <span className="text-xs font-medium text-text">Ahmedabad, India</span>
                  </div>
                  <span className="text-[11px] font-mono text-accent-1 dark:text-accent-2 font-semibold">
                    SGPA 8.77
                  </span>
                </div>
              </div>

              {/* Quick Meta under image */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-text-subtle">Current Internship</span>
                  <span className="text-xs font-semibold text-text">Vibe Tech Labs</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-text-subtle">Core Focus</span>
                  <span className="text-xs font-semibold text-text">Django 5 + React ERP Systems</span>
                </div>
              </div>
            </MotionDiv>
          </div>
        </MotionDiv>

        {/* Static Row of Technology Icon Chips (no marquee) */}
        <div className="mt-14 pt-8 border-t border-border/60">
          <p className="text-xs font-mono uppercase tracking-wider text-text-subtle mb-4">
            Core Technology Toolkit
          </p>
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {techStackRow.map((tech) => (
              <Chip
                key={tech.name}
                size="md"
                icon={<TechIcon iconName={tech.iconName} className="w-4 h-4" />}
                className="bg-surface/70 hover:border-accent-1/40 hover:bg-surface-2 transition-all"
              >
                {tech.name}
              </Chip>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
