import { useState, useEffect, lazy, Suspense } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import LoadingScreen from './components/LoadingScreen'
import AuthToast from './components/AuthToast'
import { ProtectedRoute, PublicRoute } from './components/RouteGuards'
import { useAuth } from './context/AuthContext'

// Lazy load all page components for code splitting
const Landing = lazy(() => import('./pages/Landing'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/ResetPassword'))

// Legal pages
const TermsOfService = lazy(() => import('./pages/legal/TermsOfService'))
const PrivacyPolicy = lazy(() => import('./pages/legal/PrivacyPolicy'))

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
 * Smart Landing component that redirects logged-in users
 */
function SmartLanding() {
  const { isLoggedIn, isLoading, isStudent, isCompany } = useAuth()

  // While auth is loading, show the landing page (it will redirect after loading)
  if (isLoading) {
    return <RouteLoadingFallback />
  }

  // Redirect logged-in users to their dashboard
  if (isLoggedIn) {
    if (isStudent) {
      return <Navigate to="/student/swipe" replace />
    }
    if (isCompany) {
      return <Navigate to="/company/candidates" replace />
    }
  }

  // Not logged in - show landing
  return <Landing />
}

/**
 * Main App component with:
 * - Initial loading animation
 * - Role-based routing for students and companies
 * - Lazy-loaded routes for optimal performance
 * - Auth event toast notifications
 * - Protected and public route guards
 */
function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const location = useLocation()

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
          {/* Landing - redirects if logged in */}
          <Route path="/" element={<SmartLanding />} />

          {/* Public Auth Routes - redirect if already logged in */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Legal Pages - always accessible */}
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />

          {/* Student Public Routes - redirect if already logged in */}
          <Route path="/student/signup" element={
            <PublicRoute>
              <StudentSignup />
            </PublicRoute>
          } />
          <Route path="/student/login" element={
            <PublicRoute>
              <StudentLogin />
            </PublicRoute>
          } />

          {/* Student Protected Routes - require authentication */}
          <Route path="/student/profile" element={
            <ProtectedRoute requiredType="student">
              <StudentProfile />
            </ProtectedRoute>
          } />
          <Route path="/student/swipe" element={
            <ProtectedRoute requiredType="student">
              <StudentSwipe />
            </ProtectedRoute>
          } />
          <Route path="/student/matches" element={
            <ProtectedRoute requiredType="student">
              <StudentMatches />
            </ProtectedRoute>
          } />
          <Route path="/student/chat/:matchId" element={
            <ProtectedRoute requiredType="student">
              <StudentChat />
            </ProtectedRoute>
          } />

          {/* Company Public Routes - redirect if already logged in */}
          <Route path="/company/signup" element={
            <PublicRoute>
              <CompanySignup />
            </PublicRoute>
          } />
          <Route path="/company/login" element={
            <PublicRoute>
              <CompanyLogin />
            </PublicRoute>
          } />

          {/* Company Protected Routes - require authentication */}
          <Route path="/company/profile" element={
            <ProtectedRoute requiredType="company">
              <CompanyProfile />
            </ProtectedRoute>
          } />
          <Route path="/company/post-offer" element={
            <ProtectedRoute requiredType="company">
              <PostOffer />
            </ProtectedRoute>
          } />
          <Route path="/company/candidates" element={
            <ProtectedRoute requiredType="company">
              <ViewCandidates />
            </ProtectedRoute>
          } />
          <Route path="/company/matches" element={
            <ProtectedRoute requiredType="company">
              <CompanyMatches />
            </ProtectedRoute>
          } />
          <Route path="/company/chat/:matchId" element={
            <ProtectedRoute requiredType="company">
              <CompanyChat />
            </ProtectedRoute>
          } />
        </Routes>
      </Suspense>
    </>
  )
}

export default App
