import { supabase } from './supabase'

/**
 * Upload user avatar to Supabase Storage
 * @param {string} userId - User ID
 * @param {File} file - Image file to upload
 * @returns {Promise<string>} Public URL of uploaded avatar
 */
export async function uploadAvatar(userId, file) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}.${fileExt}`

    const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true })

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

    return publicUrl
}

/**
 * Upload CV/Resume to Supabase Storage (private bucket)
 * @param {string} userId - User ID
 * @param {File} file - PDF/DOC file to upload
 * @returns {Promise<string>} Signed URL of uploaded CV (valid for 1 hour)
 */
export async function uploadCV(userId, file) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/cv.${fileExt}`

    const { data, error } = await supabase.storage
        .from('cvs')
        .upload(fileName, file, { upsert: true })

    if (error) throw error

    // Get signed URL (valid for 1 hour)
    const { data: { signedUrl } } = await supabase.storage
        .from('cvs')
        .createSignedUrl(fileName, 3600)

    return signedUrl
}

/**
 * Upload company logo to Supabase Storage
 * @param {string} companyId - Company ID
 * @param {File} file - Image file to upload
 * @returns {Promise<string>} Public URL of uploaded logo
 */
export async function uploadCompanyLogo(companyId, file) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${companyId}.${fileExt}`

    const { data, error } = await supabase.storage
        .from('company-logos')
        .upload(fileName, file, { upsert: true })

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
        .from('company-logos')
        .getPublicUrl(fileName)

    return publicUrl
}

/**
 * Get signed URL for a private file
 * @param {string} bucket - Bucket name
 * @param {string} path - File path
 * @param {number} expiresIn - Expiry time in seconds (default 1 hour)
 * @returns {Promise<string>} Signed URL
 */
export async function getSignedUrl(bucket, path, expiresIn = 3600) {
    const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, expiresIn)

    if (error) throw error
    return data.signedUrl
}
