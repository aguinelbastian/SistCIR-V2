import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, x-supabase-client-platform, apikey, content-type',
}

interface AgendamentoProposta {
  data: string
  turno: 'manhã' | 'tarde'
}

interface OPMEAdicional {
  catalog_id: string
  quantity: number
  lot_used?: string
  notes?: string
}

interface CreatePedidoRequest {
  patient_id: string
  surgeon_id: string
  proctor_id?: string
  proctor_crm?: string
  datas_propostas?: AgendamentoProposta[]
  block_preferences?: string[]
  previsao_tempo_minutos: number
  tempo_internacao_dias?: number
  operating_room?: string
  procedure_id: string
  cid10_primary: string
  clinical_indication: string
  reserva_uti: boolean
  diagnostico_cid10_id?: string
  pacote_opme_id?: string
  opme_adicional?: OPMEAdicional[]
  anexo_guia_url: string
  anexo_guia_tipo: string
  alergias_paciente: boolean
  alergias_descricao?: string
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ code: 405, message: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase environment variables missing')
    }

    const authHeader = req.headers.get('Authorization') || req.headers.get('authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ code: 401, message: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const token = authHeader.replace(/^Bearer\s+/i, '')

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    })

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token)
    if (authError || !user) {
      console.error('Auth error:', authError)
      return new Response(
        JSON.stringify({ code: 401, message: 'Unauthorized', details: authError?.message }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const payload = (await req.json()) as CreatePedidoRequest

    // ============================================================================
    // VALIDAÇÕES
    // ============================================================================

    const camposObrigatorios = [
      'patient_id',
      'previsao_tempo_minutos',
      'procedure_id',
      'cid10_primary',
      'clinical_indication',
      'anexo_guia_url',
      'anexo_guia_tipo',
      'alergias_paciente',
    ]

    for (const campo of camposObrigatorios) {
      const valor = payload[campo as keyof CreatePedidoRequest]

      if (campo === 'alergias_paciente' || campo === 'reserva_uti') {
        if (typeof valor !== 'boolean') {
          return new Response(
            JSON.stringify({
              code: 400,
              message: `Campo obrigatório ausente ou inválido: ${campo} (deve ser boolean)`,
            }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
          )
        }
      } else {
        if (valor === undefined || valor === null || valor === '') {
          return new Response(
            JSON.stringify({ code: 400, message: `Campo obrigatório ausente: ${campo}` }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
          )
        }
      }
    }

    if (typeof payload.reserva_uti !== 'boolean') {
      return new Response(
        JSON.stringify({
          code: 400,
          message: 'Campo obrigatório ausente ou inválido: reserva_uti (deve ser boolean)',
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    if (payload.alergias_paciente && !payload.alergias_descricao) {
      return new Response(
        JSON.stringify({
          code: 400,
          message: 'Descrição de alergias é obrigatória quando alergias_paciente = true',
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const tiposValidos = ['pdf', 'txt', 'docx', 'gdoc', 'N/A']
    if (!tiposValidos.includes(payload.anexo_guia_tipo)) {
      return new Response(
        JSON.stringify({
          code: 400,
          message: `Tipo de anexo inválido. Aceitos: ${tiposValidos.join(', ')}`,
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    if (payload.block_preferences && Array.isArray(payload.block_preferences)) {
      if (payload.block_preferences.length !== 3) {
        return new Response(
          JSON.stringify({
            code: 400,
            message: 'É obrigatório selecionar exatamente 3 preferências de bloco',
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        )
      }

      const uniqueBlocks = new Set(payload.block_preferences)
      if (uniqueBlocks.size !== 3) {
        return new Response(
          JSON.stringify({
            code: 400,
            message: 'Não é permitido selecionar o mesmo bloco mais de uma vez',
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        )
      }
    } else if (!payload.datas_propostas) {
      return new Response(
        JSON.stringify({
          code: 400,
          message: 'É obrigatório informar preferências de bloco ou datas propostas',
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // ============================================================================
    // CRIAR PEDIDO CIRÚRGICO
    // ============================================================================

    const { data: pedido, error: erroPedido } = await supabase
      .from('pedidos_cirurgia')
      .insert({
        patient_id: payload.patient_id,
        surgeon_id: user.id,
        proctor_id: payload.proctor_id || null,
        proctor_crm: payload.proctor_crm || null,
        previsao_tempo_minutos: payload.previsao_tempo_minutos,
        tempo_internacao_dias: payload.tempo_internacao_dias || null,
        operating_room: payload.operating_room || null,
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
      })
      .select()
      .single()

    if (erroPedido) {
      return new Response(JSON.stringify({ code: 400, message: erroPedido.message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const pedidoId = pedido.id

    // ============================================================================
    // CRIAR PREFERÊNCIAS DE BLOCOS
    // ============================================================================
    let blocosPrefsInseridos = 0

    if (
      payload.block_preferences &&
      Array.isArray(payload.block_preferences) &&
      payload.block_preferences.length === 3
    ) {
      const { data: blocos, error: erroBlocos } = await supabase
        .from('surgical_blocks')
        .select('id, is_available, hospital_id')
        .in('id', payload.block_preferences)

      if (erroBlocos) {
        return new Response(
          JSON.stringify({ code: 400, message: 'Erro ao validar blocos cirúrgicos' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        )
      }

      if (blocos && blocos.length === 3) {
        if (blocos.some((b) => !b.is_available)) {
          return new Response(
            JSON.stringify({
              code: 400,
              message: 'Um ou mais blocos selecionados não estão disponíveis',
            }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
          )
        }

        const prefsInsert = payload.block_preferences.map((blockId, index) => {
          const bloco = blocos.find((b) => b.id === blockId)

          return {
            pedido_cirurgia_id: pedidoId,
            surgical_block_id: blockId,
            preference_order: index + 1,
            hospital_id: bloco?.hospital_id,
          }
        })

        const { error: erroPrefs } = await supabase
          .from('surgical_request_block_preferences')
          .insert(prefsInsert)

        if (erroPrefs) {
          return new Response(JSON.stringify({ code: 400, message: erroPrefs.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }

        blocosPrefsInseridos = 3
      }
    }

    // ============================================================================
    // CRIAR AGENDAMENTO PROPOSTAS (Fallback / Compatibilidade)
    // ============================================================================
    if (
      payload.datas_propostas &&
      payload.datas_propostas.length > 0 &&
      blocosPrefsInseridos === 0
    ) {
      const agendamentosInsert = payload.datas_propostas.map((proposta, index) => ({
        pedido_id: pedidoId,
        numero_proposta: index + 1,
        data_proposta: proposta.data,
        turno: proposta.turno,
      }))

      const { error: erroAgendamento } = await supabase
        .from('agendamento_propostas')
        .insert(agendamentosInsert)

      if (erroAgendamento) {
        return new Response(JSON.stringify({ code: 400, message: erroAgendamento.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
    }

    // ============================================================================
    // CRIAR OPME ADICIONAL
    // ============================================================================

    if (payload.opme_adicional && payload.opme_adicional.length > 0) {
      const opmeInsert = payload.opme_adicional.map((item) => ({
        pedido_id: pedidoId,
        catalog_id: item.catalog_id,
        quantity: item.quantity,
        lot_used: item.lot_used || null,
        notes: item.notes || null,
        added_by: user.id,
      }))

      const { error: erroOPME } = await supabase.from('pedido_opme_items').insert(opmeInsert)

      if (erroOPME) {
        return new Response(JSON.stringify({ code: 400, message: erroOPME.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: pedido,
        pedido_id: pedidoId,
        status: '1_RASCUNHO',
        mensagem: 'Pedido cirúrgico criado com sucesso.',
        preferencias_inseridas: blocosPrefsInseridos,
      }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error: any) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ code: 500, message: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})
