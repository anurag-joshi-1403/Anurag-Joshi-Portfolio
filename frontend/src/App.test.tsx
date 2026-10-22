import { render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import App from './App'
import { certification, education, jsonResponse, profile, projects, skills } from './test/fixtures'

function mockApi(certifications: unknown[] = []) {
  const responses: Record<string, unknown> = {
    '/api/profile': profile,
    '/api/skills': skills,
    '/api/projects': projects,
    '/api/education': education,
    '/api/certifications': certifications,
  }
  const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
    const path = new URL(String(input)).pathname
    return path in responses ? jsonResponse(responses[path]) : jsonResponse({ detail: 'Not found' }, 404)
  })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

describe('App', () => {
  it('renders every section from the API responses (FR-DATA-1)', async () => {
    const fetchMock = mockApi()
    render(<App />)

    expect(await screen.findByRole('heading', { level: 1, name: 'Test Owner' })).toBeInTheDocument()
    expect(screen.getByText(profile.tagline)).toBeInTheDocument()

    const section = (name: string) => within(screen.getByRole('region', { name }))
    expect(section('About').getByText(profile.bio)).toBeInTheDocument()
    expect(await section('Skills').findByText('Spring Boot')).toBeInTheDocument()
    expect(await section('Projects').findByRole('heading', { name: 'Featured Project' })).toBeInTheDocument()
    expect(await section('Education').findByText('B.Tech in Computer Science and Engineering')).toBeInTheDocument()
    expect(section('Education').getByText('2023 – 2027 (expected)')).toBeInTheDocument()
    expect(section('Contact').getByRole('link', { name: 'owner@example.test' })).toHaveAttribute(
      'href',
      'mailto:owner@example.test',
    )

    const requested = fetchMock.mock.calls.map(([input]) => new URL(String(input)).pathname).sort()
    expect(requested).toEqual([
      '/api/certifications',
      '/api/education',
      '/api/profile',
      '/api/projects',
      '/api/skills',
    ])
  })

  it('marks missing links as pending instead of rendering broken ones', async () => {
    mockApi()
    render(<App />)

    expect(await screen.findByText('Resume coming soon')).toBeInTheDocument()
    expect(screen.getByText('LinkedIn link coming soon')).toBeInTheDocument()
    const sideProject = screen.getByRole('article', { name: 'Side Project' })
    expect(within(sideProject).getByText('Code link coming soon')).toBeInTheDocument()
    expect(within(sideProject).getByRole('link', { name: /Live demo/ })).toHaveAttribute(
      'href',
      'https://side.example.test',
    )
  })

  it('hides Achievements while there are no certifications (FR-ACH-1)', async () => {
    mockApi([])
    render(<App />)

    await screen.findByRole('heading', { level: 1, name: 'Test Owner' })
    expect(screen.queryByRole('heading', { name: 'Achievements' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Achievements' })).not.toBeInTheDocument()
  })

  it('shows Achievements and its nav link once a certification exists', async () => {
    mockApi([certification])
    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Achievements' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Achievements' })).toHaveAttribute('href', '#achievements')
    expect(screen.getByText('Test Java Training')).toBeInTheDocument()
    expect(screen.getByText('Aug 2026')).toBeInTheDocument()
  })

  it('keeps the page usable when the API is down', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new TypeError('Failed to fetch')
      }),
    )
    render(<App />)

    expect(await screen.findByText(/Couldn.t load projects/)).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Try again' }).length).toBeGreaterThan(1)
    // Navigation, the main calls to action, and the contact form still work without data.
    expect(screen.getByRole('link', { name: /View Projects/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Send message/ })).toBeInTheDocument()
  })
})
