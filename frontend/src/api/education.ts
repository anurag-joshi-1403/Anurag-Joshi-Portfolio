import { getJson } from './client'

export type Education = {
  id: number
  institution: string
  degree: string
  field: string | null
  startYear: number
  /** Expected graduation year while the course is still running. */
  endYear: number | null
  notes: string | null
}

export const getEducation = (signal: AbortSignal) => getJson<Education[]>('/api/education', signal)
