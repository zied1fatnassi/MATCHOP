import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Briefcase, MapPin, DollarSign, Clock, FileText, Plus, X, Send } from 'lucide-react'
import './PostOffer.css'

function PostOffer() {
    const navigate = useNavigate()
    const [offer, setOffer] = useState({
        title: '',
        department: '',
        type: 'Internship',
        location: '',
        locationType: 'onsite',
        salary: '',
        duration: '',
        description: '',
        requirements: '',
        skills: [],
    })
    const [newSkill, setNewSkill] = useState('')

    const handleAddSkill = () => {
        if (newSkill.trim() && !offer.skills.includes(newSkill.trim())) {
            setOffer({ ...offer, skills: [...offer.skills, newSkill.trim()] })
            setNewSkill('')
        }
    }

    const handleRemoveSkill = (skill) => {
        setOffer({ ...offer, skills: offer.skills.filter(s => s !== skill) })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        navigate('/company/candidates')
    }

    return (
        <div className="post-offer-page">
            <div className="container">
                <div className="page-header">
                    <h1>Post a New Opportunity</h1>
                    <p>Create an engaging job listing to attract top talent</p>
                </div>

                <form onSubmit={handleSubmit} className="offer-form">
                    <div className="form-grid">
                        {/* Left Column - Main Info */}
                        <div className="form-column">
                            <div className="form-card glass-card">
                                <h3 className="card-title">
                                    <Briefcase size={20} />
                                    Basic Information
                                </h3>

                                <div className="input-group">
                                    <label className="input-label">Job Title *</label>
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="e.g. Software Engineer Intern"
                                        value={offer.title}
                                        onChange={(e) => setOffer({ ...offer, title: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="input-row">
                                    <div className="input-group">
                                        <label className="input-label">Department</label>
                                        <input
                                            type="text"
                                            className="input"
                                            placeholder="e.g. Engineering"
                                            value={offer.department}
                                            onChange={(e) => setOffer({ ...offer, department: e.target.value })}
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label className="input-label">Type</label>
                                        <select
                                            className="input"
                                            value={offer.type}
                                            onChange={(e) => setOffer({ ...offer, type: e.target.value })}
                                        >
                                            <option value="Internship">Internship</option>
                                            <option value="Full-time">Full-time</option>
                                            <option value="Part-time">Part-time</option>
                                            <option value="Contract">Contract</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label className="input-label">
                                        <FileText size={16} />
                                        Job Description *
                                    </label>
                                    <textarea
                                        className="input textarea"
                                        placeholder="Describe the role, responsibilities, and what the candidate will learn..."
                                        value={offer.description}
                                        onChange={(e) => setOffer({ ...offer, description: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="input-group">
                                    <label className="input-label">Requirements</label>
                                    <textarea
                                        className="input textarea"
                                        placeholder="List the qualifications and experience needed..."
                                        value={offer.requirements}
                                        onChange={(e) => setOffer({ ...offer, requirements: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Details */}
                        <div className="form-column">
                            <div className="form-card glass-card">
                                <h3 className="card-title">
                                    <MapPin size={20} />
                                    Location & Compensation
                                </h3>

                                <div className="location-options">
                                    {['onsite', 'remote', 'hybrid'].map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            className={`location-option ${offer.locationType === type ? 'active' : ''}`}
                                            onClick={() => setOffer({ ...offer, locationType: type })}
                                        >
                                            {type.charAt(0).toUpperCase() + type.slice(1)}
                                        </button>
                                    ))}
                                </div>

                                {offer.locationType !== 'remote' && (
                                    <div className="input-group">
                                        <label className="input-label">Location *</label>
                                        <input
                                            type="text"
                                            className="input"
                                            placeholder="e.g. San Francisco, CA"
                                            value={offer.location}
                                            onChange={(e) => setOffer({ ...offer, location: e.target.value })}
                                        />
                                    </div>
                                )}

                                <div className="input-row">
                                    <div className="input-group">
                                        <label className="input-label">
                                            <DollarSign size={16} />
                                            Compensation
                                        </label>
                                        <input
                                            type="text"
                                            className="input"
                                            placeholder="e.g. $5,000/month"
                                            value={offer.salary}
                                            onChange={(e) => setOffer({ ...offer, salary: e.target.value })}
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label className="input-label">
                                            <Clock size={16} />
                                            Duration
                                        </label>
                                        <input
                                            type="text"
                                            className="input"
                                            placeholder="e.g. 3 months"
                                            value={offer.duration}
                                            onChange={(e) => setOffer({ ...offer, duration: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-card glass-card">
                                <h3 className="card-title">Required Skills</h3>

                                <div className="skills-input-container">
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="Add a skill..."
                                        value={newSkill}
                                        onChange={(e) => setNewSkill(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                                    />
                                    <button
                                        type="button"
                                        className="add-skill-btn"
                                        onClick={handleAddSkill}
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>

                                <div className="skills-list">
                                    {offer.skills.map(skill => (
                                        <span key={skill} className="skill-tag">
                                            {skill}
                                            <button type="button" onClick={() => handleRemoveSkill(skill)}>
                                                <X size={14} />
                                            </button>
                                        </span>
                                    ))}
                                    {offer.skills.length === 0 && (
                                        <span className="no-skills-text">No skills added yet</span>
                                    )}
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary btn-lg w-full">
                                <Send size={20} />
                                Publish Opportunity
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default PostOffer
