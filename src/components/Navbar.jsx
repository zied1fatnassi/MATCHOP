import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Menu, X, User, Briefcase, Heart, Home, LogOut, Globe, ChevronDown } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'
import './Navbar.css'

/**
 * Main navigation component with:
 * - Role-based navigation (Student vs Company)
 * - Language switcher (EN/FR)
 * - Mobile responsive menu
 * - Auth state persistence
 */
function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [langOpen, setLangOpen] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()
    const { t, i18n } = useTranslation()
    const { isLoggedIn, isStudent, isCompany, isLoading, signOut, user } = useAuth()

    const studentLinks = [
        { to: '/student/matches', icon: <Heart size={18} />, label: t('nav.matches') },
        { to: '/student/swipe', icon: <Home size={18} />, label: t('nav.discover') },
        { to: '/student/global-jobs', icon: <Globe size={18} />, label: 'Global Jobs' },
        { to: '/student/profile', icon: <User size={18} />, label: t('nav.profile') },
    ]

    const companyLinks = [
        { to: '/company/candidates', icon: <User size={18} />, label: t('nav.candidates') },
        { to: '/company/matches', icon: <Heart size={18} />, label: t('nav.matches') },
        { to: '/company/post-offer', icon: <Briefcase size={18} />, label: t('nav.postJob') },
        { to: '/company/profile', icon: <User size={18} />, label: t('nav.profile') },
    ]

    // Determine links based on user type, with fallback for when type isn't loaded yet
    const links = isStudent ? studentLinks : isCompany ? companyLinks : []

    const languages = [
        { code: 'en', label: 'EN', fullLabel: 'English', flag: '🇬🇧' },
        { code: 'fr', label: 'FR', fullLabel: 'Français', flag: '🇫🇷' },
    ]

    const currentLang = languages.find(l => l.code === i18n.language) || languages[0]

    const changeLanguage = (code) => {
        i18n.changeLanguage(code)
        setLangOpen(false)
    }

    const handleLogout = async () => {
        console.log('[Navbar] Logout clicked')
        try {
            await signOut()
            console.log('[Navbar] signOut completed, navigating to /')
            navigate('/')
            setIsOpen(false)
        } catch (err) {
            console.error('[Navbar] Logout failed:', err)
        }
    }

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Logo */}
                <Link to="/" className="navbar-logo">
                    <Logo size="small" showText={true} />
                </Link>

                {/* Center Links (when logged in) */}
                {isLoggedIn && (
                    <div className={`navbar-links ${isOpen ? 'active' : ''}`}>
                        {links.map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`navbar-link ${location.pathname === link.to ? 'active' : ''}`}
                                onClick={() => setIsOpen(false)}
                            >
                                {link.icon}
                                <span>{link.label}</span>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Right Section */}
                <div className="navbar-right">
                    {/* Language Switcher */}
                    <div className="lang-switcher">
                        <button
                            className="lang-btn"
                            onClick={() => setLangOpen(!langOpen)}
                        >
                            <Globe size={16} />
                            <span>{currentLang.label}</span>
                            <ChevronDown size={14} />
                        </button>

                        {langOpen && (
                            <div className="lang-dropdown">
                                {languages.map(lang => (
                                    <button
                                        key={lang.code}
                                        className={`lang-option ${i18n.language === lang.code ? 'active' : ''}`}
                                        onClick={() => changeLanguage(lang.code)}
                                    >
                                        <span>{lang.flag}</span>
                                        <span>{lang.fullLabel}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Auth Buttons (when not logged in and not loading) */}
                    {!isLoggedIn && !isLoading && (
                        <div className="navbar-auth">
                            <Link to="/student/signup" className="btn btn-secondary btn-sm">
                                {t('landing.ctaStudent')}
                            </Link>
                            <Link to="/company/signup" className="btn btn-primary btn-sm">
                                {t('landing.ctaCompany')}
                            </Link>
                        </div>
                    )}

                    {/* Logout (when logged in) */}
                    {isLoggedIn && (
                        <button onClick={handleLogout} className="btn btn-secondary btn-sm logout-btn">
                            <LogOut size={16} />
                            <span>{t('nav.logout')}</span>
                        </button>
                    )}

                    {/* Mobile Toggle */}
                    {isLoggedIn && (
                        <button className="navbar-toggle" onClick={() => setIsOpen(!isOpen)}>
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar
