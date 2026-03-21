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

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, PUT, OPTIONS',
}

Deno.serve(async (req) => {
  console.log('=== INÍCIO DA REQUISIÇÃO ===')
  console.log('Método:', req.method)

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders })
  }

  if (req.method !== 'POST' && req.method !== 'PUT') {
    console.log('Método não permitido:', req.method)
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
    console.log('Body recebido:', JSON.stringify(body))

    const id = body.id
    const novoEstado = body.status
    const updates = Object.fromEntries(
      Object.entries(body).filter(([key]) => !['id', 'status'].includes(key)),
    )

    console.log('ID:', id)
    console.log('Novo estado:', novoEstado)
    console.log('Updates:', JSON.stringify(updates))

    if (!id) {
      console.log('ERRO: ID ausente')
      return new Response(JSON.stringify({ error: 'ID do pedido é obrigatório' }), {
        status: 400,
        headers: corsHeaders,
      })
    }

    console.log('=== BUSCANDO PEDIDO ===')
    const { data: currentRecord, error: fetchError } = await supabase
      .from('pedidos_cirurgia')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !currentRecord) {
      console.log('ERRO ao buscar pedido:', fetchError)
      return new Response(JSON.stringify({ error: 'Pedido não encontrado' }), {
        status: 404,
        headers: corsHeaders,
      })
    }

    const estadoAtual = currentRecord.status as Estado
    console.log('Estado atual do pedido:', estadoAtual)

    // Se houver novo estado, validar transição
    if (novoEstado && novoEstado !== estadoAtual) {
      console.log('=== VALIDANDO TRANSIÇÃO ===')
      console.log('Transição solicitada:', estadoAtual, '→', novoEstado)

      if (!transicoesPermitidas[estadoAtual]?.includes(novoEstado)) {
        console.log('ERRO: Transição não permitida')
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
      console.log('✓ Transição validada')
    }

    // CORREÇÃO: Validar campos contra o estado FINAL (novo ou atual)
    console.log('=== VALIDANDO CAMPOS ===')
    const estadoFinal = novoEstado || estadoAtual
    const camposPermitidos = camposAtualizaveis[estadoFinal]
    console.log('Estado final:', estadoFinal)
    console.log('Campos permitidos:', camposPermitidos)

    const camposInvalidos = Object.keys(updates).filter(
      (field) => !camposPermitidos.includes(field),
    )
    if (camposInvalidos.length > 0) {
      console.log('ERRO: Campos não permitidos:', camposInvalidos)
      return new Response(
        JSON.stringify({
          error: `Campos não permitidos para atualização: ${camposInvalidos.join(', ')}`,
          camposPermitidos,
        }),
        { status: 400, headers: corsHeaders },
      )
    }
    console.log('✓ Campos validados')

    // Preparar dados para atualização
    console.log('=== PREPARANDO ATUALIZAÇÃO ===')
    const updateData: Record<string, any> = {
      ...updates,
      updated_at: new Date().toISOString(),
    }

    if (novoEstado) {
      updateData.status = novoEstado
    }

    console.log('Dados para atualizar:', JSON.stringify(updateData))

    // Atualizar o registro
    console.log('=== EXECUTANDO UPDATE ===')
    const { data: updatedRecord, error: updateError } = await supabase
      .from('pedidos_cirurgia')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.log('ERRO ao atualizar:', updateError)
      return new Response(
        JSON.stringify({
          error: 'Erro ao atualizar o pedido',
          details: updateError.message,
        }),
        { status: 500, headers: corsHeaders },
      )
    }

    console.log('✓ Pedido atualizado com sucesso')

    // Inserir auditoria
    console.log('=== REGISTRANDO AUDITORIA ===')
    const auditData = {
      pedido_id: id,
      acao: novoEstado ? `Transição: ${estadoAtual} → ${novoEstado}` : 'Atualização de dados',
      campos_alterados: Object.keys(updateData),
      usuario_id: null,
      criado_em: new Date().toISOString(),
    }

    const { error: auditError } = await supabase
      .from('pedidos_cirurgia_auditoria')
      .insert(auditData)

    if (auditError) {
      console.log('Aviso: Erro ao registrar auditoria:', auditError)
    } else {
      console.log('✓ Auditoria registrada')
    }

    console.log('=== REQUISIÇÃO CONCLUÍDA COM SUCESSO ===')
    return new Response(JSON.stringify({ success: true, data: updatedRecord }), {
      status: 200,
      headers: corsHeaders,
    })
  } catch (error) {
    console.log('=== ERRO GERAL ===')
    console.log('Erro:', error)
    return new Response(
      JSON.stringify({
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : String(error),
      }),
      { status: 500, headers: corsHeaders },
    )
  }
})
