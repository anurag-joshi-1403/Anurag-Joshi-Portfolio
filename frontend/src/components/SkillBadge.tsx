import styles from './SkillBadge.module.css'

/** A skill name only: no proficiency bars or percentages (FR-SKILLS-2). */
export function SkillBadge({ name }: { name: string }) {
  return <li className={styles.badge}>{name}</li>
}
