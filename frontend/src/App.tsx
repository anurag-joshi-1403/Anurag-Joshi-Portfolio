import { Footer } from './components/Footer'
import { Navbar } from './components/Navbar'
import { Section } from './components/Section'
import styles from './App.module.css'

// Foundation step: section shells only. Each one is replaced by a real
// section component (src/sections/) fed by the Spring Boot API in a later step.
export default function App() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Navbar />
      <main id="main" tabIndex={-1}>
        <section id="home" className={`container ${styles.hero}`} aria-labelledby="home-heading">
          <h1 id="home-heading">Anurag Joshi</h1>
          <p className={styles.placeholder}>Hero section — built in the frontend sections step.</p>
        </section>
        <Section id="about" title="About">
          <p className={styles.placeholder}>About content will load from GET /api/profile.</p>
        </Section>
        <Section id="skills" title="Skills">
          <p className={styles.placeholder}>Skills will load from GET /api/skills.</p>
        </Section>
        <Section id="projects" title="Projects">
          <p className={styles.placeholder}>Projects will load from GET /api/projects.</p>
        </Section>
        <Section id="experience" title="Experience & Education">
          <p className={styles.placeholder}>Education will load from GET /api/education.</p>
        </Section>
        <Section id="contact" title="Contact">
          <p className={styles.placeholder}>The contact form will post to POST /api/contact.</p>
        </Section>
      </main>
      <Footer />
    </>
  )
}
