import styles from './Footer.module.css'

export function Footer() {
  // FR-FOOTER-1: the year comes from the visitor's clock, never a hardcoded value.
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p>© {year} Anurag Joshi</p>
        <a href="#home">Back to top</a>
      </div>
    </footer>
  )
}
