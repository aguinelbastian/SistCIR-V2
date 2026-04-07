import { supabase } from '@/lib/supabase/client'
import { RoboticSystem } from '@/types/sistcir'

export async function getRoboticSystems() {
  const { data, error } = await supabase.from('robotic_systems').select('*').order('system_name')

  if (error) throw error
  return data as RoboticSystem[]
}

export async function getRoboticSystemById(id: string) {
  const { data, error } = await supabase.from('robotic_systems').select('*').eq('id', id).single()

  if (error) throw error
  return data as RoboticSystem
}

export async function createRoboticSystem(system: Partial<RoboticSystem>) {
  const { data, error } = await supabase.from('robotic_systems').insert([system]).select().single()

  if (error) throw error
  return data
}

export async function updateRoboticSystem(id: string, system: Partial<RoboticSystem>) {
  const { data, error } = await supabase
    .from('robotic_systems')
    .update(system)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteRoboticSystem(id: string) {
  const { error } = await supabase.from('robotic_systems').delete().eq('id', id)

  if (error) throw error
  return true
}

export async function getFacilities() {
  // Stub for backwards compatibility if needed, but not used anymore for facility dropdown
  return []
}
