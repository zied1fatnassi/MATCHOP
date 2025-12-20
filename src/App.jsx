import { useState, useEffect, lazy, Suspense } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import LoadingScreen from './components/LoadingScreen'
import AuthToast from './components/AuthToast'

// Lazy load all page components for code splitting
// This reduces initial bundle size by ~60-70%
const Landing = lazy(() => import('./pages/Landing'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/ResetPassword'))

// Student pages
const StudentSignup = lazy(() => import('./pages/student/StudentSignup'))
const StudentLogin = lazy(() => import('./pages/student/StudentLogin'))
const StudentProfile = lazy(() => import('./pages/student/StudentProfile'))
const StudentSwipe = lazy(() => import('./pages/student/StudentSwipe'))
const StudentMatches = lazy(() => import('./pages/student/StudentMatches'))
const StudentChat = lazy(() => import('./pages/student/StudentChat'))

// Company pages
const CompanySignup = lazy(() => import('./pages/company/CompanySignup'))
const CompanyLogin = lazy(() => import('./pages/company/CompanyLogin'))
const CompanyProfile = lazy(() => import('./pages/company/CompanyProfile'))
const PostOffer = lazy(() => import('./pages/company/PostOffer'))
const ViewCandidates = lazy(() => import('./pages/company/ViewCandidates'))
const CompanyMatches = lazy(() => import('./pages/company/CompanyMatches'))
const CompanyChat = lazy(() => import('./pages/company/CompanyChat'))

// Minimal loading fallback for route transitions
const RouteLoadingFallback = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '50vh',
    color: 'white'
  }}>
    <div style={{
      width: '40px',
      height: '40px',
      border: '3px solid rgba(255,255,255,0.1)',
      borderTop: '3px solid #2196f3',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }} />
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
)

/**
 * Main App component with:
 * - Initial loading animation
 * - Role-based routing for students and companies
 * - Lazy-loaded routes for optimal performance
 * - Auth event toast notifications
 */
function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()

  // Detect auth events from URL hash (email verification, password reset, errors)
  useEffect(() => {
    const hash = window.location.hash
    if (!hash) return

    // Parse hash parameters
    const params = new URLSearchParams(hash.substring(1))
    const accessToken = params.get('access_token')
    const error = params.get('error')
    const errorDescription = params.get('error_description')
    const type = params.get('type')

    // Handle successful email verification
    if (accessToken && type === 'signup') {
      setToast({
        type: 'success',
        message: '✅ Email verified successfully! You can now sign in.'
      })
      // Clean up URL
      window.history.replaceState(null, '', window.location.pathname)
    }
    // Handle successful password recovery
    else if (accessToken && type === 'recovery') {
      setToast({
        type: 'success',
        message: '✅ Password reset successful! Please set your new password.'
      })
      window.history.replaceState(null, '', window.location.pathname)
    }
    // Handle successful sign in via magic link
    else if (accessToken && !type) {
      setToast({
        type: 'success',
        message: '✅ Welcome back! You are now signed in.'
      })
      window.history.replaceState(null, '', window.location.pathname)
    }
    // Handle errors
    else if (error) {
      let message = errorDescription?.replace(/\+/g, ' ') || 'Authentication failed'

      if (error === 'access_denied' && errorDescription?.includes('expired')) {
        message = 'The verification link has expired. Please request a new one.'
      } else if (error === 'access_denied') {
        message = 'Access denied. Please try again or request a new link.'
      }

      setToast({
        type: 'error',
        message: `❌ ${message}`
      })
      // Clean up URL
      window.history.replaceState(null, '', window.location.pathname)
    }
  }, [location])

  const handleToastClose = () => {
    setToast(null)
  }

  return (
    <>
      {isLoading && (
        <LoadingScreen
          minDuration={1000}
          onComplete={() => setIsLoading(false)}
        />
      )}

      {/* Auth Toast Notification */}
      {toast && (
        <AuthToast
          type={toast.type}
          message={toast.message}
          duration={5000}
          onClose={handleToastClose}
        />
      )}

      <Navbar />
      <Suspense fallback={<RouteLoadingFallback />}>
        <Routes>
          <Route path="/" element={<Landing />} />

          {/* Auth Routes */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Student Routes */}
          <Route path="/student/signup" element={<StudentSignup />} />
          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/student/profile" element={<StudentProfile />} />
          <Route path="/student/swipe" element={<StudentSwipe />} />
          <Route path="/student/matches" element={<StudentMatches />} />
          <Route path="/student/chat/:matchId" element={<StudentChat />} />

          {/* Company Routes */}
          <Route path="/company/signup" element={<CompanySignup />} />
          <Route path="/company/login" element={<CompanyLogin />} />
          <Route path="/company/profile" element={<CompanyProfile />} />
          <Route path="/company/post-offer" element={<PostOffer />} />
          <Route path="/company/candidates" element={<ViewCandidates />} />
          <Route path="/company/matches" element={<CompanyMatches />} />
          <Route path="/company/chat/:matchId" element={<CompanyChat />} />
        </Routes>
      </Suspense>
    </>
  )
}

export default App
