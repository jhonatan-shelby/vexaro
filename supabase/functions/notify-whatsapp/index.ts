import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createSupabaseClient } from '../_shared/supabaseClient.ts'

const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID') ?? ''
const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN') ?? ''
const TWILIO_PHONE_NUMBER = Deno.env.get('TWILIO_PHONE_NUMBER') ?? ''

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  try {
    const { user_id, message } = await req.json()

    if (!user_id || !message) {
      return new Response(JSON.stringify({ error: 'Missing user_id or message' }), { status: 400 })
    }

    const supabase = createSupabaseClient()

    // 1. Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('whatsapp_number, whatsapp_enabled')
      .eq('id', user_id)
      .single()

    if (profileError || !profile) {
      console.error('Error fetching profile:', profileError)
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 })
    }

    if (!profile.whatsapp_enabled || !profile.whatsapp_number) {
      return new Response(JSON.stringify({ message: 'WhatsApp notifications disabled for user' }), { status: 200 })
    }

    // 2. Send WhatsApp message using Twilio (or Meta)
    if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
      const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`
      
      const formData = new URLSearchParams()
      formData.append('To', `whatsapp:${profile.whatsapp_number}`)
      formData.append('From', `whatsapp:${TWILIO_PHONE_NUMBER}`)
      formData.append('Body', message)

      const twilioRes = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData.toString()
      })

      if (!twilioRes.ok) {
        const errorText = await twilioRes.text()
        console.error('Twilio Error:', errorText)
        return new Response(JSON.stringify({ error: 'Failed to send WhatsApp message' }), { status: 500 })
      }
    } else {
      console.log(`[SIMULATED WHATSAPP to ${profile.whatsapp_number}]: ${message}`)
    }

    // 3. Log notification in database
    await supabase.from('notifications').insert({
      user_id,
      type: 'whatsapp',
      title: 'WhatsApp Alert',
      body: message
    })

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    console.error('Unhandled error:', error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
})
