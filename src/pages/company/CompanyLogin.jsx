import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, ArrowRight, Building2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import '../student/StudentSignup.css'

/**
 * Company Login Page
 * Requires email and password to sign in
 */
function CompanyLogin() {
    const navigate = useNavigate()
    const { login } = useAuth()
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })
    const [error, setError] = useState('')

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setError('')
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        // Basic validation
        if (!formData.email || !formData.password) {
            setError('Please fill in all fields')
            return
        }

        if (!formData.email.includes('@')) {
            setError('Please enter a valid email address')
            return
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }

        // In a real app, this would validate against a backend
        login('company', { email: formData.email })
        navigate('/company/candidates')
    }

    return (
        <div className="auth-page">
            <div className="auth-container login-container">
                <div className="auth-visual" style={{ background: 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)' }}>
                    <div className="visual-content">
                        <div className="visual-icon animate-float">
                            <Building2 size={64} />
                        </div>
                        <h2>Welcome Back!</h2>
                        <p>Sign in to continue finding top talent</p>
                    </div>
                </div>

                <div className="auth-form-container">
                    <div className="auth-header">
                        <h1>Company Sign In</h1>
                        <p>Don't have an account? <Link to="/company/signup">Sign up</Link></p>
                    </div>

                    {error && (
                        <div className="auth-error">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-step">
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

                            <div className="forgot-password">
                                <a href="#">Forgot password?</a>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary btn-lg w-full">
                            Sign In
                            <ArrowRight size={20} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CompanyLogin
