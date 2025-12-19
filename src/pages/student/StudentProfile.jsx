import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, Plus, X, Save, MapPin, Briefcase, Link as LinkIcon, FileText, Globe, Palette, Loader2, Trash2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useImageUpload } from '../../hooks/useImageUpload'
import { supabase } from '../../lib/supabase'
import './StudentProfile.css'

function StudentProfile() {
    const navigate = useNavigate()
    const { user, profile: authProfile, updateProfile, isLoggedIn } = useAuth()
    const fileInputRef = useRef(null)

    const { uploadImage, deleteImage, uploading, error: uploadError } = useImageUpload(user?.id)

    const [profile, setProfile] = useState({
        name: '',
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
        avatar_url: '',
    })
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [error, setError] = useState('')

    // Redirect if not logged in
    useEffect(() => {
        if (!isLoggedIn && !user) {
            navigate('/student/login')
        }
    }, [isLoggedIn, user, navigate])

    // Load profile from auth context and database
    useEffect(() => {
        if (authProfile) {
            setProfile(prev => ({
                ...prev,
                name: authProfile.name || '',
                avatar_url: authProfile.avatar_url || '',
                ...authProfile.student_profiles?.[0],
            }))
        }
        if (user?.user_metadata?.name) {
            setProfile(prev => ({ ...prev, name: user.user_metadata.name }))
        }
    }, [authProfile, user])

    // Fetch additional profile data
    useEffect(() => {
        const fetchProfile = async () => {
            if (!user?.id) return

            try {
                const { data, error } = await supabase
                    .from('student_profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single()

                if (!error && data) {
                    setProfile(prev => ({
                        ...prev,
                        bio: data.bio || '',
                        location: data.location || '',
                        skills: data.skills || [],
                        linkedin: data.linkedin || '',
                        github: data.github || '',
                        portfolio: data.portfolio || '',
                        behance: data.behance || '',
                        cv: data.cv || '',
                        experience: data.experience || '',
                        availability: data.availability || '',
                    }))
                }
            } catch (err) {
                console.error('Error fetching profile:', err)
            }
        }

        fetchProfile()
    }, [user?.id])

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

    const handleImageClick = () => {
        fileInputRef.current?.click()
    }

    const handleImageChange = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        setError('')

        const { url, error: imgError } = await uploadImage(file)

        if (imgError) {
            setError(imgError.message)
            return
        }

        if (url) {
            setProfile(prev => ({ ...prev, avatar_url: url }))
        }
    }

    const handleRemoveImage = async () => {
        setError('')
        const { error: delError } = await deleteImage()

        if (delError) {
            setError(delError.message)
            return
        }

        setProfile(prev => ({ ...prev, avatar_url: '' }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSaving(true)

        try {
            // Update main profile
            await updateProfile({ name: profile.name, avatar_url: profile.avatar_url })

            // Update student profile
            const { error: studentError } = await supabase
                .from('student_profiles')
                .upsert({
                    id: user.id,
                    bio: profile.bio,
                    location: profile.location,
                    skills: profile.skills,
                    linkedin: profile.linkedin,
                    github: profile.github,
                    portfolio: profile.portfolio,
                    behance: profile.behance,
                    cv: profile.cv,
                    experience: profile.experience,
                    availability: profile.availability,
                })

            if (studentError) {
                throw studentError
            }

            setSaved(true)
            setTimeout(() => {
                navigate('/student/swipe')
            }, 1000)
        } catch (err) {
            setError(err.message || 'Failed to save profile')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="profile-page">
            <div className="container">
                <div className="profile-header">
                    <h1>Complete Your Profile</h1>
                    <p>Your profile will be sent to companies when you apply</p>
                </div>

                {(error || uploadError) && (
                    <div className="profile-error">
                        {error || uploadError?.message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="profile-form glass-card">
                    {/* Profile Photo */}
                    <div className="photo-section">
                        <div className="photo-upload" onClick={handleImageClick}>
                            {profile.avatar_url ? (
                                <img
                                    src={profile.avatar_url}
                                    alt="Profile"
                                    className="photo-preview"
                                />
                            ) : (
                                <div className="photo-placeholder">
                                    {uploading ? <Loader2 size={32} className="spinner" /> : <Camera size={32} />}
                                </div>
                            )}
                            <button type="button" className="photo-edit-btn" disabled={uploading}>
                                {uploading ? <Loader2 size={16} className="spinner" /> : <Plus size={16} />}
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/gif,image/webp"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                            />
                        </div>
                        <div className="photo-info">
                            <h3>{profile.name || 'Your Name'}</h3>
                            <p>Add a professional photo to stand out</p>
                            {profile.avatar_url && (
                                <button
                                    type="button"
                                    className="remove-photo-btn"
                                    onClick={handleRemoveImage}
                                    disabled={uploading}
                                >
                                    <Trash2 size={14} />
                                    Remove photo
                                </button>
                            )}
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
                        <button
                            type="submit"
                            className={`btn btn-primary btn-lg ${saved ? 'saved' : ''}`}
                            disabled={saving || uploading}
                        >
                            {saved ? (
                                <>✓ Saved!</>
                            ) : saving ? (
                                <>
                                    <Loader2 size={20} className="spinner" />
                                    Saving...
                                </>
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
