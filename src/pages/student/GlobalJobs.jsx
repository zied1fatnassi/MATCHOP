import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, MapPin, Building2, Globe, ExternalLink, Calendar, Briefcase, Loader2, Send } from 'lucide-react'
import { useExternalJobs } from '../../hooks/useExternalJobs'
import Navbar from '../../components/Navbar' // Assuming Navbar is used here or in layout
import { useAuth } from '../../context/AuthContext'
import { useStudentProfile } from '../../hooks/useStudentProfile'
import { useToast } from '../../hooks/useLoadingError'
import ErrorToast from '../../components/ErrorToast'
import './GlobalJobs.css'

export default function GlobalJobs() {
    const {
        jobs, loading, error, filters, setFilters,
        page, totalPages, nextPage, prevPage, refresh
    } = useExternalJobs()
    const { user } = useAuth()
    const { profile } = useStudentProfile() // To get data for auto-apply
    const { toast, showSuccess, showError, hideToast } = useToast()

    const [applyingId, setApplyingId] = useState(null)

    // Simplified One-Click Apply (sends email to the scraped contact email if exists)
    const handleSmartApply = async (job) => {
        if (!job.contact_email) {
            window.open(job.original_url, '_blank')
            return
        }

        if (!profile?.cv_url) {
            showError('Please upload your CV in your profile first!')
            return
        }

        setApplyingId(job.id)
        try {
            // EmailJS Configuration
            const SERVICE_ID = 'service_4y9cxmr'
            const PUBLIC_KEY = 'vtEyts7G1cQCTGouY'
            const TEMPLATE_COMPANY = 'template_qfyvb36'
            const TEMPLATE_STUDENT = 'template_2t3mdf9'

            const commonParams = {
                job_title: job.title,
                company_name: job.company_name,
                candidate_name: profile.display_name,
                candidate_email: user.email,
            }

            // 1. Send Application to Company (if email exists) - mapped to Template 1 vars
            const companyParams = {
                ...commonParams,
                to_email: job.contact_email,
                message: `I am interested in the ${job.title} role at ${job.company_name}. Please find my CV attached.`,
                profile_link: `${window.location.origin}/profile/${user.id}`,
                cv_link: profile.cv_url
            }

            // 2. Send Confirmation to Student - mapped to Template 2 vars
            const studentParams = {
                ...commonParams,
                to_email: user.email, // Send to the student
            }

            // Execute sends in parallel
            const promises = [
                emailjs.send(SERVICE_ID, TEMPLATE_COMPANY, companyParams, PUBLIC_KEY)
            ]

            // We also send confirmation to student
            promises.push(emailjs.send(SERVICE_ID, TEMPLATE_STUDENT, studentParams, PUBLIC_KEY))

            await Promise.all(promises)

            showSuccess(`Application sent to ${job.company_name}!`)
        } catch (err) {
            console.error('Apply error:', err)
            showError('Failed to send application. Opened original link instead.')
            window.open(job.original_url, '_blank')
        } finally {
            setApplyingId(null)
        }
    }

    return (
        <div className="global-jobs-page animate-fade-in-up">
            <header className="page-header">
                <div className="header-content">
                    <h1><Globe size={32} /> Global Opportunities</h1>
                    <p>Aggregate jobs from top Tunisian & International platforms</p>
                    <button onClick={refresh} className="refresh-btn" disabled={loading}>
                        <Loader2 size={16} className={loading ? 'spin' : ''} /> Refresh Jobs
                    </button>
                </div>
            </header>

            <div className="filters-bar">
                <div className="search-input">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search title, skill, or company..."
                        value={filters.query}
                        onChange={e => setFilters(prev => ({ ...prev, query: e.target.value }))}
                    />
                </div>
                <div className="search-input">
                    <MapPin size={18} />
                    <input
                        type="text"
                        placeholder="Location (e.g. Remote, Tunis)"
                        value={filters.location}
                        onChange={e => setFilters(prev => ({ ...prev, location: e.target.value }))}
                    />
                </div>
            </div>

            {error && <div className="error-message">Error loading jobs: {error}</div>}

            <div className="jobs-grid">
                {loading ? (
                    <div className="loading-state">
                        <Loader2 size={48} className="spin" />
                        <p>Searching the globe...</p>
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="empty-state">
                        <Globe size={64} />
                        <h3>No jobs found matching your criteria</h3>
                        <p>Try broadening your search terms</p>
                    </div>
                ) : (
                    jobs.map(job => (
                        <motion.div
                            key={job.id}
                            className="job-card"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -5 }}
                        >
                            <div className="job-header">
                                <div className="company-logo-placeholder">
                                    {job.logo_url ? <img src={job.logo_url} alt="logo" loading="lazy" decoding="async" width="56" height="56" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-building-2"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>' }} /> : <Building2 size={24} />}
                                </div>
                                <div className="job-info">
                                    <h3>{job.title}</h3>
                                    <span className="company-name">{job.company_name}</span>
                                </div>
                                <span className="source-badge">{job.source_website}</span>
                            </div>

                            <div className="job-details">
                                <div className="detail-item"><MapPin size={14} /> {job.location || 'Remote'}</div>
                                <div className="detail-item"><Briefcase size={14} /> {job.job_type || 'Full-time'}</div>
                                <div className="detail-item"><Calendar size={14} /> {new Date(job.posted_at).toLocaleDateString()}</div>
                            </div>

                            <div className="actions">
                                <button
                                    className={`apply-btn ${job.contact_email ? 'smart' : ''}`}
                                    onClick={() => handleSmartApply(job)}
                                    disabled={applyingId === job.id}
                                >
                                    {applyingId === job.id ? (
                                        <><Loader2 size={16} className="spin" /> Sending...</>
                                    ) : job.contact_email ? (
                                        <><Send size={16} /> Fast Apply</>
                                    ) : (
                                        <><ExternalLink size={16} /> Apply on Site</>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Pagination Controls */}
            {jobs.length > 0 && (
                <div className="pagination-controls">
                    <button
                        onClick={prevPage}
                        disabled={page === 1 || loading}
                        className="page-btn"
                    >
                        Previous
                    </button>

                    <span className="page-info">
                        Page {page} of {totalPages || 1}
                    </span>

                    <button
                        onClick={nextPage}
                        disabled={page >= (totalPages || 1) || loading}
                        className="page-btn"
                    >
                        Next
                    </button>
                </div>
            )}

            {toast && <ErrorToast {...toast} onClose={hideToast} />}
        </div>
    )
}
