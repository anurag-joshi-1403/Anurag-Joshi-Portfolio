const API_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, '')

// Render's free tier sleeps when idle and can take close to a minute to wake up.
const TIMEOUT_MS = 60_000

/** A failed API call, with a message that is safe to show to the visitor. */
export class ApiError extends Error {
  readonly status: number
  /** Per-field validation messages from a 400 response, keyed by field name. */
  readonly fieldErrors: Readonly<Record<string, string>>

  constructor(message: string, status: number, fieldErrors: Record<string, string> = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

/** The RFC 9457 problem body the backend sends for every error. */
type ProblemDetail = {
  detail?: string
  errors?: Record<string, string>
}

/**
 * Aborts on the caller's signal or after the timeout, whichever comes first. Browsers without
 * AbortSignal.any (Safari before 17.4) keep only the timeout; the caller still ignores results
 * after cancelling, it just can't stop the request early.
 */
function requestSignal(callerSignal: AbortSignal | null | undefined): AbortSignal {
  const timeout = AbortSignal.timeout(TIMEOUT_MS)
  if (!callerSignal) return timeout
  return typeof AbortSignal.any === 'function' ? AbortSignal.any([timeout, callerSignal]) : timeout
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!API_URL) {
    throw new ApiError('This site is missing its API address (VITE_API_URL).', 0)
  }

  let response: Response
  try {
    response = await fetch(`${API_URL}${path}`, { ...init, signal: requestSignal(init.signal) })
  } catch (error) {
    // The caller cancelled (e.g. the component unmounted): let them ignore it.
    if (init.signal?.aborted) throw error
    if (error instanceof DOMException && error.name === 'TimeoutError') {
      throw new ApiError('The server took too long to respond.', 0)
    }
    throw new ApiError("Couldn't reach the server. Check your connection and try again.", 0)
  }

  if (!response.ok) {
    const problem = (await response.json().catch(() => null)) as ProblemDetail | null
    throw new ApiError(
      problem?.detail ?? `The server returned an error (${response.status}).`,
      response.status,
      problem?.errors ?? {},
    )
  }
  return (await response.json()) as T
}

export function getJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  return request<T>(path, { signal })
}

export function postJson<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}
