import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, Plus, Save, MapPin, Users, Globe, Link as LinkIcon } from 'lucide-react'
import { FormLocationSelector } from '../../components/forms/FormComponents'
import '../student/StudentProfile.css'

function CompanyProfile() {
    const navigate = useNavigate()
    const [profile, setProfile] = useState({
        name: 'Acme Corporation',
        description: '',
        location: '',
        website: '',
        linkedin: '',
        culture: '',
        benefits: [],
    })

    const availableBenefits = [
        'Remote Work', 'Health Insurance', 'Flexible Hours', '401k', 'Stock Options',
        'Gym Membership', 'Paid Time Off', 'Learning Budget', 'Free Lunch', 'Parental Leave'
    ]

    const handleToggleBenefit = (benefit) => {
        if (profile.benefits.includes(benefit)) {
            setProfile({ ...profile, benefits: profile.benefits.filter(b => b !== benefit) })
        } else {
            setProfile({ ...profile, benefits: [...profile.benefits, benefit] })
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        navigate('/company/post-offer')
    }

    return (
        <div className="profile-page">
            <div className="container">
                <div className="profile-header">
                    <h1>Company Profile</h1>
                    <p>Tell candidates about your company and culture</p>
                </div>

                <form onSubmit={handleSubmit} className="profile-form glass-card">
                    {/* Company Logo */}
                    <div className="photo-section">
                        <div className="photo-upload">
                            <div className="photo-placeholder" style={{ borderRadius: 'var(--radius-xl)' }}>
                                <Camera size={32} />
                            </div>
                            <button type="button" className="photo-edit-btn">
                                <Plus size={16} />
                            </button>
                        </div>
                        <div className="photo-info">
                            <h3>{profile.name}</h3>
                            <p>Add your company logo</p>
                        </div>
                    </div>

                    {/* About */}
                    <div className="form-section">
                        <h3 className="section-title">About Your Company</h3>
                        <div className="input-group">
                            <label className="input-label">Description</label>
                            <textarea
                                className="input textarea"
                                placeholder="Tell candidates what makes your company special..."
                                value={profile.description}
                                onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                                maxLength={1000}
                            />
                            <span className="char-count">{profile.description.length}/1000</span>
                        </div>

                        <div className="input-row">
                            <div className="input-group">
                                <FormLocationSelector
                                    label="Siège social / Headquarters"
                                    governorateValue={profile.governorate}
                                    cityValue={profile.location}
                                    onGovernorateChange={(val) => setProfile(prev => ({ ...prev, governorate: val }))}
                                    onCityChange={(val) => setProfile(prev => ({ ...prev, location: val }))}
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label">
                                    <Globe size={16} />
                                    Site web / Website
                                </label>
                                <input
                                    type="url"
                                    className="input"
                                    placeholder="https://sofrecom.tn"
                                    value={profile.website}
                                    onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Culture */}
                    <div className="form-section">
                        <h3 className="section-title">Company Culture</h3>
                        <div className="input-group">
                            <label className="input-label">What's it like to work here?</label>
                            <textarea
                                className="input textarea"
                                placeholder="Describe your work environment, team dynamics, and what makes your culture unique..."
                                value={profile.culture}
                                onChange={(e) => setProfile({ ...profile, culture: e.target.value })}
                                maxLength={500}
                            />
                        </div>
                    </div>

                    {/* Benefits */}
                    <div className="form-section">
                        <h3 className="section-title">Benefits & Perks</h3>
                        <p className="section-description">Select the benefits you offer to employees</p>

                        <div className="skill-suggestions">
                            {availableBenefits.map(benefit => (
                                <button
                                    key={benefit}
                                    type="button"
                                    className={`skill-suggestion ${profile.benefits.includes(benefit) ? 'selected' : ''}`}
                                    onClick={() => handleToggleBenefit(benefit)}
                                    style={profile.benefits.includes(benefit) ? {
                                        background: 'linear-gradient(135deg, #42a5f5 0%, #1976d2 100%)',
                                        color: 'white',
                                        borderColor: 'transparent'
                                    } : {}}
                                >
                                    {profile.benefits.includes(benefit) ? '✓' : '+'} {benefit}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div className="form-section">
                        <h3 className="section-title">Social Links</h3>
                        <div className="input-group">
                            <label className="input-label">
                                <LinkIcon size={16} />
                                LinkedIn
                            </label>
                            <input
                                type="url"
                                className="input"
                                placeholder="https://linkedin.com/company/sofrecom"
                                value={profile.linkedin}
                                onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary btn-lg">
                            <Save size={20} />
                            Save & Post Your First Job
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CompanyProfile
