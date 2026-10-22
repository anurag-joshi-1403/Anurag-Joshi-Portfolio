import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from '../api/client'
import { sendContactMessage } from '../api/contact'
import { ContactForm } from './ContactForm'

vi.mock('../api/contact', () => ({ sendContactMessage: vi.fn() }))
const send = vi.mocked(sendContactMessage)

beforeEach(() => {
  send.mockReset()
})

function setup(fallbackEmail: string | null = 'owner@example.test') {
  const user = userEvent.setup()
  render(<ContactForm fallbackEmail={fallbackEmail} />)
  return {
    user,
    name: screen.getByLabelText('Name'),
    email: screen.getByLabelText('Email'),
    message: screen.getByLabelText('Message'),
    submit: screen.getByRole('button', { name: /send message/i }),
  }
}

describe('ContactForm', () => {
  it('flags every empty field on submit, focuses the first, and sends nothing', async () => {
    const { user, name, email, message, submit } = setup()

    await user.click(submit)

    expect(name).toHaveAccessibleDescription('Please enter your name.')
    expect(email).toHaveAccessibleDescription('Please enter your email address.')
    expect(message).toHaveAccessibleDescription('Please enter a message.')
    expect(name).toHaveAttribute('aria-invalid', 'true')
    expect(name).toHaveFocus()
    expect(send).not.toHaveBeenCalled()
  })

  it('checks a field on leaving it only after the visitor has typed in it', async () => {
    const { user, name, email } = setup()

    await user.click(name)
    await user.tab() // left Name without typing
    expect(name).not.toHaveAttribute('aria-invalid')

    await user.type(email, 'not-an-email')
    await user.tab()
    expect(email).toHaveAccessibleDescription('Please enter a valid email address.')

    await user.type(email, '@example.com') // now "not-an-email@example.com"
    expect(email).not.toHaveAttribute('aria-invalid')
  })

  it('sends trimmed values, shows the server confirmation, and clears the form', async () => {
    send.mockResolvedValueOnce({ message: 'Thanks for getting in touch. Your message has been sent.' })
    const { user, name, email, message, submit } = setup()

    await user.type(name, '  Priya Sharma ')
    await user.type(email, 'priya@example.com ')
    await user.type(message, ' Are you open to a freelance project? ')
    await user.click(submit)

    expect(send).toHaveBeenCalledWith({
      name: 'Priya Sharma',
      email: 'priya@example.com',
      message: 'Are you open to a freelance project?',
    })
    expect(await screen.findByText('Thanks for getting in touch. Your message has been sent.')).toBeInTheDocument()
    expect(name).toHaveValue('')
    expect(message).toHaveValue('')
  })

  it('disables the button while sending so a message cannot be sent twice', async () => {
    let finish: (value: { message: string }) => void = () => {}
    send.mockReturnValueOnce(new Promise((resolve) => (finish = resolve)))
    const { user, name, email, message, submit } = setup()
    await user.type(name, 'Priya')
    await user.type(email, 'priya@example.com')
    await user.type(message, 'Hello')

    await user.click(submit)

    expect(submit).toBeDisabled()
    expect(submit).toHaveTextContent('Sending')
    finish({ message: 'Sent.' })
    expect(await screen.findByText('Sent.')).toBeInTheDocument()
    expect(submit).toBeEnabled()
  })

  it('shows server-side field errors next to the matching field', async () => {
    send.mockRejectedValueOnce(
      new ApiError('Some fields need attention.', 400, { email: 'Please enter a valid email address.' }),
    )
    const { user, name, email, message, submit } = setup()
    await user.type(name, 'Priya')
    await user.type(email, 'priya@example.com')
    await user.type(message, 'Hello')

    await user.click(submit)

    expect(await screen.findByText('Some fields need attention.')).toBeInTheDocument()
    expect(email).toHaveAccessibleDescription('Please enter a valid email address.')
    expect(email).toHaveFocus()
    // The visitor can fix this themselves, so no "email me directly" detour is offered.
    expect(screen.queryByRole('link', { name: 'owner@example.test' })).not.toBeInTheDocument()
  })

  it('reports a delivery failure honestly, keeps the text, and offers the direct email', async () => {
    send.mockRejectedValueOnce(new ApiError("Your message couldn't be sent right now.", 503))
    const { user, name, email, message, submit } = setup()
    await user.type(name, 'Priya')
    await user.type(email, 'priya@example.com')
    await user.type(message, 'Hello')

    await user.click(submit)

    expect(await screen.findByText(/Your message couldn't be sent right now\./)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'owner@example.test' })).toHaveAttribute(
      'href',
      'mailto:owner@example.test',
    )
    expect(message).toHaveValue('Hello')
  })
})
