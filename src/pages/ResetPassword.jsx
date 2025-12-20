import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Eye, EyeOff, CheckCircle, Loader2, KeyRound, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { validatePassword, getAuthErrorMessage } from '../lib/validation'
import '../pages/student/StudentSignup.css'

/**
 * Reset Password Page
 * Allows users to set a new password after clicking the reset link
 */
function ResetPassword() {
    const navigate = useNavigate()
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [isReady, setIsReady] = useState(false)
    const [sessionError, setSessionError] = useState(false)
    const hasCheckedSession = useRef(false)

    // Check if user has a valid password recovery session
    useEffect(() => {
        // Only run once
        if (hasCheckedSession.current) return
        hasCheckedSession.current = true

        const handleRecovery = async () => {
            // Give Supabase time to process the hash
            await new Promise(resolve => setTimeout(resolve, 500))

            // Check for PASSWORD_RECOVERY event
            const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
                if (event === 'PASSWORD_RECOVERY') {
                    // Clean up the URL hash
                    window.history.replaceState(null, '', window.location.pathname)
                    setIsReady(true)
                    return
                }

                if (event === 'SIGNED_IN' && session) {
                    setIsReady(true)
                    return
                }
            })

            // Also check current session
            const { data: { session } } = await supabase.auth.getSession()
            if (session) {
                setIsReady(true)
            } else {
                // Wait a bit more for the auth state change
                setTimeout(() => {
                    if (!isReady) {
                        setSessionError(true)
                    }
                }, 2000)
            }

            return () => subscription.unsubscribe()
        }

        handleRecovery()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        // Validate password
        const passwordValidation = validatePassword(password)
        if (!passwordValidation.valid) {
            setError(passwordValidation.error)
            return
        }

        // Check passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        setIsLoading(true)

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: password
            })

            if (updateError) {
                setError(getAuthErrorMessage(updateError))
                return
            }

            setIsSuccess(true)

            // Sign out and redirect to login
            await supabase.auth.signOut()
            setTimeout(() => {
                navigate('/student/login')
            }, 3000)
        } catch (err) {
            setError(getAuthErrorMessage(err))
        } finally {
            setIsLoading(false)
        }
    }

    // Password strength calculation
    const getPasswordStrength = () => {
        if (!password) return { strength: 0, label: '', color: '' }

        let strength = 0
        if (password.length >= 8) strength += 25
        if (/[A-Z]/.test(password)) strength += 25
        if (/[0-9]/.test(password)) strength += 25
        if (/[^A-Za-z0-9]/.test(password)) strength += 25

        if (strength <= 25) return { strength, label: 'Weak', color: '#ef4444' }
        if (strength <= 50) return { strength, label: 'Fair', color: '#f59e0b' }
        if (strength <= 75) return { strength, label: 'Good', color: '#3b82f6' }
        return { strength, label: 'Strong', color: '#10b981' }
    }

    const passwordStrength = getPasswordStrength()

    // Session error - link expired or invalid
    if (sessionError) {
        return (
            <div className="auth-page">
                <div className="auth-container login-container">
                    <div className="auth-visual">
                        <div className="visual-content">
                            <div className="visual-icon">
                                <AlertCircle size={64} />
                            </div>
                            <h2>Invalid Link</h2>
                            <p>This password reset link is invalid or expired</p>
                        </div>
                    </div>

                    <div className="auth-form-container">
                        <div className="auth-header">
                            <h1>Link Expired</h1>
                            <p>Please request a new password reset link</p>
                        </div>

                        <div className="auth-error" style={{ marginTop: '2rem' }}>
                            The password reset link has expired or is invalid.
                            Please request a new one.
                        </div>

                        <button
                            onClick={() => navigate('/forgot-password')}
                            className="btn btn-primary btn-lg w-full"
                            style={{ marginTop: '2rem' }}
                        >
                            Request New Link
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // Loading session check
    if (!isReady && !sessionError) {
        return (
            <div className="auth-page">
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', gap: '1rem' }}>
                    <Loader2 size={48} className="spinner" style={{ color: 'white', animation: 'spin 1s linear infinite' }} />
                    <p style={{ color: 'white' }}>Verifying your reset link...</p>
                    <style>{`
                        @keyframes spin {
                            from { transform: rotate(0deg); }
                            to { transform: rotate(360deg); }
                        }
                    `}</style>
                </div>
            </div>
        )
    }

    // Success state
    if (isSuccess) {
        return (
            <div className="auth-page">
                <div className="auth-container login-container">
                    <div className="auth-visual">
                        <div className="visual-content">
                            <div className="visual-icon">
                                <CheckCircle size={64} />
                            </div>
                            <h2>Password Updated!</h2>
                            <p>Your password has been changed successfully</p>
                        </div>
                    </div>

                    <div className="auth-form-container">
                        <div className="auth-header">
                            <h1>Success!</h1>
                            <p>Your password has been updated</p>
                        </div>

                        <div className="verification-notice" style={{ marginTop: '2rem' }}>
                            <CheckCircle size={48} style={{ color: '#10b981', marginBottom: '1rem' }} />
                            <h3>Password Changed Successfully</h3>
                            <p>
                                You will be redirected to the login page in a few seconds.
                            </p>
                        </div>

                        <button
                            onClick={() => navigate('/student/login')}
                            className="btn btn-primary btn-lg w-full"
                            style={{ marginTop: '2rem' }}
                        >
                            Go to Sign In
                        </button>
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
                        <h2>Set New Password</h2>
                        <p>Choose a strong password for your account</p>
                    </div>
                </div>

                <div className="auth-form-container">
                    <div className="auth-header">
                        <h1>Reset Password</h1>
                        <p>Enter your new password below</p>
                    </div>

                    {error && (
                        <div className="auth-error">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-step">
                            <div className="input-group">
                                <label className="input-label">New Password</label>
                                <div className="input-with-icon">
                                    <Lock size={20} className="input-icon" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className="input"
                                        placeholder="Enter new password"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value)
                                            setError('')
                                        }}
                                        disabled={isLoading}
                                        required
                                        autoComplete="new-password"
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>

                                {/* Password strength indicator */}
                                {password && (
                                    <div className="password-strength">
                                        <div className="strength-bar">
                                            <div
                                                className="strength-fill"
                                                style={{
                                                    width: `${passwordStrength.strength}%`,
                                                    backgroundColor: passwordStrength.color
                                                }}
                                            />
                                        </div>
                                        <span className="strength-label" style={{ color: passwordStrength.color }}>
                                            {passwordStrength.label}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="input-group">
                                <label className="input-label">Confirm Password</label>
                                <div className="input-with-icon">
                                    <Lock size={20} className="input-icon" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className="input"
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(e) => {
                                            setConfirmPassword(e.target.value)
                                            setError('')
                                        }}
                                        disabled={isLoading}
                                        required
                                        autoComplete="new-password"
                                    />
                                </div>

                                {/* Match indicator */}
                                {confirmPassword && (
                                    <p style={{
                                        fontSize: '0.875rem',
                                        marginTop: '0.5rem',
                                        color: password === confirmPassword ? '#10b981' : '#ef4444'
                                    }}>
                                        {password === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                                    </p>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg w-full"
                            disabled={isLoading || !password || !confirmPassword || password !== confirmPassword}
                            style={{ marginTop: '1.5rem' }}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={20} className="spinner" />
                                    Updating...
                                </>
                            ) : (
                                'Update Password'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword
