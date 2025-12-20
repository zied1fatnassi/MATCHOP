import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import './Legal.css'

/**
 * Privacy Policy Page
 * Displays the application's privacy policy and data handling practices
 */
function PrivacyPolicy() {
    return (
        <div className="legal-page">
            <div className="legal-container">
                <Link to="/" className="legal-back-link">
                    <ArrowLeft size={18} />
                    Back to Home
                </Link>

                <header className="legal-header">
                    <h1>Privacy Policy</h1>
                    <p className="last-updated">Last updated: December 20, 2024</p>
                </header>

                <div className="legal-content">
                    <h2>1. Introduction</h2>
                    <p>
                        At MatchOp, we take your privacy seriously. This Privacy Policy explains how
                        we collect, use, disclose, and safeguard your information when you use our
                        job matching platform.
                    </p>

                    <h2>2. Information We Collect</h2>
                    <h3>2.1 Personal Information</h3>
                    <p>We collect information you provide directly, including:</p>
                    <ul>
                        <li>Name and email address</li>
                        <li>Educational background (for students)</li>
                        <li>Company information (for employers)</li>
                        <li>Profile details, skills, and experience</li>
                        <li>Messages exchanged through our Platform</li>
                    </ul>

                    <h3>2.2 Usage Information</h3>
                    <p>We automatically collect certain information when you use our Platform:</p>
                    <ul>
                        <li>Device and browser information</li>
                        <li>IP address and location data</li>
                        <li>Pages visited and features used</li>
                        <li>Swiping preferences and match history</li>
                    </ul>

                    <h2>3. How We Use Your Information</h2>
                    <p>We use collected information to:</p>
                    <ul>
                        <li>Provide and improve our matching services</li>
                        <li>Create and manage your account</li>
                        <li>Facilitate connections between students and companies</li>
                        <li>Send notifications about matches and messages</li>
                        <li>Analyze usage patterns to improve the Platform</li>
                        <li>Ensure security and prevent fraud</li>
                    </ul>

                    <h2>4. Information Sharing</h2>
                    <p>We may share your information with:</p>
                    <ul>
                        <li><strong>Other Users:</strong> Profile information is visible to potential matches</li>
                        <li><strong>Service Providers:</strong> Third parties who help us operate the Platform</li>
                        <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                    </ul>
                    <p>
                        We do not sell your personal information to third parties.
                    </p>

                    <h2>5. Data Security</h2>
                    <p>
                        We implement appropriate security measures to protect your information, including
                        encryption, secure servers, and regular security assessments. However, no method
                        of transmission over the Internet is 100% secure.
                    </p>

                    <h2>6. Your Rights</h2>
                    <p>You have the right to:</p>
                    <ul>
                        <li>Access and download your personal data</li>
                        <li>Correct inaccurate information</li>
                        <li>Delete your account and associated data</li>
                        <li>Opt out of marketing communications</li>
                        <li>Request data portability</li>
                    </ul>

                    <h2>7. Cookies</h2>
                    <p>
                        We use cookies and similar technologies to enhance your experience, analyze
                        usage, and personalize content. You can manage cookie preferences through
                        your browser settings.
                    </p>

                    <h2>8. Children's Privacy</h2>
                    <p>
                        MatchOp is not intended for users under 16 years of age. We do not knowingly
                        collect information from children under 16.
                    </p>

                    <h2>9. International Users</h2>
                    <p>
                        If you access MatchOp from outside our country of operation, your information
                        may be transferred to and processed in different jurisdictions.
                    </p>

                    <h2>10. Changes to This Policy</h2>
                    <p>
                        We may update this Privacy Policy periodically. We will notify you of any
                        material changes by posting the new policy on our Platform and updating
                        the "Last updated" date.
                    </p>

                    <div className="legal-contact">
                        <h2>Contact Us</h2>
                        <p>
                            If you have questions about this Privacy Policy or your data, please
                            contact us at:{' '}
                            <a href="mailto:privacy@matchop.com">privacy@matchop.com</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PrivacyPolicy
