import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createSupabaseClient } from '../_shared/supabaseClient.ts'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const EDGE_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/notify-whatsapp`
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

serve(async () => {
  try {
    const supabase = createSupabaseClient()

    // Find events starting in exactly ~30 mins. 
    // This runs every 5 minutes, so we look for events between 30 and 35 mins from now.
    const now = new Date()
    const thirtyMinsFromNow = new Date(now.getTime() + 30 * 60000)
    const thirtyFiveMinsFromNow = new Date(now.getTime() + 35 * 60000)

    const { data: events, error: eventsError } = await supabase
      .from('calendar_events')
      .select(`
        id, 
        user_id, 
        title, 
        start_at,
        profiles!inner (whatsapp_enabled)
      `)
      .gte('start_at', thirtyMinsFromNow.toISOString())
      .lt('start_at', thirtyFiveMinsFromNow.toISOString())
      .eq('profiles.whatsapp_enabled', true)

    if (eventsError) throw eventsError

    console.log(`Found ${events?.length || 0} events starting soon.`)

    for (const event of (events || [])) {
      const message = `Recordatorio: "${event.title}" comienza en 30 minutos.`
      
      // Call our generic notify-whatsapp function
      // In a real environment, we invoke the edge function.
      await fetch(EDGE_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
        },
        body: JSON.stringify({
          user_id: event.user_id,
          message
        })
      })
      
      // Also insert in-app notification
      await supabase.from('notifications').insert({
        user_id: event.user_id,
        type: 'calendar_alert',
        title: 'Próximo Evento',
        body: message
      })
    }

    return new Response(JSON.stringify({ success: true, processed: events?.length }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error: any) {
    console.error('Error in cron-calendar-alerts:', error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
})
