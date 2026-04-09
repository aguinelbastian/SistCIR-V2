import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const resendApiKey = Deno.env.get('RESEND_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(supabaseUrl!, supabaseServiceKey!)

    // Validação de Segurança (Quem está pedindo?)
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('Token de autorização ausente.')

    const token = authHeader.replace('Bearer ', '')
    const {
      data: { user: requestingUser },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token)

    if (authError || !requestingUser) {
      throw new Error('Não autorizado. Token inválido.')
    }

    // Recebe os dados do frontend
    const { targetUserId, newEmail, newPassword, isActive, role, photoUrl } = await req.json()

    if (!targetUserId) {
      throw new Error('ID do usuário alvo é obrigatório.')
    }

    // 1. Monta o objeto de atualização de credenciais (auth.users)
    const updateAuthData: any = {}
    if (newEmail) {
      updateAuthData.email = newEmail
      updateAuthData.email_confirm = true
    }
    if (newPassword) {
      updateAuthData.password = newPassword
    }

    if (role) {
      const { data: existingUser } = await supabaseAdmin.auth.admin.getUserById(targetUserId)
      updateAuthData.user_metadata = {
        ...(existingUser?.user?.user_metadata || {}),
        user_role: role,
      }
    }

    // Executa a atualização de credenciais (se houver)
    let updatedUserEmail = ''
    if (Object.keys(updateAuthData).length > 0) {
      const { data: updatedAuth, error: updateError } =
        await supabaseAdmin.auth.admin.updateUserById(targetUserId, updateAuthData)
      if (updateError) throw updateError
      updatedUserEmail = updatedAuth.user.email
    } else {
      // Se não atualizou credenciais, busca o email atual para o caso de envio de notificação
      const { data: userData } = await supabaseAdmin.auth.admin.getUserById(targetUserId)
      updatedUserEmail = userData?.user?.email || ''
    }

    // Atualiza a tabela user_roles se o papel mudou
    if (role) {
      const { error: roleErr } = await supabaseAdmin
        .from('user_roles')
        .upsert({ user_id: targetUserId, role }, { onConflict: 'user_id' })
      if (roleErr) throw roleErr
    }

    // Atualiza a foto do perfil se necessário
    if (photoUrl) {
      const { error: profileErr } = await supabaseAdmin
        .from('profiles')
        .update({ photo_url: photoUrl })
        .eq('id', targetUserId)
      if (profileErr) throw profileErr
    }

    // 2. Disparo de E-mail de Ativação (Onboarding)
    if (isActive === true && updatedUserEmail) {
      console.log(`Iniciando envio de e-mail de ativação para: ${updatedUserEmail}`)

      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'SistCIR Notificações <onboarding@resend.dev>',
          to: updatedUserEmail,
          subject: `✅ Credenciamento Aprovado - Serviço de Cirurgia Robótica SOS Cárdio`,
          html: `
            <div style="font-family: sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2c3e50;">Bem-vindo ao Serviço de Cirurgia Robótica</h2>
              <p>Prezado(a) Doutor(a),</p>
              <p>É com grande satisfação que informamos que o seu credenciamento junto ao <b>Serviço de Cirurgia Robótica do Hospital SOS Cárdio</b> foi aprovado pela Comissão de Credenciamento.</p>
              <p>Seu acesso ao sistema <b>SistCIR</b> acaba de ser ativado pelo Coordenador do Serviço, Dr. Aguinel José Bastian Júnior.</p>
              <p>A partir deste momento, você já pode acessar a plataforma para realizar o agendamento e o acompanhamento de suas cirurgias robóticas.</p>
              <hr style="border: 1px solid #eee; margin: 20px 0;" />
              <p>Estamos à disposição para auxiliá-lo(a) no que for necessário para garantir a excelência e a segurança dos seus procedimentos.</p>
              <p>Atenciosamente,</p>
              <p><b>Coordenação do Serviço de Cirurgia Robótica</b><br/>Hospital SOS Cárdio</p>
            </div>
          `,
        }),
      })

      if (!emailResponse.ok) {
        const errText = await emailResponse.text()
        throw new Error(`Falha ao enviar e-mail de ativação: ${errText}`)
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error: any) {
    console.error('Erro na Edge Function:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
