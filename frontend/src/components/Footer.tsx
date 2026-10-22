import styles from './Footer.module.css'

/** `name` is null until the profile has loaded. */
export function Footer({ name }: { name: string | null }) {
  // FR-FOOTER-1: the year comes from the visitor's clock, never a hardcoded value.
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p>
          © {year}
          {name && ` ${name}`}
        </p>
        <a href="#home">Back to top</a>
      </div>
    </footer>
  )
}
