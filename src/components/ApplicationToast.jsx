import { useEffect, useState } from 'react'
import { Send, CheckCircle } from 'lucide-react'
import './ApplicationToast.css'

/**
 * Toast notification that appears when student applies to a company
 */
function ApplicationToast({ companyName, onClose }) {
    const [isVisible, setIsVisible] = useState(false)
    const [isExiting, setIsExiting] = useState(false)

    useEffect(() => {
        // Animate in
        setTimeout(() => setIsVisible(true), 50)

        // Start exit animation after 2.5s
        const exitTimer = setTimeout(() => {
            setIsExiting(true)
        }, 2500)

        // Call onClose after exit animation
        const closeTimer = setTimeout(() => {
            onClose?.()
        }, 3000)

        return () => {
            clearTimeout(exitTimer)
            clearTimeout(closeTimer)
        }
    }, [onClose])

    return (
        <div className={`application-toast ${isVisible ? 'visible' : ''} ${isExiting ? 'exiting' : ''}`}>
            <div className="toast-icon">
                <Send size={20} />
            </div>
            <div className="toast-content">
                <span className="toast-title">Application Sent! 📤</span>
                <span className="toast-message">
                    Your profile was sent to <strong>{companyName}</strong>
                </span>
            </div>
            <div className="toast-check">
                <CheckCircle size={20} />
            </div>
        </div>
    )
}

export default ApplicationToast
