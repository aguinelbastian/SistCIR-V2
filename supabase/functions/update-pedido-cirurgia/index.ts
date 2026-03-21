import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

type Estado =
  | '1_RASCUNHO'
  | '2_AGUARDANDO_OPME'
  | '3_EM_AUDITORIA'
  | '4_PENDENCIA_TECNICA'
  | '5_AUTORIZADO'
  | '6_AGUARDANDO_MAPA'
  | '7_AGENDADO_CC'
  | '8_EM_EXECUCAO'
  | '9_REALIZADO'
  | '10_CANCELADO'

const camposAtualizaveis: Record<Estado, string[]> = {
  '1_RASCUNHO': [
    'patient_id',
    'surgeon_id',
    'proctor_id',
    'proctor_crm',
    'previsao_tempo_minutos',
    'tempo_internacao_dias',
    'operating_room',
    'procedure_id',
    'cid10_primary',
    'clinical_indication',
    'reserva_uti',
    'diagnostico_cid10_id',
    'pacote_opme_id',
    'anexo_guia_url',
    'anexo_guia_tipo',
    'alergias_paciente',
    'alergias_descricao',
  ],
  '2_AGUARDANDO_OPME': ['pacote_opme_id', 'anexo_guia_url', 'anexo_guia_tipo'],
  '3_EM_AUDITORIA': [],
  '4_PENDENCIA_TECNICA': ['clinical_indication'],
  '5_AUTORIZADO': ['authorization_number', 'authorization_date'],
  '6_AGUARDANDO_MAPA': ['scheduled_date', 'operating_room'],
  '7_AGENDADO_CC': ['scheduled_date', 'operating_room', 'anesthesiologist_name'],
  '8_EM_EXECUCAO': [],
  '9_REALIZADO': [],
  '10_CANCELADO': ['cancellation_reason'],
}

const transicoesPermitidas: Record<Estado, Estado[]> = {
  '1_RASCUNHO': ['2_AGUARDANDO_OPME', '10_CANCELADO'],
  '2_AGUARDANDO_OPME': ['3_EM_AUDITORIA', '1_RASCUNHO', '10_CANCELADO'],
  '3_EM_AUDITORIA': ['4_PENDENCIA_TECNICA', '5_AUTORIZADO', '2_AGUARDANDO_OPME', '10_CANCELADO'],
  '4_PENDENCIA_TECNICA': ['3_EM_AUDITORIA', '10_CANCELADO'],
  '5_AUTORIZADO': ['6_AGUARDANDO_MAPA', '10_CANCELADO'],
  '6_AGUARDANDO_MAPA': ['7_AGENDADO_CC', '10_CANCELADO'],
  '7_AGENDADO_CC': ['8_EM_EXECUCAO', '10_CANCELADO'],
  '8_EM_EXECUCAO': ['9_REALIZADO', '10_CANCELADO'],
  '9_REALIZADO': ['10_CANCELADO'],
  '10_CANCELADO': [],
}

// LGPD Compliance: Telegram notifications contain NO patient PII
// Telegram is an operational notification channel, not for transmitting clinical data.
const CHAT_MAP: Record<Estado, string[]> = {
  '1_RASCUNHO': [],
  '2_AGUARDANDO_OPME': ['BILLING'],
  '3_EM_AUDITORIA': ['BILLING', 'COORDINATORS'],
  '4_PENDENCIA_TECNICA': ['CIRURGIOES'],
  '5_AUTORIZADO': ['CIRURGIOES', 'COORDINATORS'],
  '6_AGUARDANDO_MAPA': ['COORDINATORS'],
  '7_AGENDADO_CC': ['CIRURGIOES', 'COORDINATORS'],
  '8_EM_EXECUCAO': ['COORDINATORS'],
  '9_REALIZADO': ['BILLING'],
  '10_CANCELADO': ['CIRURGIOES', 'BILLING', 'COORDINATORS'],
}

const escapeMD = (text: string) => {
  if (!text) return ''
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&')
}

