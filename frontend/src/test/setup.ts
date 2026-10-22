import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// Also runs for tests in the Node environment (no DOM), so browser-only setup is guarded.
const inBrowser = typeof window !== 'undefined'

// jsdom doesn't implement these browser APIs. Assigned directly (not vi.stubGlobal) so they
// survive vi.unstubAllGlobals() below; tests that need specific behaviour override them.
class IntersectionObserverStub {
  readonly root = null
  readonly rootMargin = ''
  readonly thresholds = []
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}

/** A matchMedia that matches nothing: system prefers light, viewport is not desktop-sized. */
const defaultMatchMedia = (query: string) =>
  ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }) as MediaQueryList

if (inBrowser) {
  window.IntersectionObserver = IntersectionObserverStub as unknown as typeof IntersectionObserver
  window.matchMedia = defaultMatchMedia
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
  if (inBrowser) {
    cleanup()
    localStorage.clear()
    window.matchMedia = defaultMatchMedia
  }
})
