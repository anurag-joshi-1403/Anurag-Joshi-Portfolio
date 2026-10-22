import { CircleAlert, RotateCw } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import type { ApiState } from '../hooks/useApi'
import buttonStyles from './Button.module.css'
import styles from './DataState.module.css'

// After this long, explain the wait: a sleeping free-tier backend can take up to a minute to start.
const SLOW_AFTER_MS = 5000

type DataStateProps<T> = {
  state: ApiState<T>
  onRetry: () => void
  /** What is being loaded, for messages: "projects", "skills", ... */
  what: string
  /** Number of placeholder lines to show while loading. */
  skeletonLines?: number
  children: (data: T) => ReactNode
}

/** Renders the loading skeleton, an error with a retry button, or the loaded content. */
export function DataState<T>({ state, onRetry, what, skeletonLines = 3, children }: DataStateProps<T>) {
  if (state.status === 'success') return <>{children(state.data)}</>

  if (state.status === 'error') {
    return (
      <div className={styles.error}>
        <p className={styles.errorText}>
          <CircleAlert aria-hidden="true" />
          <span>
            Couldn&rsquo;t load {what}. {state.error.message}
          </span>
        </p>
        <button type="button" className={`${buttonStyles.button} ${buttonStyles.secondary}`} onClick={onRetry}>
          <RotateCw aria-hidden="true" />
          Try again
        </button>
      </div>
    )
  }

  return <Loading what={what} lines={skeletonLines} />
}

function Loading({ what, lines }: { what: string; lines: number }) {
  const [slow, setSlow] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setSlow(true), SLOW_AFTER_MS)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <div className={styles.loading} role="status">
      <span className="visually-hidden">Loading {what}&hellip;</span>
      <div aria-hidden="true">
        {Array.from({ length: lines }, (_, index) => (
          <span key={index} className={styles.bar} />
        ))}
      </div>
      {slow && (
        <p className={styles.slow}>
          Still loading. The server may be waking up, which can take up to a minute.
        </p>
      )}
    </div>
  )
}
