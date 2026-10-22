import { getSkills } from '../api/skills'
import { DataState } from '../components/DataState'
import { Section } from '../components/Section'
import { SkillBadge } from '../components/SkillBadge'
import { useApi } from '../hooks/useApi'
import styles from './Skills.module.css'

export function Skills() {
  const { state, retry } = useApi(getSkills)

  return (
    <Section id="skills" title="Skills">
      <DataState state={state} onRetry={retry} what="skills" skeletonLines={5}>
        {(groups) => (
          <div className={styles.grid}>
            {groups.map((group) => (
              <article key={group.category} className={styles.group}>
                <h3 className={styles.category}>{group.category}</h3>
                <ul className={styles.badges}>
                  {group.skills.map((skill) => (
                    <SkillBadge key={skill.id} name={skill.name} />
                  ))}
                </ul>
              </article>
            ))}
          </div>
        )}
      </DataState>
    </Section>
  )
}
