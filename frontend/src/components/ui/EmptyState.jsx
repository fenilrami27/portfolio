import React from 'react'
import clsx from 'clsx'
import { LuInbox } from 'react-icons/lu'

export function EmptyState({
  icon = <LuInbox className="w-10 h-10 text-text-subtle" />,
  title = 'No items found',
  description = 'There are no entries to display at this time.',
  action = null,
  className = '',
  ...props
}) {
  return (
    <div
      className={clsx(
        'rounded-card border border-dashed border-border p-8 md:p-12 text-center flex flex-col items-center justify-center bg-surface/50',
        className
      )}
      role="status"
      {...props}
    >
      <div className="w-16 h-16 rounded-full bg-surface-2 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-text mb-2">{title}</h3>
      <p className="text-sm text-text-muted max-w-sm mb-6 leading-relaxed">{description}</p>
      {action && <div>{action}</div>}
    </div>
  )
}
