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
    listDashboard: async () => {
      // Retorna apenas os dados cruciais e não expõe o full_name do paciente (Privacy-First)
      return await supabase
        .from('pedidos_cirurgia')
        .select(`
          id,
          status,
          scheduled_date,
          created_at,
          patients ( medical_record ),
          procedures ( name ),
          profiles!pedidos_cirurgia_surgeon_id_fkey ( name )
        `)
        .order('created_at', { ascending: false })
    },
    get: async (id: string) => {
      return await supabase
        .from('pedidos_cirurgia')
        .select(`
          *,
          patients (*),
          procedures (*),
          profiles!pedidos_cirurgia_surgeon_id_fkey (name)
        `)
        .eq('id', id)
        .single()
    },
    create: async (data: PedidoInsert) => {
      return await supabase.from('pedidos_cirurgia').insert(data).select().single()
    },
    updateStatus: async (id: string, status: Database['public']['Enums']['surgery_status']) => {
      return await supabase.from('pedidos_cirurgia').update({ status }).eq('id', id)
    },
    getTimeline: async (id: string) => {
      return await supabase
        .from('audit_logs')
        .select('*')
        .eq('record_id', id)
        .order('created_at', { ascending: false })
    },
  },
  pacientes: {
    list: async () => await supabase.from('patients').select('*').order('full_name'),
    create: async (data: Tables['patients']['Insert']) =>
      await supabase.from('patients').insert(data).select().single(),
  },
  procedimentos: {
    list: async () => await supabase.from('procedures').select('*').order('name'),
    create: async (data: Tables['procedures']['Insert']) =>
      await supabase.from('procedures').insert(data).select().single(),
  },
  opme: {
    list: async () => await supabase.from('opme_items').select('*').order('name'),
  },
}
