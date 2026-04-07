import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const googleOAuthClientId = Deno.env.get('GOOGLE_OAUTH_CLIENT_ID')!
const googleOAuthClientSecret = Deno.env.get('GOOGLE_OAUTH_CLIENT_SECRET')!

// IDs dos templates no Google Drive
const TEMPLATES = {
  TERMO_CONSENTIMENTO: '1UMliJeC16zUlDWD3Y7Tbk5H2AGU4-95LV-9GY7u_kE8',
  RELATORIO_CIRURGICO: '1eRwg_SLdOcFdwpceufUbKGY4do-ZFNjxIJ3Tkb3mthQ',
  PRESCRICAO: '1MognceYXzR2Sb8IAUQgpcJQxvkHkm_FDN9_CUXE-EFs',
}

interface GoogleDocsPayload {
  pedido_id: string
  status_novo: string
  surgeon_id: string
}

// Função para obter/renovar access token usando refresh token
async function getGoogleAccessToken(supabase: any, surgeon_id: string): Promise<string> {
  // Buscar token armazenado
  const { data: tokenData, error: tokenError } = await supabase
    .from('google_oauth_tokens')
    .select('access_token, refresh_token, expires_at')
    .eq('user_id', surgeon_id)
    .single()

  if (tokenError || !tokenData) {
    throw new Error(
      `Nenhum token OAuth encontrado para o cirurgião. Ele precisa autorizar o acesso ao Google Drive primeiro.`,
    )
  }

  // Verificar se token expirou
  const expiresAt = new Date(tokenData.expires_at)
  const now = new Date()

  if (now < expiresAt) {
    // Token ainda válido
    console.log('✅ Token OAuth válido')
    return tokenData.access_token
  }

  // Token expirou, renovar usando refresh token
  console.log('🔄 Renovando token OAuth...')

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: googleOAuthClientId,
      client_secret: googleOAuthClientSecret,
      refresh_token: tokenData.refresh_token,
      grant_type: 'refresh_token',
    }).toString(),
  })

  const data = await response.json()

  if (!data.access_token) {
    throw new Error(`Erro ao renovar token Google: ${data.error_description}`)
  }

  // Atualizar token no banco
  const newExpiresAt = new Date(Date.now() + data.expires_in * 1000)
  await supabase
    .from('google_oauth_tokens')
    .update({
      access_token: data.access_token,
      expires_at: newExpiresAt.toISOString(),
    })
    .eq('user_id', surgeon_id)

  console.log('✅ Token OAuth renovado')
  return data.access_token
}

// Função para copiar template e substituir placeholders
async function generateDocumentFromTemplate(
  templateId: string,
  placeholders: Record<string, string>,
  accessToken: string,
  docType: string,
): Promise<{ docId: string; docUrl: string }> {
  console.log(`📄 Gerando documento tipo: ${docType}`)

  // 1. Copiar template
  const copyResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${templateId}/copy`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: `${docType}_${placeholders.RECORD_NUMBER}_${new Date().getTime()}`,
    }),
  })

  if (!copyResponse.ok) {
    const errorData = await copyResponse.json()
    console.error('❌ Erro ao copiar template:', errorData)
    throw new Error(
      `Erro ao copiar template: ${errorData.error?.message || copyResponse.statusText}`,
    )
  }

  const copiedFile = await copyResponse.json()
  const newDocId = copiedFile.id

  console.log(`✅ Template copiado: ${newDocId}`)

  // 2. Substituir placeholders
  const requests = Object.entries(placeholders).map(([key, value]) => ({
    replaceAllText: {
      containsText: {
        text: `{{${key}}}`,
        matchCase: false,
      },
      replaceText: value,
    },
  }))

  const batchResponse = await fetch(
    `https://docs.googleapis.com/v1/documents/${newDocId}:batchUpdate`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ requests }),
    },
  )

  if (!batchResponse.ok) {
    const errorData = await batchResponse.json()
    console.error('❌ Erro ao substituir placeholders:', errorData)
    throw new Error(
      `Erro ao substituir placeholders: ${errorData.error?.message || batchResponse.statusText}`,
    )
  }

  console.log(`✅ Placeholders substituídos`)

  return {
    docId: newDocId,
    docUrl: `https://docs.google.com/document/d/${newDocId}/edit`,
  }
}

