import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

/**
 * Hook for fetching and managing matches
 * Works for both students and companies
 */
export function useMatches() {
    const [matches, setMatches] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { user, profile, isStudent, isCompany } = useAuth()

    useEffect(() => {
        if (user && profile) {
            fetchMatches()
        }
    }, [user, profile])

    const fetchMatches = async () => {
        setLoading(true)
        setError(null)

        try {
            let query = supabase
                .from('matches')
                .select(`
                    *,
                    job_offers (
                        id, title, description, location,
                        companies (id, name, logo_url, sector)
                    ),
                    student_profiles (
                        id, bio, skills,
                        profiles:id (name, avatar_url, email)
                    )
                `)
                .eq('status', 'active')
                .order('matched_at', { ascending: false })

            if (isStudent) {
                query = query.eq('student_id', user.id)
            } else if (isCompany) {
                query = query.eq('company_id', user.id)
            }

            const { data, error: fetchError } = await query

            if (fetchError) {
                // Table might not exist yet
                console.log('Matches table may not exist yet')
                setMatches([])
                return
            }

            setMatches(data || [])
        } catch (err) {
            setError(err.message)
            setMatches([])
        } finally {
            setLoading(false)
        }
    }

    const archiveMatch = async (matchId) => {
        const { error } = await supabase
            .from('matches')
            .update({ status: 'archived' })
            .eq('id', matchId)

        if (!error) {
            setMatches(prev => prev.filter(m => m.id !== matchId))
        }

        return { error }
    }

    return { matches, loading, error, refresh: fetchMatches, archiveMatch }
}

export default useMatches
