import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

/**
 * Auth Context for managing user authentication state with Supabase
 * Handles sign up, sign in, sign out, and profile management
 */
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [profile, setProfile] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
            if (session?.user) {
                fetchProfile(session.user.id)
            }
            setIsLoading(false)
        })

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                setUser(session?.user ?? null)
                if (session?.user) {
                    await fetchProfile(session.user.id)
                } else {
                    setProfile(null)
                }
            }
        )

        return () => subscription.unsubscribe()
    }, [])

    const fetchProfile = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*, student_profiles(*), companies(*)')
                .eq('id', userId)
                .single()

            if (!error && data) {
                setProfile(data)
            }
        } catch (err) {
            console.error('Error fetching profile:', err)
        }
    }

    const signUp = async (email, password, userType, userData = {}) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { type: userType, name: userData.name || 'User' }
            }
        })

        if (error) throw error

        // Create profile after signup
        if (data.user) {
            await supabase.from('profiles').insert({
                id: data.user.id,
                type: userType,
                name: userData.name || 'User',
                email: email
            })

            // Create type-specific profile
            if (userType === 'student') {
                await supabase.from('student_profiles').insert({
                    id: data.user.id,
                    bio: userData.bio || '',
                    location: userData.location || '',
                    skills: userData.skills || []
                })
            } else if (userType === 'company') {
                await supabase.from('companies').insert({
                    id: data.user.id,
                    website: userData.website || '',
                    sector: userData.sector || '',
                    description: userData.description || ''
                })
            }
        }

        return data
    }

    const signIn = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })
        if (error) throw error
        return data
    }

    const signOut = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        setUser(null)
        setProfile(null)
    }

    // Legacy login function for backward compatibility
    const login = (userType, userData = {}) => {
        // This is for demo mode without Supabase
        const mockUser = {
            id: 'demo-' + Date.now(),
            email: userData.email || 'demo@example.com',
            user_metadata: { type: userType, name: userData.name }
        }
        setUser(mockUser)
        setProfile({
            id: mockUser.id,
            type: userType,
            name: userData.name || 'Demo User',
            ...userData
        })
    }

    const logout = () => {
        if (user?.id?.startsWith('demo-')) {
            // Demo mode logout
            setUser(null)
            setProfile(null)
        } else {
            // Supabase logout
            signOut()
        }
    }

    const updateProfile = async (updates) => {
        if (!user) return { error: 'Not authenticated' }

        const { error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', user.id)

        if (!error) {
            setProfile(prev => ({ ...prev, ...updates }))
        }

        return { error }
    }

    const value = {
        user,
        profile,
        isLoggedIn: !!user,
        isStudent: profile?.type === 'student',
        isCompany: profile?.type === 'company',
        isLoading,
        // Supabase auth methods
        signUp,
        signIn,
        signOut,
        // Legacy methods for backward compatibility
        login,
        logout,
        // Profile methods
        updateProfile,
        refreshProfile: () => user && fetchProfile(user.id)
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

