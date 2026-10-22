import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { ThemeToggle } from './ThemeToggle'

let meta: HTMLMetaElement

beforeEach(() => {
  // index.html ships this tag; the toggle writes the chosen scheme into it.
  meta = document.createElement('meta')
  meta.name = 'color-scheme'
  meta.content = 'light dark'
  document.head.append(meta)
})

afterEach(() => {
  meta.remove()
})

function systemPrefers(scheme: 'light' | 'dark') {
  const original = window.matchMedia
  window.matchMedia = (query: string) => ({
    ...original(query),
    matches: query === '(prefers-color-scheme: dark)' && scheme === 'dark',
  })
}

describe('ThemeToggle', () => {
  it('switches a light system to dark, then back to following the system', async () => {
    systemPrefers('light')
    render(<ThemeToggle />)
    const toggle = screen.getByRole('button')

    await userEvent.click(toggle)
    expect(meta.content).toBe('dark')
    expect(localStorage.getItem('color-scheme')).toBe('dark')

    await userEvent.click(toggle)
    // Back to what the system shows: nothing is stored, so future OS changes apply again.
    expect(meta.content).toBe('light dark')
    expect(localStorage.getItem('color-scheme')).toBeNull()
  })

  it('pins light when the system is dark', async () => {
    systemPrefers('dark')
    render(<ThemeToggle />)

    await userEvent.click(screen.getByRole('button'))

    expect(meta.content).toBe('light')
    expect(localStorage.getItem('color-scheme')).toBe('light')
  })

  it('follows a theme change made in another tab', () => {
    render(<ThemeToggle />)

    localStorage.setItem('color-scheme', 'dark')
    window.dispatchEvent(new StorageEvent('storage', { key: 'color-scheme' }))

    expect(meta.content).toBe('dark')
  })
})
