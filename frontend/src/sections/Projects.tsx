import { getProjects } from '../api/projects'
import { DataState } from '../components/DataState'
import { ProjectCard } from '../components/ProjectCard'
import { Section } from '../components/Section'
import { useApi } from '../hooks/useApi'
import styles from './Projects.module.css'

export function Projects() {
  const { state, retry } = useApi(getProjects)

  return (
    <Section id="projects" title="Projects">
      <DataState state={state} onRetry={retry} what="projects" skeletonLines={6}>
        {(projects) => (
          <div className={styles.grid}>
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </DataState>
    </Section>
  )
}
