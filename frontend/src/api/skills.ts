import { getJson } from './client'

export type Skill = {
  id: number
  name: string
}

/** Skills arrive grouped and already in display order (Languages, Backend, Frontend, ...). */
export type SkillGroup = {
  category: string
  skills: Skill[]
}

export const getSkills = (signal: AbortSignal) => getJson<SkillGroup[]>('/api/skills', signal)
