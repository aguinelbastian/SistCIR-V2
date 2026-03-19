import { SurgeryStatus } from '@/types/sistcir'

export const STATUS_MAP: Record<SurgeryStatus, { label: string; color: string }> = {
  '1_RASCUNHO': { label: 'Rascunho', color: 'bg-slate-100 text-slate-700 border-slate-200' },
  '2_AGUARDANDO_OPME': {
    label: 'Aguardando OPME',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  },
  '3_EM_AUDITORIA': {
    label: 'Em Auditoria',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
  },
  '4_PENDENCIA_TECNICA': {
    label: 'Pendência Técnica',
    color: 'bg-red-100 text-red-800 border-red-200',
  },
  '5_AUTORIZADO': {
    label: 'Autorizado',
    color: 'bg-lime-100 text-lime-800 border-lime-200',
  },
  '6_AGUARDANDO_MAPA': {
    label: 'Aguardando Mapa',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  '7_AGENDADO_CC': {
    label: 'Agendado CC',
    color: 'bg-green-100 text-green-800 border-green-200',
  },
  '8_EM_EXECUCAO': {
    label: 'Em Execução',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  '9_REALIZADO': {
    label: 'Realizado',
    color: 'bg-emerald-800 text-white border-emerald-900',
  },
  '10_CANCELADO': {
    label: 'Cancelado',
    color: 'bg-red-800 text-white border-red-900',
  },
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
