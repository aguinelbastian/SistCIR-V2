import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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

    // Extrair usuário do token JWT
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

    // Validar que o usuário é admin
    if (!usuario_id) {
      return new Response(
        JSON.stringify({ success: false, message: 'Usuário não autenticado' }),
        { status: 401, headers: corsHeaders }
      );
    }

    const { data: userRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', usuario_id);

    if (rolesError || !userRoles?.some(r => r.role === 'admin')) {
      return new Response(
        JSON.stringify({ success: false, message: 'Apenas admins podem deletar pedidos' }),
        { status: 403, headers: corsHeaders }
      );
    }

    // Extrair datas do body
    const body = await req.json();
    const { data_inicio, data_fim } = body;

    if (!data_inicio || !data_fim) {
      return new Response(
        JSON.stringify({ success: false, message: 'data_inicio e data_fim são obrigatórios' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Validar formato de datas
    const dataInicio = new Date(data_inicio);
    const dataFim = new Date(data_fim);

    if (isNaN(dataInicio.getTime()) || isNaN(dataFim.getTime())) {
      return new Response(
        JSON.stringify({ success: false, message: 'Formato de data inválido (use ISO 8601)' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Buscar IDs dos pedidos a deletar
    const { data: pedidosADeletar, error: fetchError } = await supabase
      .from('pedidos_cirurgia')
      .select('id')
      .gte('created_at', dataInicio.toISOString())
      .lte('created_at', dataFim.toISOString());

    if (fetchError) {
      return new Response(
        JSON.stringify({ success: false, message: `Erro ao buscar pedidos: ${fetchError.message}` }),
        { status: 500, headers: corsHeaders }
      );
    }

    const pedidoIds = pedidosADeletar?.map(p => p.id) || [];

    if (pedidoIds.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Nenhum pedido encontrado no período especificado',
          relatorio: {
            pedidos_cirurgia: 0,
            pedidos_pendencias: 0,
            pedidos_calendar_events: 0,
            pedidos_cirurgia_auditoria: 0,
            total_deletado: 0
          }
        }),
        { status: 200, headers: corsHeaders }
      );
    }

    // Deletar em cascata (respeitando Foreign Keys)
    let deletedCounts = {
      pedidos_pendencias: 0,
      pedidos_calendar_events: 0,
      pedidos_cirurgia_auditoria: 0,
      pedidos_cirurgia: 0,
    };

    // 1. Deletar pendências
    const { count: countPendencias, error: errorPendencias } = await supabase
      .from('pedidos_pendencias')
      .delete()
      .in('pedido_id', pedidoIds);

    if (errorPendencias) {
      console.error('Erro ao deletar pendências:', errorPendencias);
    } else {
      deletedCounts.pedidos_pendencias = countPendencias || 0;
    }

    // 2. Deletar eventos de calendário
    const { count: countCalendar, error: errorCalendar } = await supabase
      .from('pedidos_calendar_events')
      .delete()
      .in('pedido_id', pedidoIds);

    if (errorCalendar) {
      console.error('Erro ao deletar eventos de calendário:', errorCalendar);
    } else {
      deletedCounts.pedidos_calendar_events = countCalendar || 0;
    }

    // 3. Deletar auditoria (OPCIONAL - comentar se quiser preservar)
    const { count: countAuditoria, error: errorAuditoria } = await supabase
      .from('pedidos_cirurgia_auditoria')
      .delete()
      .in('pedido_id', pedidoIds);

    if (errorAuditoria) {
      console.error('Erro ao deletar auditoria:', errorAuditoria);
    } else {
      deletedCounts.pedidos_cirurgia_auditoria = countAuditoria || 0;
    }

    // 4. Deletar pedidos principais
    const { count: countPedidos, error: errorPedidos } = await supabase
      .from('pedidos_cirurgia')
      .delete()
      .in('id', pedidoIds);

    if (errorPedidos) {
      return new Response(
        JSON.stringify({ success: false, message: `Erro ao deletar pedidos: ${errorPedidos.message}` }),
        { status: 500, headers: corsHeaders }
      );
    }

    deletedCounts.pedidos_cirurgia = countPedidos || 0;

    // Registrar operação em audit_log
    const { error: auditError } = await supabase.from('audit_log').insert({
      action: 'Deletar Pedidos de Teste',
      changed_by: usuario_id,
      notes: `Deletados ${pedidoIds.length} pedidos criados entre ${data_inicio} e ${data_fim}`,
      changed_at: new Date().toISOString(),
      pedido_id: null, // Operação em lote, sem pedido específico
      status_to: 'N/A',
    });

    if (auditError) {
      console.error('Erro ao registrar auditoria:', auditError);
    }

    const totalDeletado = Object.values(deletedCounts).reduce((a, b) => a + b, 0);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Limpeza concluída com sucesso. ${totalDeletado} registros deletados.`,
        relatorio: {
          ...deletedCounts,
          total_deletado: totalDeletado,
          periodo: { data_inicio, data_fim },
          usuario_id: usuario_id,
          timestamp: new Date().toISOString()
        }
      }),
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: `Erro interno: ${error instanceof Error ? error.message : String(error)}`
      }),
      { status: 500, headers: corsHeaders }
    );
  }
});