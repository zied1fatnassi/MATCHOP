import { useState, useEffect } from 'react'
import './SkeletonLoader.css'

/**
 * Skeleton loader components for different content types
 */

// Card skeleton for job offers, candidates, matches
export function SkeletonCard() {
    return (
        <div className="skeleton-card">
            <div className="skeleton skeleton-avatar"></div>
            <div className="skeleton skeleton-title"></div>
            <div className="skeleton skeleton-text"></div>
            <div className="skeleton skeleton-text short"></div>
            <div className="skeleton-tags">
                <div className="skeleton skeleton-tag"></div>
                <div className="skeleton skeleton-tag"></div>
                <div className="skeleton skeleton-tag"></div>
            </div>
            <div className="skeleton-actions">
                <div className="skeleton skeleton-button"></div>
                <div className="skeleton skeleton-button"></div>
            </div>
        </div>
    )
}

// List item skeleton for chat list, match list
export function SkeletonListItem() {
    return (
        <div className="skeleton-list-item">
            <div className="skeleton skeleton-avatar small"></div>
            <div className="skeleton-list-content">
                <div className="skeleton skeleton-title small"></div>
                <div className="skeleton skeleton-text short"></div>
            </div>
        </div>
    )
}

// Chat message skeleton
export function SkeletonMessage({ align = 'left' }) {
    return (
        <div className={`skeleton-message ${align}`}>
            <div className="skeleton skeleton-bubble"></div>
        </div>
    )
}

// Grid of skeleton cards
export function SkeletonGrid({ count = 6, type = 'card' }) {
    const Component = type === 'card' ? SkeletonCard : SkeletonListItem

    return (
        <div className="skeleton-grid">
            {Array.from({ length: count }).map((_, i) => (
                <Component key={i} />
            ))}
        </div>
    )
}

// Full page skeleton
export function SkeletonPage({ title = true, count = 6 }) {
    return (
        <div className="skeleton-page">
            {title && (
                <div className="skeleton-header">
                    <div className="skeleton skeleton-title large"></div>
                    <div className="skeleton skeleton-text"></div>
                </div>
            )}
            <SkeletonGrid count={count} />
        </div>
    )
}

export default {
    Card: SkeletonCard,
    ListItem: SkeletonListItem,
    Message: SkeletonMessage,
    Grid: SkeletonGrid,
    Page: SkeletonPage
}
