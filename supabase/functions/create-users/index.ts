import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface UserData {
  email: string
  password?: string
  role: string
  name?: string
  photo_url?: string
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: corsHeaders,
    })
  }

  try {
    const authHeader = req.headers.get('Authorization')

    if (authHeader) {
      const token = authHeader.replace('Bearer ', '')
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser(token)
      if (authError || !user) throw new Error('Não autorizado. Token inválido.')
    }

    const body = await req.json()
    const users: UserData[] = Array.isArray(body) ? body : [body]
    const results = []

    for (const user of users) {
      const { data, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password || 'Mudar123!',
        email_confirm: true,
        user_metadata: {
          user_role: user.role,
          full_name: user.name,
          photo_url: user.photo_url,
        },
      })

      if (error) {
        results.push({ email: user.email, success: false, error: error.message })
      } else {
        // Roles insertion is primarily handled by the auth trigger 'handle_new_user' via metadata,
        // but adding here for redundancy in case the trigger only partially works
        await supabase
          .from('user_roles')
          .insert({ user_id: data.user.id, role: user.role })
          .maybeSingle()

        results.push({ email: user.email, success: true, user_id: data.user.id })
      }
    }

    return new Response(JSON.stringify(results.length === 1 ? results[0] : results), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
