import { useState, useEffect } from 'react'
import { X, Heart, Star, RotateCcw, Loader } from 'lucide-react'
import SwipeCard from '../../components/SwipeCard'
import MatchModal from '../../components/MatchModal'
import OfferDetailModal from '../../components/OfferDetailModal'
import ApplicationToast from '../../components/ApplicationToast'
import { useApplications } from '../../context/ApplicationContext'
import { useAuth } from '../../context/AuthContext'
import { useJobOffers } from '../../hooks/useJobOffers'
import './StudentSwipe.css'

function StudentSwipe() {
    const { offers: realOffers, loading, error, swipe, refresh } = useJobOffers()
    const [offers, setOffers] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [showMatch, setShowMatch] = useState(false)
    const [matchedOffer, setMatchedOffer] = useState(null)
    const [swipeHistory, setSwipeHistory] = useState([])
    const [selectedOffer, setSelectedOffer] = useState(null)
    const [showToast, setShowToast] = useState(false)
    const [toastCompany, setToastCompany] = useState('')

    useEffect(() => {
        if (realOffers.length > 0) {
            setOffers(realOffers)
        }
    }, [realOffers])

    const { addApplication } = useApplications()
    const { user } = useAuth()

    const currentOffer = offers[currentIndex]
    const hasMoreOffers = currentIndex < offers.length

    const handleSwipe = async (direction) => {
        if (!currentOffer) return

        // Optimistic UI update
        const offerToSwipe = currentOffer
        setSwipeHistory([...swipeHistory, { offer: offerToSwipe, direction }])

        // Move to next card immediately for potential optimistic update
        const nextIndex = currentIndex + 1
        setCurrentIndex(nextIndex)

        // Call Supabase
        await swipe(offerToSwipe.id, direction)

        // On right swipe (like) or super like - send application
        if (direction === 'right' || direction === 'super') {
            // Add application (sends profile to company)
            addApplication(offerToSwipe, user?.profile)

            // Show toast notification
            setToastCompany(offerToSwipe.company)
            setShowToast(true)

            // Check if it's a match
            if (offerToSwipe.hasMatched) {
                setMatchedOffer(offerToSwipe)

                // Send email notification (fire and forget)
                import('../../lib/email').then(({ sendMatchEmail }) => {
                    sendMatchEmail(
                        user?.email,
                        user?.user_metadata?.name || 'Student',
                        offerToSwipe.company,
                        'Company'
                    )
                })

                setTimeout(() => setShowMatch(true), 500) // Delay match modal so toast appears first
            }
        }
    }

    const handleUndo = () => {
        if (swipeHistory.length === 0) return
        setSwipeHistory(swipeHistory.slice(0, -1))
        setCurrentIndex(currentIndex - 1)
    }

    const handleViewDetails = (offer) => {
        setSelectedOffer(offer)
    }

    if (loading) {
        return (
            <div className="swipe-page loading">
                <Loader className="animate-spin text-primary" size={48} />
                <p>Finding the best jobs for you...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="swipe-page error">
                <div className="glass-card">
                    <h3 className="text-red-500">Oops! Something went wrong.</h3>
                    <p>{error}</p>
                    <button className="btn btn-primary mt-4" onClick={() => refresh()}>Try Again</button>
                </div>
            </div>
        )
    }

    return (
        <div className="swipe-page">
            <div className="swipe-container">
                {hasMoreOffers ? (
                    <>
                        <div className="cards-stack">
                            {offers.slice(currentIndex, currentIndex + 2).reverse().map((offer, index) => (
                                <SwipeCard
                                    key={offer.id}
                                    offer={offer}
                                    onSwipe={handleSwipe}
                                    onViewDetails={handleViewDetails}
                                    isTop={index === offers.slice(currentIndex, currentIndex + 2).length - 1}
                                />
                            ))}
                        </div>

                        <div className="swipe-actions">
                            <button
                                className="action-btn undo"
                                onClick={handleUndo}
                                disabled={swipeHistory.length === 0}
                            >
                                <RotateCcw size={24} />
                            </button>
                            <button
                                className="action-btn pass"
                                onClick={() => handleSwipe('left')}
                            >
                                <X size={32} />
                            </button>
                            <button
                                className="action-btn super-like"
                                onClick={() => handleSwipe('super')}
                            >
                                <Star size={24} />
                            </button>
                            <button
                                className="action-btn like"
                                onClick={() => handleSwipe('right')}
                            >
                                <Heart size={32} />
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="no-more-offers glass-card">
                        <div className="empty-icon">🎯</div>
                        <h2>You're all caught up!</h2>
                        <p>You've seen all available opportunities. Check back later for new matches.</p>
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                setCurrentIndex(0)
                                setSwipeHistory([])
                            }}
                        >
                            Start Over
                        </button>
                    </div>
                )}
            </div>

            {/* Application Toast */}
            {showToast && (
                <ApplicationToast
                    companyName={toastCompany}
                    onClose={() => setShowToast(false)}
                />
            )}

            {/* Match Modal */}
            {showMatch && (
                <MatchModal
                    match={matchedOffer}
                    onClose={() => setShowMatch(false)}
                    userType="student"
                />
            )}

            {/* Offer Detail Modal */}
            {selectedOffer && (
                <OfferDetailModal
                    offer={selectedOffer}
                    onClose={() => setSelectedOffer(null)}
                />
            )}
        </div>
    )
}

export default StudentSwipe

