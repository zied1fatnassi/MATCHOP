import { useState, useRef } from 'react'
import { MapPin, Briefcase, DollarSign, Clock, Info } from 'lucide-react'
import './SwipeCard.css'

/**
 * Draggable swipe card for job offers
 * Click to view details, swipe to like/pass
 */
function SwipeCard({ offer, onSwipe, isTop, onViewDetails }) {
    const [startX, setStartX] = useState(0)
    const [offsetX, setOffsetX] = useState(0)
    const [isDragging, setIsDragging] = useState(false)
    const [hasMoved, setHasMoved] = useState(false)
    const cardRef = useRef(null)

    const handleDragStart = (e) => {
        if (!isTop) return
        setIsDragging(true)
        setHasMoved(false)
        setStartX(e.type === 'touchstart' ? e.touches[0].clientX : e.clientX)
    }

    const handleDragMove = (e) => {
        if (!isDragging || !isTop) return
        const currentX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX
        const diff = currentX - startX

        // Mark as moved if dragged more than 5px
        if (Math.abs(diff) > 5) {
            setHasMoved(true)
        }
        setOffsetX(diff)
    }

    const handleDragEnd = () => {
        if (!isDragging || !isTop) return
        setIsDragging(false)

        const threshold = 100
        if (offsetX > threshold) {
            onSwipe('right')
        } else if (offsetX < -threshold) {
            onSwipe('left')
        } else {
            setOffsetX(0)
        }
    }

    // Handle click to view details (only if not dragging)
    const handleClick = () => {
        if (!hasMoved && isTop && onViewDetails) {
            onViewDetails(offer)
        }
    }

    const rotation = offsetX * 0.1
    const opacity = Math.max(0, 1 - Math.abs(offsetX) / 300)

    const style = isTop ? {
        transform: `translateX(${offsetX}px) rotate(${rotation}deg)`,
        transition: isDragging ? 'none' : 'all 0.3s ease',
        cursor: 'grab',
    } : {
        transform: 'scale(0.95) translateY(10px)',
        opacity: 0.7,
    }

    return (
        <div
            ref={cardRef}
            className={`swipe-card ${isDragging ? 'dragging' : ''}`}
            style={style}
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
            onClick={handleClick}
        >
            {/* Swipe Indicators */}
            <div
                className="swipe-indicator like"
                style={{ opacity: Math.max(0, offsetX / 100) }}
            >
                LIKE
            </div>
            <div
                className="swipe-indicator pass"
                style={{ opacity: Math.max(0, -offsetX / 100) }}
            >
                PASS
            </div>

            {/* View Details Hint */}
            {isTop && (
                <div className="view-details-hint">
                    <Info size={14} />
                    <span>Tap for details</span>
                </div>
            )}

            {/* Company Logo */}
            <div className="card-header">
                <div className="company-logo">
                    {offer.companyLogo ? (
                        <img src={offer.companyLogo} alt={offer.company} />
                    ) : (
                        <span>{offer.company?.charAt(0) || 'C'}</span>
                    )}
                </div>
                <div className="company-info">
                    <h3 className="company-name">{offer.company}</h3>
                    <span className="badge badge-primary">{offer.type}</span>
                </div>
            </div>

            {/* Job Details */}
            <div className="card-body">
                <h2 className="job-title">{offer.title}</h2>
                <p className="job-description">{offer.description}</p>

                <div className="job-details">
                    <div className="detail-item">
                        <MapPin size={16} />
                        <span>{offer.location}</span>
                    </div>
                    <div className="detail-item">
                        <Briefcase size={16} />
                        <span>{offer.department}</span>
                    </div>
                    <div className="detail-item">
                        <DollarSign size={16} />
                        <span>{offer.salary}</span>
                    </div>
                    <div className="detail-item">
                        <Clock size={16} />
                        <span>{offer.duration}</span>
                    </div>
                </div>

                {/* Skills */}
                <div className="skills-list">
                    {offer.skills?.map((skill, index) => (
                        <span key={index} className="skill-tag">{skill}</span>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SwipeCard
