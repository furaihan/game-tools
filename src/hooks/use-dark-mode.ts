import { useState, useEffect, useCallback } from 'react'

export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('theme')
    if (stored) return stored === 'dark'
    return true
  })

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('light', !isDark)
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  const toggle = useCallback(() => setIsDark((d) => !d), [])

  return { isDark, toggle }
}