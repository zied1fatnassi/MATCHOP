import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, Plus, X, Save, MapPin, Briefcase, Link as LinkIcon, FileText, Globe, Palette } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import './StudentProfile.css'

function StudentProfile() {
    const navigate = useNavigate()
    const { user, login } = useAuth()

    const [profile, setProfile] = useState({
        name: 'John Doe',
        bio: '',
        location: '',
        linkedin: '',
        github: '',
        portfolio: '',
        behance: '',
        cv: '',
        skills: [],
        experience: '',
        availability: '',
    })
    const [newSkill, setNewSkill] = useState('')
    const [saved, setSaved] = useState(false)

    // Load profile from user context
    useEffect(() => {
        if (user?.profile) {
            setProfile(prev => ({ ...prev, ...user.profile }))
        }
        if (user?.name) {
            setProfile(prev => ({ ...prev, name: user.name }))
        }
    }, [user])

    const availableSkills = [
        'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'Java',
        'C++', 'SQL', 'AWS', 'Docker', 'Machine Learning', 'Data Analysis',
        'UI/UX Design', 'Figma', 'Product Management', 'Agile', 'Git'
    ]

    const handleAddSkill = (skill) => {
        if (!profile.skills.includes(skill) && profile.skills.length < 10) {
            setProfile({ ...profile, skills: [...profile.skills, skill] })
        }
    }

    const handleRemoveSkill = (skill) => {
        setProfile({ ...profile, skills: profile.skills.filter(s => s !== skill) })
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        // Save profile to auth context (persists to localStorage)
        login('student', {
            ...user,
            name: profile.name,
            profile: profile
        })

        setSaved(true)
        setTimeout(() => {
            navigate('/student/swipe')
        }, 1000)
    }

    return (
        <div className="profile-page">
            <div className="container">
                <div className="profile-header">
                    <h1>Complete Your Profile</h1>
                    <p>Your profile will be sent to companies when you apply</p>
                </div>

                <form onSubmit={handleSubmit} className="profile-form glass-card">
                    {/* Profile Photo */}
                    <div className="photo-section">
                        <div className="photo-upload">
                            <div className="photo-placeholder">
                                <Camera size={32} />
                            </div>
                            <button type="button" className="photo-edit-btn">
                                <Plus size={16} />
                            </button>
                        </div>
                        <div className="photo-info">
                            <h3>{profile.name}</h3>
                            <p>Add a professional photo to stand out</p>
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="form-section">
                        <h3 className="section-title">About You</h3>
                        <div className="input-group">
                            <label className="input-label">Bio</label>
                            <textarea
                                className="input textarea"
                                placeholder="Tell companies about yourself, your goals, and what makes you unique..."
                                value={profile.bio}
                                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                maxLength={500}
                            />
                            <span className="char-count">{profile.bio.length}/500</span>
                        </div>

                        <div className="input-row">
                            <div className="input-group">
                                <label className="input-label">
                                    <MapPin size={16} />
                                    Location
                                </label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="Tunis, Tunisia"
                                    value={profile.location}
                                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label">
                                    <Briefcase size={16} />
                                    Experience
                                </label>
                                <select
                                    className="input"
                                    value={profile.experience}
                                    onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                                >
                                    <option value="">Select experience</option>
                                    <option value="entry">Entry Level (0-1 years)</option>
                                    <option value="junior">Junior (1-2 years)</option>
                                    <option value="mid">Mid Level (2-4 years)</option>
                                    <option value="senior">Senior (4+ years)</option>
                                </select>
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">
                                <Briefcase size={16} />
                                Availability
                            </label>
                            <select
                                className="input"
                                value={profile.availability}
                                onChange={(e) => setProfile({ ...profile, availability: e.target.value })}
                            >
                                <option value="">When can you start?</option>
                                <option value="immediately">Immediately</option>
                                <option value="2weeks">In 2 weeks</option>
                                <option value="1month">In 1 month</option>
                                <option value="negotiable">Negotiable</option>
                            </select>
                        </div>
                    </div>

                    {/* Skills */}
                    <div className="form-section">
                        <h3 className="section-title">Skills</h3>
                        <p className="section-description">Add up to 10 skills that showcase your expertise</p>

                        <div className="selected-skills">
                            {profile.skills.map(skill => (
                                <span key={skill} className="skill-tag selected">
                                    {skill}
                                    <button type="button" onClick={() => handleRemoveSkill(skill)}>
                                        <X size={14} />
                                    </button>
                                </span>
                            ))}
                            {profile.skills.length === 0 && (
                                <span className="no-skills">No skills selected yet</span>
                            )}
                        </div>

                        <div className="skill-suggestions">
                            {availableSkills
                                .filter(s => !profile.skills.includes(s))
                                .map(skill => (
                                    <button
                                        key={skill}
                                        type="button"
                                        className="skill-suggestion"
                                        onClick={() => handleAddSkill(skill)}
                                    >
                                        <Plus size={14} />
                                        {skill}
                                    </button>
                                ))
                            }
                        </div>
                    </div>

                    {/* Professional Links */}
                    <div className="form-section">
                        <h3 className="section-title">Professional Links</h3>
                        <p className="section-description">These links will be shared with companies you apply to</p>

                        <div className="input-row">
                            <div className="input-group">
                                <label className="input-label">
                                    <LinkIcon size={16} />
                                    LinkedIn
                                </label>
                                <input
                                    type="url"
                                    className="input"
                                    placeholder="linkedin.com/in/yourprofile"
                                    value={profile.linkedin}
                                    onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label">
                                    <LinkIcon size={16} />
                                    GitHub
                                </label>
                                <input
                                    type="url"
                                    className="input"
                                    placeholder="github.com/yourprofile"
                                    value={profile.github}
                                    onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="input-row">
                            <div className="input-group">
                                <label className="input-label">
                                    <Globe size={16} />
                                    Portfolio Website
                                </label>
                                <input
                                    type="url"
                                    className="input"
                                    placeholder="yourportfolio.com"
                                    value={profile.portfolio}
                                    onChange={(e) => setProfile({ ...profile, portfolio: e.target.value })}
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label">
                                    <Palette size={16} />
                                    Behance
                                </label>
                                <input
                                    type="url"
                                    className="input"
                                    placeholder="behance.net/yourprofile"
                                    value={profile.behance}
                                    onChange={(e) => setProfile({ ...profile, behance: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">
                                <FileText size={16} />
                                CV / Resume Link
                            </label>
                            <input
                                type="url"
                                className="input"
                                placeholder="Link to your CV (Google Drive, Dropbox, etc.)"
                                value={profile.cv}
                                onChange={(e) => setProfile({ ...profile, cv: e.target.value })}
                            />
                            <span className="input-hint">Upload your CV to Google Drive or Dropbox and paste the link here</span>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="form-actions">
                        <button type="submit" className={`btn btn-primary btn-lg ${saved ? 'saved' : ''}`}>
                            {saved ? (
                                <>✓ Saved!</>
                            ) : (
                                <>
                                    <Save size={20} />
                                    Save & Start Swiping
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default StudentProfile

