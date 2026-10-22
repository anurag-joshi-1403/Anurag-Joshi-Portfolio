import { GraduationCap } from 'lucide-react'
import { getEducation, type Education as EducationEntry } from '../api/education'
import { DataState } from '../components/DataState'
import { Section } from '../components/Section'
import { useApi } from '../hooks/useApi'
import styles from './Education.module.css'

/** "2023 – 2027 (expected)" while the end year is still in the future. */
function formatYears({ startYear, endYear }: EducationEntry) {
  if (endYear === null) return `${startYear} – present`
  const expected = endYear > new Date().getFullYear() ? ' (expected)' : ''
  return `${startYear} – ${endYear}${expected}`
}

export function Education() {
  const { state, retry } = useApi(getEducation)

  return (
    <Section id="education" title="Education">
      <DataState state={state} onRetry={retry} what="education" skeletonLines={3}>
        {(entries) => (
          <ol className={styles.list}>
            {entries.map((entry) => (
              <li key={entry.id} className={styles.entry}>
                <span className={styles.icon} aria-hidden="true">
                  <GraduationCap />
                </span>
                <div className={styles.details}>
                  <h3 className={styles.degree}>
                    {entry.degree}
                    {entry.field && ` in ${entry.field}`}
                  </h3>
                  <p>{entry.institution}</p>
                  <p className={styles.years}>{formatYears(entry)}</p>
                  {entry.notes && <p className={styles.notes}>{entry.notes}</p>}
                </div>
              </li>
            ))}
          </ol>
        )}
      </DataState>
    </Section>
  )
}
