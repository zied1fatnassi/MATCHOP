import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, CheckCircle, Loader2, KeyRound } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { validateEmail, getAuthErrorMessage } from '../lib/validation'
import '../pages/student/StudentSignup.css'

/**
 * Forgot Password Page
 * Sends password reset email via Supabase Auth
 */
function ForgotPassword() {
    const { resetPassword } = useAuth()
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isEmailSent, setIsEmailSent] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        // Validate email
        const emailValidation = validateEmail(email)
        if (!emailValidation.valid) {
            setError(emailValidation.error)
            return
        }

        setIsLoading(true)

        try {
            const { error: resetError } = await resetPassword(email)

            if (resetError) {
                setError(getAuthErrorMessage(resetError))
                return
            }

            setIsEmailSent(true)
        } catch (err) {
            setError(getAuthErrorMessage(err))
        } finally {
            setIsLoading(false)
        }
    }

    // Success state - email sent
    if (isEmailSent) {
        return (
            <div className="auth-page">
                <div className="auth-container login-container">
                    <div className="auth-visual">
                        <div className="visual-content">
                            <div className="visual-icon">
                                <CheckCircle size={64} />
                            </div>
                            <h2>Check Your Email</h2>
                            <p>We've sent you a password reset link</p>
                        </div>
                    </div>

                    <div className="auth-form-container">
                        <div className="auth-header">
                            <h1>Email Sent!</h1>
                            <p>Check your inbox for the password reset link</p>
                        </div>

                        <div className="verification-notice" style={{ marginTop: '2rem' }}>
                            <CheckCircle size={48} style={{ color: '#10b981', marginBottom: '1rem' }} />
                            <h3>Password Reset Email Sent</h3>
                            <p>
                                We've sent a password reset link to <strong>{email}</strong>.
                                Click the link in the email to reset your password.
                            </p>
                            <p style={{ marginTop: '1rem', opacity: 0.8 }}>
                                Didn't receive the email? Check your spam folder or try again.
                            </p>
                        </div>

                        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <button
                                onClick={() => {
                                    setIsEmailSent(false)
                                    setEmail('')
                                }}
                                className="btn btn-secondary w-full"
                            >
                                Try Different Email
                            </button>
                            <Link to="/student/login" className="btn btn-primary w-full">
                                <ArrowLeft size={20} />
                                Back to Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="auth-page">
            <div className="auth-container login-container">
                <div className="auth-visual">
                    <div className="visual-content">
                        <div className="visual-icon">
                            <KeyRound size={64} />
                        </div>
                        <h2>Forgot Password?</h2>
                        <p>No worries, we'll help you reset it</p>
                    </div>
                </div>

                <div className="auth-form-container">
                    <div className="auth-header">
                        <h1>Reset Password</h1>
                        <p>Enter your email to receive a reset link</p>
                    </div>

                    {error && (
                        <div className="auth-error">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-step">
                            <div className="input-group">
                                <label className="input-label">Email Address</label>
                                <div className="input-with-icon">
                                    <Mail size={20} className="input-icon" />
                                    <input
                                        type="email"
                                        className="input"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value)
                                            setError('')
                                        }}
                                        disabled={isLoading}
                                        required
                                        autoComplete="email"
                                        autoFocus
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg w-full"
                            disabled={isLoading || !email}
                            style={{ marginTop: '1.5rem' }}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={20} className="spinner" />
                                    Sending...
                                </>
                            ) : (
                                'Send Reset Link'
                            )}
                        </button>

                        <Link
                            to="/student/login"
                            className="btn btn-secondary w-full"
                            style={{ marginTop: '1rem' }}
                        >
                            <ArrowLeft size={20} />
                            Back to Sign In
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword
