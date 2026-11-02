import React from 'react'
import clsx from 'clsx'

export function Card({
  children,
  as: Component = 'div',
  hoverable = true,
  className = '',
  ...props
}) {
  return (
    <Component
      className={clsx(
        'rounded-card bg-surface border border-border transition-all duration-200',
        hoverable && 'bento-card hover:shadow-lg',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}
