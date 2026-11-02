import React from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'

export function IconButton({
  children,
  'aria-label': ariaLabel,
  variant = 'secondary',
  size = 'md',
  to,
  href,
  onClick,
  className = '',
  disabled = false,
  ...props
}) {
  if (!ariaLabel) {
    console.warn('IconButton requires an aria-label for accessibility.')
  }

  const baseClasses =
    'inline-flex items-center justify-center rounded-btn transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-2 focus-visible:ring-offset-2 active:scale-95 disabled:opacity-50 disabled:pointer-events-none select-none shrink-0'

  const sizeClasses = {
    sm: 'w-10 h-10 min-w-[44px] min-h-[44px] text-sm',
    md: 'w-11 h-11 min-w-[44px] min-h-[44px] text-base',
    lg: 'w-12 h-12 min-w-[48px] min-h-[48px] text-lg',
  }

  const variantClasses = {
    primary:
      'accent-gradient-bg text-white shadow-sm hover:brightness-110 border border-transparent',
    secondary:
      'bg-surface hover:bg-surface-2 text-text border border-border hover:border-accent-1/50 shadow-sm',
    ghost:
      'bg-transparent hover:bg-surface-2 text-text-muted hover:text-text border border-transparent',
  }

  const classes = clsx(
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    className
  )

  if (to) {
    return (
      <Link
        to={to}
        className={classes}
        aria-label={ariaLabel}
        onClick={onClick}
        {...props}
      >
        {children}
      </Link>
    )
  }

  if (href) {
    const isExternal = href.startsWith('http') || href.startsWith('mailto:')
    return (
      <a
        href={href}
        className={classes}
        target={isExternal && !href.startsWith('mailto:') ? '_blank' : undefined}
        rel={isExternal && !href.startsWith('mailto:') ? 'noopener noreferrer' : undefined}
        aria-label={ariaLabel}
        onClick={onClick}
        {...props}
      >
        {children}
      </a>
    )
  }

  return (
    <button
      type="button"
      className={classes}
      disabled={disabled}
      aria-label={ariaLabel}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}
