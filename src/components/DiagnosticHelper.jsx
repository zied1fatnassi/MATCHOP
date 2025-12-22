import { useEffect } from 'react'

/**
 * Diagnostic Component to Help Debug Loading Issues
 * 
 * Add this to your App.jsx TEMPORARILY to see detailed logs
 * Remove after debugging
 */
export function DiagnosticHelper() {
    useEffect(() => {
        console.log('=== MATCHOP DIAGNOSTIC START ===')

        // 1. Check environment variables
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

        console.log('[Diagnostic] Environment Variables:')
        console.log('  - VITE_SUPABASE_URL:', supabaseUrl ? '✅ SET' : '❌ MISSING')
        console.log('  - VITE_SUPABASE_ANON_KEY:', supabaseKey ? '✅ SET' : '❌ MISSING')
        if (supabaseUrl) {
            console.log('  - URL Preview:', supabaseUrl.substring(0, 40) + '...')
        }
        console.log('  - Mode:', import.meta.env.MODE)

        if (!supabaseUrl || !supabaseKey) {
            console.error('')
            console.error('❌❌❌ CRITICAL ERROR ❌❌❌')
            console.error('Missing Supabase environment variables!')
            console.error('The app CANNOT connect to the database.')
            console.error('')
            console.error('FIX: Go to Vercel Dashboard → Settings → Environment Variables')
            console.error('Add: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
            console.error('Then redeploy.')
            console.error('')
        }

        // 2. Check browser capabilities
        console.log('[Diagnostic] Browser Info:', {
            localStorage: typeof window.localStorage !== 'undefined',
            fetch: typeof fetch !== 'undefined',
            userAgent: navigator.userAgent.substring(0, 50) + '...'
        })

        // 3. Check network
        fetch('https://www.google.com/favicon.ico', { mode: 'no-cors' })
            .then(() => console.log('[Diagnostic] ✅ Network connection OK'))
            .catch(err => console.error('[Diagnostic] ❌ Network issue:', err))

        // 4. Monitor auth state changes
        let authCheckCount = 0
        const authInterval = setInterval(() => {
            authCheckCount++
            const authToken = localStorage.getItem('matchop-auth-token')
            console.log(`[Diagnostic] Auth check #${authCheckCount}:`, {
                hasToken: !!authToken,
                tokenLength: authToken?.length
            })

            if (authCheckCount >= 10) {
                clearInterval(authInterval)
                console.log('[Diagnostic] Auth monitoring stopped after 10 checks')
            }
        }, 3000)

        console.log('=== MATCHOP DIAGNOSTIC END ===')
        console.log('Check logs above for issues marked with ❌')

        return () => clearInterval(authInterval)
    }, [])

    return null
}

export default DiagnosticHelper
