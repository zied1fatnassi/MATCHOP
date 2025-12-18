import { Link } from 'react-router-dom'
import { MessageCircle, MapPin, GraduationCap } from 'lucide-react'
import '../student/StudentMatches.css'

// Mock matches data
const mockMatches = [
    {
        id: 1,
        name: 'Alex Johnson',
        photo: null,
        title: 'Computer Science Student',
        university: 'Stanford University',
        matchedAt: '2 hours ago',
        lastMessage: "Thank you for the opportunity! I'm very excited...",
        unread: true,
    },
    {
        id: 2,
        name: 'Sarah Chen',
        photo: null,
        title: 'Data Science Student',
        university: 'MIT',
        matchedAt: '1 day ago',
        lastMessage: 'Yes, Tuesday at 2pm works perfectly for me!',
        unread: false,
    },
    {
        id: 3,
        name: 'Emily Davis',
        photo: null,
        title: 'UX Design Student',
        university: 'RISD',
        matchedAt: '3 days ago',
        lastMessage: null,
        unread: false,
    },
]

function CompanyMatches() {
    return (
        <div className="matches-page">
            <div className="container">
                <div className="matches-header">
                    <h1>Your Matches</h1>
                    <p>Candidates who matched with your opportunities</p>
                </div>

                {mockMatches.length > 0 ? (
                    <div className="matches-list">
                        {mockMatches.map(match => (
                            <Link
                                to={`/company/chat/${match.id}`}
                                key={match.id}
                                className={`match-card glass-card ${match.unread ? 'unread' : ''}`}
                            >
                                <div className="match-avatar">
                                    {match.photo ? (
                                        <img src={match.photo} alt={match.name} />
                                    ) : (
                                        <span>{match.name.charAt(0)}</span>
                                    )}
                                </div>

                                <div className="match-info">
                                    <div className="match-header">
                                        <h3 className="match-company">{match.name}</h3>
                                        <span className="match-time">{match.matchedAt}</span>
                                    </div>

                                    <p className="match-title">{match.title}</p>

                                    <div className="match-location">
                                        <GraduationCap size={14} />
                                        <span>{match.university}</span>
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
                        <div className="empty-icon">🤝</div>
                        <h2>No matches yet</h2>
                        <p>When you match with candidates, they'll appear here!</p>
                        <Link to="/company/candidates" className="btn btn-primary">
                            View Candidates
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CompanyMatches
