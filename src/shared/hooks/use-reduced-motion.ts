import { useEffect, useState } from 'react'

/**
 * Tracks the user's reduced-motion preference. Motion that only decorates a
 * state should not be rendered at all when this is true — hiding it in CSS
 * leaves nodes that utilities such as `lg:block` can bring back.
 */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return reduced
}
