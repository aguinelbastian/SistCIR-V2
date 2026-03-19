import { supabase } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/types'

type Tables = Database['public']['Tables']
type PedidoInsert = Tables['pedidos_cirurgia']['Insert']

export const api = {
  pedidos: {
    list: async () => {
      return await supabase
        .from('pedidos_cirurgia')
        .select(`
          *,
          patients (full_name, medical_record),
          procedures (name, tuss_code),
          profiles!pedidos_cirurgia_surgeon_id_fkey (name)
        `)
        .order('created_at', { ascending: false })
    },
    listDashboard: async (filters?: { surgeonId?: string }) => {
      let query = supabase
        .from('pedidos_cirurgia')
        .select(`
          id,
          status,
          scheduled_date,
          created_at,
          surgeon_id,
          patients ( medical_record ),
          procedures ( name ),
          profiles!pedidos_cirurgia_surgeon_id_fkey ( name )
        `)
        .order('created_at', { ascending: false })

      if (filters?.surgeonId) {
        query = query.eq('surgeon_id', filters.surgeonId)
      }

      return await query
    },
    get: async (id: string) => {
      return await supabase
        .from('pedidos_cirurgia')
        .select(`
          *,
          patients (*),
          procedures (*),
          profiles!pedidos_cirurgia_surgeon_id_fkey (*)
        `)
        .eq('id', id)
        .single()
    },
    create: async (data: PedidoInsert) => {
      return await supabase.from('pedidos_cirurgia').insert(data).select().single()
    },
    updateStatus: async (
      id: string,
      statusFrom: string,
      statusTo: Database['public']['Enums']['surgery_status'],
      actionLabel: string,
    ) => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return { error: new Error('Não autenticado') }

      const updateRes = await supabase
        .from('pedidos_cirurgia')
        .update({ status: statusTo })
        .eq('id', id)
      if (updateRes.error) return updateRes

      await supabase.from('audit_log' as any).insert({
        pedido_id: id,
        changed_by: user.id,
        status_from: statusFrom,
        status_to: statusTo,
        action: actionLabel,
      })

      return updateRes
    },
    cancel: async (id: string, statusFrom: string, reason: string) => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return { error: new Error('Não autenticado') }

      const updateRes = await supabase
        .from('pedidos_cirurgia')
        .update({
          status: '10_CANCELADO',
          cancellation_reason: reason,
          cancellation_actor_id: user.id,
        })
        .eq('id', id)
      if (updateRes.error) return updateRes

      await supabase.from('audit_log' as any).insert({
        pedido_id: id,
        changed_by: user.id,
        status_from: statusFrom,
        status_to: '10_CANCELADO',
        action: 'Cancelar',
        notes: reason,
      })

      return updateRes
    },
    getTimeline: async (id: string) => {
      return await supabase
        .from('audit_log' as any)
        .select(`
          id,
          changed_at,
          action,
          notes,
          profiles ( name )
        `)
        .eq('pedido_id', id)
        .order('changed_at', { ascending: true })
    },
  },
  pacientes: {
    list: async () =>
      await supabase.from('patients').select('*').order('medical_record', { ascending: true }),
    create: async (data: Tables['patients']['Insert']) =>
      await supabase.from('patients').insert(data).select().single(),
  },
  procedimentos: {
    list: async () =>
      await supabase.from('procedures').select('*').order('name', { ascending: true }),
    create: async (data: Tables['procedures']['Insert']) =>
      await supabase.from('procedures').insert(data).select().single(),
  },
  opme: {
    list: async () => await supabase.from('opme_items').select('*').order('name'),
  },
  opmeCatalog: {
    list: async () => await supabase.from('opme_items').select('*').order('description'),
    listActive: async () =>
      await supabase.from('opme_items').select('*').eq('is_active', true).order('description'),
    create: async (data: any) => await supabase.from('opme_items').insert(data).select().single(),
    update: async (id: string, data: any) =>
      await supabase.from('opme_items').update(data).eq('id', id).select().single(),
  },
  pedidoOpme: {
    list: async (pedidoId: string) =>
      await supabase
        .from('pedido_opme_items')
        .select('*, opme_items(code, description, manufacturer), profiles(name)')
        .eq('pedido_id', pedidoId)
        .order('created_at', { ascending: true }),
    add: async (data: any) =>
      await supabase.from('pedido_opme_items').insert(data).select().single(),
    update: async (id: string, data: any) =>
      await supabase.from('pedido_opme_items').update(data).eq('id', id).select().single(),
    remove: async (id: string) => await supabase.from('pedido_opme_items').delete().eq('id', id),
  },
  profiles: {
    listActive: async () =>
      await supabase
        .from('profiles')
        .select('id, name, crm')
        .eq('is_active', true)
        .order('name', { ascending: true }),
  },
}
