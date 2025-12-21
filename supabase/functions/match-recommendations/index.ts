
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // 1. Create Supabase Client
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        )

        // 2. Get User Context (Auth)
        const {
            data: { user },
        } = await supabaseClient.auth.getUser()

        if (!user) {
            throw new Error('Unauthorized')
        }

        // 3. Parse Request Body
        const { limit = 20, offset = 0, distance = 100 } = await req.json().catch(() => ({}))

        // 4. Call Database RPC (The Heavy Lifting)
        // We delegate the complex logic to Postgres (PostGIS + Text Search)
        const { data: offers, error } = await supabaseClient.rpc('recommend_matches_rpc', {
            student_uuid: user.id,
            limit_count: limit,
            offset_count: offset,
            max_distance_km: distance
        })

        if (error) throw error

        // 5. Return JSON Response
        return new Response(JSON.stringify({
            data: offers,
            meta: {
                count: offers?.length,
                params: { limit, offset, distance }
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
