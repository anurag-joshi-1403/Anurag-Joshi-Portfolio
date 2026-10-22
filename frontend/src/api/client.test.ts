// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { jsonResponse } from '../test/fixtures'
import { ApiError, getJson, postJson } from './client'

const fetchMock = vi.fn<typeof fetch>()

beforeEach(() => {
  fetchMock.mockReset()
  vi.stubGlobal('fetch', fetchMock)
})

async function caught(promise: Promise<unknown>) {
  return promise.then(
    () => {
      throw new Error('Expected the request to fail')
    },
    (error: unknown) => error,
  )
}

describe('getJson', () => {
  it('requests the path under VITE_API_URL and returns the parsed body', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse([{ id: 1 }]))

    await expect(getJson('/api/projects')).resolves.toEqual([{ id: 1 }])
    expect(fetchMock).toHaveBeenCalledWith(
      'http://api.test/api/projects',
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    )
  })

  it('turns a problem response into an ApiError carrying the server detail', async () => {
    const detail = 'The database is unavailable right now. Please try again later.'
    fetchMock.mockResolvedValueOnce(jsonResponse({ detail }, 503, 'application/problem+json'))

    const error = await caught(getJson('/api/profile'))

    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({ status: 503, message: detail })
  })

  it('falls back to a generic message when the error body is not JSON', async () => {
    fetchMock.mockResolvedValueOnce(new Response('<html>Bad gateway</html>', { status: 502 }))

    const error = await caught(getJson('/api/profile'))

    expect(error).toMatchObject({ status: 502, message: 'The server returned an error (502).' })
  })

  it('reports a network failure in plain words', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch'))

    const error = await caught(getJson('/api/profile'))

    expect(error).toMatchObject({
      status: 0,
      message: "Couldn't reach the server. Check your connection and try again.",
    })
  })

  it('reports a timeout separately from a network failure', async () => {
    fetchMock.mockRejectedValueOnce(new DOMException('signal timed out', 'TimeoutError'))

    const error = await caught(getJson('/api/profile'))

    expect(error).toMatchObject({ message: 'The server took too long to respond.' })
  })

  it('still works in browsers without AbortSignal.any (Safari before 17.4)', async () => {
    const original = AbortSignal.any
    Object.defineProperty(AbortSignal, 'any', { value: undefined, configurable: true, writable: true })
    fetchMock.mockResolvedValueOnce(jsonResponse({ name: 'Test Owner' }))

    try {
      await expect(getJson('/api/profile', new AbortController().signal)).resolves.toEqual({ name: 'Test Owner' })
    } finally {
      Object.defineProperty(AbortSignal, 'any', { value: original, configurable: true, writable: true })
    }
  })

  it('passes a caller cancellation through untouched, so it can be ignored', async () => {
    const controller = new AbortController()
    fetchMock.mockImplementationOnce(async () => {
      controller.abort()
      throw new DOMException('The operation was aborted.', 'AbortError')
    })

    const error = await caught(getJson('/api/profile', controller.signal))

    expect(error).not.toBeInstanceOf(ApiError)
    expect(error).toMatchObject({ name: 'AbortError' })
  })
})

describe('postJson', () => {
  it('sends the body as JSON', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ message: 'Sent' }))

    await expect(postJson('/api/contact', { name: 'Priya' })).resolves.toEqual({ message: 'Sent' })
    expect(fetchMock).toHaveBeenCalledWith(
      'http://api.test/api/contact',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{"name":"Priya"}',
      }),
    )
  })

  it('exposes per-field validation errors from a 400', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse(
        { detail: 'Some fields need attention.', errors: { email: 'Please enter a valid email address.' } },
        400,
        'application/problem+json',
      ),
    )

    const error = await caught(postJson('/api/contact', {}))

    expect(error).toBeInstanceOf(ApiError)
    expect((error as ApiError).fieldErrors).toEqual({ email: 'Please enter a valid email address.' })
  })
})
