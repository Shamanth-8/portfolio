import { useEffect, useState } from 'react'

/**
 * Touch-sized viewport. Below this the desktop metaphor is replaced by an app
 * grid and full-screen sheets — dragging and resizing windows does not survive
 * a phone, and most portfolio traffic arrives on one.
 */
const QUERY = '(max-width: 767px)'

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(QUERY).matches,
  )

  useEffect(() => {
    const mql = window.matchMedia(QUERY)
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return isMobile
}
