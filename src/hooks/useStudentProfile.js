import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

/**
 * LinkedIn-style Student Profile Hook
 * 
 * CONNECTED TO SUPABASE:
 * - profile (students table)
 * - experiences (experiences table)
 * - education (student_education table) ← NOW CONNECTED
 * 
 * LOCAL STATE ONLY (for now):
 * - certifications, projects, languages, volunteer
 */
export function useStudentProfile() {
    const { user } = useAuth()

    // Profile state (Supabase connected)
    const [profile, setProfile] = useState(null)
    const [experiences, setExperiences] = useState([])
    const [education, setEducation] = useState([])  // Now Supabase connected

    // New sections - LOCAL STATE ONLY (awaiting Supabase integration)
    const [certifications, setCertifications] = useState([])
    const [projects, setProjects] = useState([])
    const [languages, setLanguages] = useState([])
    const [volunteer, setVolunteer] = useState([])

    // Loading/error states
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [experiencesError, setExperiencesError] = useState(null)
    const [educationError, setEducationError] = useState(null)  // New error state
    const [completion, setCompletion] = useState(0)

    // ========================================================================
    // FETCH PROFILE (Supabase connected)
    // ========================================================================
    const fetchProfile = useCallback(async () => {
        if (!user?.id) {
            setLoading(false)
            return
        }

        const controller = new AbortController()
        const timeoutId = setTimeout(() => {
            controller.abort()
            setError('Loading timed out after 8 seconds')
            setLoading(false)
        }, 8000)

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
                    .eq('id', user.id)
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

            // Fetch experiences
            let expData = []
            try {
                const { data, error: expError } = await supabase
                    .from('experiences')
                    .select('*')
                    .eq('student_id', user.id)
                    .abortSignal(controller.signal)
                    .order('start_date', { ascending: false })

                if (expError) {
                    console.error('[Experiences] Error:', expError.message)
                    setExperiencesError(expError.message)
                } else {
                    expData = data || []
                }
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('[Experiences] Fetch failed:', err)
                    setExperiencesError('Failed to load experiences')
                }
            }

            // Fetch education from student_education table
            let eduData = []
            try {
                const { data, error: eduError } = await supabase
                    .from('student_education')
                    .select('*')
                    .eq('student_id', user.id)
                    .abortSignal(controller.signal)
                    .order('start_date', { ascending: false })

                if (eduError) {
                    console.error('[Education] Error:', eduError.message)
                    setEducationError(eduError.message)
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
                id: user.id,
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

        } catch (err) {
            if (err.name !== 'AbortError') {
                setError(err.message || 'Failed to load profile')
            }
        } finally {
            clearTimeout(timeoutId)
            setLoading(false)
        }
    }, [user?.id])

    // ========================================================================
    // COMPLETION CALCULATION
    // ========================================================================
    const calculateCompletion = (prof, exps, edu = education, certs = certifications, projs = projects, langs = languages) => {
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
        if (!user?.id) return { error: 'Not authenticated' }

        try {
            const { error: updateError } = await supabase
                .from('students')
                .upsert({
                    id: user.id,
                    ...updates,
                })

            if (updateError) {
                console.error('[updateProfile] Error:', updateError)
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
        if (!user?.id) return { error: 'Not authenticated' }

        try {
            const { data, error } = await supabase
                .from('experiences')
                .insert({ student_id: user.id, ...experience })
                .select()
                .single()

            if (error) throw error

            const newExps = [data, ...experiences]
            setExperiences(newExps)
            calculateCompletion(profile, newExps, education)
            return { error: null, data }
        } catch (err) {
            return { error: err.message }
        }
    }

    const deleteExperience = async (id) => {
        if (!user?.id) return { error: 'Not authenticated' }

        try {
            const { error } = await supabase
                .from('experiences')
                .delete()
                .eq('id', id)
                .eq('student_id', user.id)

            if (error) throw error

            const newExps = experiences.filter(exp => exp.id !== id)
            setExperiences(newExps)
            calculateCompletion(profile, newExps, education)
            return { error: null }
        } catch (err) {
            return { error: err.message }
        }
    }

    // ========================================================================
    // EDUCATION (Supabase connected) - student_education table
    // ========================================================================
    const addEducation = async (edu) => {
        if (!user?.id) return { error: 'Not authenticated' }

        try {
            const { data, error } = await supabase
                .from('student_education')
                .insert({ student_id: user.id, ...edu })
                .select()
                .single()

            if (error) {
                console.error('[addEducation] Error:', error)
                return { error: error.message }
            }

            const updated = [data, ...education]
            setEducation(updated)
            setEducationError(null)
            calculateCompletion(profile, experiences, updated)
            return { error: null, data }
        } catch (err) {
            console.error('[addEducation] Exception:', err)
            return { error: err.message }
        }
    }

    const updateEducation = async (id, updates) => {
        if (!user?.id) return { error: 'Not authenticated' }

        try {
            const { data, error } = await supabase
                .from('student_education')
                .update(updates)
                .eq('id', id)
                .eq('student_id', user.id)
                .select()
                .single()

            if (error) {
                console.error('[updateEducation] Error:', error)
                return { error: error.message }
            }

            const updated = education.map(e => e.id === id ? data : e)
            setEducation(updated)
            setEducationError(null)
            return { error: null, data }
        } catch (err) {
            console.error('[updateEducation] Exception:', err)
            return { error: err.message }
        }
    }

    const removeEducation = async (id) => {
        if (!user?.id) return { error: 'Not authenticated' }

        try {
            const { error } = await supabase
                .from('student_education')
                .delete()
                .eq('id', id)
                .eq('student_id', user.id)

            if (error) {
                console.error('[removeEducation] Error:', error)
                return { error: error.message }
            }

            const updated = education.filter(e => e.id !== id)
            setEducation(updated)
            setEducationError(null)
            calculateCompletion(profile, experiences, updated)
            return { error: null }
        } catch (err) {
            console.error('[removeEducation] Exception:', err)
            return { error: err.message }
        }
    }

    // ========================================================================
    // CERTIFICATIONS (LOCAL STATE ONLY - Supabase integration later)
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
    // PROJECTS (LOCAL STATE ONLY - Supabase integration later)
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
    // LANGUAGES (LOCAL STATE ONLY - Supabase integration later)
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
    // VOLUNTEER (LOCAL STATE ONLY - Supabase integration later)
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
    // EFFECTS
    // ========================================================================
    useEffect(() => {
        fetchProfile()
    }, [fetchProfile])

    return {
        // Profile & core data
        profile,
        experiences,
        loading,
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

        // Profile actions (Supabase connected)
        updateProfile,
        addExperience,
        deleteExperience,

        // Education actions (Supabase connected)
        addEducation,
        updateEducation,
        removeEducation,

        // Certifications actions (local state only)
        addCertification,
        removeCertification,

        // Projects actions (local state only)
        addProject,
        removeProject,

        // Languages actions (local state only)
        addLanguage,
        removeLanguage,

        // Volunteer actions (local state only)
        addVolunteer,
        removeVolunteer,

        refresh: fetchProfile
    }
}

export default useStudentProfile
