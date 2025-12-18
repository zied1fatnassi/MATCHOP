import { useEffect, useState } from 'react'
import Logo from './Logo'
import './LoadingScreen.css'

/**
 * Full-screen loading animation with MatchOp logo
 * Shows on initial app load, then fades out
 */
function LoadingScreen({ onComplete, minDuration = 2000 }) {
    const [isVisible, setIsVisible] = useState(true)
    const [isFading, setIsFading] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsFading(true)

            // Wait for fade animation to complete
            setTimeout(() => {
                setIsVisible(false)
                if (onComplete) onComplete()
            }, 500)
        }, minDuration)

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
