import { BriefcaseBusiness, FolderGit2, Mail } from 'lucide-react'
import type { Profile } from '../api/profile'
import { ContactForm } from '../components/ContactForm'
import { DataState } from '../components/DataState'
import { NewTabLink } from '../components/NewTabLink'
import { Section } from '../components/Section'
import type { ApiState } from '../hooks/useApi'
import styles from './Contact.module.css'

type ContactProps = {
  profile: ApiState<Profile>
  onRetry: () => void
}

export function Contact({ profile, onRetry }: ContactProps) {
  const fallbackEmail = profile.status === 'success' ? profile.data.email : null

  return (
    <Section id="contact" title="Contact">
      <div className={styles.layout}>
        <div className={styles.intro}>
          <p className={styles.lead}>
            Hiring for a developer role, or have a project in mind? Send a message and it comes straight to my
            inbox.
          </p>
          <DataState state={profile} onRetry={onRetry} what="contact details" skeletonLines={3}>
            {(data) => (
              <ul className={styles.links}>
                <li>
                  {data.email ? (
                    <a href={`mailto:${data.email}`} className={styles.link}>
                      <Mail aria-hidden="true" />
                      {data.email}
                    </a>
                  ) : (
                    <span className={styles.pending}>
                      <Mail aria-hidden="true" />
                      Email address coming soon
                    </span>
                  )}
                </li>
                <li>
                  {data.githubUrl ? (
                    <NewTabLink href={data.githubUrl} className={styles.link}>
                      <FolderGit2 aria-hidden="true" />
                      GitHub
                    </NewTabLink>
                  ) : (
                    <span className={styles.pending}>
                      <FolderGit2 aria-hidden="true" />
                      GitHub link coming soon
                    </span>
                  )}
                </li>
                <li>
                  {data.linkedinUrl ? (
                    <NewTabLink href={data.linkedinUrl} className={styles.link}>
                      <BriefcaseBusiness aria-hidden="true" />
                      LinkedIn
                    </NewTabLink>
                  ) : (
                    <span className={styles.pending}>
                      <BriefcaseBusiness aria-hidden="true" />
                      LinkedIn link coming soon
                    </span>
                  )}
                </li>
              </ul>
            )}
          </DataState>
        </div>

        <ContactForm fallbackEmail={fallbackEmail} />
      </div>
    </Section>
  )
}
