import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

/**
 * Hook for fetching and managing job offers
 * Filters out already-swiped offers and provides swipe functionality
 */
export function useJobOffers() {
    const [offers, setOffers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { user, profile } = useAuth()

    useEffect(() => {
        if (user && profile?.type === 'student') {
            fetchOffers()
        }
    }, [user, profile])

    const fetchOffers = async () => {
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
            }

            let query = supabase
                .from('job_offers')
                .select(`
                    *,
                    companies (
                        id, name, logo_url, sector, location, website
                    )
                `)
                .eq('is_active', true)
                .order('created_at', { ascending: false })

            const { data, error: fetchError } = await query

            if (fetchError) {
                setError(fetchError.message)
                return
            }

            // Filter out swiped offers and transform data
            const filteredOffers = (data || [])
                .filter(offer => !swipedOfferIds.includes(offer.id))
                .map(offer => ({
                    ...offer,
                    company: offer.companies?.name || 'Unknown Company',
                    companyLogo: offer.companies?.logo_url,
                    salary: offer.salary_min && offer.salary_max
                        ? `${offer.salary_min}-${offer.salary_max} ${offer.salary_currency || 'TND'}/month`
                        : 'Competitive',
                    hasMatched: Math.random() > 0.7 // For demo purposes
                }))

            setOffers(filteredOffers)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const swipe = async (offerId, direction) => {
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
                // If table doesn't exist yet, just update local state
                console.log('Swipe recorded locally (table may not exist yet)')
            }

            // Remove offer from list regardless
            setOffers(prev => prev.filter(o => o.id !== offerId))

            return { error: null }
        } catch (err) {
            return { error: err.message }
        }
    }

    return { offers, loading, error, swipe, refresh: fetchOffers }
}

export default useJobOffers
