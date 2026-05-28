import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

export const createSupabaseClient = (req?: Request) => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
  const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
  // For crons/admin tasks we might need the SERVICE_ROLE_KEY
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

  // If request is provided, we can use the user's auth header
  const authHeader = req?.headers.get('Authorization')

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: authHeader ? { Authorization: authHeader } : undefined,
    }
  })
}
