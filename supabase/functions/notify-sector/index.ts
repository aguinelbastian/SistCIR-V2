import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const telegramBotToken = Deno.env.get('TELEGRAM_BOT_TOKEN')
const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const resendApiKey = Deno.env.get('RESEND_API_KEY')

const supabase = createClient(supabaseUrl!, supabaseServiceKey!)

serve(async (req) => {
  try {
    const payload = await req.json()
    console.log('1. Payload recebido:', JSON.stringify(payload))

    const record = payload.record
    if (!record || !record.status) {
      throw new Error('Payload inválido.')
    }

    const status = record.status
    let sectorName = ''

    // ==========================================
    // FLUXO 1: CANCELAMENTO (Broadcast Geral)
    // ==========================================
    if (
      status === 'canceled' ||
      status === 'canceled_by_hospital' ||
      status === 'canceled_by_surgeon'
    ) {
      console.log('Status CANCELED: Iniciando notificação em massa.')

      // A. E-mail para o Cirurgião
      const surgeonId = record.surgeon_id
      if (surgeonId) {
        const { data: userData } = await supabase.auth.admin.getUserById(surgeonId)
        if (userData?.user?.email) {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${resendApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'SistCIR Notificações <onboarding@resend.dev>',
              to: userData.user.email,
              subject: `❌ CANCELAMENTO de Cirurgia: Paciente ${record.patient_name}`,
              html: `
                <div style="font-family: sans-serif; color: #333;">
                  <h2 style="color: #d9534f;">Cirurgia Cancelada</h2>
                  <p>Doutor(a), informamos que a cirurgia abaixo foi <b>cancelada</b> no sistema.</p>
                  <hr />
                  <ul>
                    <li><b>Paciente:</b> ${record.patient_name}</li>
                    <li><b>Prontuário:</b> ${record.medical_record}</li>
                    <li><b>Status Atual:</b> Cancelada</li>
                  </ul>
                  <hr />
                  <p><small>Este é um e-mail automático do sistema SistCIR.</small></p>
                </div>
              `,
            }),
          })
          console.log('E-mail de cancelamento enviado.')
        }
      }

      // B. Telegram para TODOS os setores (Financeiro, OPME, Enfermagem)
      const { data: sectors } = await supabase.from('sectors').select('telegram_chat_id')
      if (sectors && sectors.length > 0) {
        const cancelMessage = `❌ <b>CIRURGIA CANCELADA</b>\n\n👤 <b>Paciente:</b> ${record.patient_name}\n📋 <b>Prontuário:</b> ${record.medical_record}\n\n⚠️ <b>Atenção:</b> Todos os procedimentos e separações de materiais para este paciente devem ser suspensos imediatamente.`

        // Dispara as mensagens em paralelo (Promise.all) para máxima performance
        await Promise.all(
          sectors.map((sector) => {
            if (sector.telegram_chat_id) {
              return fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  chat_id: sector.telegram_chat_id,
                  text: cancelMessage,
                  parse_mode: 'HTML',
                }),
              })
            }
          }),
        )
        console.log('Telegram de cancelamento enviado a todos os grupos.')
      }

      return new Response(JSON.stringify({ success: true, method: 'cancel_all' }), { status: 200 })
    }

    // ==========================================
    // FLUXO 2: CONFIRMAÇÃO FINAL (E-mail Cirurgião)
    // ==========================================
    if (status === 'nursing_confirmed') {
      console.log('Status nursing_confirmed: E-mail para o cirurgião.')
      const surgeonId = record.surgeon_id
      if (!surgeonId) throw new Error('surgeon_id ausente.')

      const { data: userData, error: userError } = await supabase.auth.admin.getUserById(surgeonId)
      if (userError || !userData.user) throw new Error('Erro ao buscar cirurgião.')

      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'SistCIR Notificações <onboarding@resend.dev>',
          to: userData.user.email,
          subject: `✅ Confirmação de Cirurgia Robótica: Paciente ${record.patient_name}`,
          html: `
            <div style="font-family: sans-serif; color: #333;">
              <h2>Sua cirurgia foi confirmada!</h2>
              <p>Doutor(a), o agendamento da cirurgia robótica passou por todas as etapas de validação e está <b>confirmado</b>.</p>
              <hr />
              <ul>
                <li><b>Paciente:</b> ${record.patient_name}</li>
                <li><b>Prontuário:</b> ${record.medical_record}</li>
                <li><b>Status Atual:</b> Agendamento Confirmado</li>
              </ul>
              <hr />
            </div>
          `,
        }),
      })

      if (!emailResponse.ok) throw new Error('Falha no Resend.')
      return new Response(JSON.stringify({ success: true, method: 'email' }), { status: 200 })
    }

    // ==========================================
    // FLUXO 3: ESTEIRA DE PRODUÇÃO (Telegram Setores)
    // ==========================================
    if (status === 'requested') sectorName = 'Financeiro'
    else if (status === 'budget_approved') sectorName = 'OPME'
    else if (status === 'materials_separated') sectorName = 'Enfermagem_Robotica'

    if (sectorName) {
      const { data: sector, error } = await supabase
        .from('sectors')
        .select('telegram_chat_id')
        .eq('name', sectorName)
        .single()
      if (error || !sector?.telegram_chat_id)
        throw new Error(`ID do Telegram ausente para ${sectorName}`)

      const message = `🔔 <b>Nova Atualização de Cirurgia</b>\n\n👤 <b>Paciente:</b> ${record.patient_name}\n📋 <b>Prontuário:</b> ${record.medical_record}\n🔄 <b>Novo Status:</b> ${status}\n\nPor favor, verifique o painel.`

      const telegramResponse = await fetch(
        `https://api.telegram.org/bot${telegramBotToken}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: sector.telegram_chat_id,
            text: message,
            parse_mode: 'HTML',
          }),
        },
      )

      if (!telegramResponse.ok) throw new Error('Falha no Telegram.')
      return new Response(JSON.stringify({ success: true, method: 'telegram' }), { status: 200 })
    }

    return new Response(JSON.stringify({ message: 'Status ignorado.' }), { status: 200 })
  } catch (error) {
    console.error('ERRO FATAL:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
