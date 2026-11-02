import React from 'react'
import clsx from 'clsx'

export function Badge({
  children,
  variant = 'default',
  showDot = false,
  className = '',
  ...props
}) {
  const variantClasses = {
    default: 'bg-surface-2 text-text border-border',
    success: 'bg-success/10 text-success border-success/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    danger: 'bg-danger/10 text-danger border-danger/20',
    accent: 'bg-accent-1/10 text-accent-1 dark:text-accent-2 border-accent-1/25',
  }

  const dotClasses = {
    default: 'bg-text-muted',
    success: 'bg-success animate-pulse',
    warning: 'bg-warning animate-pulse',
    danger: 'bg-danger',
    accent: 'bg-accent-2 animate-pulse',
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border tracking-wide uppercase',
        variantClasses[variant] || variantClasses.default,
        className
      )}
      {...props}
    >
      {showDot && (
        <span
          className={clsx('w-2 h-2 rounded-full shrink-0', dotClasses[variant] || dotClasses.default)}
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </span>
  )
}
