import React from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  to,
  href,
  onClick,
  type = 'button',
  className = '',
  leftIcon = null,
  rightIcon = null,
  'aria-label': ariaLabel,
  ...props
}) {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-btn transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-2 focus-visible:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 select-none'

  const sizeClasses = {
    sm: 'text-xs px-3.5 py-2 min-h-[44px] gap-1.5',
    md: 'text-sm px-5 py-2.5 min-h-[44px] gap-2',
    lg: 'text-base px-6 py-3 min-h-[48px] gap-2.5',
  }

  const variantClasses = {
    primary:
      'accent-gradient-bg text-white shadow-sm hover:brightness-110 hover:shadow-md border border-transparent',
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

  const content = (
    <>
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
      ) : (
        leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
    </>
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
        {content}
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
        {content}
      </a>
    )
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      aria-label={ariaLabel}
      onClick={onClick}
      {...props}
    >
      {content}
    </button>
  )
}
