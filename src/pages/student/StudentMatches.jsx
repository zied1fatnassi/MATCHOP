import { Link } from 'react-router-dom'
import { MessageCircle, MapPin, Briefcase } from 'lucide-react'
import './StudentMatches.css'

// Mock matches data
const mockMatches = [
    {
        id: 1,
        company: 'DataFlow Analytics',
        logo: null,
        title: 'Data Science Intern',
        location: 'Remote',
        matchedAt: '2 hours ago',
        lastMessage: "Hi! We're excited about your application...",
        unread: true,
    },
    {
        id: 2,
        company: 'TechStart Inc.',
        logo: null,
        title: 'Software Engineer Intern',
        location: 'San Francisco, CA',
        matchedAt: '1 day ago',
        lastMessage: 'Looking forward to our interview next week!',
        unread: false,
    },
    {
        id: 3,
        company: 'CloudNine',
        logo: null,
        title: 'DevOps Engineer Intern',
        location: 'Seattle, WA',
        matchedAt: '3 days ago',
        lastMessage: null,
        unread: false,
    },
]

function StudentMatches() {
    return (
        <div className="matches-page">
            <div className="container">
                <div className="matches-header">
                    <h1>Your Matches</h1>
                    <p>Companies interested in your profile</p>
                </div>

                {mockMatches.length > 0 ? (
                    <div className="matches-list">
                        {mockMatches.map(match => (
                            <Link
                                to={`/student/chat/${match.id}`}
                                key={match.id}
                                className={`match-card glass-card ${match.unread ? 'unread' : ''}`}
                            >
                                <div className="match-avatar">
                                    {match.logo ? (
                                        <img src={match.logo} alt={match.company} />
                                    ) : (
                                        <span>{match.company.charAt(0)}</span>
                                    )}
                                </div>

                                <div className="match-info">
                                    <div className="match-header">
                                        <h3 className="match-company">{match.company}</h3>
                                        <span className="match-time">{match.matchedAt}</span>
                                    </div>

                                    <p className="match-title">{match.title}</p>

                                    <div className="match-location">
                                        <MapPin size={14} />
                                        <span>{match.location}</span>
                                    </div>

                                    {match.lastMessage ? (
                                        <p className="match-message">{match.lastMessage}</p>
                                    ) : (
                                        <p className="match-message no-message">
                                            <MessageCircle size={14} />
                                            Start the conversation!
                                        </p>
                                    )}
                                </div>

                                {match.unread && <span className="unread-badge" />}
                            </Link>
                        ))}
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
