import React from 'react'
import { Award, Users, Globe } from 'lucide-react'

const About = () => {
    return (
        <div className="container" style={{ padding: '4rem 1rem' }}>
            <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>About MatchOp</h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto' }}>
                    We are revolutionizing how Tunisian talent connects with global opportunities.
                    Our AI-driven platform removes bias and focuses on skills and potential.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <div className="glass-card hover-lift" style={{ padding: '2rem' }}>
                    <div style={{ background: 'rgba(37, 99, 235, 0.1)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--primary)' }}>
                        <Users size={30} />
                    </div>
                    <h3>Our Mission</h3>
                    <p>To empower every student in Tunisia to find an internship that matches their true potential, regardless of their background.</p>
                </div>

                <div className="glass-card hover-lift" style={{ padding: '2rem' }}>
                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--accent-teal)' }}>
                        <Globe size={30} />
                    </div>
                    <h3>Global Reach</h3>
                    <p>Connecting local talent with international remote opportunities. We believe skills have no borders.</p>
                </div>

                <div className="glass-card hover-lift" style={{ padding: '2rem' }}>
                    <div style={{ background: 'rgba(139, 92, 246, 0.1)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--accent-purple)' }}>
                        <Award size={30} />
                    </div>
                    <h3>Excellence First</h3>
                    <p>We verify every student and company to ensure a high-quality, trusted ecosystem for professional growth.</p>
                </div>
            </div>
        </div>
    )
}

export default About