async function notifyTelegramBySector(
  pedidoId: string,
  novoEstado: string,
  supabase: any,
  botToken: string,
) {
  const targetGroups = CHAT_MAP[novoEstado as Estado] || []
  if (targetGroups.length === 0) {
    return { notificationSent: true, notified: [] }
  }

  // Fetch only non-PII operational/clinical data
  const { data: pedido, error } = await supabase
    .from('pedidos_cirurgia')
    .select(`
      id,
      cid10_primary,
      operating_room,
      patients ( medical_record ),
      procedures ( name ),
      profiles!pedidos_cirurgia_surgeon_id_fkey ( name, crm )
    `)
    .eq('id', pedidoId)
    .single()

  if (error || !pedido) {
    return {
      notificationSent: false,
      notificationWarning: 'Falha ao recuperar dados para notificação',
    }
  }

  const medRecord = escapeMD(pedido.patients?.medical_record || 'N/A')
  const procName = escapeMD(pedido.procedures?.name || 'N/A')
  const surgeonName = escapeMD(pedido.profiles?.name || 'N/A')
  const surgeonCrm = escapeMD(pedido.profiles?.crm || 'N/A')
  const cid10 = escapeMD(pedido.cid10_primary || 'N/A')
  const opRoom = escapeMD(pedido.operating_room || 'N/A')
  const pedidoIdEscaped = escapeMD(pedido.id)
  const statusTo = escapeMD(novoEstado)

  const message =
    `🏥 *SISTCIR v2 \\- Transição de Estado*\n\n` +
    `*Novo Status:* ${statusTo}\n` +
    `*Prontuário:* ${medRecord}\n` +
    `*Cirurgião:* ${surgeonName} \\(CRM: ${surgeonCrm}\\)\n` +
    `*Procedimento:* ${procName}\n` +
    `*CID\\-10:* ${cid10}\n` +
    `*Sala Operatória:* ${opRoom}\n\n` +
    `_Pedido ID: ${pedidoIdEscaped}_`

  const errors: string[] = []
  const notified: string[] = []

  const promises = targetGroups.map(async (group) => {
    const chatId = Deno.env.get(`TELEGRAM_CHAT_${group}`)
    if (!chatId) {
      errors.push(`Missing chat ID for group: ${group}`)
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
        errors.push(`Telegram API error for ${group}: ${errData}`)
      } else {
        notified.push(group)
      }
    } catch (err: any) {
      errors.push(`Failed to send to ${group}: ${err.message}`)
    }
  })

  await Promise.all(promises)

  if (errors.length > 0) {
    return {
      notificationSent: false,
      notificationWarning: `Falha ao enviar notificação para: ${targetGroups.join(', ')}. Detalhes: ${errors.join(' | ')}`,
      notified,
    }
  }

  return { notificationSent: true, notified }
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, PUT, OPTIONS',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders })
  }

  if (req.method !== 'POST' && req.method !== 'PUT') {
    return new Response(JSON.stringify({ error: 'Método não permitido' }), {
      status: 405,
      headers: corsHeaders,
    })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const body = await req.json()

    const id = body.id
    const novoEstado = body.status
    const updates = Object.fromEntries(
      Object.entries(body).filter(([key]) => !['id', 'status'].includes(key)),
    )

    if (!id) {
      return new Response(JSON.stringify({ error: 'ID do pedido é obrigatório' }), {
        status: 400,
        headers: corsHeaders,
      })
    }

    const { data: currentRecord, error: fetchError } = await supabase
      .from('pedidos_cirurgia')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !currentRecord) {
      return new Response(JSON.stringify({ error: 'Pedido não encontrado' }), {
        status: 404,
        headers: corsHeaders,
      })
    }

    const estadoAtual = currentRecord.status as Estado

    if (novoEstado && novoEstado !== estadoAtual) {
      if (!transicoesPermitidas[estadoAtual]?.includes(novoEstado)) {
        return new Response(
          JSON.stringify({
            error: 'Transição de estado não permitida',
            estadoAtual,
            novoEstado,
            transicoesPermitidas: transicoesPermitidas[estadoAtual],
          }),
          { status: 400, headers: corsHeaders },
        )
      }
    }

    const estadoFinal = novoEstado || estadoAtual
    const camposPermitidos = camposAtualizaveis[estadoFinal]

    const camposInvalidos = Object.keys(updates).filter(
      (field) => !camposPermitidos.includes(field),
    )
    if (camposInvalidos.length > 0) {
      return new Response(
        JSON.stringify({
          error: `Campos não permitidos para atualização: ${camposInvalidos.join(', ')}`,
          camposPermitidos,
        }),
        { status: 400, headers: corsHeaders },
      )
    }

    const updateData: Record<string, any> = {
      ...updates,
      updated_at: new Date().toISOString(),
    }

    if (novoEstado) {
      updateData.status = novoEstado
    }

    const { data: updatedRecord, error: updateError } = await supabase
      .from('pedidos_cirurgia')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      return new Response(
        JSON.stringify({
          error: 'Erro ao atualizar o pedido',
          details: updateError.message,
        }),
        { status: 500, headers: corsHeaders },
      )
    }

    const auditData = {
      pedido_id: id,
      acao: novoEstado ? `Transição: ${estadoAtual} → ${novoEstado}` : 'Atualização de dados',
      campos_alterados: Object.keys(updateData),
      usuario_id: null,
      criado_em: new Date().toISOString(),
    }

    await supabase.from('pedidos_cirurgia_auditoria').insert(auditData)

    let notificationSent = undefined
    let notificationWarning = undefined
    let notifiedGroups: string[] = []

    // Only notify if there's a state transition
    if (novoEstado && novoEstado !== estadoAtual) {
      const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN')
      if (botToken) {
        const notifResult = await notifyTelegramBySector(id, novoEstado, supabase, botToken)
        notificationSent = notifResult.notificationSent
        notificationWarning = notifResult.notificationWarning
        notifiedGroups = notifResult.notified
      } else {
        console.warn('Aviso: TELEGRAM_BOT_TOKEN não configurado.')
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: updatedRecord,
        notificationSent,
        notificationWarning,
        notifiedGroups,
      }),
      { status: 200, headers: corsHeaders },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : String(error),
      }),
      { status: 500, headers: corsHeaders },
    )
  }
})
