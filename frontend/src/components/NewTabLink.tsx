import type { ReactNode } from 'react'

type NewTabLinkProps = {
  href: string
  className?: string
  children: ReactNode
}

/** An external link that opens in a new tab and tells screen-reader users so. */
export function NewTabLink({ href, className, children }: NewTabLinkProps) {
  return (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer">
      {children}
      <span className="visually-hidden"> (opens in a new tab)</span>
    </a>
  )
}
