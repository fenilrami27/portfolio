import React from 'react'
import clsx from 'clsx'

export function Skeleton({ className = '', rounded = 'rounded-md', ...props }) {
  return (
    <div
      className={clsx(
        'animate-pulse bg-surface-2/80 dark:bg-surface-2/60 border border-border/40',
        rounded,
        className
      )}
      aria-hidden="true"
      {...props}
    />
  )
}
