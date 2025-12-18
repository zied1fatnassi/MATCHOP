import './ChatBubble.css'

function ChatBubble({ message, isOwn, timestamp }) {
    return (
        <div className={`chat-bubble-wrapper ${isOwn ? 'own' : 'other'}`}>
            <div className={`chat-bubble ${isOwn ? 'own' : 'other'}`}>
                <p className="message-text">{message}</p>
                <span className="message-time">{timestamp}</span>
            </div>
        </div>
    )
}

export default ChatBubble
