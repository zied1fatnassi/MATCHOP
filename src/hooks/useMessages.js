import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

/**
 * Hook for real-time chat messages
 * Subscribes to new messages and provides send functionality
 */
export function useMessages(matchId) {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { user } = useAuth()

    const fetchMessages = useCallback(async () => {
        if (!matchId) return

        setLoading(true)
        setError(null)

        try {
            const { data, error: fetchError } = await supabase
                .from('messages')
                .select(`
                    *,
                    sender:sender_id (
                        name, avatar_url
                    )
                `)
                .eq('match_id', matchId)
                .order('created_at', { ascending: true })

            if (fetchError) {
                console.log('Messages table may not exist yet')
                setMessages([])
                return
            }

            setMessages(data || [])
        } catch (err) {
            setError(err.message)
            setMessages([])
        } finally {
            setLoading(false)
        }
    }, [matchId])

    useEffect(() => {
        if (!matchId) return

        // Fetch existing messages
        fetchMessages()

        // Subscribe to new messages (real-time)
        const channel = supabase
            .channel(`messages:${matchId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `match_id=eq.${matchId}`
                },
                (payload) => {
                    setMessages(prev => [...prev, payload.new])
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [matchId, fetchMessages])

    const sendMessage = async (content) => {
        if (!user?.id || !matchId || !content.trim()) {
            return { error: 'Invalid message' }
        }

        try {
            const newMessage = {
                match_id: matchId,
                sender_id: user.id,
                content: content.trim()
            }

            const { data, error: sendError } = await supabase
                .from('messages')
                .insert(newMessage)
                .select()
                .single()

            if (sendError) {
                // For demo, add message locally
                const localMessage = {
                    id: Date.now(),
                    ...newMessage,
                    created_at: new Date().toISOString(),
                    sender: { name: 'You' }
                }
                setMessages(prev => [...prev, localMessage])
                return { error: null, data: localMessage }
            }

            return { error: null, data }
        } catch (err) {
            return { error: err.message }
        }
    }

    const markAsRead = async () => {
        if (!matchId || !user?.id) return

        await supabase
            .from('messages')
            .update({ is_read: true })
            .eq('match_id', matchId)
            .neq('sender_id', user.id)
    }

    return {
        messages,
        loading,
        error,
        sendMessage,
        markAsRead,
        refresh: fetchMessages
    }
}

export default useMessages
