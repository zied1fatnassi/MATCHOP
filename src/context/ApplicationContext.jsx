import { createContext, useContext, useState, useEffect } from 'react'

/**
 * Application Context for managing student applications to companies
 * Tracks which companies a student has applied to (swiped right on)
 * Persists to localStorage
 */
const ApplicationContext = createContext(null)

export function ApplicationProvider({ children }) {
    const [applications, setApplications] = useState([])
    const [recentApplication, setRecentApplication] = useState(null)

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('matchop_applications')
        if (saved) {
            try {
                setApplications(JSON.parse(saved))
            } catch (e) {
                localStorage.removeItem('matchop_applications')
            }
        }
    }, [])

    // Save to localStorage when applications change
    useEffect(() => {
        localStorage.setItem('matchop_applications', JSON.stringify(applications))
    }, [applications])

    // Add a new application (when student swipes right)
    const addApplication = (company, userProfile) => {
        const newApplication = {
            id: Date.now(),
            companyId: company.id,
            companyName: company.company,
            companyEmail: company.email,
            position: company.title,
            appliedAt: new Date().toISOString(),
            status: 'pending', // pending, matched, rejected
            userProfile: {
                name: userProfile?.name || 'Student',
                bio: userProfile?.bio || '',
                linkedin: userProfile?.linkedin || '',
                github: userProfile?.github || '',
                portfolio: userProfile?.portfolio || '',
                behance: userProfile?.behance || '',
                cv: userProfile?.cv || '',
                skills: userProfile?.skills || [],
            }
        }

        setApplications(prev => [...prev, newApplication])
        setRecentApplication(newApplication)

        // Clear recent application after 3 seconds (for toast)
        setTimeout(() => setRecentApplication(null), 3000)

        return newApplication
    }

    // Check if already applied to a company
    const hasAppliedTo = (companyId) => {
        return applications.some(app => app.companyId === companyId)
    }

    // Get all applications
    const getApplications = () => applications

    // Update application status (e.g., when matched)
    const updateApplicationStatus = (companyId, status) => {
        setApplications(prev => prev.map(app =>
            app.companyId === companyId ? { ...app, status } : app
        ))
    }

    const value = {
        applications,
        recentApplication,
        addApplication,
        hasAppliedTo,
        getApplications,
        updateApplicationStatus,
    }

    return (
        <ApplicationContext.Provider value={value}>
            {children}
        </ApplicationContext.Provider>
    )
}

export function useApplications() {
    const context = useContext(ApplicationContext)
    if (!context) {
        throw new Error('useApplications must be used within an ApplicationProvider')
    }
    return context
}

export default ApplicationContext
