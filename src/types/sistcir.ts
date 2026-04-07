export type SurgeryStatus =
  | '1_RASCUNHO'
  | '2_AGUARDANDO_OPME'
  | '3_EM_AUDITORIA'
  | '4_PENDENCIA_TECNICA'
  | '5_AUTORIZADO'
  | '6_AGUARDANDO_MAPA'
  | '7_AGENDADO_CC'
  | '8_EM_EXECUCAO'
  | '9_REALIZADO'
  | '10_CANCELADO'

export type UserRole =
  | 'surgeon'
  | 'secretary'
  | 'opme'
  | 'billing'
  | 'nursing'
  | 'coordinator'
  | 'admin'
  | 'facility_manager'

export interface SurgicalRoom {
  id: string
  room_number: string
  room_name: string
  facility_id: string
  robotic_system_id?: string
  capacity_patients: number
  is_active: boolean
  notes?: string
  created_at: string
  updated_at: string
}

export interface Patient {
  id: string
  medical_record: string
  full_name: string
  cpf_hash: string
  insurance_provider?: string
  insurance_plan?: string
}

export interface PedidoCirurgia {
  id: string
  patient_id: string
  surgeon_id: string
  status: SurgeryStatus
  cid10_primary: string
  procedure_id: string
  created_at: string
  cancellation_reason?: string
  scheduled_date?: string
  operating_room?: string
  patients?: {
    medical_record: string
    full_name?: string
  }
  procedures?: {
    name: string
    tuss_code?: string
  }
  profiles?: {
    name: string | null
  }
}
