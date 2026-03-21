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

interface PropostaData {
  data: string // YYYY-MM-DD
  turno: 'manhã' | 'tarde'
}

interface DisponibilidadeResponse {
  data: string
  turno: string
  disponivel: boolean
  motivo: string
  conflitos: {
    cirurgiao: boolean
    sala: boolean
    robo: boolean
  }
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
    const { surgeon_id, operating_room, datas_propostas } = await req.json()

    if (!surgeon_id || !datas_propostas || !Array.isArray(datas_propostas)) {
      return new Response(
        JSON.stringify({
          error: 'Missing required fields: surgeon_id, operating_room, datas_propostas',
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const disponibilidade: DisponibilidadeResponse[] = []

    for (const proposta of datas_propostas) {
      const { data, turno } = proposta as PropostaData

      // Validar formato de data
      if (!data || !/^\d{4}-\d{2}-\d{2}$/.test(data)) {
        disponibilidade.push({
          data,
          turno,
          disponivel: false,
          motivo: 'Formato de data inválido (use YYYY-MM-DD)',
          conflitos: { cirurgiao: false, sala: false, robo: false },
        })
        continue
      }

      // Definir horários do turno
      const [horaInicio, horaFim] = turno === 'manhã' ? ['07:00', '12:00'] : ['13:00', '18:00']
      const dataHoraInicio = `${data}T${horaInicio}:00`
      const dataHoraFim = `${data}T${horaFim}:00`

      // 1. Verificar conflito de cirurgião
      const { data: conflitoCirurgiao, error: erroCirurgiao } = await supabaseAdmin
        .from('pedidos_cirurgia')
        .select('id, scheduled_date, status')
        .eq('surgeon_id', surgeon_id)
        .eq('status', '7_AGENDADO_CC') // Apenas agendamentos confirmados
        .gte('scheduled_date', dataHoraInicio)
        .lt('scheduled_date', dataHoraFim)

      if (erroCirurgiao) throw erroCirurgiao

      // 2. Verificar conflito de sala cirúrgica
      const { data: conflitoSala, error: erroSala } = await supabaseAdmin
        .from('pedidos_cirurgia')
        .select('id, scheduled_date, status, operating_room')
        .eq('operating_room', operating_room)
        .eq('status', '7_AGENDADO_CC')
        .gte('scheduled_date', dataHoraInicio)
        .lt('scheduled_date', dataHoraFim)

      if (erroSala) throw erroSala

      // 3. Verificar conflito de robô (robot_platform)
      const { data: conflitoRobo, error: erroRobo } = await supabaseAdmin
        .from('pedidos_cirurgia')
        .select('id, scheduled_date, status, robot_platform')
        .eq('robot_platform', 'da_vinci') // Assumindo plataforma padrão
        .eq('status', '7_AGENDADO_CC')
        .gte('scheduled_date', dataHoraInicio)
        .lt('scheduled_date', dataHoraFim)

      if (erroRobo) throw erroRobo

      // Determinar disponibilidade
      const temConflitoCircurgiao = conflitoCirurgiao && conflitoCirurgiao.length > 0
      const temConflitoSala = conflitoSala && conflitoSala.length > 0
      const temConflitoRobo = conflitoRobo && conflitoRobo.length > 0

      const disponivel = !temConflitoCircurgiao && !temConflitoSala && !temConflitoRobo

      let motivo = 'Disponível'
      if (temConflitoCircurgiao) motivo = 'Cirurgião indisponível neste horário'
      else if (temConflitoSala) motivo = 'Sala cirúrgica indisponível neste horário'
      else if (temConflitoRobo) motivo = 'Robô indisponível neste horário'

      disponibilidade.push({
        data,
        turno,
        disponivel,
        motivo,
        conflitos: {
          cirurgiao: temConflitoCircurgiao,
          sala: temConflitoSala,
          robo: temConflitoRobo,
        },
      })
    }

    return new Response(
      JSON.stringify({
        success: true,
        disponibilidade,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
