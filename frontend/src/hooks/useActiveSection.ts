import { useEffect, useState } from 'react'

/**
 * Returns the id of the section currently crossing the middle of the viewport,
 * or null when none of them is (for example while the hero is on screen).
 * Pass a stable array (a module-level constant) so the observer isn't rebuilt every render.
 */
export function useActiveSection(sectionIds: readonly string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    // A zero-height band at the vertical center of the viewport: whichever
    // section overlaps it is the one the visitor is reading.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id
          if (entry.isIntersecting) {
            setActiveId(id)
          } else {
            setActiveId((current) => (current === id ? null : current))
          }
        }
      },
      { rootMargin: '-50% 0px -50% 0px' },
    )

    for (const id of sectionIds) {
      const section = document.getElementById(id)
      if (section) observer.observe(section)
    }
    return () => observer.disconnect()
  }, [sectionIds])

  return activeId
}
