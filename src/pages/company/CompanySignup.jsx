import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, Building2, ArrowRight, CheckCircle, Globe, Loader2, AlertCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { validatePassword, validateEmail, validateName, getPasswordStrengthInfo, getAuthErrorMessage } from '../../lib/validation'
import '../student/StudentSignup.css'

/**
 * Company Signup Page
 * Secure registration using Supabase Auth with email verification
 */
function CompanySignup() {
    const navigate = useNavigate()
    const { signUp } = useAuth()
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        companyName: '',
        email: '',
        password: '',
        website: '',
        industry: '',
        size: '',
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
        // Validate company name
        const nameValidation = validateName(formData.companyName)
        if (!nameValidation.valid) {
            setError(nameValidation.error.replace('Name', 'Company name'))
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
            if (!formData.industry || !formData.size) {
                setError('Please complete all required fields')
                return
            }

            setIsLoading(true)

            try {
                const { data, error: signUpError, needsEmailVerification } = await signUp(
                    formData.email,
                    formData.password,
                    'company',
                    {
                        name: formData.companyName,
                        website: formData.website,
                        sector: formData.industry,
                        size: formData.size
                    }
                )

                if (signUpError) {
                    setError(getAuthErrorMessage(signUpError))
                    return
                }

                if (needsEmailVerification) {
                    setShowEmailVerification(true)
                } else if (data?.user) {
                    navigate('/company/profile')
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
                    <div className="auth-visual" style={{ background: 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)' }}>
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
                                Click the link in the email to activate your company account.
                                If you don't see it, check your spam folder.
                            </p>
                            <Link to="/company/login" className="btn btn-primary">
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
                                            disabled={isLoading}
                                            required
                                            autoComplete="organization"
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
                                    <label className="input-label">Website (optional)</label>
                                    <div className="input-with-icon">
                                        <Globe size={20} className="input-icon" />
                                        <input
                                            type="url"
                                            name="website"
                                            className="input"
                                            placeholder="https://company.com"
                                            value={formData.website}
                                            onChange={handleChange}
                                            disabled={isLoading}
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
                                        disabled={isLoading}
                                        required
                                    >
                                        <option value="">Select industry</option>
                                        <option value="technology">Technology</option>
                                        <option value="finance">Finance</option>
                                        <option value="healthcare">Healthcare</option>
                                        <option value="education">Education</option>
                                        <option value="retail">Retail</option>
                                        <option value="manufacturing">Manufacturing</option>
                                        <option value="consulting">Consulting</option>
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
                                        disabled={isLoading}
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

export default CompanySignup
