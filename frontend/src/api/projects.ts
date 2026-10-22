import { getJson } from './client'

export type Project = {
  id: number
  name: string
  description: string
  problem: string
  techStack: string[]
  imageUrl: string | null
  githubUrl: string | null
  liveUrl: string | null
  featured: boolean
}

/** Featured projects come first. */
export const getProjects = (signal: AbortSignal) => getJson<Project[]>('/api/projects', signal)
