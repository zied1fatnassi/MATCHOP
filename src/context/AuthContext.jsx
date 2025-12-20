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
        let timeoutId = null
        let didComplete = false

        console.log('[Auth] Starting auth initialization...')

        // Timeout protection - if auth takes too long, force loading to complete
        timeoutId = setTimeout(() => {
            if (!didComplete) {
                console.error('[Auth] TIMEOUT: Auth initialization timed out after 10 seconds')
                setIsLoading(false)
            }
        }, 10000)

        // Get initial session
        console.log('[Auth] Calling supabase.auth.getSession()...')
        supabase.auth.getSession().then(async ({ data, error }) => {
            didComplete = true
            clearTimeout(timeoutId)

            console.log('[Auth] getSession result:', {
                hasSession: !!data?.session,
                userId: data?.session?.user?.id,
                userEmail: data?.session?.user?.email,
                error: error
            })

            if (error) {
                console.error('[Auth] getSession ERROR:', error.code, error.message)
                setIsLoading(false)
                return
            }

            const session = data?.session
            setUser(session?.user ?? null)

            if (session?.user) {
                console.log('[Auth] User found, fetching profile...')
                // Wait for profile fetch before setting loading to false
                await fetchProfile(session.user.id)
                console.log('[Auth] Profile fetch complete, setting loading=false')
            } else {
                console.log('[Auth] No session, setting loading=false')
            }
            setIsLoading(false)
        }).catch(err => {
            didComplete = true
            clearTimeout(timeoutId)
            console.error('[Auth] getSession EXCEPTION:', err)
            setIsLoading(false)
        })

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log('[Auth] onAuthStateChange:', event, session?.user?.id)
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
            let { data, error } = await supabase
                .from('profiles')
                .select('*, student_profiles(*), companies(*)')
                .eq('id', userId)
                .single()

            // If profile doesn't exist, try to create it from user metadata
            if (error?.code === 'PGRST116') {
                const { data: { user } } = await supabase.auth.getUser()
                if (user?.user_metadata) {
                    const { type, name } = user.user_metadata
                    if (type && name) {
                        console.log('Profile not found, creating from user metadata...')
                        const { error: insertError } = await supabase
                            .from('profiles')
                            .insert({
                                id: userId,
                                type: type,
                                name: name,
                                email: user.email
                            })

                        if (!insertError) {
                            // Also create type-specific profile
                            if (type === 'student') {
                                await supabase.from('student_profiles').insert({
                                    id: userId,
                                    bio: '',
                                    location: '',
                                    skills: []
                                })
                            } else if (type === 'company') {
                                await supabase.from('companies').insert({
                                    id: userId,
                                    website: '',
                                    sector: '',
                                    description: ''
                                })
                            }

                            // Fetch the newly created profile
                            const result = await supabase
                                .from('profiles')
                                .select('*, student_profiles(*), companies(*)')
                                .eq('id', userId)
                                .single()
                            data = result.data
                            error = result.error
                        }
                    }
                }
            }

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
     * NOTE: If email verification is required, profile creation is deferred
     * until the user verifies their email and gets a valid session.
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

            // Only create profile if we have a session (no email verification required)
            // Otherwise, profile will be created when user verifies email and fetchProfile runs
            if (data.user && data.session) {
                try {
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
                } catch (profileErr) {
                    // Profile creation failed, but signup succeeded
                    // Profile will be auto-created on next login via fetchProfile
                    console.warn('Profile creation failed, will retry on login:', profileErr)
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
        console.log('[AuthContext] signOut called')
        setAuthError(null)

        const { error } = await supabase.auth.signOut()

        if (error) {
            console.error('[AuthContext] signOut error:', error)
            setAuthError(error)
            throw error
        }

        console.log('[AuthContext] signOut successful, clearing user state')
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
        isStudent: profile?.type === 'student' || user?.user_metadata?.type === 'student',
        isCompany: profile?.type === 'company' || user?.user_metadata?.type === 'company',
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


