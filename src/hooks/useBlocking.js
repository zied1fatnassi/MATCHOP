import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

/**
 * Hook for blocking/unblocking users
 * Blocked users won't appear in swipe deck, matches, or chat
 */
export function useBlocking() {
    const [blockedUsers, setBlockedUsers] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const { user } = useAuth()

    useEffect(() => {
        if (user) {
            fetchBlockedUsers()
        }
    }, [user])

    const fetchBlockedUsers = async () => {
        if (!user) {
            setIsLoading(false)
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            const { data, error: fetchError } = await supabase
                .from('blocked_users')
                .select('blocked_id')
                .eq('blocker_id', user.id)

            if (fetchError) throw fetchError

            setBlockedUsers((data || []).map(b => b.blocked_id))
        } catch (err) {
            console.error('Failed to fetch blocked users:', err)
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    const blockUser = async (blockedId) => {
        if (!user) {
            throw new Error('Must be logged in to block users')
        }

        if (blockedId === user.id) {
            throw new Error('Cannot block yourself')
        }

        if (blockedUsers.includes(blockedId)) {
            return { success: true, message: 'User already blocked' }
        }

        setError(null)

        try {
            const { error: insertError } = await supabase
                .from('blocked_users')
                .insert({
                    blocker_id: user.id,
                    blocked_id: blockedId
                })

            if (insertError) throw insertError

            // Update local state
            setBlockedUsers([...blockedUsers, blockedId])

            return { success: true }
        } catch (err) {
            console.error('Block failed:', err)
            setError(err.message)
            return { success: false, error: err.message }
        }
    }

    const unblockUser = async (blockedId) => {
        if (!user) {
            throw new Error('Must be logged in')
        }

        setError(null)

        try {
            const { error: deleteError } = await supabase
                .from('blocked_users')
                .delete()
                .eq('blocker_id', user.id)
                .eq('blocked_id', blockedId)

            if (deleteError) throw deleteError

            // Update local state
            setBlockedUsers(blockedUsers.filter(id => id !== blockedId))

            return { success: true }
        } catch (err) {
            console.error('Unblock failed:', err)
            setError(err.message)
            return { success: false, error: err.message }
        }
    }

    const isBlocked = (userId) => {
        return blockedUsers.includes(userId)
    }

    const getBlockedUsersList = async () => {
        if (!user) return []

        try {
            const { data, error: fetchError } = await supabase
                .from('blocked_users')
                .select(`
                    *,
                    blocked:profiles!blocked_id(id, name, avatar_url, type)
                `)
                .eq('blocker_id', user.id)
                .order('created_at', { ascending: false })

            if (fetchError) throw fetchError
            return data || []
        } catch (err) {
            console.error('Failed to fetch blocked users list:', err)
            return []
        }
    }

    return {
        blockedUsers,
        blockUser,
        unblockUser,
        isBlocked,
        getBlockedUsersList,
        isLoading,
        error,
        refresh: fetchBlockedUsers
    }
}
