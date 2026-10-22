import { getJson } from './client'

/** Null fields are details the owner hasn't supplied yet; the UI shows them as pending. */
export type Profile = {
  name: string
  title: string
  tagline: string
  bio: string
  interests: string | null
  objective: string | null
  location: string | null
  email: string | null
  resumeUrl: string | null
  githubUrl: string | null
  linkedinUrl: string | null
}

export const getProfile = (signal: AbortSignal) => getJson<Profile>('/api/profile', signal)
