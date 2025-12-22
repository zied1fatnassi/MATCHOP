import React from 'react'
import { Calendar, User, ArrowRight } from 'lucide-react'

const Blog = () => {
    const posts = [
        {
            id: 1,
            title: "How to Build a Killer Student Profile",
            excerpt: "Learn the secrets to standing out to top recruiters with a profile that highlights your true potential.",
            date: "Dec 15, 2025",
            author: "MatchOp Team",
            image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800"
        },
        {
            id: 2,
            title: "Top 5 Emerging Tech Jobs in Tunisia",
            excerpt: "The Tunisian tech sector is booming. Here are the most in-demand roles for 2026 and beyond.",
            date: "Dec 10, 2025",
            author: "Sarah J.",
            image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800"
        },
        {
            id: 3,
            title: "Remote Work: A Student's Guide",
            excerpt: "Working for international companies from your dorm room? Here is how to manage time and expectations.",
            date: "Nov 28, 2025",
            author: "Ahmed K.",
            image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?auto=format&fit=crop&q=80&w=800"
        }
    ]

    return (
        <div className="container" style={{ padding: '4rem 1rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>The MatchOp Blog</h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Insights, tips, and news for your career journey.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                {posts.map(post => (
                    <div key={post.id} className="glass-card hover-lift" style={{ overflow: 'hidden', padding: '0' }}>
                        <div style={{ height: '200px', overflow: 'hidden' }}>
                            <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Calendar size={14} /> {post.date}</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><User size={14} /> {post.author}</span>
                            </div>
                            <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', lineHeight: '1.3' }}>{post.title}</h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>{post.excerpt}</p>
                            <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'space-between' }}>
                                Read Article <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Blog
