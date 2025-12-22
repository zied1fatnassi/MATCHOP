export function detectDateInMessage(text) {
    if (!text) return null

    // Simple regex for common date/time patterns (English)
    // Matches: "tomorrow at 2pm", "on Friday", "next week", "Dec 25th"
    const timeRegex = /\b((mon|tue|wed|thu|fri|sat|sun)(day)?|tomorrow|next week|today)\b/i
    const specificDateRegex = /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]* \d{1,2}(st|nd|rd|th)?\b/i
    const clockTimeRegex = /\b\d{1,2}(:\d{2})?\s?(am|pm)\b/i

    const hasTime = timeRegex.test(text) || specificDateRegex.test(text)

    if (hasTime || (text.toLowerCase().includes('schedule') && clockTimeRegex.test(text))) {
        return {
            hasDate: true,
            text: text
        }
    }

    return null
}

export function generateCalendarUrl(title, details) {
    // Generate a Google Calendar link
    const baseUrl = "https://calendar.google.com/calendar/render?action=TEMPLATE"
    const start = new Date()
    start.setDate(start.getDate() + 1) // Default to tomorrow
    start.setHours(10, 0, 0, 0)

    const end = new Date(start)
    end.setHours(11, 0, 0, 0)

    const formatDate = (date) => date.toISOString().replace(/-|:|\.\d\d\d/g, '').substring(0, 15) + 'Z'

    const params = new URLSearchParams({
        text: `Interview: ${title}`,
        details: details || 'Discussing job opportunity.',
        dates: `${formatDate(start)}/${formatDate(end)}`
    })

    return `${baseUrl}&${params.toString()}`
}
