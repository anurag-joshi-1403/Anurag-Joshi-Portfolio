import { Award, BadgeCheck } from 'lucide-react'
import type { Certification } from '../api/certifications'
import { NewTabLink } from '../components/NewTabLink'
import { Section } from '../components/Section'
import styles from './Achievements.module.css'

/** "May 2026", read from the ISO date's own year and month (no timezone shift). */
function formatMonth(isoDate: string) {
  const [year, month] = isoDate.split('-').map(Number)
  return new Date(year, month - 1).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
}

/** Only rendered once real certifications exist (FR-ACH-1); App decides that. */
export function Achievements({ certifications }: { certifications: Certification[] }) {
  return (
    <Section id="achievements" title="Achievements">
      <ul className={styles.grid}>
        {certifications.map((certification) => (
          <li key={certification.id} className={styles.card}>
            <Award aria-hidden="true" className={styles.icon} />
            <div className={styles.details}>
              <h3 className={styles.name}>{certification.name}</h3>
              <p>{certification.issuer}</p>
              <p className={styles.date}>
                <time dateTime={certification.date}>{formatMonth(certification.date)}</time>
              </p>
              {certification.verifyUrl && (
                <NewTabLink href={certification.verifyUrl} className={styles.verify}>
                  <BadgeCheck aria-hidden="true" />
                  Verify<span className="visually-hidden"> {certification.name}</span>
                </NewTabLink>
              )}
            </div>
          </li>
        ))}
      </ul>
    </Section>
  )
}
