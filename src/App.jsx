import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import LoadingScreen from './components/LoadingScreen'
import Landing from './pages/Landing'
import StudentSignup from './pages/student/StudentSignup'
import StudentLogin from './pages/student/StudentLogin'
import StudentProfile from './pages/student/StudentProfile'
import StudentSwipe from './pages/student/StudentSwipe'
import StudentMatches from './pages/student/StudentMatches'
import StudentChat from './pages/student/StudentChat'
import CompanySignup from './pages/company/CompanySignup'
import CompanyLogin from './pages/company/CompanyLogin'
import CompanyProfile from './pages/company/CompanyProfile'
import PostOffer from './pages/company/PostOffer'
import ViewCandidates from './pages/company/ViewCandidates'
import CompanyMatches from './pages/company/CompanyMatches'
import CompanyChat from './pages/company/CompanyChat'

/**
 * Main App component with:
 * - Initial loading animation
 * - Role-based routing for students and companies
 */
function App() {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <>
      {isLoading && (
        <LoadingScreen
          minDuration={2500}
          onComplete={() => setIsLoading(false)}
        />
      )}

      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />

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
    </>
  )
}

export default App