serve(async (req: Request) => {
  try {
    const payload: GoogleDocsPayload = await req.json()
    const { pedido_id, status_novo, surgeon_id } = payload

    console.log('📋 Payload recebido:', { pedido_id, status_novo, surgeon_id })

    // Validar se deve gerar documento
    if (!['5_AUTORIZADO', '9_REALIZADO'].includes(status_novo)) {
      console.log('⏭️ Status não requer geração de documento')
      return new Response(JSON.stringify({ message: 'Status não requer geração de documento' }), {
        status: 200,
      })
    }

    // Conectar ao Supabase
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Buscar dados do pedido
    const { data: pedido, error: pedidoError } = await supabase
      .from('pedidos_cirurgia')
      .select(
        `
        id,
        status,
        scheduled_date,
        surgeon_id,
        procedure_id,
        cid10_primary,
        procedures(name),
        profiles!surgeon_id(name, crm, email)
      `,
      )
      .eq('id', pedido_id)
      .single()

    if (pedidoError || !pedido) {
      throw new Error(`Pedido não encontrado: ${pedidoError?.message}`)
    }

    console.log('✅ Pedido encontrado:', pedido.id)

    // Preparar placeholders (Zero-PHI)
    const placeholders = {
      RECORD_NUMBER: pedido.id.substring(0, 8).toUpperCase(),
      SURGEON_CRM: pedido.profiles?.crm || 'N/A',
      SURGEON_NAME: pedido.profiles?.name || 'N/A',
      PROCEDURE: pedido.procedures?.name || 'N/A',
      CID10: pedido.cid10_primary || 'N/A',
      SCHEDULED_DATE: pedido.scheduled_date
        ? new Date(pedido.scheduled_date).toLocaleDateString('pt-BR')
        : 'N/A',
      STATUS: status_novo.replace(/_/g, ' '),
    }

    console.log('📝 Placeholders preparados:', placeholders)

    // Obter token de acesso do Google (usando OAuth)
    console.log('🔐 Obtendo token OAuth do cirurgião...')
    const accessToken = await getGoogleAccessToken(supabase, surgeon_id)

    // Determinar qual template usar e gerar documento(s)
    const docsGerados: Array<{
      docType: string
      docId: string
      docUrl: string
    }> = []

    if (status_novo === '5_AUTORIZADO') {
      const doc = await generateDocumentFromTemplate(
        TEMPLATES.TERMO_CONSENTIMENTO,
        placeholders,
        accessToken,
        'TERMO_CONSENTIMENTO',
      )
      docsGerados.push({
        docType: 'TERMO_CONSENTIMENTO',
        docId: doc.docId,
        docUrl: doc.docUrl,
      })
    } else if (status_novo === '9_REALIZADO') {
      // Gerar 2 documentos: Relatório + Prescrição
      const docRelatorio = await generateDocumentFromTemplate(
        TEMPLATES.RELATORIO_CIRURGICO,
        placeholders,
        accessToken,
        'RELATORIO_CIRURGICO',
      )
      docsGerados.push({
        docType: 'RELATORIO_CIRURGICO',
        docId: docRelatorio.docId,
        docUrl: docRelatorio.docUrl,
      })

      const docPrescricao = await generateDocumentFromTemplate(
        TEMPLATES.PRESCRICAO,
        placeholders,
        accessToken,
        'PRESCRICAO',
      )
      docsGerados.push({
        docType: 'PRESCRICAO',
        docId: docPrescricao.docId,
        docUrl: docPrescricao.docUrl,
      })
    }

    // Registrar documentos no banco
    const inserts = docsGerados.map((doc) => ({
      pedido_id,
      doc_id: doc.docId,
      doc_url: doc.docUrl,
      doc_type: doc.docType,
      generated_by: surgeon_id,
      shared_with_email: pedido.profiles?.email,
    }))

    const { error: insertError } = await supabase.from('pedidos_docs_exports').insert(inserts)

    if (insertError) {
      throw new Error(`Erro ao registrar documentos: ${insertError.message}`)
    }

    console.log(`✅ ${docsGerados.length} documento(s) registrado(s) no banco`)

    return new Response(
      JSON.stringify({
        message: 'Documento(s) gerado(s) com sucesso',
        pedido_id,
        docs: docsGerados,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    console.error('❌ Erro em generate-google-docs:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
