import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Footer } from './Footer'

describe('Footer', () => {
  it("takes the copyright year from the visitor's clock (FR-FOOTER-1)", () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2031-03-01T12:00:00'))

    render(<Footer name="Test Owner" />)

    expect(screen.getByText('© 2031 Test Owner')).toBeInTheDocument()
  })

  it('leaves the name out until the profile has loaded', () => {
    render(<Footer name={null} />)

    expect(screen.getByText(`© ${new Date().getFullYear()}`)).toBeInTheDocument()
  })
})
