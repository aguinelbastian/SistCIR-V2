import { Database } from './supabase/types'

export type SurgeryStatus = Database['public']['Enums']['surgery_status']

export const STATUS_MAP: Record<SurgeryStatus, { label: string; color: string }> = {
  '1_RASCUNHO': { label: 'Rascunho', color: 'bg-slate-100 text-slate-700 border-slate-200' },
  '2_AGUARDANDO_OPME': {
    label: 'Aguardando OPME',
    color: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  '3_EM_AUDITORIA': {
    label: 'Em Auditoria',
    color: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  '4_PENDENCIA_TECNICA': {
    label: 'Pendência Técnica',
    color: 'bg-rose-100 text-rose-700 border-rose-200',
  },
  '5_AUTORIZADO': {
    label: 'Autorizado',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  },
  '6_AGUARDANDO_MAPA': {
    label: 'Aguardando Mapa',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  '7_AGENDADO_CC': { label: 'Agendado CC', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  '8_EM_EXECUCAO': {
    label: 'Em Execução',
    color: 'bg-purple-100 text-purple-700 border-purple-200',
  },
  '9_REALIZADO': {
    label: 'Realizado',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  },
  '10_CANCELADO': { label: 'Cancelado', color: 'bg-red-100 text-red-700 border-red-200' },
}

export const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrador',
  surgeon: 'Cirurgião',
  secretary: 'Secretária',
  opme: 'Setor OPME',
  billing: 'Faturamento',
  nursing: 'Enfermagem',
  coordinator: 'Coordenador',
}
