import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ApiError } from '../api/client'
import { useApi } from './useApi'

describe('useApi', () => {
  it('starts loading, then holds the data', async () => {
    const fetcher = vi.fn(async () => ['Java'])
    const { result } = renderHook(() => useApi(fetcher))

    expect(result.current.state).toEqual({ status: 'loading' })
    await waitFor(() => expect(result.current.state).toEqual({ status: 'success', data: ['Java'] }))
  })

  it('keeps an ApiError as is', async () => {
    const apiError = new ApiError('The database is unavailable right now.', 503)
    const fetcher = vi.fn(async () => {
      throw apiError
    })
    const { result } = renderHook(() => useApi(fetcher))

    await waitFor(() => expect(result.current.state).toEqual({ status: 'error', error: apiError }))
  })

  it('wraps any other failure in a generic ApiError', async () => {
    const fetcher = vi.fn(async () => {
      throw new Error('boom')
    })
    const { result } = renderHook(() => useApi(fetcher))

    await waitFor(() => expect(result.current.state.status).toBe('error'))
    const { state } = result.current
    expect(state.status === 'error' && state.error).toMatchObject({ message: 'Something went wrong.' })
  })

  it('fetches again on retry, showing loading in between', async () => {
    const fetcher = vi
      .fn<(signal: AbortSignal) => Promise<string>>()
      .mockRejectedValueOnce(new ApiError('Down', 503))
      .mockResolvedValueOnce('Back up')
    const { result } = renderHook(() => useApi(fetcher))
    await waitFor(() => expect(result.current.state.status).toBe('error'))

    act(() => result.current.retry())

    expect(result.current.state).toEqual({ status: 'loading' })
    await waitFor(() => expect(result.current.state).toEqual({ status: 'success', data: 'Back up' }))
    expect(fetcher).toHaveBeenCalledTimes(2)
  })

  it('cancels the request when the component unmounts', () => {
    let signal: AbortSignal | undefined
    const fetcher = vi.fn((s: AbortSignal) => {
      signal = s
      return new Promise<never>(() => {})
    })
    const { unmount } = renderHook(() => useApi(fetcher))

    unmount()

    expect(signal?.aborted).toBe(true)
  })
})
