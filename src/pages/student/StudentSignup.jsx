import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, User, ArrowRight, GraduationCap, CheckCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import './StudentSignup.css'

function StudentSignup() {
    const navigate = useNavigate()
    const { login } = useAuth()
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        university: '',
        major: '',
        graduationYear: '',
    })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (step < 2) {
            setStep(step + 1)
        } else {
            // Log the user in as a student
            login('student', { name: formData.name, email: formData.email })
            navigate('/student/profile')
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-visual">
                    <div className="visual-content">
                        <div className="visual-icon animate-float">
                            <GraduationCap size={64} />
                        </div>
                        <h2>Start Your Journey</h2>
                        <p>Join thousands of students discovering their dream careers through SwipeMatch</p>

                        <div className="visual-features">
                            <div className="visual-feature">
                                <CheckCircle size={20} />
                                <span>Personalized job matches</span>
                            </div>
                            <div className="visual-feature">
                                <CheckCircle size={20} />
                                <span>Direct company connections</span>
                            </div>
                            <div className="visual-feature">
                                <CheckCircle size={20} />
                                <span>Interview scheduling</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="auth-form-container">
                    <div className="auth-header">
                        <h1>Create Account</h1>
                        <p>Already have an account? <Link to="/student/login">Sign in</Link></p>
                    </div>

                    {/* Progress Steps */}
                    <div className="progress-steps">
                        <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
                            <div className="step-dot">1</div>
                            <span>Account</span>
                        </div>
                        <div className="progress-line"></div>
                        <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
                            <div className="step-dot">2</div>
                            <span>Education</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        {step === 1 && (
                            <div className="form-step animate-fade-in">
                                <div className="input-group">
                                    <label className="input-label">Full Name</label>
                                    <div className="input-with-icon">
                                        <User size={20} className="input-icon" />
                                        <input
                                            type="text"
                                            name="name"
                                            className="input"
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label className="input-label">Email Address</label>
                                    <div className="input-with-icon">
                                        <Mail size={20} className="input-icon" />
                                        <input
                                            type="email"
                                            name="email"
                                            className="input"
                                            placeholder="you@university.edu"
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
                                    <label className="input-label">University</label>
                                    <div className="input-with-icon">
                                        <GraduationCap size={20} className="input-icon" />
                                        <input
                                            type="text"
                                            name="university"
                                            className="input"
                                            placeholder="Stanford University"
                                            value={formData.university}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label className="input-label">Major</label>
                                    <input
                                        type="text"
                                        name="major"
                                        className="input"
                                        placeholder="Computer Science"
                                        value={formData.major}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="input-group">
                                    <label className="input-label">Expected Graduation</label>
                                    <select
                                        name="graduationYear"
                                        className="input"
                                        value={formData.graduationYear}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select year</option>
                                        <option value="2024">2024</option>
                                        <option value="2025">2025</option>
                                        <option value="2026">2026</option>
                                        <option value="2027">2027</option>
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

export default StudentSignup
