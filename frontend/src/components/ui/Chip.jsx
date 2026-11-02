import React from 'react'
import clsx from 'clsx'

export function Chip({
  children,
  icon = null,
  level = null,
  size = 'md',
  className = '',
  ...props
}) {
  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1 gap-1.5',
    md: 'text-xs md:text-sm px-3.5 py-1.5 gap-2',
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center font-mono rounded-full bg-surface-2 border border-border text-text transition-colors duration-150',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {icon && <span className="inline-flex shrink-0 text-accent-1 dark:text-accent-2" aria-hidden="true">{icon}</span>}
      <span className="truncate">{children}</span>
      {level && (
        <span className="ml-1 text-[10px] uppercase tracking-wider text-text-subtle border-l border-border pl-1.5 font-sans">
          {level}
        </span>
      )}
    </span>
  )
}
