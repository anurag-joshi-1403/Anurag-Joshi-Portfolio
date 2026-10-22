import { useCallback, useEffect } from 'react'

/*
 * Two-state theme toggle over three underlying states: follow the system (nothing stored),
 * or a stored "light"/"dark" override. The choice is written into <meta name="color-scheme">,
 * which tokens.css maps onto the CSS color-scheme property. The inline script in index.html
 * applies a stored override before first paint, so there's no flash of the wrong theme.
 */

const STORAGE_KEY = 'color-scheme'

type Scheme = 'light' | 'dark'

function readStoredScheme(): Scheme | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === 'light' || value === 'dark' ? value : null
  } catch {
    return null
  }
}

function systemScheme(): Scheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function colorSchemeMeta() {
  return document.querySelector<HTMLMetaElement>('meta[name="color-scheme"]')
}

function applyScheme(override: Scheme | null) {
  const meta = colorSchemeMeta()
  if (meta) meta.content = override ?? 'light dark'
}

export function useTheme() {
  // Keep every open tab in sync when the theme changes in another one.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY || event.key === null) applyScheme(readStoredScheme())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const toggleTheme = useCallback(() => {
    const current = colorSchemeMeta()?.content
    const rendered: Scheme = current === 'light' || current === 'dark' ? current : systemScheme()
    const target: Scheme = rendered === 'dark' ? 'light' : 'dark'
    // Switching back to what the system already shows means "follow the system again",
    // so nothing is stored and future OS changes apply.
    const override = target === systemScheme() ? null : target

    try {
      if (override) localStorage.setItem(STORAGE_KEY, override)
      else localStorage.removeItem(STORAGE_KEY)
    } catch {
      // Storage blocked: still switch the theme for this page view.
    }
    applyScheme(override)
  }, [])

  return { toggleTheme }
}
