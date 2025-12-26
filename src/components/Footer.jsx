import React from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { Sun, Moon, Monitor } from 'lucide-react'
import Logo from './Logo'

const Footer = () => {
    const { theme, setTheme } = useTheme()
    const currentYear = new Date().getFullYear()

    return (
        <footer className="footer" style={{
            background: 'var(--bg-main)',
            borderTop: '1px solid var(--glass-border)',
            padding: '3rem 1rem',
            marginTop: 'auto'
        }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '2rem',
                    marginBottom: '2rem'
                }}>
                    {/* Brand Section */}
                    <div>
                        <div style={{ marginBottom: '1rem' }}>
                            <Logo showText={true} />
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                            Matching talent with opportunity through AI-driven discovery.
                        </p>
                    </div>

                    {/* Founder Profile */}
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <img
                                src="/founder.jpg"
                                alt="Zied Fatnassi - Founder"
                                style={{
                                    width: '100px',
                                    height: '100px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    border: '3px solid var(--glass-border)',
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                                }}
                                width="100"
                                height="100"
                            />
                            <div style={{ marginTop: '0.75rem' }}>
                                <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>Zied Fatnassi</h4>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Founder & Developer</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Company</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <Link to="/about" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>About Us</Link>
                            <Link to="/contact" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Contact</Link>
                            <Link to="/blog" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Blog</Link>
                        </div>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Legal</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <Link to="/legal/terms" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Terms of Service</Link>
                            <Link to="/legal/privacy" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Privacy Policy</Link>
                            <Link to="/legal/cookies" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Cookie Policy</Link>
                        </div>
                    </div>

                    {/* Theme Toggle */}
                    <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Appearance</h4>
                        <div style={{
                            display: 'inline-flex',
                            background: 'var(--glass-surface)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '9999px',
                            padding: '0.25rem'
                        }}>
                            {[
                                { id: 'light', icon: Sun, label: 'Light' },
                                { id: 'dark', icon: Moon, label: 'Dark' },
                                { id: 'system', icon: Monitor, label: 'Auto' }
                            ].map(mode => (
                                <button
                                    key={mode.id}
                                    onClick={() => setTheme(mode.id)}
                                    title={mode.label}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '0.5rem',
                                        borderRadius: '50%',
                                        border: 'none',
                                        background: theme === mode.id ? 'var(--primary)' : 'transparent',
                                        color: theme === mode.id ? '#fff' : 'var(--text-secondary)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <mode.icon size={16} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{
                    borderTop: '1px solid var(--glass-border)',
                    paddingTop: '1.5rem',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem'
                }}>
                    &copy; {currentYear} MatchOp. All rights reserved.
                </div>
            </div>
        </footer>
    )
}

export default Footer
