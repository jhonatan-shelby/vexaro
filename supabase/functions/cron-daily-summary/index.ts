import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createSupabaseClient } from '../_shared/supabaseClient.ts'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const EDGE_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/notify-whatsapp`
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

serve(async () => {
  try {
    const supabase = createSupabaseClient()

    // This runs hourly. We need to find users where their local time 
    // matches their daily_summary_time.
    // For simplicity in this demo, we select all users who have whatsapp enabled
    // and whose daily_summary_time hour matches the current hour in their timezone.
    
    // In PostgreSQL we could do:
    // SELECT id FROM profiles WHERE EXTRACT(HOUR FROM timezone(timezone, now())) = EXTRACT(HOUR FROM daily_summary_time);
    
    // Let's use an RPC or do a simple fetch if user count is low. 
    // For scalability, an RPC is better.
    // Here we'll just fetch all enabled users and filter in JS (ok for small scale).
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('id, timezone, daily_summary_time')
      .eq('whatsapp_enabled', true)

    if (usersError) throw usersError

    let processed = 0

    for (const user of (users || [])) {
      try {
        // Evaluate if current time in user's timezone matches their preference
        const userTime = new Date().toLocaleString('en-US', { timeZone: user.timezone, hour12: false, hour: '2-digit' })
        const summaryHour = user.daily_summary_time.split(':')[0]

        if (userTime === summaryHour) {
          // It's time! Let's build a summary.
          // Fetch tasks completed today.
          const startOfDay = new Date().toLocaleString('en-US', { timeZone: user.timezone }) // simplistic approach
          // A robust approach needs proper timezone boundaries.
          
          const message = `🌟 Resumen Diario Vexaro 🌟\n\nHas completado tu jornada. Revisa la app para ver tus estadísticas de hoy y preparar tu plan de mañana.`
          
          await fetch(EDGE_FUNCTION_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
            },
            body: JSON.stringify({
              user_id: user.id,
              message
            })
          })

          await supabase.from('notifications').insert({
            user_id: user.id,
            type: 'system',
            title: 'Resumen Diario',
            body: message
          })

          processed++
        }
      } catch (e) {
        console.error(`Error processing user ${user.id}:`, e)
      }
    }

    return new Response(JSON.stringify({ success: true, processed }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error: any) {
    console.error('Error in cron-daily-summary:', error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
})
