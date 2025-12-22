import React, { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

/**
 * Manages the application theme (light, dark, system).
 * Applies 'data-theme' attribute to the document root.
 */
export const ThemeProvider = ({ children }) => {
    // Default to 'light' as requested by user
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem('matchop-theme')
        return saved || 'light'
    })

    useEffect(() => {
        const root = window.document.documentElement
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)')

        const applyTheme = (targetTheme) => {
            if (targetTheme === 'system') {
                const systemMode = systemDark.matches ? 'dark' : 'light'
                root.setAttribute('data-theme', systemMode)
            } else {
                root.setAttribute('data-theme', targetTheme)
            }
        }

        applyTheme(theme)
        localStorage.setItem('matchop-theme', theme)

        // Listener for system changes if in system mode
        if (theme === 'system') {
            const listener = (e) => {
                root.setAttribute('data-theme', e.matches ? 'dark' : 'light')
            }
            systemDark.addEventListener('change', listener)
            return () => systemDark.removeEventListener('change', listener)
        }
    }, [theme])

    const value = {
        theme,
        setTheme,
        isDark: document.documentElement.getAttribute('data-theme') === 'dark' // precise check
    }

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}
