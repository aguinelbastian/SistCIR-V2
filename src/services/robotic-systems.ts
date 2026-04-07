import { supabase } from '@/lib/supabase/client'
import { RoboticSystem } from '@/types/sistcir'

export const getRoboticSystems = async () => {
  const { data, error } = await supabase
    .from('robotic_systems')
    .select(`
      *,
      facility:profiles!robotic_systems_facility_id_fkey(name)
    `)
    .order('created_at', { ascending: false })

  if (error) throw error

  // Transform name to system_name to support the typing difference
  return (data || []).map((row) => ({
    ...row,
    system_name: (row as any).system_name || (row as any).name,
  })) as RoboticSystem[]
}

export const getRoboticSystem = async (id: string) => {
  const { data, error } = await supabase.from('robotic_systems').select('*').eq('id', id).single()

  if (error) throw error
  return {
    ...data,
    system_name: (data as any).system_name || (data as any).name,
  } as RoboticSystem
}

export const createRoboticSystem = async (payload: Partial<RoboticSystem>) => {
  const dbPayload = {
    ...payload,
    name: payload.system_name, // Fallback if schema hasn't fully updated yet
  }

  const { data, error } = await supabase
    .from('robotic_systems')
    // @ts-expect-error - Ignoring until types are updated by the backend
    .insert(dbPayload)
    .select()
    .single()

  if (error) throw error
  return data
}

export const updateRoboticSystem = async (id: string, payload: Partial<RoboticSystem>) => {
  const dbPayload = {
    ...payload,
    name: payload.system_name,
  }

  const { data, error } = await supabase
    .from('robotic_systems')
    // @ts-expect-error
    .update(dbPayload)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export const deleteRoboticSystem = async (id: string) => {
  const { error } = await supabase.from('robotic_systems').delete().eq('id', id)

  if (error) throw error
}

export const getFacilities = async () => {
  const { data, error } = await supabase.from('profiles').select('id, name').order('name')

  if (error) throw error
  return data
}
