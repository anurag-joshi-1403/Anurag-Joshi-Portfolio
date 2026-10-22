import type { Certification } from '../api/certifications'
import type { Education } from '../api/education'
import type { Profile } from '../api/profile'
import type { Project } from '../api/projects'
import type { SkillGroup } from '../api/skills'

// Sample API responses for tests. Deliberately not the real seed data, so tests prove the
// components render whatever the API returns rather than anything built in.

export const profile: Profile = {
  name: 'Test Owner',
  title: 'Java Full-Stack Developer',
  tagline: 'Builds APIs and the interfaces that use them.',
  bio: 'A test biography.',
  interests: 'Test interests.',
  objective: 'A test career objective.',
  location: 'Test City',
  email: 'owner@example.test',
  resumeUrl: null,
  githubUrl: 'https://github.com/test-owner',
  linkedinUrl: null,
}

export const skills: SkillGroup[] = [
  { category: 'Languages', skills: [{ id: 1, name: 'Java' }] },
  { category: 'Backend', skills: [{ id: 2, name: 'Spring Boot' }] },
]

export const projects: Project[] = [
  {
    id: 1,
    name: 'Featured Project',
    description: 'A featured test project.',
    problem: 'A test problem.',
    techStack: ['Java', 'Spring Boot'],
    imageUrl: null,
    githubUrl: 'https://github.com/test-owner/featured',
    liveUrl: null,
    featured: true,
  },
  {
    id: 2,
    name: 'Side Project',
    description: 'A second test project.',
    problem: 'Another test problem.',
    techStack: ['React'],
    imageUrl: null,
    githubUrl: null,
    liveUrl: 'https://side.example.test',
    featured: false,
  },
]

export const education: Education[] = [
  {
    id: 1,
    institution: 'Test University',
    degree: 'B.Tech',
    field: 'Computer Science and Engineering',
    startYear: 2023,
    endYear: 2027,
    notes: null,
  },
]

export const certification: Certification = {
  id: 1,
  name: 'Test Java Training',
  issuer: 'Test Institute',
  date: '2026-08-05',
  verifyUrl: null,
}

export function jsonResponse(body: unknown, status = 200, contentType = 'application/json') {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': contentType } })
}
