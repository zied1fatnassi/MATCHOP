import { useState } from 'react'
import { Heart, X, Eye, MessageCircle, Filter, Grid, List } from 'lucide-react'
import MatchModal from '../../components/MatchModal'
import './ViewCandidates.css'

// Mock candidates data
const mockCandidates = [
    {
        id: 1,
        name: 'Alex Johnson',
        photo: null,
        title: 'Computer Science Student',
        university: 'Stanford University',
        location: 'San Francisco, CA',
        skills: ['React', 'Python', 'Machine Learning', 'SQL'],
        matchScore: 95,
        bio: 'Passionate about building products that make a difference. Looking for an internship where I can grow and contribute.',
        hasLiked: true, // Has liked our job offer
    },
    {
        id: 2,
        name: 'Sarah Chen',
        photo: null,
        title: 'Data Science Student',
        university: 'MIT',
        location: 'Boston, MA',
        skills: ['Python', 'TensorFlow', 'SQL', 'R'],
        matchScore: 92,
        bio: 'Data enthusiast with a passion for turning numbers into insights. Experience with ML projects.',
        hasLiked: true,
    },
    {
        id: 3,
        name: 'Mike Ross',
        photo: null,
        title: 'Software Engineering Student',
        university: 'UC Berkeley',
        location: 'Berkeley, CA',
        skills: ['JavaScript', 'Node.js', 'React', 'AWS'],
        matchScore: 88,
        bio: 'Full-stack developer passionate about clean code and great user experiences.',
        hasLiked: false,
    },
    {
        id: 4,
        name: 'Emily Davis',
        photo: null,
        title: 'UX Design Student',
        university: 'RISD',
        location: 'Providence, RI',
        skills: ['Figma', 'UI Design', 'User Research', 'Prototyping'],
        matchScore: 85,
        bio: 'Creative designer focused on building intuitive and beautiful digital experiences.',
        hasLiked: true,
    },
]

function ViewCandidates() {
    const [candidates, setCandidates] = useState(mockCandidates)
    const [viewMode, setViewMode] = useState('grid')
    const [showMatch, setShowMatch] = useState(false)
    const [matchedCandidate, setMatchedCandidate] = useState(null)
    const [selectedCandidate, setSelectedCandidate] = useState(null)

    const handleLike = (candidate) => {
        if (candidate.hasLiked) {
            setMatchedCandidate(candidate)
            setShowMatch(true)
        }
        setCandidates(candidates.filter(c => c.id !== candidate.id))
    }

    const handlePass = (candidateId) => {
        setCandidates(candidates.filter(c => c.id !== candidateId))
    }

    return (
        <div className="candidates-page">
            <div className="container">
                <div className="candidates-header">
                    <div className="header-left">
                        <h1>Candidates</h1>
                        <p>{candidates.length} candidates interested in your offers</p>
                    </div>

                    <div className="header-actions">
                        <button className="btn btn-secondary btn-sm">
                            <Filter size={18} />
                            Filter
                        </button>
                        <div className="view-toggle">
                            <button
                                className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                                onClick={() => setViewMode('grid')}
                            >
                                <Grid size={18} />
                            </button>
                            <button
                                className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                                onClick={() => setViewMode('list')}
                            >
                                <List size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {candidates.length > 0 ? (
                    <div className={`candidates-grid ${viewMode}`}>
                        {candidates.map(candidate => (
                            <div key={candidate.id} className="candidate-card glass-card">
                                <div className="candidate-header">
                                    <div className="candidate-avatar">
                                        {candidate.photo ? (
                                            <img src={candidate.photo} alt={candidate.name} />
                                        ) : (
                                            <span>{candidate.name.charAt(0)}</span>
                                        )}
                                        {candidate.hasLiked && (
                                            <span className="interested-badge">
                                                <Heart size={12} fill="currentColor" />
                                            </span>
                                        )}
                                    </div>
                                    <div className="match-score">
                                        <span className="score-value">{candidate.matchScore}%</span>
                                        <span className="score-label">Match</span>
                                    </div>
                                </div>

                                <div className="candidate-info">
                                    <h3>{candidate.name}</h3>
                                    <p className="candidate-title">{candidate.title}</p>
                                    <p className="candidate-university">{candidate.university}</p>
                                </div>

                                <div className="candidate-skills">
                                    {candidate.skills.slice(0, 4).map(skill => (
                                        <span key={skill} className="skill-badge">{skill}</span>
                                    ))}
                                </div>

                                <p className="candidate-bio">{candidate.bio}</p>

                                <div className="candidate-actions">
                                    <button
                                        className="action-btn pass"
                                        onClick={() => handlePass(candidate.id)}
                                    >
                                        <X size={20} />
                                    </button>
                                    <button
                                        className="action-btn view"
                                        onClick={() => setSelectedCandidate(candidate)}
                                    >
                                        <Eye size={20} />
                                    </button>
                                    <button
                                        className="action-btn like"
                                        onClick={() => handleLike(candidate)}
                                    >
                                        <Heart size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-candidates glass-card">
                        <div className="empty-icon">👥</div>
                        <h2>No candidates yet</h2>
                        <p>Candidates who are interested in your offers will appear here.</p>
                    </div>
                )}
            </div>

            {showMatch && (
                <MatchModal
                    match={matchedCandidate}
                    onClose={() => setShowMatch(false)}
                    userType="company"
                />
            )}
        </div>
    )
}

export default ViewCandidates
