import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import styles from './ThemeToggle.module.css'

/**
 * Shows the theme currently on screen; pressing it switches to the other one.
 * Which half is visible is decided in CSS from <meta name="color-scheme">, so the
 * button stays correct when the system theme changes, without re-rendering.
 */
export function ThemeToggle() {
  const { toggleTheme } = useTheme()

  return (
    <button type="button" className={styles.toggle} onClick={toggleTheme}>
      <span className={styles.whenLight}>
        <Sun aria-hidden="true" />
        <span className="visually-hidden">Switch to dark theme</span>
      </span>
      <span className={styles.whenDark}>
        <Moon aria-hidden="true" />
        <span className="visually-hidden">Switch to light theme</span>
      </span>
    </button>
  )
}
