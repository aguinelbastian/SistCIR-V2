import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Map surgery status to target Telegram groups
const chatMap: Record<string, string[]> = {
  '1_RASCUNHO': ['OPME', 'FINANCEIRO'],
  '2_AGUARDANDO_OPME': ['OPME'],
  '3_EM_AUDITORIA': ['FINANCEIRO'],
  '4_PENDENCIA_TECNICA': ['FINANCEIRO'],
  '5_AUTORIZADO': ['COORDINATOR'],
  '6_AGUARDANDO_ALOCACAO': ['COORDINATOR'],
  '7_AGENDADO_CC': ['ENFERMAGEM', 'COORDINATOR'],
  '8_EM_EXECUCAO': ['ENFERMAGEM'],
  '9_REALIZADO': ['FINANCEIRO', 'ENFERMAGEM'],
  '10_CANCELADO': ['FINANCEIRO', 'OPME'],
}

// Escape special characters for Telegram MarkdownV2
const escapeMD = (text: string) => {
  if (!text) return ''
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&')
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Parse Webhook Payload
    const payload = await req.json()

    // 2. Structural Payload Validation
    if (!payload || !payload.record || !payload.record.pedido_id) {
      return new Response(JSON.stringify({ message: 'Invalid payload' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const record = payload.record

    if (payload.type !== 'INSERT') {
      return new Response(JSON.stringify({ message: 'Event ignored' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Determine target groups early to avoid unnecessary DB calls
    const targetGroups = chatMap[record.status_to] || []
    if (targetGroups.length === 0) {
      return new Response(JSON.stringify({ message: 'No target group for this status' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 3. Retrieve Full Details from DB
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const supabase = createClient(supabaseUrl, supabaseServiceKey!)
    const { data: pedido, error } = await supabase
      .from('pedidos_cirurgia')
      .select(`
        id,
        patients ( medical_record ),
        procedures ( name ),
        profiles!pedidos_cirurgia_surgeon_id_fkey ( name, crm )
      `)
      .eq('id', record.pedido_id)
      .single()

    if (error || !pedido) {
      console.error('Database query failed:', error?.message)
      return new Response(JSON.stringify({ error: 'Failed to retrieve surgery details' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 4. Format Message
    const dateObj = new Date(record.changed_at || new Date())
    const pad = (n: number) => n.toString().padStart(2, '0')
    const formattedDate = `${pad(dateObj.getDate())}/${pad(dateObj.getMonth() + 1)}/${dateObj.getFullYear()} ${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}`

    // Note: Patient full name is explicitly excluded to protect privacy
    const medRecord = escapeMD(pedido.patients?.medical_record || 'N/A')
    const procName = escapeMD(pedido.procedures?.name || 'N/A')
    const surgeonName = escapeMD(pedido.profiles?.name || 'N/A')
    const statusFrom = escapeMD(record.status_from || 'N/A')
    const statusTo = escapeMD(record.status_to || 'N/A')
    const action = escapeMD(record.action || 'N/A')
    const changedAtEscaped = escapeMD(formattedDate)

    const message =
      `🏥 *SISTCIR v2*\n` +
      `📋 Prontuário: ${medRecord}\n` +
      `🔬 Procedimento: ${procName}\n` +
      `👨‍⚕️ Cirurgião: ${surgeonName}\n` +
      `📊 Status: ${statusFrom} \u2192 ${statusTo}\n` +
      `✅ Ação: ${action}\n` +
      `🕐 ${changedAtEscaped}`

    if (!botToken) {
      console.error('Missing Telegram configuration')
      return new Response(JSON.stringify({ error: 'Configuration missing' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 5. Dispatch Notifications
    const promises = targetGroups.map(async (group) => {
      const chatId = Deno.env.get(`TELEGRAM_CHAT_${group}`)
      if (!chatId) {
        console.error(`Missing chat ID for group: ${group}`)
        return
      }

      try {
        const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'MarkdownV2',
          }),
        })

        if (!res.ok) {
          const errData = await res.text()
          console.error(`Telegram API error for ${group}:`, errData)
        }
      } catch (err: any) {
        console.error(`Failed to send to ${group}:`, err.message)
      }
    })

    await Promise.all(promises)

    return new Response(JSON.stringify({ success: true, notified: targetGroups }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err: any) {
    console.error('Critical function error:', err.message)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
