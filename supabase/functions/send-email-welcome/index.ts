import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.6'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, x-supabase-client-platform, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    const payload = await req.json()
    const record = payload.record

    if (!record || !record.id) {
      return new Response(JSON.stringify({ error: 'Missing record or id in webhook payload' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      })
    }

    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.admin.getUserById(record.id)

    if (userError || !user || !user.email) {
      console.error('Error fetching user:', userError)
      return new Response(JSON.stringify({ error: 'User or email not found' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      })
    }

    const appUrl = Deno.env.get('APP_URL') ?? 'http://localhost:5173'

    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: user.email,
      options: {
        redirectTo: `${appUrl}/aguardando-aprovacao`,
      },
    })

    if (linkError) {
      console.error('Error generating link:', linkError)
      return new Response(JSON.stringify({ error: linkError.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      })
    }

    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (resendApiKey) {
      const htmlContent = `
        <h2 style="color: blue;">Bem-vindo ao SistCIR!</h2>
        <p>Olá, <strong>${record.name || 'Usuário'}</strong>.</p>
        <p>Seu cadastro no SistCIR foi recebido com sucesso. Assim que seu acesso for liberado pelo administrador do sistema, você receberá um novo e-mail de confirmação.</p>
        <br/>
        <p><a href="${linkData?.properties?.action_link || appUrl}">Acompanhar status do cadastro</a></p>
        <br/>
        <p>Equipe SistCIR - Sistema de Gestão de Cirurgias Robóticas</p>
      `

      const emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'SistCIR <onboarding@resend.dev>',
          to: user.email,
          subject: 'Bem-vindo ao SistCIR!',
          html: htmlContent,
        }),
      })

      if (!emailRes.ok) {
        const errText = await emailRes.text()
        console.error('Error sending email via Resend:', errText)
      }
    } else {
      console.warn('RESEND_API_KEY not found. Email not sent, but link was generated.')
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Welcome email processed successfully' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      },
    )
  } catch (error: any) {
    console.error('Internal Function Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
  }
})
