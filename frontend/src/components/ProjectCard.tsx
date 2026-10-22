import { ExternalLink, FolderGit2, Star } from 'lucide-react'
import type { Project } from '../api/projects'
import { NewTabLink } from './NewTabLink'
import styles from './ProjectCard.module.css'

export function ProjectCard({ project }: { project: Project }) {
  const headingId = `project-${project.id}`

  return (
    <article className={styles.card} aria-labelledby={headingId}>
      {project.imageUrl && (
        <img
          className={styles.image}
          src={project.imageUrl}
          alt={`Screenshot of ${project.name}`}
          width={1600}
          height={1000}
          loading="lazy"
          decoding="async"
        />
      )}

      <div className={styles.body}>
        <div className={styles.header}>
          <h3 id={headingId} className={styles.name}>
            {project.name}
          </h3>
          {project.featured && (
            <span className={styles.featured}>
              <Star aria-hidden="true" />
              Featured
            </span>
          )}
        </div>

        <p>{project.description}</p>

        <div>
          <h4 className={styles.label}>Problem solved</h4>
          <p className={styles.problem}>{project.problem}</p>
        </div>

        <div>
          <h4 className="visually-hidden">Tech stack</h4>
          <ul className={styles.tech}>
            {project.techStack.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
        </div>

        <div className={styles.links}>
          {project.githubUrl ? (
            <NewTabLink href={project.githubUrl} className={styles.link}>
              <FolderGit2 aria-hidden="true" />
              Code<span className="visually-hidden"> for {project.name} on GitHub</span>
            </NewTabLink>
          ) : (
            <span className={styles.pending}>Code link coming soon</span>
          )}
          {project.liveUrl ? (
            <NewTabLink href={project.liveUrl} className={styles.link}>
              <ExternalLink aria-hidden="true" />
              Live demo<span className="visually-hidden"> of {project.name}</span>
            </NewTabLink>
          ) : (
            <span className={styles.pending}>No live demo yet</span>
          )}
        </div>
      </div>
    </article>
  )
}
