import { getCertifications } from './api/certifications'
import { getProfile } from './api/profile'
import { Footer } from './components/Footer'
import { Navbar } from './components/Navbar'
import { useApi } from './hooks/useApi'
import { About } from './sections/About'
import { Achievements } from './sections/Achievements'
import { Contact } from './sections/Contact'
import { Education } from './sections/Education'
import { Hero } from './sections/Hero'
import { Projects } from './sections/Projects'
import { Skills } from './sections/Skills'

// All content comes from the Spring Boot API (FR-DATA-1). The profile is fetched once here
// because the nav, hero, about, contact, and footer all use it.
export default function App() {
  const profile = useApi(getProfile)
  const certifications = useApi(getCertifications)

  const name = profile.state.status === 'success' ? profile.state.data.name : null
  // FR-ACH-1: Achievements stays hidden until real certifications exist (or if they can't be loaded).
  const certificationList = certifications.state.status === 'success' ? certifications.state.data : []
  const showAchievements = certificationList.length > 0

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Navbar name={name} showAchievements={showAchievements} />
      <main id="main" tabIndex={-1}>
        <Hero profile={profile.state} onRetry={profile.retry} />
        <About profile={profile.state} onRetry={profile.retry} />
        <Skills />
        <Projects />
        <Education />
        {showAchievements && <Achievements certifications={certificationList} />}
        <Contact profile={profile.state} onRetry={profile.retry} />
      </main>
      <Footer name={name} />
    </>
  )
}
