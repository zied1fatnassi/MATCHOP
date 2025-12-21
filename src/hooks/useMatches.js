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
        console.log('[useMatches] fetchMatches called:', {
            userId: user?.id,
            hasProfile: !!profile,
            isStudent,
            isCompany,
            forceRefresh
        })

        // No user or profile - stop loading
        if (!user || !profile) {
            console.log('[useMatches] No user or profile, setting loading=false')
            if (isMounted.current) {
                setLoading(false)
                setMatches([])
            }
            return
        }

        const cacheKey = isStudent ? 'student' : 'company'
        const cache = matchesCache[cacheKey]
        const now = Date.now()
        const cacheValid = cache.data && (now - cache.timestamp) < CACHE_TTL

        // Return cached data immediately (stale-while-revalidate)
        if (cacheValid && !forceRefresh) {
            console.log('[useMatches] Using cached data, setting loading=false')
            if (isMounted.current) {
                setMatches(cache.data)
                setLoading(false)
            }
            return
        }

        if (isMounted.current) {
            setLoading(true)
            setError(null)
        }

        try {
            // Build query based on user type
            console.log('[useMatches] Building query for:', isStudent ? 'student' : 'company', 'id:', user.id)

            let query = supabase
                .from('matches')
                .select(`
                    *,
                    offers!offer_id (
                        id, title, description, location,
                        companies!company_id (
                            id, logo_url, industry, company_name
                        )
                    ),
                    students!student_id (
                        id, display_name, skills
                    )
                `)
                .order('matched_at', { ascending: false })

            if (isStudent) {
                query = query.eq('student_id', user.id)
            } else if (isCompany) {
                query = query.eq('company_id', user.id)
            }

            console.log('[useMatches] Executing matches query...')
            const { data, error: fetchError } = await query

            console.log('[useMatches] Matches query result:', {
                data: data,
                error: fetchError,
                count: data?.length
            })

            if (fetchError) {
                console.error('[useMatches] Matches query ERROR:', fetchError.code, fetchError.message)
                if (isMounted.current) {
                    setError(`Failed to load matches: ${fetchError.message} (code: ${fetchError.code})`)
                    setMatches([])
                    setLoading(false) // <-- THIS WAS MISSING BEFORE!
                }
                return
            }

            // Update cache
            matchesCache[cacheKey] = { data: data || [], timestamp: now }

            console.log('[useMatches] Success, found', data?.length || 0, 'matches, setting loading=false')

            if (isMounted.current) {
                setMatches(data || [])
                setError(null)
                setLoading(false)
            }
        } catch (err) {
            console.error('[useMatches] Unexpected exception:', err)
            if (isMounted.current) {
                setError(err.message || 'Failed to load matches')
                setMatches([])
                setLoading(false)
            }
        }
    }, [user, profile, isStudent, isCompany])

    useEffect(() => {
        fetchMatches()
    }, [fetchMatches])

    const archiveMatch = useCallback(async (matchId) => {
        console.log('[useMatches] archiveMatch called:', matchId)

        const { error } = await supabase
            .from('matches')
            .update({ status: 'archived' })
            .eq('id', matchId)

        console.log('[useMatches] archiveMatch result:', { error })

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
