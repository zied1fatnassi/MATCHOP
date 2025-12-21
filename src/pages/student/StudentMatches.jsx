import { Link } from 'react-router-dom'
import { MessageCircle, MapPin, Loader, AlertCircle, RefreshCw } from 'lucide-react'
import { useMatches } from '../../hooks/useMatches'
import './StudentMatches.css'

/**
 * Student Matches Page
 * Shows real matches from Supabase, not mock data
 */
function StudentMatches() {
    const { matches, loading, error, refresh } = useMatches()

    // Loading state
    if (loading) {
        return (
            <div className="matches-page">
                <div className="container">
                    <div className="matches-header">
                        <h1>Your Matches</h1>
                        <p>Companies interested in your profile</p>
                    </div>
                    <div className="matches-loading">
                        <Loader className="animate-spin" size={48} />
                        <p>Loading your matches...</p>
                    </div>
                </div>
            </div>
        )
    }

    // Error state
    if (error) {
        return (
            <div className="matches-page">
                <div className="container">
                    <div className="matches-header">
                        <h1>Your Matches</h1>
                        <p>Companies interested in your profile</p>
                    </div>
                    <div className="matches-error glass-card">
                        <AlertCircle size={48} className="text-red-500" />
                        <h3>Failed to load matches</h3>
                        <p>{error}</p>
                        <button className="btn btn-primary" onClick={() => refresh()}>
                            <RefreshCw size={18} />
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="matches-page">
            <div className="container">
                <div className="matches-header">
                    <h1>Your Matches</h1>
                    <p>Companies interested in your profile</p>
                </div>

                {matches.length > 0 ? (
                    <div className="matches-list">
                        {matches.map(match => {
                            // Extract company and job info from the joined data (V2.1 schema)
                            const company = match.offers?.companies
                            const offer = match.offers
                            const companyName = company?.company_name || 'Unknown Company'
                            const jobTitle = offer?.title || 'Job Opportunity'
                            const location = offer?.location || 'Remote'
                            const matchedAt = match.matched_at
                                ? new Date(match.matched_at).toLocaleDateString()
                                : 'Recently'

                            return (
                                <Link
                                    to={`/student/chat/${match.id}`}
                                    key={match.id}
                                    className={`match-card glass-card ${match.unread ? 'unread' : ''}`}
                                >
                                    <div className="match-avatar">
                                        {company?.logo_url ? (
                                            <img src={company.logo_url} alt={companyName} />
                                        ) : (
                                            <span>{companyName.charAt(0)}</span>
                                        )}
                                    </div>

                                    <div className="match-info">
                                        <div className="match-header">
                                            <h3 className="match-company">{companyName}</h3>
                                            <span className="match-time">{matchedAt}</span>
                                        </div>

                                        <p className="match-title">{jobTitle}</p>

                                        <div className="match-location">
                                            <MapPin size={14} />
                                            <span>{location}</span>
                                        </div>

                                        {match.last_message ? (
                                            <p className="match-message">{match.last_message}</p>
                                        ) : (
                                            <p className="match-message no-message">
                                                <MessageCircle size={14} />
                                                Start the conversation!
                                            </p>
                                        )}
                                    </div>

                                    {match.unread && <span className="unread-badge" />}
                                </Link>
                            )
                        })}
                    </div>
                ) : (
                    <div className="no-matches glass-card">
                        <div className="empty-icon">💼</div>
                        <h2>No matches yet</h2>
                        <p>Keep swiping to find your perfect opportunity!</p>
                        <Link to="/student/swipe" className="btn btn-primary">
                            Start Swiping
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

export default StudentMatches
