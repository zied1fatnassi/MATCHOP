import { useState, useRef, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Send, Paperclip, Phone, Video, MoreVertical, Calendar } from 'lucide-react'
import ChatBubble from '../../components/ChatBubble'
import '../student/StudentChat.css'

// Mock data
const mockMatch = {
    id: 1,
    name: 'Alex Johnson',
    photo: null,
    title: 'Computer Science Student',
    isOnline: true,
}

const mockMessages = [
    {
        id: 1,
        text: "Hi Alex! We're very impressed with your profile and would love to discuss the Software Engineer Intern position with you.",
        isOwn: true,
        timestamp: '10:30 AM',
    },
    {
        id: 2,
        text: "Thank you for reaching out! I'm really excited about this opportunity at DataFlow Analytics.",
        isOwn: false,
        timestamp: '10:35 AM',
    },
    {
        id: 3,
        text: "I've been following your work on predictive analytics and would love to contribute to the team!",
        isOwn: false,
        timestamp: '10:36 AM',
    },
    {
        id: 4,
        text: "That's great to hear! Would you be available for a video interview this week? We're flexible with timing.",
        isOwn: true,
        timestamp: '10:40 AM',
    },
    {
        id: 5,
        text: "Yes, absolutely! I'm available Tuesday afternoon or Thursday morning.",
        isOwn: false,
        timestamp: '10:42 AM',
    },
]

function CompanyChat() {
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
                <Link to="/company/matches" className="back-btn">
                    <ArrowLeft size={24} />
                </Link>

                <div className="chat-user">
                    <div className="chat-avatar">
                        {mockMatch.photo ? (
                            <img src={mockMatch.photo} alt={mockMatch.name} />
                        ) : (
                            <span>{mockMatch.name.charAt(0)}</span>
                        )}
                        {mockMatch.isOnline && <span className="online-indicator" />}
                    </div>
                    <div className="chat-user-info">
                        <h3>{mockMatch.name}</h3>
                        <span className="status">
                            {mockMatch.isOnline ? 'Online' : 'Offline'}
                        </span>
                    </div>
                </div>

                <div className="chat-actions">
                    <button className="action-icon">
                        <Calendar size={20} />
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

export default CompanyChat
