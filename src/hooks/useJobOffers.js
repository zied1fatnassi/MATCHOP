import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

// Simple in-memory cache for job offers
const offersCache = {
    data: null,
    timestamp: 0,
    swipedIds: new Set(),
}
const CACHE_TTL = 60000 // 60 seconds
const FETCH_TIMEOUT = 15000 // 15 second timeout

/**
 * Hook for fetching and managing job offers
 * Filters out already-swiped offers and provides swipe functionality
 * Implements caching with stale-while-revalidate pattern
 */
export function useJobOffers() {
    const [offers, setOffers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { user, isStudent } = useAuth()
    const isMounted = useRef(true)

    useEffect(() => {
        isMounted.current = true
        return () => { isMounted.current = false }
    }, [])

    const fetchOffers = useCallback(async (forceRefresh = false) => {
        console.log('[useJobOffers] fetchOffers called, user:', user?.id, 'forceRefresh:', forceRefresh)

        // No user - stop loading and return empty
        if (!user) {
            console.log('[useJobOffers] No user available, setting loading=false')
            if (isMounted.current) {
                setLoading(false)
                setOffers([])
            }
            return
        }

        // Check cache first (stale-while-revalidate)
        const now = Date.now()
        const cacheValid = offersCache.data && (now - offersCache.timestamp) < CACHE_TTL

        if (cacheValid && !forceRefresh) {
            console.log('[useJobOffers] Using cached data, setting loading=false')
            const cachedOffers = offersCache.data.filter(
                o => !offersCache.swipedIds.has(o.id)
            )
            if (isMounted.current) {
                setOffers(cachedOffers)
                setLoading(false)
            }
            return
        }

        if (isMounted.current) {
            setLoading(true)
            setError(null)
        }

        // TIMEOUT PROTECTION - Force loading to complete after 30 seconds
        const timeoutId = setTimeout(() => {
            console.error('[useJobOffers] TIMEOUT: Query took too long, forcing loading=false')
            if (isMounted.current) {
                setLoading(false)
                setError('Request timed out. Please try again.')
            }
        }, 30000)

        try {
            // STEP 1: Get swipes for this student
            let swipedOfferIds = []
            console.log('[useJobOffers] Querying student_swipes for student_id:', user.id)

            const swipeResult = await supabase
                .from('student_swipes')
                .select('offer_id')
                .eq('student_id', user.id)

            console.log('[useJobOffers] Swipes query result:', {
                data: swipeResult.data,
                error: swipeResult.error,
                count: swipeResult.data?.length
            })

            if (swipeResult.error) {
                console.error('[useJobOffers] Swipes query ERROR:', swipeResult.error.code, swipeResult.error.message)
                // Continue - swipes table might not exist or RLS blocking
            } else {
                swipedOfferIds = swipeResult.data?.map(s => s.offer_id) || []
                offersCache.swipedIds = new Set(swipedOfferIds)
            }

            // STEP 2: Get active offers with company data
            console.log('[useJobOffers] Querying offers with companies...')

            const offersResult = await supabase
                .from('offers')
                .select('*, companies!company_id(id, company_name, logo_url, industry)')
                .eq('status', 'active')

            console.log('[useJobOffers] Job offers query result:', {
                data: offersResult.data,
                error: offersResult.error,
                count: offersResult.data?.length
            })

            if (offersResult.error) {
                console.error('[useJobOffers] Job offers query ERROR:', offersResult.error.code, offersResult.error.message)
                clearTimeout(timeoutId) // Clear timeout on error
                if (isMounted.current) {
                    setError(`Failed to load jobs: ${offersResult.error.message} (code: ${offersResult.error.code})`)
                    setOffers([])
                    setLoading(false)
                }
                return
            }

            // Transform offers (now joining companies)
            const transformedOffers = (offersResult.data || []).map(offer => ({
                ...offer,
                company: offer.companies?.company_name || 'Unknown Company',
                companyLogo: offer.companies?.logo_url,
                industry: offer.companies?.industry,
                salary: offer.salary_range || 'Competitive',
                skills: offer.req_skills || []
            }))

            // Update cache
            offersCache.data = transformedOffers
            offersCache.timestamp = now

            // Filter out swiped offers
            const filteredOffers = transformedOffers.filter(
                offer => !swipedOfferIds.includes(offer.id)
            )

            console.log('[useJobOffers] Final result:', filteredOffers.length, 'offers to show, setting loading=false')

            clearTimeout(timeoutId) // Clear timeout on success

            if (isMounted.current) {
                setOffers(filteredOffers)
                setError(null)
                setLoading(false)
            }
        } catch (err) {
            console.error('[useJobOffers] Unexpected exception:', err)
            clearTimeout(timeoutId) // Clear timeout on error
            if (isMounted.current) {
                setError(err.message || 'Failed to load job offers')
                setOffers([])
                setLoading(false)
            }
        }
    }, [user])

    useEffect(() => {
        fetchOffers()
    }, [fetchOffers])

    const swipe = useCallback(async (offerId, direction) => {
        if (!user?.id) {
            console.log('[useJobOffers] swipe called but no user')
            return { error: 'Not authenticated' }
        }

        console.log('[useJobOffers] Recording swipe:', direction, 'on offer:', offerId, 'for student:', user.id)

        const { data, error: swipeError } = await supabase
            .from('student_swipes')
            .insert({
                student_id: user.id,
                offer_id: offerId,
                direction
            })
            .select()

        console.log('[useJobOffers] Swipe insert result:', { data, error: swipeError })

        if (swipeError) {
            console.error('[useJobOffers] Swipe insert ERROR:', swipeError.code, swipeError.message)
        }

        // Update cache and local state regardless of DB result
        offersCache.swipedIds.add(offerId)
        setOffers(prev => prev.filter(o => o.id !== offerId))

        return { error: swipeError?.message || null }
    }, [user])

    return {
        offers,
        loading,
        error,
        swipe,
        refresh: () => fetchOffers(true)
    }
}

export default useJobOffers
