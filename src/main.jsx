import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ApplicationProvider } from './context/ApplicationContext'
import { ThemeProvider } from './context/ThemeContext'
import './lib/i18n' // Initialize i18n before App
import './index.css'
import App from './App.jsx'

// =====================================================
// ENVIRONMENT DEBUGGING - Log on every page load
// =====================================================
console.log('='.repeat(60))
console.log('[Env] MatchOp Debug Info')
console.log('[Env] href:', window.location.href)
console.log('[Env] userAgent:', navigator.userAgent)
console.log('[Env] platform:', navigator.platform)
console.log('[Env] screenWidth:', window.screen?.width)
console.log('[Env] screenHeight:', window.screen?.height)
console.log('[Env] innerWidth:', window.innerWidth)
console.log('[Env] innerHeight:', window.innerHeight)
console.log('[Env] devicePixelRatio:', window.devicePixelRatio)
console.log('[Env] cookiesEnabled:', navigator.cookieEnabled)
console.log('[Env] localStorage available:', typeof localStorage !== 'undefined')
console.log('='.repeat(60))

/**
 * MatchOp - Match the Opportunity
 * Student-Company matching platform
 * 
 * Entry point that initializes:
 * - React 19 with Strict Mode
 * - React Router for navigation
 * - AuthProvider for authentication state
 * - ApplicationProvider for managing job applications
 * - i18next for internationalization
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ApplicationProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </ApplicationProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
