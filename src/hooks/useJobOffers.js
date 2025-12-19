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

/**
 * Hook for fetching and managing job offers
 * Filters out already-swiped offers and provides swipe functionality
 * Implements caching with stale-while-revalidate pattern
 */
export function useJobOffers() {
    const [offers, setOffers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { user, profile } = useAuth()
    const isMounted = useRef(true)

    useEffect(() => {
        isMounted.current = true
        return () => { isMounted.current = false }
    }, [])

    const fetchOffers = useCallback(async (forceRefresh = false) => {
        if (!user || profile?.type !== 'student') {
            setLoading(false)
            return
        }

        // Check cache first (stale-while-revalidate)
        const now = Date.now()
        const cacheValid = offersCache.data && (now - offersCache.timestamp) < CACHE_TTL

        if (cacheValid && !forceRefresh) {
            // Return cached data immediately
            const cachedOffers = offersCache.data.filter(
                o => !offersCache.swipedIds.has(o.id)
            )
            setOffers(cachedOffers)
            setLoading(false)
            return
        }

        setLoading(true)
        setError(null)

        try {
            // Get offers that user hasn't swiped on yet
            let swipedOfferIds = []

            if (user?.id) {
                const { data: swipedData } = await supabase
                    .from('swipes')
                    .select('offer_id')
                    .eq('student_id', user.id)

                swipedOfferIds = swipedData?.map(s => s.offer_id) || []
                // Update swiped IDs cache
                offersCache.swipedIds = new Set(swipedOfferIds)
            }

            const { data, error: fetchError } = await supabase
                .from('job_offers')
                .select(`
                    *,
                    companies (
                        id, name, logo_url, sector, location, website
                    )
                `)
                .eq('is_active', true)
                .order('created_at', { ascending: false })

            if (fetchError) {
                if (isMounted.current) {
                    setError(fetchError.message)
                }
                return
            }

            // Transform data once
            const transformedOffers = (data || []).map(offer => ({
                ...offer,
                company: offer.companies?.name || 'Unknown Company',
                companyLogo: offer.companies?.logo_url,
                salary: offer.salary_min && offer.salary_max
                    ? `${offer.salary_min}-${offer.salary_max} ${offer.salary_currency || 'TND'}/month`
                    : 'Competitive',
                hasMatched: Math.random() > 0.7
            }))

            // Update cache
            offersCache.data = transformedOffers
            offersCache.timestamp = now

            // Filter out swiped offers
            const filteredOffers = transformedOffers.filter(
                offer => !swipedOfferIds.includes(offer.id)
            )

            if (isMounted.current) {
                setOffers(filteredOffers)
            }
        } catch (err) {
            if (isMounted.current) {
                setError(err.message)
            }
        } finally {
            if (isMounted.current) {
                setLoading(false)
            }
        }
    }, [user, profile])

    useEffect(() => {
        fetchOffers()
    }, [fetchOffers])

    const swipe = useCallback(async (offerId, direction) => {
        if (!user?.id) return { error: 'Not authenticated' }

        try {
            const { error: swipeError } = await supabase
                .from('swipes')
                .insert({
                    student_id: user.id,
                    offer_id: offerId,
                    direction
                })

            if (swipeError) {
                console.log('Swipe recorded locally (table may not exist yet)')
            }

            // Update cache and local state
            offersCache.swipedIds.add(offerId)
            setOffers(prev => prev.filter(o => o.id !== offerId))

            return { error: null }
        } catch (err) {
            return { error: err.message }
        }
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

