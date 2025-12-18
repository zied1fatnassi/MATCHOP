import { useState } from 'react'
import { X, Heart, Star, RotateCcw } from 'lucide-react'
import SwipeCard from '../../components/SwipeCard'
import MatchModal from '../../components/MatchModal'
import OfferDetailModal from '../../components/OfferDetailModal'
import ApplicationToast from '../../components/ApplicationToast'
import { useApplications } from '../../context/ApplicationContext'
import { useAuth } from '../../context/AuthContext'
import tunisianOffers from '../../data/companies'
import './StudentSwipe.css'

// Use Tunisian companies data
const mockOffers = tunisianOffers

function StudentSwipe() {
    const [offers, setOffers] = useState(mockOffers)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [showMatch, setShowMatch] = useState(false)
    const [matchedOffer, setMatchedOffer] = useState(null)
    const [swipeHistory, setSwipeHistory] = useState([])
    const [selectedOffer, setSelectedOffer] = useState(null)
    const [showToast, setShowToast] = useState(false)
    const [toastCompany, setToastCompany] = useState('')

    const { addApplication, hasAppliedTo } = useApplications()
    const { user } = useAuth()

    const currentOffer = offers[currentIndex]
    const hasMoreOffers = currentIndex < offers.length

    const handleSwipe = (direction) => {
        if (!currentOffer) return

        setSwipeHistory([...swipeHistory, { offer: currentOffer, direction }])

        // On right swipe (like) or super like - send application
        if (direction === 'right' || direction === 'super') {
            // Add application (sends profile to company)
            addApplication(currentOffer, user?.profile)

            // Show toast notification
            setToastCompany(currentOffer.company)
            setShowToast(true)

            // Check if it's a match
            if (currentOffer.hasMatched) {
                setMatchedOffer(currentOffer)
                setTimeout(() => setShowMatch(true), 500) // Delay match modal so toast appears first
            }
        }

        setTimeout(() => {
            setCurrentIndex(currentIndex + 1)
        }, 300)
    }

    const handleUndo = () => {
        if (swipeHistory.length === 0) return
        setSwipeHistory(swipeHistory.slice(0, -1))
        setCurrentIndex(currentIndex - 1)
    }

    const handleViewDetails = (offer) => {
        setSelectedOffer(offer)
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

