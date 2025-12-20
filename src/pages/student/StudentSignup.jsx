import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, User, ArrowRight, GraduationCap, CheckCircle, Loader2, AlertCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { validatePassword, validateEmail, validateName, getPasswordStrengthInfo, getAuthErrorMessage } from '../../lib/validation'
import './StudentSignup.css'

/**
 * Student Signup Page
 * Secure registration using Supabase Auth with email verification
 */
function StudentSignup() {
    const navigate = useNavigate()
    const { signUp } = useAuth()
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        university: '',
        major: '',
        graduationYear: '',
    })
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [showEmailVerification, setShowEmailVerification] = useState(false)
    const [passwordStrength, setPasswordStrength] = useState({ strength: 0, errors: [] })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
        setError('')

        // Update password strength in real-time
        if (name === 'password') {
            const validation = validatePassword(value)
            setPasswordStrength({ strength: validation.strength, errors: validation.errors })
        }
    }

    const validateStep1 = () => {
        // Validate name
        const nameValidation = validateName(formData.name)
        if (!nameValidation.valid) {
            setError(nameValidation.error)
            return false
        }

        // Validate email
        const emailValidation = validateEmail(formData.email)
        if (!emailValidation.valid) {
            setError(emailValidation.error)
            return false
        }

        // Validate password strength
        const passwordValidation = validatePassword(formData.password)
        if (!passwordValidation.valid) {
            setError(passwordValidation.errors[0])
            return false
        }

        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (step < 2) {
            if (validateStep1()) {
                setStep(step + 1)
            }
        } else {
            // Final submission
            if (!formData.university || !formData.major || !formData.graduationYear) {
                setError('Please complete all fields')
                return
            }

            setIsLoading(true)

            try {
                const { data, error: signUpError, needsEmailVerification } = await signUp(
                    formData.email,
                    formData.password,
                    'student',
                    {
                        name: formData.name,
                        university: formData.university,
                        major: formData.major,
                        graduationYear: formData.graduationYear
                    }
                )

                if (signUpError) {
                    setError(getAuthErrorMessage(signUpError))
                    return
                }

                if (needsEmailVerification) {
                    setShowEmailVerification(true)
                } else if (data?.user) {
                    navigate('/student/profile')
                }
            } catch (err) {
                setError(getAuthErrorMessage(err))
            } finally {
                setIsLoading(false)
            }
        }
    }

    const strengthInfo = getPasswordStrengthInfo(passwordStrength.strength)

    // Email verification success screen
    if (showEmailVerification) {
        return (
            <div className="auth-page">
                <div className="auth-container">
                    <div className="auth-visual">
                        <div className="visual-content">
                            <div className="visual-icon animate-float">
                                <Mail size={64} />
                            </div>
                            <h2>Check Your Email</h2>
                            <p>We've sent a verification link to your inbox</p>
                        </div>
                    </div>

                    <div className="auth-form-container">
                        <div className="email-verification-notice">
                            <div className="verification-icon">
                                <CheckCircle size={48} />
                            </div>
                            <h2>Verify Your Email</h2>
                            <p>We've sent a verification email to:</p>
                            <p className="verification-email">{formData.email}</p>
                            <p className="verification-instructions">
                                Click the link in the email to activate your account.
                                If you don't see it, check your spam folder.
                            </p>
                            <Link to="/student/login" className="btn btn-primary">
                                Go to Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
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
                        <p>Join thousands of students discovering their dream careers through MatchOp</p>

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

                    {error && (
                        <div className="auth-error">
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}

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
                                            disabled={isLoading}
                                            required
                                            autoComplete="name"
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
                                            disabled={isLoading}
                                            required
                                            autoComplete="email"
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
                                            disabled={isLoading}
                                            required
                                            autoComplete="new-password"
                                        />
                                    </div>

                                    {/* Password strength indicator */}
                                    {formData.password && (
                                        <div className="password-strength">
                                            <div className="strength-bar">
                                                <div
                                                    className="strength-fill"
                                                    style={{
                                                        width: `${passwordStrength.strength}%`,
                                                        backgroundColor: strengthInfo.color
                                                    }}
                                                />
                                            </div>
                                            <span className="strength-label" style={{ color: strengthInfo.color }}>
                                                {strengthInfo.label}
                                            </span>
                                        </div>
                                    )}

                                    <p className="password-hint">
                                        Min. 8 characters with uppercase, lowercase, number, and special character
                                    </p>
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
                                            disabled={isLoading}
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
                                        disabled={isLoading}
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
                                        disabled={isLoading}
                                        required
                                    >
                                        <option value="">Select year</option>
                                        <option value="2024">2024</option>
                                        <option value="2025">2025</option>
                                        <option value="2026">2026</option>
                                        <option value="2027">2027</option>
                                        <option value="2028">2028</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={20} className="spinner" />
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    {step < 2 ? 'Continue' : 'Create Account'}
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>

                        {step > 1 && (
                            <button
                                type="button"
                                className="btn btn-secondary w-full"
                                onClick={() => setStep(step - 1)}
                                disabled={isLoading}
                            >
                                Back
                            </button>
                        )}
                    </form>

                    <p className="auth-terms">
                        By signing up, you agree to our <Link to="/terms-of-service" target="_blank" rel="noopener noreferrer">Terms of Service</Link> and <Link to="/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default StudentSignup
