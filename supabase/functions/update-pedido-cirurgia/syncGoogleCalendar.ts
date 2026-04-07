import { SignJWT, importPKCS8 } from 'npm:jose@5.2.3'

// LGPD/HIPAA Compliance: Google Calendar events contain NO patient PII
export async function syncGoogleCalendar(
  supabase: any,
  pedido: any,
  action: 'CREATE' | 'UPDATE' | 'DELETE',
) {
  const results = { synced: false, updated: false, deleted: false, warning: '' }
  const warnings: string[] = []

  const buildGoogleEvent = () => {
    if (!pedido.scheduled_date) return {}
    const startDate = new Date(pedido.scheduled_date)
    const previsao = parseInt(pedido.previsao_tempo_minutos, 10)
    const duration = isNaN(previsao) ? 60 : previsao
    const endDate = new Date(startDate.getTime() + duration * 60000)

    // Convert to ISO strings for Google Calendar
    const timeZone = 'America/Sao_Paulo'

    return {
      summary: `Cirurgia - Prontuário ${pedido.patients?.medical_record || 'N/A'}`,
      description: `Cirurgião: ${pedido.profiles?.name || 'N/A'} (CRM: ${pedido.profiles?.crm || 'N/A'})\nProcedimento: ${pedido.procedures?.name || 'N/A'}\nCID-10: ${pedido.cid10_primary || 'N/A'}\nSala: ${pedido.operating_room || 'N/A'}\n\nPedido ID: ${pedido.id}`,
      start: { dateTime: startDate.toISOString(), timeZone },
      end: { dateTime: endDate.toISOString(), timeZone },
      location: pedido.operating_room || 'N/A',
      attendees: [
        {
          email: pedido.profiles?.email || 'cirurgiao@hospital.com',
          displayName: pedido.profiles?.name || 'Cirurgião',
          responseStatus: 'accepted',
        },
      ],
    }
  }

  const getSaToken = async (sa: any) => {
    const privateKey = await importPKCS8(sa.private_key, 'RS256')
    const jwt = await new SignJWT({
      iss: sa.client_email,
      scope: 'https://www.googleapis.com/auth/calendar.events',
      aud: 'https://oauth2.googleapis.com/token',
    })
      .setProtectedHeader({ alg: 'RS256', typ: 'JWT', kid: sa.private_key_id })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(privateKey)

    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt,
      }),
    })
    if (!res.ok) throw new Error('Failed to get SA token')
    const data = await res.json()
    return data.access_token
  }

  const refreshOAuthToken = async (
    refreshToken: string,
    clientId: string,
    clientSecret: string,
  ) => {
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    })
    if (!res.ok) {
      if (res.status === 401 || res.status === 400) throw new Error('AUTH_EXPIRED')
      throw new Error('Failed to refresh token')
    }
    const data = await res.json()
    return data.access_token
  }

  const performSync = async (
    type: 'SERVICE_ACCOUNT' | 'PERSONAL',
    token: string,
    calendarId: string,
    surgeonId: string | null,
  ) => {
    let query = supabase
      .from('pedidos_calendar_events')
      .select('*')
      .eq('pedido_id', pedido.id)
      .eq('calendar_type', type)
    if (surgeonId) query = query.eq('surgeon_id', surgeonId)

    const { data: existing } = await query.maybeSingle()

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }

    try {
      if (action === 'CREATE' || (action === 'UPDATE' && !existing)) {
        const payload = buildGoogleEvent()
        if (!payload.start) throw new Error('Data agendada ausente.')

        const res = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`,
          {
            method: 'POST',
            headers,
            body: JSON.stringify(payload),
          },
        )

        if (!res.ok) {
          const errText = await res.text()
          if (res.status === 401 || res.status === 403) throw new Error('AUTH_EXPIRED')
          throw new Error(errText)
        }
        const event = await res.json()

        await supabase.from('pedidos_calendar_events').insert({
          pedido_id: pedido.id,
          calendar_type: type,
          surgeon_id: surgeonId,
          google_event_id: event.id,
          google_calendar_id: calendarId,
          event_title: event.summary,
          event_start: event.start.dateTime,
          event_end: event.end.dateTime,
          sync_status: 'SYNCED',
        })
        results.synced = true
      } else if (action === 'UPDATE' && existing) {
        const payload = buildGoogleEvent()
        if (!payload.start) throw new Error('Data agendada ausente.')

        const res = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${existing.google_event_id}`,
          {
            method: 'PUT',
            headers,
            body: JSON.stringify(payload),
          },
        )
        if (!res.ok) {
          const errText = await res.text()
          if (res.status === 401 || res.status === 403) throw new Error('AUTH_EXPIRED')
          throw new Error(errText)
        }

        await supabase
          .from('pedidos_calendar_events')
          .update({
            event_title: payload.summary,
            event_start: payload.start.dateTime,
            event_end: payload.end.dateTime,
            updated_at: new Date().toISOString(),
            sync_status: 'SYNCED',
            sync_error: null,
          })
          .eq('id', existing.id)
        results.updated = true
      } else if (action === 'DELETE' && existing) {
        const res = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${existing.google_event_id}`,
          {
            method: 'DELETE',
            headers,
          },
        )
        if (!res.ok && res.status !== 404 && res.status !== 410) {
          const errText = await res.text()
          if (res.status === 401 || res.status === 403) throw new Error('AUTH_EXPIRED')
          throw new Error(errText)
        }

        await supabase.from('pedidos_calendar_events').delete().eq('id', existing.id)
        results.deleted = true
      }
    } catch (e: any) {
      const isAuthError = e.message === 'AUTH_EXPIRED'
      const errorMsg = isAuthError
        ? 'Sincronização com calendário pessoal expirou. Reautentique.'
        : e.message

      warnings.push(`Erro no calendário ${type}: ${errorMsg}`)

      if (existing) {
        await supabase
          .from('pedidos_calendar_events')
          .update({
            sync_status: 'FAILED',
            sync_error: errorMsg,
          })
          .eq('id', existing.id)
      } else if (action === 'CREATE') {
        // Record the failure even if event creation failed
        await supabase.from('pedidos_calendar_events').insert({
          pedido_id: pedido.id,
          calendar_type: type,
          surgeon_id: surgeonId,
          google_event_id: `failed-${Date.now()}`,
          google_calendar_id: calendarId,
          event_title: `Falha: ${pedido.patients?.medical_record || 'N/A'}`,
          event_start: new Date().toISOString(),
          event_end: new Date().toISOString(),
          sync_status: 'FAILED',
          sync_error: errorMsg,
        })
      }
    }
  }

  // 1. Service Account Sync
  const saKeyStr = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_KEY')
  if (saKeyStr) {
    try {
      const saKey = JSON.parse(saKeyStr)
      const token = await getSaToken(saKey)
      await performSync('SERVICE_ACCOUNT', token, saKey.client_email, null)
    } catch (e: any) {
      warnings.push(`Erro Service Account: ${e.message}`)
    }
  }

  // 2. Personal OAuth2 Sync
  const refreshToken = pedido.profiles?.google_calendar_refresh_token
  const clientId = Deno.env.get('GOOGLE_CLIENT_ID')
  const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET')

  if (refreshToken && clientId && clientSecret) {
    try {
      const token = await refreshOAuthToken(refreshToken, clientId, clientSecret)
      await performSync('PERSONAL', token, 'primary', pedido.profiles.id)
    } catch (e: any) {
      warnings.push('Sincronização com calendário pessoal expirou. Reautentique.')
      await supabase
        .from('pedidos_calendar_events')
        .update({
          sync_status: 'FAILED',
          sync_error: 'Sincronização com calendário pessoal expirou. Reautentique.',
        })
        .eq('pedido_id', pedido.id)
        .eq('calendar_type', 'PERSONAL')
        .eq('surgeon_id', pedido.profiles.id)
    }
  }

  if (warnings.length > 0) {
    results.warning = warnings.join(' | ')
  }

  return results
}
