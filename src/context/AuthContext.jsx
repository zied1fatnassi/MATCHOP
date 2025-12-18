import { createContext, useContext, useState, useEffect } from 'react'

/**
 * Auth Context for managing user authentication state
 * Persists to localStorage so state survives page refreshes
 */
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    // Load auth state from localStorage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('matchop_user')
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser))
            } catch (e) {
                localStorage.removeItem('matchop_user')
            }
        }
        setIsLoading(false)
    }, [])

    // Save to localStorage whenever user changes
    useEffect(() => {
        if (user) {
            localStorage.setItem('matchop_user', JSON.stringify(user))
        } else {
            localStorage.removeItem('matchop_user')
        }
    }, [user])

    const login = (userType, userData = {}) => {
        setUser({
            type: userType, // 'student' or 'company'
            ...userData,
            loggedInAt: new Date().toISOString()
        })
    }

    const logout = () => {
        setUser(null)
    }

    const value = {
        user,
        isLoggedIn: !!user,
        isStudent: user?.type === 'student',
        isCompany: user?.type === 'company',
        isLoading,
        login,
        logout
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export default AuthContext
