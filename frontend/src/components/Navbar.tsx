import { Menu, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react'
import { useActiveSection } from '../hooks/useActiveSection'
import styles from './Navbar.module.css'
import { ThemeToggle } from './ThemeToggle'

type NavItem = { id: string; label: string }

const BEFORE_ACHIEVEMENTS: NavItem[] = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
]
const ACHIEVEMENTS: NavItem = { id: 'achievements', label: 'Achievements' }
const CONTACT: NavItem = { id: 'contact', label: 'Contact' }

type NavbarProps = {
  /** The owner's name once the profile has loaded. */
  name: string | null
  /** FR-ACH-1: only link to Achievements when that section is shown. */
  showAchievements: boolean
}

export function Navbar({ name, showAchievements }: NavbarProps) {
  const navItems = useMemo(
    () => [...BEFORE_ACHIEVEMENTS, ...(showAchievements ? [ACHIEVEMENTS] : []), CONTACT],
    [showAchievements],
  )
  const sectionIds = useMemo(() => navItems.map((item) => item.id), [navItems])
  const activeId = useActiveSection(sectionIds)
  const [menuOpen, setMenuOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    if (!menuOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        toggleRef.current?.focus()
      }
    }
    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setMenuOpen(false)
    }
    // Close the mobile menu if the window grows to the desktop layout.
    const desktop = window.matchMedia('(min-width: 48rem)')
    const onBreakpoint = () => desktop.matches && setMenuOpen(false)

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    desktop.addEventListener('change', onBreakpoint)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
      desktop.removeEventListener('change', onBreakpoint)
    }
  }, [menuOpen])

  const toggleMenu = (event: MouseEvent<HTMLButtonElement>) => {
    const opening = !menuOpen
    setMenuOpen(opening)
    // The links come before this button in the page order (so desktop tab order matches what's
    // on screen). When the menu was opened from the keyboard (click detail 0), move focus into it.
    if (opening && event.detail === 0) {
      requestAnimationFrame(() => menuRef.current?.querySelector('a')?.focus())
    }
  }

  return (
    <header ref={headerRef} className={styles.header}>
      <nav className={`container ${styles.nav}`} aria-label="Primary">
        <a href="#home" className={styles.brand} onClick={() => setMenuOpen(false)}>
          {name ?? 'Home'}
        </a>

        <ul ref={menuRef} id="primary-menu" className={styles.links} data-open={menuOpen}>
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={styles.link}
                aria-current={activeId === item.id ? 'location' : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className={styles.actions}>
          <ThemeToggle />
          <button
            ref={toggleRef}
            type="button"
            className={styles.toggle}
            aria-expanded={menuOpen}
            aria-controls="primary-menu"
            onClick={toggleMenu}
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            <span className="visually-hidden">{menuOpen ? 'Close menu' : 'Open menu'}</span>
          </button>
        </div>
      </nav>
    </header>
  )
}
