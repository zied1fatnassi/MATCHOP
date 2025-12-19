import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'
import { supabase } from '../lib/supabase'

/**
 * Auth Context for managing user authentication state with Supabase
 * SECURITY: All authentication goes through Supabase - no demo/bypass mode
 */
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [profile, setProfile] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [authError, setAuthError] = useState(null)

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
            async (event, session) => {
                setUser(session?.user ?? null)
                if (session?.user) {
                    await fetchProfile(session.user.id)
                } else {
                    setProfile(null)
                }

                // Clear error on successful auth events
                if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
                    setAuthError(null)
                }
            }
        )

        return () => subscription.unsubscribe()
    }, [])

    const fetchProfile = useCallback(async (userId) => {
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
    }, [])

    /**
     * Sign up a new user with Supabase Auth
     * Creates profile and type-specific data after signup
     * @param {string} email 
     * @param {string} password 
     * @param {string} userType - 'student' or 'company'
     * @param {object} userData - Additional user data
     * @returns {Promise<{data: object, error: Error|null, needsEmailVerification: boolean}>}
     */
    const signUp = useCallback(async (email, password, userType, userData = {}) => {
        setAuthError(null)

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { type: userType, name: userData.name || 'User' },
                    emailRedirectTo: `${window.location.origin}/`
                }
            })

            if (error) {
                setAuthError(error)
                throw error
            }

            // Check if email confirmation is required
            const needsEmailVerification = data.user && !data.session

            // Create profile after signup (only if user was created)
            if (data.user) {
                const { error: profileError } = await supabase.from('profiles').insert({
                    id: data.user.id,
                    type: userType,
                    name: userData.name || 'User',
                    email: email
                })

                if (profileError && !profileError.message.includes('duplicate')) {
                    console.error('Profile creation error:', profileError)
                }

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

            return { data, error: null, needsEmailVerification }
        } catch (err) {
            return { data: null, error: err, needsEmailVerification: false }
        }
    }, [])

    /**
     * Sign in with email and password
     * @param {string} email 
     * @param {string} password 
     * @returns {Promise<{data: object, error: Error|null}>}
     */
    const signIn = useCallback(async (email, password) => {
        setAuthError(null)

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            })

            if (error) {
                setAuthError(error)
                throw error
            }

            return { data, error: null }
        } catch (err) {
            return { data: null, error: err }
        }
    }, [])

    /**
     * Sign out the current user
     */
    const signOut = useCallback(async () => {
        setAuthError(null)
        const { error } = await supabase.auth.signOut()
        if (error) {
            setAuthError(error)
            throw error
        }
        setUser(null)
        setProfile(null)
    }, [])

    /**
     * Resend email verification
     * @param {string} email 
     * @returns {Promise<{error: Error|null}>}
     */
    const resendVerificationEmail = useCallback(async (email) => {
        try {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email,
                options: {
                    emailRedirectTo: `${window.location.origin}/`
                }
            })
            return { error }
        } catch (err) {
            return { error: err }
        }
    }, [])

    /**
     * Request password reset email
     * @param {string} email 
     * @returns {Promise<{error: Error|null}>}
     */
    const resetPassword = useCallback(async (email) => {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`
            })
            return { error }
        } catch (err) {
            return { error: err }
        }
    }, [])

    /**
     * Update user profile
     */
    const updateProfile = useCallback(async (updates) => {
        if (!user) return { error: 'Not authenticated' }

        const { error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', user.id)

        if (!error) {
            setProfile(prev => ({ ...prev, ...updates }))
        }

        return { error }
    }, [user])

    // Check if email is verified
    const isEmailVerified = user?.email_confirmed_at != null

    // Memoize context value to prevent unnecessary re-renders
    const value = useMemo(() => ({
        user,
        profile,
        isLoggedIn: !!user,
        isEmailVerified,
        isStudent: profile?.type === 'student',
        isCompany: profile?.type === 'company',
        isLoading,
        authError,
        // Auth methods
        signUp,
        signIn,
        signOut,
        // Additional auth methods
        resendVerificationEmail,
        resetPassword,
        // Profile methods
        updateProfile,
        refreshProfile: () => user && fetchProfile(user.id),
        clearError: () => setAuthError(null),
    }), [user, profile, isLoading, isEmailVerified, authError, signUp, signIn, signOut, resendVerificationEmail, resetPassword, updateProfile, fetchProfile])

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


