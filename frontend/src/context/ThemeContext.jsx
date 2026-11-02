import React, { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext({
  theme: 'dark',
  toggleTheme: () => {},
  setTheme: () => {},
})

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    try {
      const stored = localStorage.getItem('fenil_portfolio_theme')
      if (stored === 'light' || stored === 'dark') {
        return stored
      }
      if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light'
      }
    } catch {
      // Fallback if localStorage is inaccessible
    }
    return 'dark'
  })

  useEffect(() => {
    const root = document.documentElement
    const themeColorMeta = document.getElementById('theme-color-meta')

    if (theme === 'dark') {
      root.classList.add('dark')
      if (themeColorMeta) themeColorMeta.setAttribute('content', '#0B0E14')
    } else {
      root.classList.remove('dark')
      if (themeColorMeta) themeColorMeta.setAttribute('content', '#F6F7FB')
    }

    try {
      localStorage.setItem('fenil_portfolio_theme', theme)
    } catch {
      // Ignore storage write issues
    }
  }, [theme])

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const setTheme = (newTheme) => {
    if (newTheme === 'dark' || newTheme === 'light') {
      setThemeState(newTheme)
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
