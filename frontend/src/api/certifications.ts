import { getJson } from './client'

export type Certification = {
  id: number
  name: string
  issuer: string
  /** ISO date, e.g. "2026-05-01" */
  date: string
  verifyUrl: string | null
}

export const getCertifications = (signal: AbortSignal) =>
  getJson<Certification[]>('/api/certifications', signal)
