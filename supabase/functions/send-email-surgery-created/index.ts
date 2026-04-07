import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.6'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, x-supabase-client-platform, apikey, content-type',
}

const getInitials = (name: string) => {
  if (!name) return ''
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'Data não agendada'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' })
  } catch {
    return 'Data inválida'
  }
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

    if (!record || !record.pedido_id) {
      return new Response(
        JSON.stringify({ error: 'Missing record or pedido_id in webhook payload' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    const { data: pedidoData, error: pedidoError } = await supabaseAdmin
      .from('pedidos_cirurgia')
      .select(`
        id,
        scheduled_date,
        surgeon_id,
        patients ( full_name ),
        procedures ( name ),
        profiles ( name )
      `)
      .eq('id', record.pedido_id)
      .single()

    if (pedidoError || !pedidoData) {
      return new Response(JSON.stringify({ error: 'Pedido not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      })
    }

    const pedido: any = pedidoData
    const { data: { user: surgeon }, error: surgeonError } = await supabaseAdmin.auth.admin.getUserById(pedido.surgeon_id)

    if (surgeonError || !surgeon || !surgeon.email) {
      return new Response(JSON.stringify({ error: 'Surgeon user or email not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      })
    }

    const appUrl = Deno.env.get('APP_URL') ?? 'http://localhost:5173'
    const redirectUrl = `${appUrl}/pedidos/${pedido.id}`

    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: surgeon.email,
      options: {
        redirectTo: redirectUrl,
      },
    })

    if (linkError) {
      return new Response(JSON.stringify({ error: linkError.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      })
    }

    const surgeonName = pedido.profiles?.name || 'Cirurgião'
    const patientName = pedido.patients?.full_name || ''
    const patientInitials = getInitials(patientName)
    const procedureName = pedido.procedures?.name || 'Procedimento não especificado'
    const surgeryDate = formatDate(pedido.scheduled_date)
    const magicLink = linkData?.properties?.action_link || redirectUrl

    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (resendApiKey) {
      const htmlContent = `
        <h2 style="color: #0066cc;">SistCIR — Cirurgia Registrada</h2>
        <p>Olá, <strong>${surgeonName}</strong>.</p>
        <p>Uma nova solicitação de cirurgia foi registrada com sucesso.</p>
        <ul>
          <li><strong>Paciente:</strong> ${patientInitials}</li>
          <li><strong>Data Agendada:</strong> ${surgeryDate}</li>
          <li><strong>Procedimento:</strong> ${procedureName}</li>
        </ul>
        <br/>
        <p><a href="${magicLink}" style="background-color: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Acompanhar Status</a></p>
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
          to: surgeon.email,
          subject: 'SistCIR — Cirurgia Registrada',
          html: htmlContent,
        }),
      })

      if (!emailRes.ok) {
        console.error('Error sending email via Resend:', await emailRes.text())
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  } catch (error: any) {
    console.error('Internal Function Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
  }
})
