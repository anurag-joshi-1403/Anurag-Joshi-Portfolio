import { ArrowRight, Download, Mail, MapPin } from 'lucide-react'
import type { Profile } from '../api/profile'
import buttonStyles from '../components/Button.module.css'
import { DataState } from '../components/DataState'
import type { ApiState } from '../hooks/useApi'
import styles from './Hero.module.css'

type HeroProps = {
  profile: ApiState<Profile>
  onRetry: () => void
}

const primary = `${buttonStyles.button} ${buttonStyles.primary}`
const secondary = `${buttonStyles.button} ${buttonStyles.secondary}`

export function Hero({ profile, onRetry }: HeroProps) {
  return (
    <section id="home" className={styles.hero} aria-label="Introduction">
      <div className="container">
        <div className={styles.card}>
          {/* Reserves the introduction's height while it loads, so nothing shifts when it arrives. */}
          <div className={styles.introSlot}>
            <DataState state={profile} onRetry={onRetry} what="the introduction" skeletonLines={4}>
              {(data) => (
                <div className={styles.intro}>
                  <p className={styles.eyebrow}>Hi, I&rsquo;m</p>
                  <h1 className={styles.name}>{data.name}</h1>
                  <p className={styles.title}>{data.title}</p>
                  <p className={styles.tagline}>{data.tagline}</p>
                  {data.location && (
                    <p className={styles.location}>
                      <MapPin aria-hidden="true" />
                      {data.location}
                    </p>
                  )}
                </div>
              )}
            </DataState>
          </div>

          {/* FR-HERO-2: the next actions stay available even while the profile loads. */}
          <div className={styles.actions}>
            <a href="#projects" className={primary}>
              View Projects
              <ArrowRight aria-hidden="true" />
            </a>
            {profile.status === 'success' ? (
              <ResumeAction resumeUrl={profile.data.resumeUrl} />
            ) : (
              // Invisible stand-in the size of the resume button, so the row doesn't grow (and the
              // centred hero doesn't jump) when the profile arrives. Its label is CSS-only.
              <span className={`${buttonStyles.button} ${buttonStyles.pending} ${styles.reserved}`} aria-hidden="true">
                <Download />
              </span>
            )}
            <a href="#contact" className={secondary}>
              <Mail aria-hidden="true" />
              Contact Me
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function ResumeAction({ resumeUrl }: { resumeUrl: string | null }) {
  if (!resumeUrl) {
    return (
      <span className={`${buttonStyles.button} ${buttonStyles.pending}`}>
        <Download aria-hidden="true" />
        Resume coming soon
      </span>
    )
  }

  // A file served with this site (e.g. /resume.pdf) can be downloaded directly;
  // a file hosted elsewhere opens in a new tab instead.
  const sameSite = resumeUrl.startsWith('/')
  return (
    <a
      href={resumeUrl}
      className={secondary}
      {...(sameSite ? { download: '' } : { target: '_blank', rel: 'noopener noreferrer' })}
    >
      <Download aria-hidden="true" />
      Download Resume
      {!sameSite && <span className="visually-hidden"> (opens in a new tab)</span>}
    </a>
  )
}
