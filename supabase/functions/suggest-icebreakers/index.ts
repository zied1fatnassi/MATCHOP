import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { match_id } = await req.json()

        if (!match_id) {
            return new Response(JSON.stringify({ error: 'Missing match_id' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            })
        }

        const supabaseUrl = Deno.env.get('SUPABASE_URL')!
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
        const supabase = createClient(supabaseUrl, supabaseKey)

        // 1. Fetch Match Details (Student & Job)
        const { data: match, error: matchError } = await supabase
            .from('matches')
            .select(`
                student_id,
                offer_id,
                students (
                    display_name,
                    bio,
                    skills,
                    headline
                ),
                offers (
                    title,
                    description,
                    req_skills,
                    companies (
                        company_name
                    )
                )
            `)
            .eq('id', match_id)
            .single()

        if (matchError || !match) {
            return new Response(JSON.stringify({ error: 'Match not found' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 404,
            })
        }

        const student = match.students
        const offer = match.offers
        const company = offer.companies?.company_name || 'the company'

        // 2. Construct Prompt for Llama 3.2
        const prompt = `
            You are a professional career coach. Generate 3 short, engaging conversation starters (icebreakers) for a student named ${student.display_name} to send to a recruiter at ${company}.
            
            Context:
            - Job: ${offer.title}
            - Student Headline: ${student.headline}
            - Student Skills: ${Array.isArray(student.skills) ? student.skills.join(', ') : student.skills}
            - Job Skills: ${Array.isArray(offer.req_skills) ? offer.req_skills.join(', ') : offer.req_skills}
            
            Rules:
            - Keep them professional but friendly.
            - Mention specific overlapping skills or interest in the role.
            - Less than 150 characters each.
            - Return ONLY a JSON array of strings. No markdown, no explanations.
            
            Example output:
            ["Hi! I saw you're looking for React devs. I recently built a dashboard using Next.js and would love to chat.", "Hello! I'm very interested in the ${offer.title} role. My background in Python seems like a great fit.", "Hi there! I admire ${company}'s work and would love to discuss how my design skills could contribute."]
        `

        // 3. Call OpenRouter
        const openRouterKey = Deno.env.get('OPENROUTER_API_KEY')
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${openRouterKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'meta-llama/llama-3.2-3b-instruct:free',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
            }),
        })

        const aiData = await response.json()
        const content = aiData.choices?.[0]?.message?.content || '[]'

        // Parse JSON from AI response (handle potential markdown wrapping)
        let suggestions = []
        try {
            const cleanContent = content.replace(/```json/g, '').replace(/```/g, '').trim()
            suggestions = JSON.parse(cleanContent)
        } catch (e) {
            console.error('Failed to parse AI response:', content)
            // Fallback suggestions
            suggestions = [
                `Hi! I'm interested in the ${offer.title} position and would love to connect.`,
                `Hello! I saw your opening for ${offer.title} and think my skills would be a great match.`,
                `Hi there! I'd love to learn more about the engineering team at ${company}.`
            ]
        }

        return new Response(JSON.stringify({ suggestions }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
        })
    }
})
