/**
 * Validation utilities for authentication
 * Provides strong password validation and email validation
 */

/**
 * Password requirements:
 * - Minimum 8 characters
 * - At least 1 uppercase letter
 * - At least 1 lowercase letter
 * - At least 1 number
 * - At least 1 special character (!@#$%^&*(),.?":{}|<>)
 */
export const PASSWORD_REQUIREMENTS = {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecial: true,
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {{ valid: boolean, errors: string[], strength: number }}
 */
export function validatePassword(password) {
    const errors = []
    let strength = 0

    if (!password) {
        return { valid: false, errors: ['Password is required'], strength: 0 }
    }

    // Check minimum length
    if (password.length < PASSWORD_REQUIREMENTS.minLength) {
        errors.push(`Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters`)
    } else {
        strength += 20
    }

    // Check for uppercase
    if (PASSWORD_REQUIREMENTS.requireUppercase && !/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter')
    } else {
        strength += 20
    }

    // Check for lowercase
    if (PASSWORD_REQUIREMENTS.requireLowercase && !/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter')
    } else {
        strength += 20
    }

    // Check for number
    if (PASSWORD_REQUIREMENTS.requireNumber && !/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number')
    } else {
        strength += 20
    }

    // Check for special character
    if (PASSWORD_REQUIREMENTS.requireSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('Password must contain at least one special character (!@#$%^&*)')
    } else {
        strength += 20
    }

    return {
        valid: errors.length === 0,
        errors,
        strength: Math.min(strength, 100),
    }
}

/**
 * Get password strength label and color
 * @param {number} strength - Password strength (0-100)
 * @returns {{ label: string, color: string }}
 */
export function getPasswordStrengthInfo(strength) {
    if (strength < 40) {
        return { label: 'Weak', color: '#ef4444' }
    } else if (strength < 60) {
        return { label: 'Fair', color: '#f97316' }
    } else if (strength < 80) {
        return { label: 'Good', color: '#eab308' }
    } else {
        return { label: 'Strong', color: '#10b981' }
    }
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {{ valid: boolean, error: string | null }}
 */
export function validateEmail(email) {
    if (!email) {
        return { valid: false, error: 'Email is required' }
    }

    // Basic email regex - more permissive than strict RFC 5322
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
        return { valid: false, error: 'Please enter a valid email address' }
    }

    return { valid: true, error: null }
}

/**
 * Validate name (non-empty, reasonable length)
 * @param {string} name - Name to validate
 * @returns {{ valid: boolean, error: string | null }}
 */
export function validateName(name) {
    if (!name || name.trim().length === 0) {
        return { valid: false, error: 'Name is required' }
    }

    if (name.trim().length < 2) {
        return { valid: false, error: 'Name must be at least 2 characters' }
    }

    if (name.trim().length > 100) {
        return { valid: false, error: 'Name must be less than 100 characters' }
    }

    return { valid: true, error: null }
}

/**
 * Map Supabase auth error codes to user-friendly messages
 * @param {Error} error - Supabase error object
 * @returns {string} User-friendly error message
 */
export function getAuthErrorMessage(error) {
    const errorCode = error?.code || error?.message || ''

    const errorMessages = {
        'invalid_credentials': 'Invalid email or password. Please try again.',
        'user_not_found': 'No account found with this email address.',
        'email_not_confirmed': 'Please verify your email before logging in.',
        'invalid_login_credentials': 'Invalid email or password. Please try again.',
        'email_address_invalid': 'Please enter a valid email address.',
        'weak_password': 'Password is too weak. Please choose a stronger password.',
        'user_already_exists': 'An account with this email already exists.',
        'over_request_rate_limit': 'Too many attempts. Please wait a moment and try again.',
        'signup_disabled': 'Sign up is currently disabled. Please contact support.',
    }

    // Check for matching error code
    for (const [code, message] of Object.entries(errorMessages)) {
        if (errorCode.toLowerCase().includes(code.toLowerCase())) {
            return message
        }
    }

    // Default message
    return error?.message || 'An error occurred. Please try again.'
}

export default {
    validatePassword,
    validateEmail,
    validateName,
    getPasswordStrengthInfo,
    getAuthErrorMessage,
    PASSWORD_REQUIREMENTS,
}
