import { useState, useRef, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Send, Paperclip, Phone, Video, MoreVertical, Loader } from 'lucide-react'
import ChatBubble from '../../components/ChatBubble'
import { useMessages } from '../../hooks/useMessages'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import './StudentChat.css'

function StudentChat() {
    const { matchId } = useParams()
    const { user } = useAuth()
    const { messages, sendMessage, subscribeToMessages, loading: messagesLoading } = useMessages(matchId)
    const [newMessage, setNewMessage] = useState('')
    const [matchDetails, setMatchDetails] = useState(null)
    const [loadingDetails, setLoadingDetails] = useState(true)
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    // Fetch match details (company info)
    useEffect(() => {
        const fetchMatchDetails = async () => {
            if (!matchId) return

            try {
                // Get match info including company details
                // Use companies:company_id to specify FK relationship
                const { data: matchData, error } = await supabase
                    .from('matches')
                    .select(`
                        *,
                        companies:company_id (
                            id, name, logo_url
                        ),
                        job_offers (
                            title
                        )
                    `)
                    .eq('id', matchId)
                    .single()

                if (error) throw error

                setMatchDetails({
                    id: matchData.id,
                    company: matchData.companies?.name || 'Company',
                    logo: matchData.companies?.logo_url,
                    title: matchData.job_offers?.title || 'Job Offer',
                    isOnline: false
                })
            } catch (err) {
                console.error("Error fetching match:", err)
            } finally {
                setLoadingDetails(false)
            }
        }

        fetchMatchDetails()
    }, [matchId])

    const handleSend = async (e) => {
        e.preventDefault()
        if (!newMessage.trim()) return

        await sendMessage(newMessage)
        setNewMessage('')
    }

    if (loadingDetails) {
        return (
            <div className="chat-page flex items-center justify-center">
                <Loader className="animate-spin text-primary" size={40} />
            </div>
        )
    }

    if (!matchDetails) {
        return (
            <div className="chat-page flex flex-col items-center justify-center">
                <h3>Match not found</h3>
                <Link to="/student/matches" className="btn btn-primary mt-4">Go Back</Link>
            </div>
        )
    }

    return (
        <div className="chat-page">
            {/* Chat Header */}
            <div className="chat-header glass-card">
                <Link to="/student/matches" className="back-btn">
                    <ArrowLeft size={24} />
                </Link>

                <div className="chat-user">
                    <div className="chat-avatar">
                        {matchDetails.logo ? (
                            <img src={matchDetails.logo} alt={matchDetails.company} />
                        ) : (
                            <span>{matchDetails.company.charAt(0)}</span>
                        )}
                        {matchDetails.isOnline && <span className="online-indicator" />}
                    </div>
                    <div className="chat-user-info">
                        <h3>{matchDetails.company}</h3>
                        <span className="status">
                            {matchDetails.title}
                        </span>
                    </div>
                </div>

                <div className="chat-actions">
                    <button className="action-icon">
                        <Phone size={20} />
                    </button>
                    <button className="action-icon">
                        <Video size={20} />
                    </button>
                    <button className="action-icon">
                        <MoreVertical size={20} />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="chat-messages">
                <div className="messages-container">
                    <div className="chat-date">Today</div>

                    {messages.map(message => (
                        <ChatBubble
                            key={message.id}
                            message={message.content}
                            isOwn={message.sender_id === user?.id}
                            timestamp={new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        />
                    ))}

                    {messages.length === 0 && (
                        <div className="text-center opacity-50 py-10">
                            No messages yet. Start the conversation!
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input */}
            <form className="chat-input-container" onSubmit={handleSend}>
                <button type="button" className="attach-btn">
                    <Paperclip size={20} />
                </button>
                <input
                    type="text"
                    className="chat-input"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button
                    type="submit"
                    className="send-btn"
                    disabled={!newMessage.trim()}
                >
                    <Send size={20} />
                </button>
            </form>
        </div>
    )
}

export default StudentChat
