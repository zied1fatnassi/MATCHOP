import { useState, useRef, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Send, Paperclip, Phone, Video, MoreVertical } from 'lucide-react'
import ChatBubble from '../../components/ChatBubble'
import './StudentChat.css'

// Mock data
const mockMatch = {
    id: 1,
    company: 'DataFlow Analytics',
    logo: null,
    title: 'Data Science Intern',
    isOnline: true,
}

const mockMessages = [
    {
        id: 1,
        text: "Hi! We're excited about your application for the Data Science Intern position!",
        isOwn: false,
        timestamp: '10:30 AM',
    },
    {
        id: 2,
        text: "Your background in machine learning and Python really stood out to us.",
        isOwn: false,
        timestamp: '10:31 AM',
    },
    {
        id: 3,
        text: "Thank you so much! I'm really excited about this opportunity.",
        isOwn: true,
        timestamp: '10:35 AM',
    },
    {
        id: 4,
        text: "I've been following DataFlow's work on predictive analytics and would love to contribute!",
        isOwn: true,
        timestamp: '10:36 AM',
    },
    {
        id: 5,
        text: "That's great to hear! Would you be available for a video interview this week?",
        isOwn: false,
        timestamp: '10:40 AM',
    },
]

function StudentChat() {
    const { matchId } = useParams()
    const [messages, setMessages] = useState(mockMessages)
    const [newMessage, setNewMessage] = useState('')
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSend = (e) => {
        e.preventDefault()
        if (!newMessage.trim()) return

        const message = {
            id: messages.length + 1,
            text: newMessage,
            isOwn: true,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }

        setMessages([...messages, message])
        setNewMessage('')
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
                        {mockMatch.logo ? (
                            <img src={mockMatch.logo} alt={mockMatch.company} />
                        ) : (
                            <span>{mockMatch.company.charAt(0)}</span>
                        )}
                        {mockMatch.isOnline && <span className="online-indicator" />}
                    </div>
                    <div className="chat-user-info">
                        <h3>{mockMatch.company}</h3>
                        <span className="status">
                            {mockMatch.isOnline ? 'Online' : 'Offline'}
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
                            message={message.text}
                            isOwn={message.isOwn}
                            timestamp={message.timestamp}
                        />
                    ))}

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
