import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ApiError } from '../api/client'
import { DataState } from './DataState'

describe('DataState', () => {
  it('announces loading, then explains a slow server after 5 seconds', () => {
    vi.useFakeTimers()
    render(
      <DataState state={{ status: 'loading' }} onRetry={() => {}} what="projects">
        {() => null}
      </DataState>,
    )

    expect(screen.getByRole('status')).toHaveTextContent('Loading projects')
    expect(screen.queryByText(/server may be waking up/)).not.toBeInTheDocument()

    act(() => vi.advanceTimersByTime(5000))

    expect(screen.getByText(/server may be waking up/)).toBeInTheDocument()
  })

  it('shows the error with a working retry button', async () => {
    const onRetry = vi.fn()
    render(
      <DataState
        state={{ status: 'error', error: new ApiError('The database is unavailable right now.', 503) }}
        onRetry={onRetry}
        what="projects"
      >
        {() => null}
      </DataState>,
    )

    expect(screen.getByText(/Couldn.t load projects\. The database is unavailable right now\./)).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }))
    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('renders the loaded data', () => {
    render(
      <DataState state={{ status: 'success', data: ['Java', 'React'] }} onRetry={() => {}} what="skills">
        {(skills) => <p>{skills.join(', ')}</p>}
      </DataState>,
    )

    expect(screen.getByText('Java, React')).toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})
