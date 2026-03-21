import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, x-supabase-client-platform, apikey, content-type',
}

interface AgendamentoProposta {
  data: string // YYYY-MM-DD
  turno: 'manhã' | 'tarde'
}

interface OPMEAdicional {
  descricao: string
  quantidade: number
  fabricante?: string
  fornecedor?: string
}

interface CreatePedidoRequest {
  // Paciente (referência)
  patient_id: string

  // Equipe
  surgeon_id: string
  proctor_id?: string
  proctor_crm?: string

  // Agendamento
  datas_propostas: AgendamentoProposta[]
  previsao_tempo_minutos: number
  tempo_internacao_dias?: number
  operating_room: string

  // Procedimento
  procedure_id: string
  cid10_primary: string
  clinical_indication: string
  reserva_uti: boolean
  diagnostico_cid10_id?: string

  // Pacote OPME
  pacote_opme_id?: string

  // OPME Adicional
  opme_adicional?: OPMEAdicional[]

  // Anexo
  anexo_guia_url: string
  anexo_guia_tipo: string // pdf, txt, docx, gdoc

  // Alergias
  alergias_paciente: boolean
  alergias_descricao?: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    const payload = (await req.json()) as CreatePedidoRequest

    // ============================================================================
    // VALIDAÇÕES
    // ============================================================================

    // Validar campos obrigatórios
    const camposObrigatorios = [
      'patient_id',
      'surgeon_id',
      'datas_propostas',
      'previsao_tempo_minutos',
      'operating_room',
      'procedure_id',
      'cid10_primary',
      'clinical_indication',
      'anexo_guia_url',
      'anexo_guia_tipo',
      'alergias_paciente',
    ]

    for (const campo of camposObrigatorios) {
      const valor = payload[campo as keyof CreatePedidoRequest]

      // Tratamento especial para booleanos
      if (campo === 'alergias_paciente' || campo === 'reserva_uti') {
        if (typeof valor !== 'boolean') {
          return new Response(
            JSON.stringify({
              error: `Campo obrigatório ausente ou inválido: ${campo} (deve ser boolean)`,
            }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
          )
        }
      } else {
        // Para outros campos
        if (valor === undefined || valor === null || valor === '') {
          return new Response(JSON.stringify({ error: `Campo obrigatório ausente: ${campo}` }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }
      }
    }

    // Validar reserva_uti (obrigatório)
    if (typeof payload.reserva_uti !== 'boolean') {
      return new Response(
        JSON.stringify({
          error: 'Campo obrigatório ausente ou inválido: reserva_uti (deve ser boolean)',
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // Validar datas propostas
    if (!Array.isArray(payload.datas_propostas) || payload.datas_propostas.length !== 3) {
      return new Response(JSON.stringify({ error: 'Deve haver exatamente 3 datas propostas' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    for (const proposta of payload.datas_propostas) {
      if (!proposta.data || !proposta.turno) {
        return new Response(
          JSON.stringify({ error: 'Data e turno são obrigatórios em cada proposta' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        )
      }
      if (!['manhã', 'tarde'].includes(proposta.turno)) {
        return new Response(JSON.stringify({ error: 'Turno deve ser "manhã" ou "tarde"' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
    }

    // Validar alergias (se sim, descrição é obrigatória)
    if (payload.alergias_paciente && !payload.alergias_descricao) {
      return new Response(
        JSON.stringify({
          error: 'Descrição de alergias é obrigatória quando alergias_paciente = true',
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // Validar anexo
    const tiposValidos = ['pdf', 'txt', 'docx', 'gdoc']
    if (!tiposValidos.includes(payload.anexo_guia_tipo)) {
      return new Response(
        JSON.stringify({
          error: `Tipo de anexo inválido. Aceitos: ${tiposValidos.join(', ')}`,
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // ============================================================================
    // CRIAR PEDIDO CIRÚRGICO (Usando APENAS campos que existem)
    // ============================================================================

    const { data: pedido, error: erroPedido } = await supabaseAdmin
      .from('pedidos_cirurgia')
      .insert({
        patient_id: payload.patient_id,
        surgeon_id: payload.surgeon_id,
        proctor_id: payload.proctor_id || null,
        proctor_crm: payload.proctor_crm || null,
        previsao_tempo_minutos: payload.previsao_tempo_minutos,
        tempo_internacao_dias: payload.tempo_internacao_dias || null,
        operating_room: payload.operating_room,
        procedure_id: payload.procedure_id,
        cid10_primary: payload.cid10_primary,
        clinical_indication: payload.clinical_indication,
        reserva_uti: payload.reserva_uti,
        diagnostico_cid10_id: payload.diagnostico_cid10_id || null,
        pacote_opme_id: payload.pacote_opme_id || null,
        anexo_guia_url: payload.anexo_guia_url,
        anexo_guia_tipo: payload.anexo_guia_tipo,
        alergias_paciente: payload.alergias_paciente,
        alergias_descricao: payload.alergias_descricao || null,
        status: '1_RASCUNHO',
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (erroPedido) throw erroPedido

    const pedidoId = pedido.id

    // ============================================================================
    // CRIAR AGENDAMENTO PROPOSTAS (3 datas/turnos)
    // ============================================================================

    const agendamentosInsert = payload.datas_propostas.map((proposta, index) => ({
      pedido_id: pedidoId,
      numero_proposta: index + 1,
      data_proposta: proposta.data,
      turno: proposta.turno,
      criado_em: new Date().toISOString(),
    }))

    const { error: erroAgendamento } = await supabaseAdmin
      .from('agendamento_propostas')
      .insert(agendamentosInsert)

    if (erroAgendamento) throw erroAgendamento

    // ============================================================================
    // CRIAR OPME ADICIONAL (Se houver)
    // ============================================================================

    if (payload.opme_adicional && payload.opme_adicional.length > 0) {
      // Nota: opme_adicional agora espera { opme_item_id, quantity }
      // em vez de { descricao, quantidade, fabricante, fornecedor }

      const opmeInsert = payload.opme_adicional.map((item) => ({
        pedido_id: pedidoId,
        opme_item_id: item.opme_item_id, // UUID do item OPME do catálogo
        quantity: item.quantity,
        lot_used: item.lot_used || null,
        notes: item.notes || null,
        added_by: payload.surgeon_id, // Quem adicionou (cirurgião)
        created_at: new Date().toISOString(),
      }))

      const { error: erroOPME } = await supabaseAdmin.from('pedido_opme_items').insert(opmeInsert)

      if (erroOPME) throw erroOPME
    }
    // ============================================================================
    // RESPOSTA DE SUCESSO
    // ============================================================================

    return new Response(
      JSON.stringify({
        success: true,
        pedido_id: pedidoId,
        status: '1_RASCUNHO',
        mensagem: 'Pedido cirúrgico criado com sucesso. Aguardando aprovação da enfermagem.',
        agendamentos_propostos: payload.datas_propostas.length,
      }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
