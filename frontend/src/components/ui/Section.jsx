import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import clsx from 'clsx'
import { Container } from './Container'
import { sectionRevealVariants } from '../../lib/motion'

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className = '',
  containerClassName = '',
  animate = true,
  headerAction = null,
  ...props
}) {
  const shouldReduceMotion = useReducedMotion()
  const headingId = id ? `${id}-heading` : undefined

  const headerContent = (eyebrow || title || description) && (
    <div className="mb-10 md:mb-14 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="font-mono text-xs uppercase tracking-wider text-accent-1 dark:text-accent-2 mb-2">
            {eyebrow}
          </p>
        )}
        {title && (
          <h2
            id={headingId}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-text"
          >
            {title}
          </h2>
        )}
        {description && (
          <p className="mt-3 text-base sm:text-lg text-text-muted leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {headerAction && <div className="shrink-0">{headerAction}</div>}
    </div>
  )

  const sectionContent = (
    <Container className={containerClassName}>
      {headerContent}
      {children}
    </Container>
  )

  if (!animate || shouldReduceMotion) {
    return (
      <section
        id={id}
        aria-labelledby={headingId}
        className={clsx('py-16 md:py-28 relative', className)}
        {...props}
      >
        {sectionContent}
      </section>
    )
  }

  return (
    <motion.section
      id={id}
      aria-labelledby={headingId}
      className={clsx('py-16 md:py-28 relative', className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={sectionRevealVariants}
      {...props}
    >
      {sectionContent}
    </motion.section>
  )
}
