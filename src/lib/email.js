import emailjs from '@emailjs/browser'

// Initialize EmailJS with your Public Key
// Recommendation: Add these to your .env file
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_id_placeholder'
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_id_placeholder'
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'public_key_placeholder'

/**
 * Send an email notification when a match happens
 * @param {string} toEmail - Recipient email
 * @param {string} toName - Recipient name
 * @param {string} matchName - Name of the matched company/person
 * @param {string} matchType - 'Company' or 'Student'
 */
export const sendMatchEmail = async (toEmail, toName, matchName, matchType) => {
    try {
        if (!import.meta.env.VITE_EMAILJS_PUBLIC_KEY) {
            console.warn('EmailJS Public Key not found. Email notification skipped.')
            return
        }

        const templateParams = {
            to_email: toEmail,
            to_name: toName,
            match_name: matchName,
            match_type: matchType,
            message: `Congratulations! You have a new match with ${matchName}. Log in to MatchOp to start chatting!`
        }

        const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
        console.log('Email sent successfully:', response.status, response.text)
        return response
    } catch (error) {
        console.error('Failed to send email:', error)
        // Don't throw error to avoid breaking the UI flow
    }
}
