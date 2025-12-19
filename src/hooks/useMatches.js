import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

// Simple in-memory cache for matches (separate for student/company)
const matchesCache = {
    student: { data: null, timestamp: 0 },
    company: { data: null, timestamp: 0 },
}
const CACHE_TTL = 30000 // 30 seconds

/**
 * Hook for fetching and managing matches
 * Works for both students and companies
 * Implements caching with stale-while-revalidate pattern
 */
export function useMatches() {
    const [matches, setMatches] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { user, profile, isStudent, isCompany } = useAuth()
    const isMounted = useRef(true)

    useEffect(() => {
        isMounted.current = true
        return () => { isMounted.current = false }
    }, [])

    const fetchMatches = useCallback(async (forceRefresh = false) => {
        if (!user || !profile) {
            setLoading(false)
            return
        }

        const cacheKey = isStudent ? 'student' : 'company'
        const cache = matchesCache[cacheKey]
        const now = Date.now()
        const cacheValid = cache.data && (now - cache.timestamp) < CACHE_TTL

        // Return cached data immediately (stale-while-revalidate)
        if (cacheValid && !forceRefresh) {
            setMatches(cache.data)
            setLoading(false)
            return
        }

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
                console.log('Matches table may not exist yet')
                if (isMounted.current) {
                    setMatches([])
                }
                return
            }

            // Update cache
            matchesCache[cacheKey] = { data: data || [], timestamp: now }

            if (isMounted.current) {
                setMatches(data || [])
            }
        } catch (err) {
            if (isMounted.current) {
                setError(err.message)
                setMatches([])
            }
        } finally {
            if (isMounted.current) {
                setLoading(false)
            }
        }
    }, [user, profile, isStudent, isCompany])

    useEffect(() => {
        fetchMatches()
    }, [fetchMatches])

    const archiveMatch = useCallback(async (matchId) => {
        const { error } = await supabase
            .from('matches')
            .update({ status: 'archived' })
            .eq('id', matchId)

        if (!error) {
            setMatches(prev => prev.filter(m => m.id !== matchId))
            // Invalidate cache
            const cacheKey = isStudent ? 'student' : 'company'
            matchesCache[cacheKey].timestamp = 0
        }

        return { error }
    }, [isStudent])

    return {
        matches,
        loading,
        error,
        refresh: () => fetchMatches(true),
        archiveMatch
    }
}

export default useMatches

