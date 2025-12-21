import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

/**
 * LinkedIn-style Student Profile Hook
 * 
 * CONNECTED TO SUPABASE:
 * - profile (students table)
 * - experiences (experiences table)
 * - education (student_education table)
 * 
 * LOCAL STATE ONLY (for now):
 * - certifications, projects, languages, volunteer
 * 
 * AUTH GUARDS:
 * - All queries wait for user.id to be available
 * - All writes explicitly set student_id = user.id
 */
export function useStudentProfile() {
    const { user, isLoading: authLoading } = useAuth()
    const hasInitialized = useRef(false)

    // Profile state (Supabase connected)
    const [profile, setProfile] = useState(null)
    const [experiences, setExperiences] = useState([])
    const [education, setEducation] = useState([])

    // New sections - LOCAL STATE ONLY
    const [certifications, setCertifications] = useState([])
    const [projects, setProjects] = useState([])
    const [languages, setLanguages] = useState([])
    const [volunteer, setVolunteer] = useState([])

    // Loading/error states
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [experiencesError, setExperiencesError] = useState(null)
    const [educationError, setEducationError] = useState(null)
    const [completion, setCompletion] = useState(0)

    // ========================================================================
    // FETCH PROFILE - Only runs when user.id is available
    // ========================================================================
    const fetchProfile = useCallback(async () => {
        // CRITICAL: Don't query until auth is ready and user exists
        if (authLoading) {
            console.log('[Profile] Waiting for auth...')
            return
        }

        if (!user?.id) {
            console.log('[Profile] No user, clearing state')
            setProfile(null)
            setExperiences([])
            setEducation([])
            setLoading(false)
            return
        }

        const userId = user.id
        console.log('[Profile] Fetching for user:', userId)

        const controller = new AbortController()
        const timeoutId = setTimeout(() => {
            controller.abort()
            setError('Loading timed out after 10 seconds')
            setLoading(false)
        }, 10000)

        try {
            setLoading(true)
            setError(null)
            setExperiencesError(null)
            setEducationError(null)

            // Fetch from 'students' table
            let profileData = null
            try {
                const { data, error: profileError } = await supabase
                    .from('students')
                    .select('*')
                    .eq('id', userId)
                    .abortSignal(controller.signal)
                    .single()

                if (profileError && profileError.code !== 'PGRST116') {
                    console.error('[Profile] Error:', profileError.message)
                }
                profileData = data
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('[Profile] Fetch failed:', err)
                }
            }

            // Fetch experiences - with explicit student_id check
            let expData = []
            try {
                const { data, error: expError } = await supabase
                    .from('experiences')
                    .select('*')
                    .eq('student_id', userId)
                    .abortSignal(controller.signal)
                    .order('start_date', { ascending: false })

                if (expError) {
                    console.error('[Experiences] Error:', expError.message, expError.code)
                    if (expError.code === '42501' || expError.message?.includes('permission denied')) {
                        setExperiencesError('Permission denied. Please re-login.')
                    } else {
                        setExperiencesError(expError.message)
                    }
                } else {
                    expData = data || []
                }
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('[Experiences] Fetch failed:', err)
                    setExperiencesError('Failed to load experiences')
                }
            }

            // Fetch education
            let eduData = []
            try {
                const { data, error: eduError } = await supabase
                    .from('student_education')
                    .select('*')
                    .eq('student_id', userId)
                    .abortSignal(controller.signal)
                    .order('start_date', { ascending: false })

                if (eduError) {
                    console.error('[Education] Error:', eduError.message, eduError.code)
                    if (eduError.code === '42501' || eduError.message?.includes('permission denied')) {
                        setEducationError('Permission denied. Please re-login.')
                    } else {
                        setEducationError(eduError.message)
                    }
                } else {
                    eduData = data || []
                }
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('[Education] Fetch failed:', err)
                    setEducationError('Failed to load education')
                }
            }

            clearTimeout(timeoutId)

            const finalProfile = profileData || {
                id: userId,
                display_name: user.user_metadata?.name || user.email?.split('@')[0] || 'Student',
                headline: '',
                bio: '',
                location: '',
                skills: [],
                avatar_url: '',
                open_to_work: false
            }

            setProfile(finalProfile)
            setExperiences(expData)
            setEducation(eduData)
            calculateCompletion(finalProfile, expData, eduData)
            hasInitialized.current = true

        } catch (err) {
            clearTimeout(timeoutId)
            if (err.name !== 'AbortError') {
                setError(err.message || 'Failed to load profile')
            }
        } finally {
            clearTimeout(timeoutId)
            setLoading(false)
        }
    }, [user?.id, authLoading])

    // ========================================================================
    // COMPLETION CALCULATION
    // ========================================================================
    const calculateCompletion = (prof, exps = experiences, edu = education, certs = certifications, projs = projects, langs = languages) => {
        if (!prof) return setCompletion(0)

        let filled = 0
        const total = 10

        if (prof.avatar_url) filled++
        if (prof.display_name) filled++
        if (prof.headline) filled++
        if (prof.bio && prof.bio.length > 20) filled++
        if (prof.location) filled++
        if (prof.skills && prof.skills.length >= 3) filled++
        if (exps && exps.length > 0) filled++
        if (edu && edu.length > 0) filled++
        if (certs && certs.length > 0) filled++
        if (langs && langs.length > 0) filled++

        setCompletion(Math.round((filled / total) * 100))
    }

    // ========================================================================
    // PROFILE UPDATE (Supabase connected)
    // ========================================================================
    const updateProfile = async (updates) => {
        if (!user?.id) return { error: 'Not authenticated - please login again' }

        try {
            const { error: updateError } = await supabase
                .from('students')
                .upsert({
                    id: user.id,  // Always use current user.id
                    ...updates,
                })

            if (updateError) {
                console.error('[updateProfile] Error:', updateError)
                if (updateError.code === '42501') return { error: 'Permission denied. Please re-login.' }
                throw updateError
            }

            setProfile(prev => ({ ...prev, ...updates }))
            calculateCompletion({ ...profile, ...updates }, experiences, education)
            return { error: null }
        } catch (err) {
            return { error: err.message }
        }
    }

    // ========================================================================
    // EXPERIENCES (Supabase connected)
    // ========================================================================
    const addExperience = async (experience) => {
        if (!user?.id) {
            const errMsg = 'Not authenticated - please login again'
            setExperiencesError(errMsg)
            return { error: errMsg }
        }

        // Clear any previous error
        setExperiencesError(null)

        try {
            // CRITICAL: Always set student_id explicitly to user.id
            const payload = {
                ...experience,
                student_id: user.id  // Guaranteed to match auth.uid()
            }

            console.log('[addExperience] Inserting with student_id:', user.id)

            const { data, error } = await supabase
                .from('experiences')
                .insert(payload)
                .select()
                .single()

            if (error) {
                console.error('[addExperience] Error:', error)
                let errMsg = error.message
                if (error.code === '42501' || error.message?.includes('permission denied')) {
                    errMsg = 'Permission denied. Please re-login and try again.'
                }
                setExperiencesError(errMsg)
                return { error: errMsg }
            }

            const newExps = [data, ...experiences]
            setExperiences(newExps)
            calculateCompletion(profile, newExps, education)
            return { error: null, data }
        } catch (err) {
            console.error('[addExperience] Exception:', err)
            setExperiencesError(err.message)
            return { error: err.message }
        }
    }

    const updateExperience = async (id, updates) => {
        if (!user?.id) {
            const errMsg = 'Not authenticated - please login again'
            setExperiencesError(errMsg)
            return { error: errMsg }
        }

        setExperiencesError(null)

        try {
            // Remove student_id from updates to prevent accidental changes
            const { student_id, ...safeUpdates } = updates

            const { data, error } = await supabase
                .from('experiences')
                .update(safeUpdates)
                .eq('id', id)
                .eq('student_id', user.id)  // Extra safety: only update own records
                .select()
                .single()

            if (error) {
                console.error('[updateExperience] Error:', error)
                let errMsg = error.message
                if (error.code === '42501') errMsg = 'Permission denied. Please re-login.'
                setExperiencesError(errMsg)
                return { error: errMsg }
            }

            const updated = experiences.map(e => e.id === id ? data : e)
            setExperiences(updated)
            return { error: null, data }
        } catch (err) {
            setExperiencesError(err.message)
            return { error: err.message }
        }
    }

    const deleteExperience = async (id) => {
        if (!user?.id) {
            const errMsg = 'Not authenticated - please login again'
            setExperiencesError(errMsg)
            return { error: errMsg }
        }

        setExperiencesError(null)

        try {
            const { error } = await supabase
                .from('experiences')
                .delete()
                .eq('id', id)
                .eq('student_id', user.id)  // Only delete own records

            if (error) {
                console.error('[deleteExperience] Error:', error)
                let errMsg = error.message
                if (error.code === '42501') errMsg = 'Permission denied. Please re-login.'
                setExperiencesError(errMsg)
                return { error: errMsg }
            }

            const newExps = experiences.filter(exp => exp.id !== id)
            setExperiences(newExps)
            calculateCompletion(profile, newExps, education)
            return { error: null }
        } catch (err) {
            setExperiencesError(err.message)
            return { error: err.message }
        }
    }

    // ========================================================================
    // EDUCATION (Supabase connected) - student_education table
    // ========================================================================
    const addEducation = async (edu) => {
        if (!user?.id) {
            const errMsg = 'Not authenticated - please login again'
            setEducationError(errMsg)
            return { error: errMsg }
        }

        setEducationError(null)

        try {
            // CRITICAL: Always set student_id explicitly
            const payload = {
                ...edu,
                student_id: user.id  // Guaranteed to match auth.uid()
            }

            console.log('[addEducation] Inserting with student_id:', user.id)

            const { data, error } = await supabase
                .from('student_education')
                .insert(payload)
                .select()
                .single()

            if (error) {
                console.error('[addEducation] Error:', error)
                let errMsg = error.message
                if (error.code === '42501' || error.message?.includes('permission denied')) {
                    errMsg = 'Permission denied. Please re-login and try again.'
                }
                setEducationError(errMsg)
                return { error: errMsg }
            }

            const updated = [data, ...education]
            setEducation(updated)
            calculateCompletion(profile, experiences, updated)
            return { error: null, data }
        } catch (err) {
            console.error('[addEducation] Exception:', err)
            setEducationError(err.message)
            return { error: err.message }
        }
    }

    const updateEducation = async (id, updates) => {
        if (!user?.id) {
            const errMsg = 'Not authenticated - please login again'
            setEducationError(errMsg)
            return { error: errMsg }
        }

        setEducationError(null)

        try {
            const { student_id, ...safeUpdates } = updates

            const { data, error } = await supabase
                .from('student_education')
                .update(safeUpdates)
                .eq('id', id)
                .eq('student_id', user.id)
                .select()
                .single()

            if (error) {
                console.error('[updateEducation] Error:', error)
                let errMsg = error.message
                if (error.code === '42501') errMsg = 'Permission denied. Please re-login.'
                setEducationError(errMsg)
                return { error: errMsg }
            }

            const updated = education.map(e => e.id === id ? data : e)
            setEducation(updated)
            return { error: null, data }
        } catch (err) {
            setEducationError(err.message)
            return { error: err.message }
        }
    }

    const removeEducation = async (id) => {
        if (!user?.id) {
            const errMsg = 'Not authenticated - please login again'
            setEducationError(errMsg)
            return { error: errMsg }
        }

        setEducationError(null)

        try {
            const { error } = await supabase
                .from('student_education')
                .delete()
                .eq('id', id)
                .eq('student_id', user.id)

            if (error) {
                console.error('[removeEducation] Error:', error)
                let errMsg = error.message
                if (error.code === '42501') errMsg = 'Permission denied. Please re-login.'
                setEducationError(errMsg)
                return { error: errMsg }
            }

            const updated = education.filter(e => e.id !== id)
            setEducation(updated)
            calculateCompletion(profile, experiences, updated)
            return { error: null }
        } catch (err) {
            setEducationError(err.message)
            return { error: err.message }
        }
    }

    // ========================================================================
    // CERTIFICATIONS (LOCAL STATE ONLY)
    // ========================================================================
    const addCertification = (cert) => {
        const newCert = { id: crypto.randomUUID(), ...cert }
        const updated = [newCert, ...certifications]
        setCertifications(updated)
        calculateCompletion(profile, experiences, education, updated)
        return { error: null, data: newCert }
    }

    const removeCertification = (id) => {
        const updated = certifications.filter(c => c.id !== id)
        setCertifications(updated)
        calculateCompletion(profile, experiences, education, updated)
        return { error: null }
    }

    // ========================================================================
    // PROJECTS (LOCAL STATE ONLY)
    // ========================================================================
    const addProject = (proj) => {
        const newProj = { id: crypto.randomUUID(), ...proj }
        const updated = [newProj, ...projects]
        setProjects(updated)
        calculateCompletion(profile, experiences, education, certifications, updated)
        return { error: null, data: newProj }
    }

    const removeProject = (id) => {
        const updated = projects.filter(p => p.id !== id)
        setProjects(updated)
        calculateCompletion(profile, experiences, education, certifications, updated)
        return { error: null }
    }

    // ========================================================================
    // LANGUAGES (LOCAL STATE ONLY)
    // ========================================================================
    const addLanguage = (lang) => {
        const newLang = { id: crypto.randomUUID(), ...lang }
        const updated = [...languages, newLang]
        setLanguages(updated)
        calculateCompletion(profile, experiences, education, certifications, projects, updated)
        return { error: null, data: newLang }
    }

    const removeLanguage = (id) => {
        const updated = languages.filter(l => l.id !== id)
        setLanguages(updated)
        calculateCompletion(profile, experiences, education, certifications, projects, updated)
        return { error: null }
    }

    // ========================================================================
    // VOLUNTEER (LOCAL STATE ONLY)
    // ========================================================================
    const addVolunteer = (vol) => {
        const newVol = { id: crypto.randomUUID(), ...vol }
        setVolunteer(prev => [newVol, ...prev])
        return { error: null, data: newVol }
    }

    const removeVolunteer = (id) => {
        setVolunteer(prev => prev.filter(v => v.id !== id))
        return { error: null }
    }

    // ========================================================================
    // EFFECTS - Wait for auth before fetching
    // ========================================================================
    useEffect(() => {
        // Only fetch when auth is done loading and we have a user
        if (!authLoading) {
            fetchProfile()
        }
    }, [fetchProfile, authLoading])

    // Combine loading states
    const isLoading = authLoading || loading

    return {
        // Profile & core data
        profile,
        experiences,
        loading: isLoading,
        error,
        experiencesError,
        completion,

        // Education (Supabase connected)
        education,
        educationError,

        // Other sections (local state)
        certifications,
        projects,
        languages,
        volunteer,

        // Profile actions
        updateProfile,

        // Experience actions
        addExperience,
        updateExperience,
        deleteExperience,

        // Education actions
        addEducation,
        updateEducation,
        removeEducation,

        // Certifications actions (local)
        addCertification,
        removeCertification,

        // Projects actions (local)
        addProject,
        removeProject,

        // Languages actions (local)
        addLanguage,
        removeLanguage,

        // Volunteer actions (local)
        addVolunteer,
        removeVolunteer,

        refresh: fetchProfile
    }
}

export default useStudentProfile
