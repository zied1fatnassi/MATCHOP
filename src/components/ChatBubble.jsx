import { Calendar } from 'lucide-react'
import { detectDateInMessage, generateCalendarUrl } from '../utils/smartScheduling'
import './ChatBubble.css'

function ChatBubble({ message, isOwn, timestamp }) {
    const scheduling = detectDateInMessage(message)

    return (
        <div className={`chat-bubble-wrapper ${isOwn ? 'own' : 'other'}`}>
            <div className={`chat-bubble ${isOwn ? 'own' : 'other'}`}>
                <p className="message-text">{message}</p>

                {scheduling && (
                    <a
                        href={generateCalendarUrl('MatchOp Interview', message)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="schedule-suggestion"
                    >
                        <Calendar size={14} />
                        <span>Schedule Call</span>
                    </a>
                )}

                <span className="message-time">{timestamp}</span>
            </div>
        </div>
    )
}

export default ChatBubble
