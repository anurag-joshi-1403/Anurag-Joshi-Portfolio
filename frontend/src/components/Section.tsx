import type { ReactNode } from 'react'
import styles from './Section.module.css'

type SectionProps = {
  id: string
  title: string
  children: ReactNode
}

/** Shared wrapper for every content section: anchor id, heading, and spacing. */
export function Section({ id, title, children }: SectionProps) {
  const headingId = `${id}-heading`

  return (
    <section id={id} className={styles.section} aria-labelledby={headingId}>
      <div className="container">
        <h2 id={headingId} className={styles.title}>
          {title}
        </h2>
        {children}
      </div>
    </section>
  )
}
