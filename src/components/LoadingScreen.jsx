import { useEffect, useState } from 'react'
import Logo from './Logo'
import './LoadingScreen.css'

/**
 * Full-screen loading animation with MatchOp logo
 * Shows on initial app load, then fades out
 * Skips on repeat visits within the same session for faster UX
 */
function LoadingScreen({ onComplete, minDuration = 800 }) {
    const [isVisible, setIsVisible] = useState(true)
    const [isFading, setIsFading] = useState(false)

    useEffect(() => {
        // Skip loading screen on repeat visits within session
        const hasLoaded = sessionStorage.getItem('matchop-loaded')
        const duration = hasLoaded ? 300 : minDuration

        const timer = setTimeout(() => {
            setIsFading(true)

            // Wait for fade animation to complete
            setTimeout(() => {
                setIsVisible(false)
                sessionStorage.setItem('matchop-loaded', 'true')
                if (onComplete) onComplete()
            }, 400)
        }, duration)

        return () => clearTimeout(timer)
    }, [minDuration, onComplete])

    if (!isVisible) return null

    return (
        <div className={`loading-screen ${isFading ? 'fading' : ''}`}>
            <div className="loading-content">
                <Logo size="large" showText={true} animated={true} />
                <div className="loading-bar">
                    <div className="loading-progress"></div>
                </div>
            </div>
        </div>
    )
}

export default LoadingScreen

