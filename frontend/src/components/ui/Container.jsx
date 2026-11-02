import React from 'react'
import clsx from 'clsx'

export function Container({ children, className = '', as: Component = 'div', ...props }) {
  return (
    <Component
      className={clsx('w-full max-w-container mx-auto px-4 sm:px-6 lg:px-8', className)}
      {...props}
    >
      {children}
    </Component>
  )
}
