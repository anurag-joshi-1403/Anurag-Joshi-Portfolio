import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Navbar } from './Navbar'

function navLinks() {
  const nav = screen.getByRole('navigation', { name: 'Primary' })
  return within(nav)
    .getAllByRole('link')
    .map((link) => link.textContent)
}

describe('Navbar', () => {
  it("shows the owner's name, or a plain Home link before the profile loads", () => {
    const { rerender } = render(<Navbar name={null} showAchievements={false} />)
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '#home')

    rerender(<Navbar name="Test Owner" showAchievements={false} />)
    expect(screen.getByRole('link', { name: 'Test Owner' })).toHaveAttribute('href', '#home')
  })

  it('links to Achievements only when that section is shown (FR-ACH-1)', () => {
    const { rerender } = render(<Navbar name={null} showAchievements={false} />)
    expect(navLinks()).toEqual(['Home', 'About', 'Skills', 'Projects', 'Education', 'Contact'])

    rerender(<Navbar name={null} showAchievements />)
    expect(navLinks()).toEqual(['Home', 'About', 'Skills', 'Projects', 'Education', 'Achievements', 'Contact'])
  })

  it('opens the mobile menu, and Escape closes it and returns focus to the button (FR-NAV-2)', async () => {
    const user = userEvent.setup()
    render(<Navbar name={null} showAchievements={false} />)
    const toggle = screen.getByRole('button', { name: 'Open menu' })

    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(toggle).toHaveAccessibleName('Close menu')

    await user.keyboard('{Escape}')
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(toggle).toHaveFocus()
  })

  it('closes the mobile menu after a link is chosen', async () => {
    const user = userEvent.setup()
    render(<Navbar name={null} showAchievements={false} />)
    const toggle = screen.getByRole('button', { name: 'Open menu' })

    await user.click(toggle)
    await user.click(screen.getByRole('link', { name: 'Projects' }))

    expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })
})
