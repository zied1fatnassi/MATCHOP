import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, Building2, ArrowRight, CheckCircle, Globe } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import '../student/StudentSignup.css'

function CompanySignup() {
    const navigate = useNavigate()
    const { login } = useAuth()
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        companyName: '',
        email: '',
        password: '',
        website: '',
        industry: '',
        size: '',
    })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (step < 2) {
            setStep(step + 1)
        } else {
            // Log the user in as a company
            login('company', { name: formData.companyName, email: formData.email })
            navigate('/company/profile')
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-visual" style={{ background: 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)' }}>
                    <div className="visual-content">
                        <div className="visual-icon animate-float">
                            <Building2 size={64} />
                        </div>
                        <h2>Find Top Talent</h2>
                        <p>Connect with motivated students and graduates ready to make an impact</p>

                        <div className="visual-features">
                            <div className="visual-feature">
                                <CheckCircle size={20} />
                                <span>Pre-qualified candidates</span>
                            </div>
                            <div className="visual-feature">
                                <CheckCircle size={20} />
                                <span>Reduced time-to-hire</span>
                            </div>
                            <div className="visual-feature">
                                <CheckCircle size={20} />
                                <span>Direct messaging</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="auth-form-container">
                    <div className="auth-header">
                        <h1>Company Account</h1>
                        <p>Already registered? <Link to="/company/login">Sign in</Link></p>
                    </div>

                    <div className="progress-steps">
                        <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
                            <div className="step-dot">1</div>
                            <span>Account</span>
                        </div>
                        <div className="progress-line"></div>
                        <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
                            <div className="step-dot">2</div>
                            <span>Company</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        {step === 1 && (
                            <div className="form-step animate-fade-in">
                                <div className="input-group">
                                    <label className="input-label">Company Name</label>
                                    <div className="input-with-icon">
                                        <Building2 size={20} className="input-icon" />
                                        <input
                                            type="text"
                                            name="companyName"
                                            className="input"
                                            placeholder="Acme Corporation"
                                            value={formData.companyName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label className="input-label">Work Email</label>
                                    <div className="input-with-icon">
                                        <Mail size={20} className="input-icon" />
                                        <input
                                            type="email"
                                            name="email"
                                            className="input"
                                            placeholder="you@company.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label className="input-label">Password</label>
                                    <div className="input-with-icon">
                                        <Lock size={20} className="input-icon" />
                                        <input
                                            type="password"
                                            name="password"
                                            className="input"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="form-step animate-fade-in">
                                <div className="input-group">
                                    <label className="input-label">Website</label>
                                    <div className="input-with-icon">
                                        <Globe size={20} className="input-icon" />
                                        <input
                                            type="url"
                                            name="website"
                                            className="input"
                                            placeholder="https://company.com"
                                            value={formData.website}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label className="input-label">Industry</label>
                                    <select
                                        name="industry"
                                        className="input"
                                        value={formData.industry}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select industry</option>
                                        <option value="technology">Technology</option>
                                        <option value="finance">Finance</option>
                                        <option value="healthcare">Healthcare</option>
                                        <option value="education">Education</option>
                                        <option value="retail">Retail</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div className="input-group">
                                    <label className="input-label">Company Size</label>
                                    <select
                                        name="size"
                                        className="input"
                                        value={formData.size}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select size</option>
                                        <option value="1-10">1-10 employees</option>
                                        <option value="11-50">11-50 employees</option>
                                        <option value="51-200">51-200 employees</option>
                                        <option value="201-500">201-500 employees</option>
                                        <option value="500+">500+ employees</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        <button type="submit" className="btn btn-primary btn-lg w-full">
                            {step < 2 ? 'Continue' : 'Create Account'}
                            <ArrowRight size={20} />
                        </button>

                        {step > 1 && (
                            <button
                                type="button"
                                className="btn btn-secondary w-full"
                                onClick={() => setStep(step - 1)}
                            >
                                Back
                            </button>
                        )}
                    </form>

                    <p className="auth-terms">
                        By signing up, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default CompanySignup
