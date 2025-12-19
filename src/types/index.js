/**
 * TypeScript type definitions for MatchOp entities
 * These can be used with JSDoc for type hints in JavaScript files
 */

/**
 * @typedef {'student' | 'company'} UserRole
 */

/**
 * @typedef {Object} User
 * @property {string} id - Unique user identifier
 * @property {string} email - User email address
 * @property {UserRole} role - User role (student or company)
 * @property {Date} createdAt - Account creation timestamp
 */

/**
 * @typedef {Object} CandidateProfile
 * @property {string} userId - Reference to User
 * @property {string} name - Full name
 * @property {string} bio - Short biography
 * @property {string} university - University name
 * @property {string} major - Field of study
 * @property {number} graduationYear - Expected graduation year
 * @property {Skill[]} skills - List of skills
 * @property {string} location - Current location
 * @property {string} [avatar] - Profile photo URL
 * @property {string} [linkedin] - LinkedIn profile URL
 * @property {string} [github] - GitHub profile URL
 * @property {'entry' | 'junior' | 'mid' | 'senior'} [experience] - Experience level
 */

/**
 * @typedef {Object} CompanyProfile
 * @property {string} userId - Reference to User
 * @property {string} name - Company name
 * @property {string} description - Company description
 * @property {string} industry - Industry sector
 * @property {string} size - Company size range
 * @property {string} location - Headquarters location
 * @property {string} [website] - Company website URL
 * @property {string} [logo] - Company logo URL
 * @property {string[]} benefits - List of employee benefits
 * @property {string} [culture] - Company culture description
 * @property {string} [linkedin] - LinkedIn company page URL
 */

/**
 * @typedef {'Internship' | 'Full-time' | 'Part-time' | 'Contract'} JobType
 */

/**
 * @typedef {'onsite' | 'remote' | 'hybrid'} LocationType
 */

/**
 * @typedef {Object} JobOffer
 * @property {string} id - Unique offer identifier
 * @property {string} companyId - Reference to Company
 * @property {string} company - Company name (denormalized)
 * @property {string} [companyLogo] - Company logo URL
 * @property {string} title - Job title
 * @property {string} description - Job description
 * @property {string} [requirements] - Job requirements
 * @property {JobType} type - Employment type
 * @property {string} location - Job location
 * @property {LocationType} locationType - Remote/onsite/hybrid
 * @property {string} salary - Salary or compensation
 * @property {string} duration - Duration (for internships)
 * @property {string} department - Department name
 * @property {Skill[]} skills - Required skills
 * @property {Date} createdAt - Posting date
 * @property {boolean} [hasMatched] - Whether user matched with this offer
 */

/**
 * @typedef {'left' | 'right' | 'super'} SwipeDirection
 */

/**
 * @typedef {Object} Swipe
 * @property {string} id - Unique swipe identifier
 * @property {string} userId - User who swiped
 * @property {string} targetId - Target of swipe (offer or candidate)
 * @property {SwipeDirection} direction - Swipe direction
 * @property {Date} createdAt - Swipe timestamp
 */

/**
 * @typedef {Object} Match
 * @property {string} id - Unique match identifier
 * @property {string} studentId - Student user ID
 * @property {string} companyId - Company user ID
 * @property {string} jobOfferId - Related job offer ID
 * @property {Date} createdAt - Match timestamp
 * @property {string} [lastMessage] - Last message preview
 * @property {boolean} [unread] - Whether there are unread messages
 */

/**
 * @typedef {Object} Message
 * @property {string} id - Unique message identifier
 * @property {string} matchId - Reference to Match
 * @property {string} senderId - Sender user ID
 * @property {string} content - Message text content
 * @property {Date} createdAt - Send timestamp
 * @property {boolean} read - Whether message has been read
 */

/**
 * @typedef {Object} Skill
 * @property {string} id - Unique skill identifier
 * @property {string} name - Skill name
 * @property {string} [category] - Skill category
 */

// Export empty object to make this a module
export { };
