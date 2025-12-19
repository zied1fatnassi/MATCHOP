import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

/**
 * Hook for uploading and managing profile images in Supabase Storage
 * @param {string} userId - The user's ID
 * @param {string} bucket - The storage bucket name (default: 'avatars')
 */
export function useImageUpload(userId, bucket = 'avatars') {
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState(null)
    const [progress, setProgress] = useState(0)

    /**
     * Upload an image to Supabase Storage
     * @param {File} file - The file to upload
     * @returns {Promise<{url: string | null, error: Error | null}>}
     */
    const uploadImage = useCallback(async (file) => {
        if (!userId) {
            return { url: null, error: new Error('User not authenticated') }
        }

        if (!file) {
            return { url: null, error: new Error('No file provided') }
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
        if (!validTypes.includes(file.type)) {
            const err = new Error('Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.')
            setError(err)
            return { url: null, error: err }
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024 // 5MB
        if (file.size > maxSize) {
            const err = new Error('File too large. Maximum size is 5MB.')
            setError(err)
            return { url: null, error: err }
        }

        setUploading(true)
        setError(null)
        setProgress(0)

        try {
            // Generate unique filename
            const fileExt = file.name.split('.').pop()
            const fileName = `${userId}/avatar.${fileExt}`

            // Delete existing avatar if any
            await supabase.storage.from(bucket).remove([`${userId}/avatar.png`, `${userId}/avatar.jpg`, `${userId}/avatar.jpeg`, `${userId}/avatar.webp`, `${userId}/avatar.gif`])

            // Upload new avatar
            const { data, error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: true
                })

            if (uploadError) {
                setError(uploadError)
                return { url: null, error: uploadError }
            }

            // Get public URL
            const { data: urlData } = supabase.storage
                .from(bucket)
                .getPublicUrl(fileName)

            const publicUrl = urlData?.publicUrl

            // Update profile with avatar URL
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', userId)

            if (updateError) {
                console.error('Failed to update profile with avatar URL:', updateError)
            }

            setProgress(100)
            return { url: publicUrl, error: null }
        } catch (err) {
            setError(err)
            return { url: null, error: err }
        } finally {
            setUploading(false)
        }
    }, [userId, bucket])

    /**
     * Delete the current avatar
     * @returns {Promise<{error: Error | null}>}
     */
    const deleteImage = useCallback(async () => {
        if (!userId) {
            return { error: new Error('User not authenticated') }
        }

        setUploading(true)
        setError(null)

        try {
            // Try to delete all possible avatar formats
            await supabase.storage.from(bucket).remove([
                `${userId}/avatar.png`,
                `${userId}/avatar.jpg`,
                `${userId}/avatar.jpeg`,
                `${userId}/avatar.webp`,
                `${userId}/avatar.gif`
            ])

            // Update profile to remove avatar URL
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: null })
                .eq('id', userId)

            if (updateError) {
                setError(updateError)
                return { error: updateError }
            }

            return { error: null }
        } catch (err) {
            setError(err)
            return { error: err }
        } finally {
            setUploading(false)
        }
    }, [userId, bucket])

    /**
     * Get the current avatar URL from the profile
     * @returns {Promise<string | null>}
     */
    const getAvatarUrl = useCallback(async () => {
        if (!userId) return null

        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('avatar_url')
                .eq('id', userId)
                .single()

            if (error || !data) return null
            return data.avatar_url
        } catch {
            return null
        }
    }, [userId])

    return {
        uploadImage,
        deleteImage,
        getAvatarUrl,
        uploading,
        error,
        progress,
        clearError: () => setError(null)
    }
}

export default useImageUpload
