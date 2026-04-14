import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

type Estado = '1_RASCUNHO' | '2_AGUARDANDO_OPME' | '3_EM_AUDITORIA' | '4_PENDENCIA_TECNICA' | '5_AUTORIZADO' | '6_AGUARDANDO_MAPA' | '7_AGENDADO_CC' | '8_EM_EXECUCAO' | '9_REALIZADO' | '10_CANCELADO';

const camposAtualizaveis: Record<Estado, string[]> = {
  '1_RASCUNHO': ['patient_id', 'surgeon_id', 'proctor_id', 'proctor_crm', 'previsao_tempo_minutos', 'tempo_internacao_dias', 'operating_room', 'procedure_id', 'cid10_primary', 'clinical_indication', 'reserva_uti', 'diagnostico_cid10_id', 'pacote_opme_id', 'anexo_guia_url', 'anexo_guia_tipo', 'alergias_paciente', 'alergias_descricao'],
  '2_AGUARDANDO_OPME': ['pacote_opme_id', 'anexo_guia_url', 'anexo_guia_tipo'],
  '3_EM_AUDITORIA': [],
  '4_PENDENCIA_TECNICA': ['clinical_indication'],
  '5_AUTORIZADO': ['authorization_number', 'authorization_date'],
  '6_AGUARDANDO_MAPA': ['scheduled_date', 'operating_room'],
  '7_AGENDADO_CC': ['scheduled_date', 'operating_room', 'anesthesiologist_name'],
  '8_EM_EXECUCAO': [],
  '9_REALIZADO': [],
  '10_CANCELADO': ['cancellation_reason']
};

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
  '10_CANCELADO': []
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, PUT, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let usuario_id: string | null = null;
    const authHeader = req.headers.get('Authorization');

    if (authHeader) {
      try {
        const token = authHeader.replace('Bearer ', '').trim();
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          usuario_id = payload.sub || null;
        }
      } catch (err) {
        console.error('JWT extraction error:', err);
      }
    }

    const body = await req.json();
    const id = body.pedido_id || body.id;
    const novoEstado = body.new_status || body.status;
    const updates = Object.fromEntries(
      Object.entries(body).filter(([key]) => !['id', 'status', 'pedido_id', 'new_status', 'notes'].includes(key))
    );

    if (!id) {
      return new Response(JSON.stringify({ success: false, message: 'ID obrigatório' }), { status: 400, headers: corsHeaders });
    }

    const { data: currentRecord, error: fetchError } = await supabase
      .from('pedidos_cirurgia')
      .select('id, status')
      .eq('id', id)
      .single();

    if (fetchError || !currentRecord) {
      return new Response(JSON.stringify({ success: false, message: 'Pedido não encontrado' }), { status: 404, headers: corsHeaders });
    }

    const estadoAtual = currentRecord.status as Estado;

    if (novoEstado && novoEstado !== estadoAtual) {
      if (!transicoesPermitidas[estadoAtual]?.includes(novoEstado)) {
        return new Response(JSON.stringify({ 
          success: false,
          message: `Transição não permitida de ${estadoAtual} para ${novoEstado}`
        }), { status: 200, headers: corsHeaders });
      }
    }

    const estadoFinal = novoEstado || estadoAtual;
    const camposPermitidos = camposAtualizaveis[estadoFinal];

    const camposInvalidos = Object.keys(updates).filter(field => !camposPermitidos.includes(field));
    if (camposInvalidos.length > 0) {
      return new Response(JSON.stringify({ 
        success: false,
        message: `Campos não permitidos: ${camposInvalidos.join(', ')}`
      }), { status: 200, headers: corsHeaders });
    }

    const updateData: Record<string, any> = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    if (novoEstado) {
      updateData.status = novoEstado;
    }

    const { data: updatedRecord, error: updateError } = await supabase
      .from('pedidos_cirurgia')
      .update(updateData)
      .eq('id', id)
      .select('id, status')
      .single();

    if (updateError) {
      return new Response(JSON.stringify({ 
        success: false,
        message: 'Erro ao atualizar: ' + updateError.message
      }), { status: 500, headers: corsHeaders });
    }

    const auditData = {
      pedido_id: id,
      acao: novoEstado ? `Transição: ${estadoAtual} → ${novoEstado}` : 'Atualização de dados',
      campos_alterados: Object.keys(updateData),
      usuario_id: usuario_id,
      criado_em: new Date().toISOString()
    };

    const { error: auditError } = await supabase.from('pedidos_cirurgia_auditoria').insert(auditData);
    if (auditError) {
      console.error('Audit insert error:', auditError);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: novoEstado ? `Transição para ${novoEstado} realizada` : 'Pedido atualizado',
      data: {
        id: updatedRecord.id,
        status: updatedRecord.status
      }
    }), { status: 200, headers: corsHeaders });

  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false,
      message: 'Erro interno: ' + (error instanceof Error ? error.message : String(error))
    }), { status: 500, headers: corsHeaders });
  }
});