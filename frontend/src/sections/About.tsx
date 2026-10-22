import { Lightbulb, Target } from 'lucide-react'
import type { Profile } from '../api/profile'
import { DataState } from '../components/DataState'
import { Section } from '../components/Section'
import type { ApiState } from '../hooks/useApi'
import styles from './About.module.css'

type AboutProps = {
  profile: ApiState<Profile>
  onRetry: () => void
}

export function About({ profile, onRetry }: AboutProps) {
  return (
    <Section id="about" title="About">
      <DataState state={profile} onRetry={onRetry} what="the About section" skeletonLines={4}>
        {(data) => (
          <div className={styles.layout}>
            <p className={styles.bio}>{data.bio}</p>
            <div className={styles.cards}>
              {data.interests && (
                <article className={styles.card}>
                  <h3>
                    <Lightbulb aria-hidden="true" />
                    Interests
                  </h3>
                  <p>{data.interests}</p>
                </article>
              )}
              {data.objective && (
                <article className={styles.card}>
                  <h3>
                    <Target aria-hidden="true" />
                    What I&rsquo;m looking for
                  </h3>
                  <p>{data.objective}</p>
                </article>
              )}
            </div>
          </div>
        )}
      </DataState>
    </Section>
  )
}
