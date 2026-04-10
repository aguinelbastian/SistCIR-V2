// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.4'
  }
  public: {
    Tables: {
      agendamento_propostas: {
        Row: {
          criado_em: string | null
          data_proposta: string
          id: string
          numero_proposta: number
          pedido_id: string
          turno: string
        }
        Insert: {
          criado_em?: string | null
          data_proposta: string
          id?: string
          numero_proposta: number
          pedido_id: string
          turno: string
        }
        Update: {
          criado_em?: string | null
          data_proposta?: string
          id?: string
          numero_proposta?: number
          pedido_id?: string
          turno?: string
        }
        Relationships: [
          {
            foreignKeyName: 'agendamento_propostas_pedido_id_fkey'
            columns: ['pedido_id']
            isOneToOne: false
            referencedRelation: 'mv_kpi_cirurgias'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'agendamento_propostas_pedido_id_fkey'
            columns: ['pedido_id']
            isOneToOne: false
            referencedRelation: 'pedidos_cirurgia'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'agendamento_propostas_pedido_id_fkey'
            columns: ['pedido_id']
            isOneToOne: false
            referencedRelation: 'v_pedidos_pendentes_sla'
            referencedColumns: ['id']
          },
        ]
      }
      audit_log: {
        Row: {
          action: string
          action_context: string | null
          action_type: Database['public']['Enums']['audit_action_type'] | null
          changed_at: string
          changed_by: string
          hash_algorithm: string | null
          id: string
          notes: string | null
          pedido_id: string
          previous_hash: string | null
          record_hash: string | null
          status_from: string | null
          status_to: string
        }
        Insert: {
          action: string
          action_context?: string | null
          action_type?: Database['public']['Enums']['audit_action_type'] | null
          changed_at?: string
          changed_by: string
          hash_algorithm?: string | null
          id?: string
          notes?: string | null
          pedido_id: string
          previous_hash?: string | null
          record_hash?: string | null
          status_from?: string | null
          status_to: string
        }
        Update: {
          action?: string
          action_context?: string | null
          action_type?: Database['public']['Enums']['audit_action_type'] | null
          changed_at?: string
          changed_by?: string
          hash_algorithm?: string | null
          id?: string
          notes?: string | null
          pedido_id?: string
          previous_hash?: string | null
          record_hash?: string | null
          status_from?: string | null
          status_to?: string
        }
        Relationships: [
          {
            foreignKeyName: 'audit_log_changed_by_fkey'
            columns: ['changed_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'audit_log_pedido_id_fkey'
            columns: ['pedido_id']
            isOneToOne: false
            referencedRelation: 'mv_kpi_cirurgias'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'audit_log_pedido_id_fkey'
            columns: ['pedido_id']
            isOneToOne: false
            referencedRelation: 'pedidos_cirurgia'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'audit_log_pedido_id_fkey'
            columns: ['pedido_id']
            isOneToOne: false
            referencedRelation: 'v_pedidos_pendentes_sla'
            referencedColumns: ['id']
          },
        ]
      }
      audit_logs: {
        Row: {
          actor_id: string | null
          actor_ip: string | null
          actor_role: string | null
          created_at: string | null
          event_type: string
          id: string
          mfa_used: boolean | null
          new_value: Json | null
          old_value: Json | null
          previous_hash: string | null
          record_hash: string | null
          record_id: string | null
          table_name: string
        }
        Insert: {
          actor_id?: string | null
          actor_ip?: string | null
          actor_role?: string | null
          created_at?: string | null
          event_type: string
          id?: string
          mfa_used?: boolean | null
          new_value?: Json | null
          old_value?: Json | null
          previous_hash?: string | null
          record_hash?: string | null
          record_id?: string | null
          table_name: string
        }
        Update: {
          actor_id?: string | null
          actor_ip?: string | null
          actor_role?: string | null
          created_at?: string | null
          event_type?: string
          id?: string
          mfa_used?: boolean | null
          new_value?: Json | null
          old_value?: Json | null
          previous_hash?: string | null
          record_hash?: string | null
          record_id?: string | null
          table_name?: string
        }
        Relationships: []
      }
      diagnosticos_cid10: {
        Row: {
          ativo: boolean | null
          codigo_cid10: string
          criado_em: string | null
          descricao: string
          especialidade: string | null
          id: string
        }
        Insert: {
          ativo?: boolean | null
          codigo_cid10: string
          criado_em?: string | null
          descricao: string
          especialidade?: string | null
          id?: string
        }
        Update: {
          ativo?: boolean | null
          codigo_cid10?: string
          criado_em?: string | null
          descricao?: string
          especialidade?: string | null
          id?: string
        }
        Relationships: []
      }
      google_oauth_tokens: {
        Row: {
          access_token: string
          created_at: string | null
          expires_at: string
          id: string
          refresh_token: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token: string
          created_at?: string | null
          expires_at: string
          id?: string
          refresh_token?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token?: string
          created_at?: string | null
          expires_at?: string
          id?: string
          refresh_token?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'google_oauth_tokens_user_id_fkey'
            columns: ['user_id']
            isOneToOne: true
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      hospital_users: {
        Row: {
          created_at: string | null
          hospital_id: string
          id: string
          is_active: boolean | null
          role: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          hospital_id: string
          id?: string
          is_active?: boolean | null
          role: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          hospital_id?: string
          id?: string
          is_active?: boolean | null
          role?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'hospital_users_hospital_id_fkey'
            columns: ['hospital_id']
            isOneToOne: false
            referencedRelation: 'hospitals'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'hospital_users_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      hospitals: {
        Row: {
          address: string | null
          city: string | null
          cnpj: string | null
          country: string | null
          created_at: string | null
          hospital_name: string
          id: string
          is_active: boolean | null
          state: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          cnpj?: string | null
          country?: string | null
          created_at?: string | null
          hospital_name: string
          id?: string
          is_active?: boolean | null
          state?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          cnpj?: string | null
          country?: string | null
          created_at?: string | null
          hospital_name?: string
          id?: string
          is_active?: boolean | null
          state?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      opme_items: {
        Row: {
          code: string
          created_at: string
          current_lives: number | null
          description: string
          id: string
          is_active: boolean
          is_available: boolean | null
          item_type: string
          lot_number: string | null
          manufacturer: string
          max_lives: number | null
          name: string
          serial_number: string | null
          tuss_code: string
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string
          current_lives?: number | null
          description: string
          id?: string
          is_active?: boolean
          is_available?: boolean | null
          item_type: string
          lot_number?: string | null
          manufacturer: string
          max_lives?: number | null
          name: string
          serial_number?: string | null
          tuss_code: string
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          current_lives?: number | null
          description?: string
          id?: string
          is_active?: boolean
          is_available?: boolean | null
          item_type?: string
          lot_number?: string | null
          manufacturer?: string
          max_lives?: number | null
          name?: string
          serial_number?: string | null
          tuss_code?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      pacotes_opme: {
        Row: {
          ativo: boolean | null
          criado_em: string | null
          descricao: string | null
          id: string
          nome: string
        }
        Insert: {
          ativo?: boolean | null
          criado_em?: string | null
          descricao?: string | null
          id?: string
          nome: string
        }
        Update: {
          ativo?: boolean | null
          criado_em?: string | null
          descricao?: string | null
          id?: string
          nome?: string
        }
        Relationships: []
      }
      pacotes_opme_itens: {
        Row: {
          criado_em: string | null
          descricao: string
          fabricante: string | null
          fornecedor: string | null
          id: string
          pacote_id: string
          quantidade: number
        }
        Insert: {
          criado_em?: string | null
          descricao: string
          fabricante?: string | null
          fornecedor?: string | null
          id?: string
          pacote_id: string
          quantidade?: number
        }
        Update: {
          criado_em?: string | null
          descricao?: string
          fabricante?: string | null
          fornecedor?: string | null
          id?: string
          pacote_id?: string
          quantidade?: number
        }
        Relationships: [
          {
            foreignKeyName: 'pacotes_opme_itens_pacote_id_fkey'
            columns: ['pacote_id']
            isOneToOne: false
            referencedRelation: 'pacotes_opme'
            referencedColumns: ['id']
          },
        ]
      }
      patients: {
        Row: {
          cns: string | null
          cpf_hash: string
          created_at: string | null
          created_by: string | null
          date_of_birth: string | null
          endereco: string | null
          full_name: string
          id: string
          insurance_card_number: string | null
          insurance_plan: string | null
          insurance_provider: string | null
          medical_record: string | null
          pessoa_contato: string | null
          profissao: string | null
          telefone: string | null
          telefone_contato: string | null
          updated_at: string | null
        }
        Insert: {
          cns?: string | null
          cpf_hash: string
          created_at?: string | null
          created_by?: string | null
          date_of_birth?: string | null
          endereco?: string | null
          full_name: string
          id?: string
          insurance_card_number?: string | null
          insurance_plan?: string | null
          insurance_provider?: string | null
          medical_record?: string | null
          pessoa_contato?: string | null
          profissao?: string | null
          telefone?: string | null
          telefone_contato?: string | null
          updated_at?: string | null
        }
        Update: {
          cns?: string | null
          cpf_hash?: string
          created_at?: string | null
          created_by?: string | null
          date_of_birth?: string | null
          endereco?: string | null
          full_name?: string
          id?: string
          insurance_card_number?: string | null
          insurance_plan?: string | null
          insurance_provider?: string | null
          medical_record?: string | null
          pessoa_contato?: string | null
          profissao?: string | null
          telefone?: string | null
          telefone_contato?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      pedido_opme_items: {
        Row: {
          added_by: string
          authorization_code: string | null
          authorized_at: string | null
          created_at: string
          id: string
          lives_consumed: number | null
          lot_used: string | null
          notes: string | null
          opme_item_id: string
          pedido_id: string
          quantity: number
        }
        Insert: {
          added_by: string
          authorization_code?: string | null
          authorized_at?: string | null
          created_at?: string
          id?: string
          lives_consumed?: number | null
          lot_used?: string | null
          notes?: string | null
          opme_item_id: string
          pedido_id: string
          quantity?: number
        }
        Update: {
          added_by?: string
          authorization_code?: string | null
          authorized_at?: string | null
          created_at?: string
          id?: string
          lives_consumed?: number | null
          lot_used?: string | null
          notes?: string | null
          opme_item_id?: string
          pedido_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: 'pedido_opme_items_added_by_fkey'
            columns: ['added_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'pedido_opme_items_opme_item_id_fkey'
            columns: ['opme_item_id']
            isOneToOne: false
            referencedRelation: 'opme_items'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'pedido_opme_items_pedido_id_fkey'
            columns: ['pedido_id']
            isOneToOne: false
            referencedRelation: 'mv_kpi_cirurgias'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'pedido_opme_items_pedido_id_fkey'
            columns: ['pedido_id']
            isOneToOne: false
            referencedRelation: 'pedidos_cirurgia'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'pedido_opme_items_pedido_id_fkey'
            columns: ['pedido_id']
            isOneToOne: false
            referencedRelation: 'v_pedidos_pendentes_sla'
            referencedColumns: ['id']
          },
        ]
      }
      pedidos_calendar_events: {
        Row: {
          calendar_type: string
          created_at: string | null
          event_description: string | null
          event_end: string
          event_start: string
          event_title: string
          google_calendar_id: string
          google_event_id: string
          id: string
          pedido_id: string
          surgeon_id: string | null
          sync_error: string | null
          sync_status: string | null
          updated_at: string | null
        }
        Insert: {
          calendar_type: string
          created_at?: string | null
          event_description?: string | null
          event_end: string
          event_start: string
          event_title: string
          google_calendar_id: string
          google_event_id: string
          id?: string
          pedido_id: string
          surgeon_id?: string | null
          sync_error?: string | null
          sync_status?: string | null
          updated_at?: string | null
        }
        Update: {
          calendar_type?: string
          created_at?: string | null
          event_description?: string | null
          event_end?: string
          event_start?: string
          event_title?: string
          google_calendar_id?: string
          google_event_id?: string
          id?: string
          pedido_id?: string
          surgeon_id?: string | null
          sync_error?: string | null
          sync_status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'pedidos_calendar_events_pedido_id_fkey'
            columns: ['pedido_id']
            isOneToOne: false
            referencedRelation: 'mv_kpi_cirurgias'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'pedidos_calendar_events_pedido_id_fkey'
            columns: ['pedido_id']
            isOneToOne: false
            referencedRelation: 'pedidos_cirurgia'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'pedidos_calendar_events_pedido_id_fkey'
            columns: ['pedido_id']
            isOneToOne: false
            referencedRelation: 'v_pedidos_pendentes_sla'
            referencedColumns: ['id']
          },
        ]
      }
      pedidos_cirurgia: {
        Row: {
          adjuvant_procedures: Json | null
          alergias_descricao: string | null
          alergias_paciente: boolean | null
          anesthesiologist_name: string | null
          anexo_guia_tipo: string | null
          anexo_guia_url: string | null
          asa_classification: string | null
          assistant_surgeons: Json | null
          authorization_date: string | null
          authorization_number: string | null
          cancellation_actor_id: string | null
          cancellation_reason: string | null
          cid10_primary: string
          cid10_secondary: string[] | null
          clinical_indication: string
          clinical_summary: string | null
          consent_form_path: string | null
          created_at: string | null
          diagnostico_cid10_id: string | null
          estimated_room_time_min: number | null
          exam_reports_paths: string[] | null
          google_calendar_event_id: string | null
          google_drive_doc_id: string | null
          guide_type: string | null
          id: string
          insurance_provider_code: string | null
          laterality: string | null
          needs_blood_products: boolean | null
          needs_frozen_section: boolean | null
          needs_icu: boolean | null
          operating_room: string | null
          pacote_opme_id: string | null
          patient_id: string
          previsao_tempo_minutos: number | null
          procedure_id: string
          proctor_crm: string | null
          proctor_id: string | null
          reserva_uti: boolean | null
          robot_platform: string | null
          scheduled_date: string | null
          secretary_id: string | null
          status: Database['public']['Enums']['surgery_status'] | null
          surgeon_id: string
          surgical_technique: string | null
          tempo_internacao_dias: number | null
          tiss_xml_path: string | null
          updated_at: string | null
        }
        Insert: {
          adjuvant_procedures?: Json | null
          alergias_descricao?: string | null
          alergias_paciente?: boolean | null
          anesthesiologist_name?: string | null
          anexo_guia_tipo?: string | null
          anexo_guia_url?: string | null
          asa_classification?: string | null
          assistant_surgeons?: Json | null
          authorization_date?: string | null
          authorization_number?: string | null
          cancellation_actor_id?: string | null
          cancellation_reason?: string | null
          cid10_primary: string
          cid10_secondary?: string[] | null
          clinical_indication: string
          clinical_summary?: string | null
          consent_form_path?: string | null
          created_at?: string | null
          diagnostico_cid10_id?: string | null
          estimated_room_time_min?: number | null
          exam_reports_paths?: string[] | null
          google_calendar_event_id?: string | null
          google_drive_doc_id?: string | null
          guide_type?: string | null
          id?: string
          insurance_provider_code?: string | null
          laterality?: string | null
          needs_blood_products?: boolean | null
          needs_frozen_section?: boolean | null
          needs_icu?: boolean | null
          operating_room?: string | null
          pacote_opme_id?: string | null
          patient_id: string
          previsao_tempo_minutos?: number | null
          procedure_id: string
          proctor_crm?: string | null
          proctor_id?: string | null
          reserva_uti?: boolean | null
          robot_platform?: string | null
          scheduled_date?: string | null
          secretary_id?: string | null
          status?: Database['public']['Enums']['surgery_status'] | null
          surgeon_id: string
          surgical_technique?: string | null
          tempo_internacao_dias?: number | null
          tiss_xml_path?: string | null
          updated_at?: string | null
        }
        Update: {
          adjuvant_procedures?: Json | null
          alergias_descricao?: string | null
          alergias_paciente?: boolean | null
          anesthesiologist_name?: string | null
          anexo_guia_tipo?: string | null
          anexo_guia_url?: string | null
          asa_classification?: string | null
          assistant_surgeons?: Json | null
          authorization_date?: string | null
          authorization_number?: string | null
          cancellation_actor_id?: string | null
          cancellation_reason?: string | null
          cid10_primary?: string
          cid10_secondary?: string[] | null
          clinical_indication?: string
          clinical_summary?: string | null
          consent_form_path?: string | null
          created_at?: string | null
          diagnostico_cid10_id?: string | null
          estimated_room_time_min?: number | null
          exam_reports_paths?: string[] | null
          google_calendar_event_id?: string | null
          google_drive_doc_id?: string | null
          guide_type?: string | null
          id?: string
          insurance_provider_code?: string | null
          laterality?: string | null
          needs_blood_products?: boolean | null
          needs_frozen_section?: boolean | null
          needs_icu?: boolean | null
          operating_room?: string | null
          pacote_opme_id?: string | null
          patient_id?: string
          previsao_tempo_minutos?: number | null
          procedure_id?: string
          proctor_crm?: string | null
          proctor_id?: string | null
          reserva_uti?: boolean | null
          robot_platform?: string | null
          scheduled_date?: string | null
          secretary_id?: string | null
          status?: Database['public']['Enums']['surgery_status'] | null
          surgeon_id?: string
          surgical_technique?: string | null
          tempo_internacao_dias?: number | null
          tiss_xml_path?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'pedidos_cirurgia_diagnostico_cid10_id_fkey'
            columns: ['diagnostico_cid10_id']
            isOneToOne: false
            referencedRelation: 'diagnosticos_cid10'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'pedidos_cirurgia_pacote_opme_id_fkey'
            columns: ['pacote_opme_id']
            isOneToOne: false
            referencedRelation: 'pacotes_opme'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'pedidos_cirurgia_patient_id_fkey'
            columns: ['patient_id']
            isOneToOne: false
            referencedRelation: 'patients'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'pedidos_cirurgia_procedure_id_fkey'
            columns: ['procedure_id']
            isOneToOne: false
            referencedRelation: 'procedures'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'pedidos_cirurgia_surgeon_id_fkey'
            columns: ['surgeon_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      pedidos_cirurgia_auditoria: {
        Row: {
          acao: string
          campos_alterados: string[]
          created_at: string | null
          criado_em: string
          id: string
          pedido_id: string
          usuario_id: string
        }
        Insert: {
          acao: string
          campos_alterados: string[]
          created_at?: string | null
          criado_em: string
          id?: string
          pedido_id: string
          usuario_id: string
        }
        Update: {
          acao?: string
          campos_alterados?: string[]
          created_at?: string | null
          criado_em?: string
          id?: string
          pedido_id?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'pedidos_cirurgia_auditoria_pedido_id_fkey'
            columns: ['pedido_id']
            isOneToOne: false
            referencedRelation: 'mv_kpi_cirurgias'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'pedidos_cirurgia_auditoria_pedido_id_fkey'
            columns: ['pedido_id']
            isOneToOne: false
            referencedRelation: 'pedidos_cirurgia'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'pedidos_cirurgia_auditoria_pedido_id_fkey'
            columns: ['pedido_id']
            isOneToOne: false
            referencedRelation: 'v_pedidos_pendentes_sla'
            referencedColumns: ['id']
          },
        ]
      }
      pedidos_docs_exports: {
        Row: {
          doc_id: string
          doc_type: string
          doc_url: string
          generated_at: string | null
          generated_by: string
          id: string
          pedido_id: string
          shared_with_email: string | null
        }
        Insert: {
          doc_id: string
          doc_type: string
          doc_url: string
          generated_at?: string | null
          generated_by: string
          id?: string
          pedido_id: string
          shared_with_email?: string | null
        }
        Update: {
          doc_id?: string
          doc_type?: string
          doc_url?: string
          generated_at?: string | null
          generated_by?: string
          id?: string
          pedido_id?: string
          shared_with_email?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'pedidos_docs_exports_generated_by_fkey'
            columns: ['generated_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'pedidos_docs_exports_generated_by_fkey1'
            columns: ['generated_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'pedidos_docs_exports_pedido_id_fkey'
            columns: ['pedido_id']
            isOneToOne: false
            referencedRelation: 'mv_kpi_cirurgias'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'pedidos_docs_exports_pedido_id_fkey'
            columns: ['pedido_id']
            isOneToOne: false
            referencedRelation: 'pedidos_cirurgia'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'pedidos_docs_exports_pedido_id_fkey'
            columns: ['pedido_id']
            isOneToOne: false
            referencedRelation: 'v_pedidos_pendentes_sla'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'pedidos_docs_exports_pedido_id_fkey1'
            columns: ['pedido_id']
            isOneToOne: false
            referencedRelation: 'mv_kpi_cirurgias'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'pedidos_docs_exports_pedido_id_fkey1'
            columns: ['pedido_id']
            isOneToOne: false
            referencedRelation: 'pedidos_cirurgia'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'pedidos_docs_exports_pedido_id_fkey1'
            columns: ['pedido_id']
            isOneToOne: false
            referencedRelation: 'v_pedidos_pendentes_sla'
            referencedColumns: ['id']
          },
        ]
      }
      pedidos_documentos: {
        Row: {
          arquivo_hash: string
          arquivo_nome: string
          arquivo_tamanho: number
          arquivo_tipo: string
          created_at: string | null
          deleted_at: string | null
          descricao: string | null
          documento_tipo: string
          id: string
          notas: string | null
          obrigatorio: boolean | null
          pedido_id: string
          storage_path: string
          updated_at: string | null
          uploaded_at: string | null
          uploaded_by: string
        }
        Insert: {
          arquivo_hash: string
          arquivo_nome: string
          arquivo_tamanho: number
          arquivo_tipo: string
          created_at?: string | null
          deleted_at?: string | null
          descricao?: string | null
          documento_tipo: string
          id?: string
          notas?: string | null
          obrigatorio?: boolean | null
          pedido_id: string
          storage_path: string
          updated_at?: string | null
          uploaded_at?: string | null
          uploaded_by: string
        }
        Update: {
          arquivo_hash?: string
          arquivo_nome?: string
          arquivo_tamanho?: number
          arquivo_tipo?: string
          created_at?: string | null
          deleted_at?: string | null
          descricao?: string | null
          documento_tipo?: string
          id?: string
          notas?: string | null
          obrigatorio?: boolean | null
          pedido_id?: string
          storage_path?: string
          updated_at?: string | null
          uploaded_at?: string | null
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: 'pedidos_documentos_pedido_id_fkey'
            columns: ['pedido_id']
            isOneToOne: false
            referencedRelation: 'mv_kpi_cirurgias'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'pedidos_documentos_pedido_id_fkey'
            columns: ['pedido_id']
            isOneToOne: false
            referencedRelation: 'pedidos_cirurgia'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'pedidos_documentos_pedido_id_fkey'
            columns: ['pedido_id']
            isOneToOne: false
            referencedRelation: 'v_pedidos_pendentes_sla'
            referencedColumns: ['id']
          },
        ]
      }
      procedures: {
        Row: {
          created_at: string | null
          id: string
          name: string
          priority_weight: number | null
          requires_proctor: boolean | null
          requires_robot: boolean | null
          setup_time_minutes: number | null
          surgical_time_minutes: number
          tuss_code: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          priority_weight?: number | null
          requires_proctor?: boolean | null
          requires_robot?: boolean | null
          setup_time_minutes?: number | null
          surgical_time_minutes: number
          tuss_code: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          priority_weight?: number | null
          requires_proctor?: boolean | null
          requires_robot?: boolean | null
          setup_time_minutes?: number | null
          surgical_time_minutes?: number
          tuss_code?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          city: string | null
          created_at: string
          crm: string | null
          email: string
          google_calendar_refresh_token: string | null
          id: string
          is_active: boolean
          last_sign_in_at: string | null
          name: string | null
          phone: string | null
          photo_url: string | null
          requested_at: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string
          crm?: string | null
          email: string
          google_calendar_refresh_token?: string | null
          id: string
          is_active?: boolean
          last_sign_in_at?: string | null
          name?: string | null
          phone?: string | null
          photo_url?: string | null
          requested_at?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string
          crm?: string | null
          email?: string
          google_calendar_refresh_token?: string | null
          id?: string
          is_active?: boolean
          last_sign_in_at?: string | null
          name?: string | null
          phone?: string | null
          photo_url?: string | null
          requested_at?: string | null
        }
        Relationships: []
      }
      resource_allocation: {
        Row: {
          allocated_at: string
          allocated_by: string
          allocated_proctor_id: string | null
          allocated_surgeon_id: string
          allocation_status: Database['public']['Enums']['allocation_status']
          estimated_duration_minutes: number
          fallback_reason: string | null
          id: string
          is_fallback_allocation: boolean | null
          original_preference_id: string | null
          pedido_id: string
          robotic_system_id: string
          selected_preference_order: number | null
          surgical_block_id: string
          surgical_room_id: string
          updated_at: string
        }
        Insert: {
          allocated_at?: string
          allocated_by: string
          allocated_proctor_id?: string | null
          allocated_surgeon_id: string
          allocation_status?: Database['public']['Enums']['allocation_status']
          estimated_duration_minutes: number
          fallback_reason?: string | null
          id?: string
          is_fallback_allocation?: boolean | null
          original_preference_id?: string | null
          pedido_id: string
          robotic_system_id: string
          selected_preference_order?: number | null
          surgical_block_id: string
          surgical_room_id: string
          updated_at?: string
        }
        Update: {
          allocated_at?: string
          allocated_by?: string
          allocated_proctor_id?: string | null
          allocated_surgeon_id?: string
          allocation_status?: Database['public']['Enums']['allocation_status']
          estimated_duration_minutes?: number
          fallback_reason?: string | null
          id?: string
          is_fallback_allocation?: boolean | null
          original_preference_id?: string | null
          pedido_id?: string
          robotic_system_id?: string
          selected_preference_order?: number | null
          surgical_block_id?: string
          surgical_room_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'resource_allocation_allocated_by_fkey'
            columns: ['allocated_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'resource_allocation_allocated_proctor_id_fkey'
            columns: ['allocated_proctor_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'resource_allocation_allocated_surgeon_id_fkey'
            columns: ['allocated_surgeon_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'resource_allocation_original_preference_id_fkey'
            columns: ['original_preference_id']
            isOneToOne: false
            referencedRelation: 'surgical_request_block_preferences'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'resource_allocation_pedido_id_fkey'
            columns: ['pedido_id']
            isOneToOne: false
            referencedRelation: 'mv_kpi_cirurgias'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'resource_allocation_pedido_id_fkey'
            columns: ['pedido_id']
            isOneToOne: false
            referencedRelation: 'pedidos_cirurgia'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'resource_allocation_pedido_id_fkey'
            columns: ['pedido_id']
            isOneToOne: false
            referencedRelation: 'v_pedidos_pendentes_sla'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'resource_allocation_robotic_system_id_fkey'
            columns: ['robotic_system_id']
            isOneToOne: false
            referencedRelation: 'robotic_systems'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'resource_allocation_surgical_block_id_fkey'
            columns: ['surgical_block_id']
            isOneToOne: false
            referencedRelation: 'surgical_blocks'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'resource_allocation_surgical_block_id_fkey'
            columns: ['surgical_block_id']
            isOneToOne: false
            referencedRelation: 'v_blocos_disponiveis'
            referencedColumns: ['bloco_id']
          },
          {
            foreignKeyName: 'resource_allocation_surgical_room_id_fkey'
            columns: ['surgical_room_id']
            isOneToOne: false
            referencedRelation: 'surgical_rooms'
            referencedColumns: ['id']
          },
        ]
      }
      robotic_systems: {
        Row: {
          created_at: string
          facility_id: string | null
          id: string
          installation_date: string | null
          is_operational: boolean | null
          last_maintenance_date: string | null
          model: Database['public']['Enums']['robotic_system_model']
          next_maintenance_date: string | null
          notes: string | null
          serial_number: string | null
          system_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          facility_id?: string | null
          id?: string
          installation_date?: string | null
          is_operational?: boolean | null
          last_maintenance_date?: string | null
          model: Database['public']['Enums']['robotic_system_model']
          next_maintenance_date?: string | null
          notes?: string | null
          serial_number?: string | null
          system_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          facility_id?: string | null
          id?: string
          installation_date?: string | null
          is_operational?: boolean | null
          last_maintenance_date?: string | null
          model?: Database['public']['Enums']['robotic_system_model']
          next_maintenance_date?: string | null
          notes?: string | null
          serial_number?: string | null
          system_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'robotic_systems_facility_id_fkey'
            columns: ['facility_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      sectors: {
        Row: {
          created_at: string | null
          id: string
          name: string
          notify_on_status: Database['public']['Enums']['surgery_status'][] | null
          role_target: Database['public']['Enums']['user_role_type'] | null
          telegram_chat_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          notify_on_status?: Database['public']['Enums']['surgery_status'][] | null
          role_target?: Database['public']['Enums']['user_role_type'] | null
          telegram_chat_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          notify_on_status?: Database['public']['Enums']['surgery_status'][] | null
          role_target?: Database['public']['Enums']['user_role_type'] | null
          telegram_chat_id?: string | null
        }
        Relationships: []
      }
      surgical_block_exceptions: {
        Row: {
          created_at: string
          exception_date: string
          hospital_id: string
          id: string
          reason: string | null
          surgical_block_template_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          exception_date: string
          hospital_id: string
          id?: string
          reason?: string | null
          surgical_block_template_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          exception_date?: string
          hospital_id?: string
          id?: string
          reason?: string | null
          surgical_block_template_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'surgical_block_exceptions_hospital_id_fkey'
            columns: ['hospital_id']
            isOneToOne: false
            referencedRelation: 'hospitals'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'surgical_block_exceptions_surgical_block_template_id_fkey'
            columns: ['surgical_block_template_id']
            isOneToOne: false
            referencedRelation: 'surgical_block_templates'
            referencedColumns: ['id']
          },
        ]
      }
      surgical_block_templates: {
        Row: {
          block_end_time: string
          block_start_time: string
          created_at: string
          day_of_week: Database['public']['Enums']['day_of_week']
          hospital_id: string
          id: string
          is_active: boolean
          notes: string | null
          surgical_room_id: string
          updated_at: string
        }
        Insert: {
          block_end_time: string
          block_start_time: string
          created_at?: string
          day_of_week: Database['public']['Enums']['day_of_week']
          hospital_id: string
          id?: string
          is_active?: boolean
          notes?: string | null
          surgical_room_id: string
          updated_at?: string
        }
        Update: {
          block_end_time?: string
          block_start_time?: string
          created_at?: string
          day_of_week?: Database['public']['Enums']['day_of_week']
          hospital_id?: string
          id?: string
          is_active?: boolean
          notes?: string | null
          surgical_room_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'surgical_block_templates_hospital_id_fkey'
            columns: ['hospital_id']
            isOneToOne: false
            referencedRelation: 'hospitals'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'surgical_block_templates_surgical_room_id_fkey'
            columns: ['surgical_room_id']
            isOneToOne: false
            referencedRelation: 'surgical_rooms'
            referencedColumns: ['id']
          },
        ]
      }
      surgical_blocks: {
        Row: {
          assigned_proctor_id: string | null
          assigned_surgeon_id: string | null
          block_date: string
          block_end_time: string
          block_start_time: string
          created_at: string
          duration_minutes: number | null
          hospital_id: string
          id: string
          is_available: boolean | null
          notes: string | null
          surgical_room_id: string
          template_id: string | null
          updated_at: string
        }
        Insert: {
          assigned_proctor_id?: string | null
          assigned_surgeon_id?: string | null
          block_date: string
          block_end_time: string
          block_start_time: string
          created_at?: string
          duration_minutes?: number | null
          hospital_id: string
          id?: string
          is_available?: boolean | null
          notes?: string | null
          surgical_room_id: string
          template_id?: string | null
          updated_at?: string
        }
        Update: {
          assigned_proctor_id?: string | null
          assigned_surgeon_id?: string | null
          block_date?: string
          block_end_time?: string
          block_start_time?: string
          created_at?: string
          duration_minutes?: number | null
          hospital_id?: string
          id?: string
          is_available?: boolean | null
          notes?: string | null
          surgical_room_id?: string
          template_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'surgical_blocks_assigned_proctor_id_fkey'
            columns: ['assigned_proctor_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'surgical_blocks_assigned_surgeon_id_fkey'
            columns: ['assigned_surgeon_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'surgical_blocks_hospital_id_fkey'
            columns: ['hospital_id']
            isOneToOne: false
            referencedRelation: 'hospitals'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'surgical_blocks_surgical_room_id_fkey'
            columns: ['surgical_room_id']
            isOneToOne: false
            referencedRelation: 'surgical_rooms'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'surgical_blocks_template_id_fkey'
            columns: ['template_id']
            isOneToOne: false
            referencedRelation: 'surgical_block_templates'
            referencedColumns: ['id']
          },
        ]
      }
      surgical_request_block_preferences: {
        Row: {
          created_at: string
          hospital_id: string
          id: string
          pedido_cirurgia_id: string
          preference_order: number
          surgical_block_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          hospital_id: string
          id?: string
          pedido_cirurgia_id: string
          preference_order: number
          surgical_block_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          hospital_id?: string
          id?: string
          pedido_cirurgia_id?: string
          preference_order?: number
          surgical_block_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'surgical_request_block_preferences_hospital_id_fkey'
            columns: ['hospital_id']
            isOneToOne: false
            referencedRelation: 'hospitals'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'surgical_request_block_preferences_pedido_cirurgia_id_fkey'
            columns: ['pedido_cirurgia_id']
            isOneToOne: false
            referencedRelation: 'mv_kpi_cirurgias'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'surgical_request_block_preferences_pedido_cirurgia_id_fkey'
            columns: ['pedido_cirurgia_id']
            isOneToOne: false
            referencedRelation: 'pedidos_cirurgia'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'surgical_request_block_preferences_pedido_cirurgia_id_fkey'
            columns: ['pedido_cirurgia_id']
            isOneToOne: false
            referencedRelation: 'v_pedidos_pendentes_sla'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'surgical_request_block_preferences_surgical_block_id_fkey'
            columns: ['surgical_block_id']
            isOneToOne: false
            referencedRelation: 'surgical_blocks'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'surgical_request_block_preferences_surgical_block_id_fkey'
            columns: ['surgical_block_id']
            isOneToOne: false
            referencedRelation: 'v_blocos_disponiveis'
            referencedColumns: ['bloco_id']
          },
        ]
      }
      surgical_rooms: {
        Row: {
          capacity_patients: number | null
          created_at: string
          hospital_id: string
          id: string
          is_active: boolean | null
          notes: string | null
          robotic_system_id: string | null
          room_name: string
          room_number: string
          updated_at: string
        }
        Insert: {
          capacity_patients?: number | null
          created_at?: string
          hospital_id: string
          id?: string
          is_active?: boolean | null
          notes?: string | null
          robotic_system_id?: string | null
          room_name: string
          room_number: string
          updated_at?: string
        }
        Update: {
          capacity_patients?: number | null
          created_at?: string
          hospital_id?: string
          id?: string
          is_active?: boolean | null
          notes?: string | null
          robotic_system_id?: string | null
          room_name?: string
          room_number?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'surgical_rooms_hospital_id_fkey'
            columns: ['hospital_id']
            isOneToOne: false
            referencedRelation: 'hospitals'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'surgical_rooms_robotic_system_id_fkey'
            columns: ['robotic_system_id']
            isOneToOne: false
            referencedRelation: 'robotic_systems'
            referencedColumns: ['id']
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          granted_by: string | null
          id: string
          is_active: boolean | null
          role: Database['public']['Enums']['user_role_type']
          user_id: string
        }
        Insert: {
          created_at?: string | null
          granted_by?: string | null
          id?: string
          is_active?: boolean | null
          role: Database['public']['Enums']['user_role_type']
          user_id: string
        }
        Update: {
          created_at?: string | null
          granted_by?: string | null
          id?: string
          is_active?: boolean | null
          role?: Database['public']['Enums']['user_role_type']
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      mv_kpi_cirurgias: {
        Row: {
          asa_classification: string | null
          created_at: string | null
          estimated_room_time_min: number | null
          id: string | null
          insurance_provider_code: string | null
          needs_icu: boolean | null
          patient_hash: string | null
          procedure_name: string | null
          scheduled_date: string | null
          status: Database['public']['Enums']['surgery_status'] | null
          tuss_code: string | null
        }
        Relationships: []
      }
      v_audit_log_with_context: {
        Row: {
          action: string | null
          action_context: string | null
          action_type: Database['public']['Enums']['audit_action_type'] | null
          changed_at: string | null
          changed_by: string | null
          changed_by_email: string | null
          changed_by_name: string | null
          hash_valid: boolean | null
          id: string | null
          notes: string | null
          pedido_id: string | null
          previous_hash: string | null
          record_hash: string | null
          status_from: string | null
          status_to: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'audit_log_changed_by_fkey'
            columns: ['changed_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'audit_log_pedido_id_fkey'
            columns: ['pedido_id']
            isOneToOne: false
            referencedRelation: 'mv_kpi_cirurgias'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'audit_log_pedido_id_fkey'
            columns: ['pedido_id']
            isOneToOne: false
            referencedRelation: 'pedidos_cirurgia'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'audit_log_pedido_id_fkey'
            columns: ['pedido_id']
            isOneToOne: false
            referencedRelation: 'v_pedidos_pendentes_sla'
            referencedColumns: ['id']
          },
        ]
      }
      v_blocos_disponiveis: {
        Row: {
          block_date: string | null
          block_end_time: string | null
          block_start_time: string | null
          bloco_id: string | null
          hospital_id: string | null
          num_cirurgioes_interessados: number | null
          status_bloco: string | null
          surgical_room_id: string | null
          template_id: string | null
        }
        Insert: {
          block_date?: string | null
          block_end_time?: string | null
          block_start_time?: string | null
          bloco_id?: string | null
          hospital_id?: string | null
          num_cirurgioes_interessados?: never
          status_bloco?: never
          surgical_room_id?: string | null
          template_id?: string | null
        }
        Update: {
          block_date?: string | null
          block_end_time?: string | null
          block_start_time?: string | null
          bloco_id?: string | null
          hospital_id?: string | null
          num_cirurgioes_interessados?: never
          status_bloco?: never
          surgical_room_id?: string | null
          template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'surgical_blocks_hospital_id_fkey'
            columns: ['hospital_id']
            isOneToOne: false
            referencedRelation: 'hospitals'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'surgical_blocks_surgical_room_id_fkey'
            columns: ['surgical_room_id']
            isOneToOne: false
            referencedRelation: 'surgical_rooms'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'surgical_blocks_template_id_fkey'
            columns: ['template_id']
            isOneToOne: false
            referencedRelation: 'surgical_block_templates'
            referencedColumns: ['id']
          },
        ]
      }
      v_cirurgias_por_cirurgiao: {
        Row: {
          canceladas: number | null
          cirurgiao: string | null
          crm: string | null
          realizadas: number | null
          taxa_cancelamento_pct: number | null
          total_cirurgias: number | null
        }
        Relationships: []
      }
      v_cirurgias_por_procedimento: {
        Row: {
          canceladas: number | null
          procedimento: string | null
          realizadas: number | null
          taxa_realizacao_pct: number | null
          total: number | null
        }
        Relationships: []
      }
      v_cirurgias_por_status: {
        Row: {
          percentual: number | null
          status: Database['public']['Enums']['surgery_status'] | null
          total: number | null
        }
        Relationships: []
      }
      v_pedidos_pendentes_sla: {
        Row: {
          cirurgiao: string | null
          created_at: string | null
          horas_pendente: number | null
          id: string | null
          paciente: string | null
          procedimento: string | null
          scheduled_date: string | null
          status_sla: string | null
        }
        Relationships: []
      }
      v_taxa_conversao: {
        Row: {
          autorizados: number | null
          cancelados: number | null
          em_execucao: number | null
          em_processamento: number | null
          rascunhos: number | null
          realizados: number | null
          taxa_realizacao_geral_pct: number | null
          total_pedidos: number | null
        }
        Relationships: []
      }
      v_tempo_autorizacao: {
        Row: {
          cirurgiao: string | null
          tempo_maximo_horas: number | null
          tempo_medio_horas: number | null
          tempo_minimo_horas: number | null
          total_pedidos: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      create_auth_user: {
        Args: { email: string; password: string; user_role: string }
        Returns: string
      }
      fn_calculate_record_hash: {
        Args: {
          p_changed_at: string
          p_changed_by: string
          p_pedido_id: string
          p_status_from: string
          p_status_to: string
        }
        Returns: string
      }
      fn_generate_recurring_blocks: {
        Args: {
          p_end_date: string
          p_start_date: string
          p_template_id: string
        }
        Returns: {
          blocks_created: number
          message: string
        }[]
      }
      fn_generate_recurring_blocks_12months: {
        Args: { p_template_id: string }
        Returns: {
          blocks_created: number
          message: string
        }[]
      }
      fn_get_available_blocks_for_request: {
        Args: { p_pedido_cirurgia_id: string }
        Returns: {
          block_date: string
          block_end_time: string
          block_start_time: string
          id: string
          is_available: boolean
          room_name: string
          surgical_room_id: string
          template_id: string
        }[]
      }
      fn_is_exception_date: {
        Args: { p_date: string; p_template_id: string }
        Returns: boolean
      }
      fn_map_status_to_action: {
        Args: { p_status_from: string; p_status_to: string }
        Returns: Database['public']['Enums']['audit_action_type']
      }
      fn_validate_audit_integrity: {
        Args: { p_pedido_id: string }
        Returns: {
          changed_at: string
          hash_valid: boolean
          id: string
          integrity_status: string
          previous_hash: string
          record_hash: string
          status_to: string
        }[]
      }
      fn_validate_block_for_preference: {
        Args: { p_pedido_cirurgia_id: string; p_surgical_block_id: string }
        Returns: {
          is_valid: boolean
          validation_message: string
        }[]
      }
      get_default_hospital_id: { Args: never; Returns: string }
      get_user_managed_hospitals: { Args: never; Returns: string[] }
      get_user_role: { Args: never; Returns: string }
      get_user_roles: { Args: never; Returns: string[] }
      has_any_role: { Args: { required_roles: string[] }; Returns: boolean }
      has_role: { Args: { required_role: string }; Returns: boolean }
      is_admin: { Args: never; Returns: boolean }
      register_pinça_consumption: {
        Args: {
          p_lives_consumed: number
          p_lot_used?: string
          p_pedido_opme_item_id: string
        }
        Returns: {
          message: string
          success: boolean
        }[]
      }
      update_pedido_cirurgia: {
        Args: { p_new_status: string; p_notes?: string; p_pedido_id: string }
        Returns: {
          message: string
          pedido_id: string
          success: boolean
        }[]
      }
      validate_pinças_before_scheduling: {
        Args: { p_pedido_id: string }
        Returns: {
          message: string
          valid: boolean
        }[]
      }
    }
    Enums: {
      allocation_status: 'ALOCADO' | 'CONFIRMADO' | 'CANCELADO'
      audit_action_type:
        | 'CREATED'
        | 'SUBMITTED'
        | 'APPROVED'
        | 'REJECTED'
        | 'SCHEDULED'
        | 'RESCHEDULED'
        | 'IN_EXECUTION'
        | 'COMPLETED'
        | 'CANCELLED'
        | 'AUDIT_PENDING'
        | 'AUDIT_APPROVED'
        | 'AUDIT_REJECTED'
      day_of_week:
        | 'MONDAY'
        | 'TUESDAY'
        | 'WEDNESDAY'
        | 'THURSDAY'
        | 'FRIDAY'
        | 'SATURDAY'
        | 'SUNDAY'
      robotic_system_model: 'da Vinci Xi' | 'da Vinci X' | 'da Vinci SP'
      surgery_status:
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
      user_role_type:
        | 'surgeon'
        | 'secretary'
        | 'opme'
        | 'billing'
        | 'nursing'
        | 'coordinator'
        | 'admin'
        | 'facility_manager'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      allocation_status: ['ALOCADO', 'CONFIRMADO', 'CANCELADO'],
      audit_action_type: [
        'CREATED',
        'SUBMITTED',
        'APPROVED',
        'REJECTED',
        'SCHEDULED',
        'RESCHEDULED',
        'IN_EXECUTION',
        'COMPLETED',
        'CANCELLED',
        'AUDIT_PENDING',
        'AUDIT_APPROVED',
        'AUDIT_REJECTED',
      ],
      day_of_week: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'],
      robotic_system_model: ['da Vinci Xi', 'da Vinci X', 'da Vinci SP'],
      surgery_status: [
        '1_RASCUNHO',
        '2_AGUARDANDO_OPME',
        '3_EM_AUDITORIA',
        '4_PENDENCIA_TECNICA',
        '5_AUTORIZADO',
        '6_AGUARDANDO_MAPA',
        '7_AGENDADO_CC',
        '8_EM_EXECUCAO',
        '9_REALIZADO',
        '10_CANCELADO',
      ],
      user_role_type: [
        'surgeon',
        'secretary',
        'opme',
        'billing',
        'nursing',
        'coordinator',
        'admin',
        'facility_manager',
      ],
    },
  },
} as const

// ====== DATABASE EXTENDED CONTEXT (auto-generated) ======
// This section contains actual PostgreSQL column types, constraints, RLS policies,
// functions, triggers, indexes and materialized views not present in the type definitions above.
// IMPORTANT: The TypeScript types above map UUID, TEXT, VARCHAR all to "string".
// Use the COLUMN TYPES section below to know the real PostgreSQL type for each column.
// Always use the correct PostgreSQL type when writing SQL migrations.

// --- COLUMN TYPES (actual PostgreSQL types) ---
// Use this to know the real database type when writing migrations.
// "string" in TypeScript types above may be uuid, text, varchar, timestamptz, etc.
// Table: agendamento_propostas
//   id: uuid (not null, default: gen_random_uuid())
//   pedido_id: uuid (not null)
//   numero_proposta: integer (not null)
//   data_proposta: date (not null)
//   turno: character varying (not null)
//   criado_em: timestamp without time zone (nullable, default: now())
// Table: audit_log
//   id: uuid (not null, default: gen_random_uuid())
//   pedido_id: uuid (not null)
//   changed_by: uuid (not null)
//   changed_at: timestamp with time zone (not null, default: now())
//   status_from: text (nullable)
//   status_to: text (not null)
//   action: text (not null)
//   notes: text (nullable)
//   record_hash: character varying (nullable)
//   previous_hash: character varying (nullable)
//   hash_algorithm: character varying (nullable, default: 'SHA256'::character varying)
//   action_type: audit_action_type (nullable)
//   action_context: text (nullable)
// Table: audit_logs
//   id: uuid (not null, default: uuid_generate_v4())
//   actor_id: uuid (nullable)
//   actor_role: text (nullable)
//   actor_ip: text (nullable)
//   mfa_used: boolean (nullable, default: false)
//   event_type: text (not null)
//   table_name: text (not null)
//   record_id: uuid (nullable)
//   old_value: jsonb (nullable)
//   new_value: jsonb (nullable)
//   previous_hash: text (nullable)
//   record_hash: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: diagnosticos_cid10
//   id: uuid (not null, default: gen_random_uuid())
//   codigo_cid10: character varying (not null)
//   descricao: text (not null)
//   especialidade: character varying (nullable)
//   ativo: boolean (nullable, default: true)
//   criado_em: timestamp without time zone (nullable, default: now())
// Table: google_oauth_tokens
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   access_token: text (not null)
//   refresh_token: text (nullable)
//   expires_at: timestamp with time zone (not null)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
// Table: hospital_users
//   id: uuid (not null, default: gen_random_uuid())
//   hospital_id: uuid (not null)
//   user_id: uuid (not null)
//   role: text (not null)
//   is_active: boolean (nullable, default: true)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
// Table: hospitals
//   id: uuid (not null, default: gen_random_uuid())
//   hospital_name: text (not null)
//   cnpj: text (nullable)
//   address: text (nullable)
//   city: text (nullable)
//   state: text (nullable)
//   country: text (nullable, default: 'Brasil'::text)
//   is_active: boolean (nullable, default: true)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
// Table: opme_items
//   id: uuid (not null, default: uuid_generate_v4())
//   name: text (not null)
//   tuss_code: text (not null)
//   item_type: text (not null)
//   max_lives: integer (nullable)
//   current_lives: integer (nullable)
//   lot_number: text (nullable)
//   serial_number: text (nullable)
//   is_available: boolean (nullable, default: true)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   code: text (not null)
//   description: text (not null)
//   manufacturer: text (not null)
//   is_active: boolean (not null, default: true)
// Table: pacotes_opme
//   id: uuid (not null, default: gen_random_uuid())
//   nome: character varying (not null)
//   descricao: text (nullable)
//   ativo: boolean (nullable, default: true)
//   criado_em: timestamp without time zone (nullable, default: now())
// Table: pacotes_opme_itens
//   id: uuid (not null, default: gen_random_uuid())
//   pacote_id: uuid (not null)
//   descricao: text (not null)
//   quantidade: integer (not null, default: 1)
//   fabricante: character varying (nullable)
//   fornecedor: character varying (nullable)
//   criado_em: timestamp without time zone (nullable, default: now())
// Table: patients
//   id: uuid (not null, default: uuid_generate_v4())
//   full_name: text (not null)
//   cpf_hash: text (not null)
//   cns: text (nullable)
//   medical_record: text (nullable)
//   date_of_birth: date (nullable)
//   insurance_provider: text (nullable)
//   insurance_plan: text (nullable)
//   insurance_card_number: text (nullable)
//   created_by: uuid (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   profissao: text (nullable)
//   endereco: text (nullable)
//   telefone: text (nullable)
//   pessoa_contato: text (nullable)
//   telefone_contato: text (nullable)
// Table: pedido_opme_items
//   id: uuid (not null, default: uuid_generate_v4())
//   pedido_id: uuid (not null)
//   opme_item_id: uuid (not null)
//   quantity: integer (not null, default: 1)
//   lives_consumed: integer (nullable, default: 0)
//   lot_used: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   authorization_code: text (nullable)
//   authorized_at: timestamp with time zone (nullable)
//   notes: text (nullable)
//   added_by: uuid (not null)
// Table: pedidos_calendar_events
//   id: uuid (not null, default: gen_random_uuid())
//   pedido_id: uuid (not null)
//   calendar_type: character varying (not null)
//   surgeon_id: uuid (nullable)
//   google_event_id: text (not null)
//   google_calendar_id: text (not null)
//   event_title: character varying (not null)
//   event_description: text (nullable)
//   event_start: timestamp without time zone (not null)
//   event_end: timestamp without time zone (not null)
//   sync_status: character varying (nullable, default: 'SYNCED'::character varying)
//   sync_error: text (nullable)
//   created_at: timestamp without time zone (nullable, default: now())
//   updated_at: timestamp without time zone (nullable, default: now())
// Table: pedidos_cirurgia
//   id: uuid (not null, default: uuid_generate_v4())
//   patient_id: uuid (not null)
//   surgeon_id: uuid (not null)
//   secretary_id: uuid (nullable)
//   status: surgery_status (nullable, default: '1_RASCUNHO'::surgery_status)
//   cancellation_reason: text (nullable)
//   cancellation_actor_id: uuid (nullable)
//   guide_type: text (nullable)
//   authorization_number: text (nullable)
//   authorization_date: date (nullable)
//   insurance_provider_code: text (nullable)
//   cid10_primary: text (not null)
//   cid10_secondary: _text (nullable)
//   clinical_indication: text (not null)
//   clinical_summary: text (nullable)
//   procedure_id: uuid (not null)
//   adjuvant_procedures: jsonb (nullable)
//   laterality: text (nullable)
//   surgical_technique: text (nullable)
//   asa_classification: text (nullable)
//   estimated_room_time_min: integer (nullable)
//   needs_icu: boolean (nullable, default: false)
//   needs_blood_products: boolean (nullable, default: false)
//   needs_frozen_section: boolean (nullable, default: false)
//   anesthesiologist_name: text (nullable)
//   assistant_surgeons: jsonb (nullable)
//   proctor_id: uuid (nullable)
//   proctor_crm: text (nullable)
//   scheduled_date: timestamp with time zone (nullable)
//   operating_room: text (nullable)
//   robot_platform: text (nullable, default: 'Da Vinci'::text)
//   consent_form_path: text (nullable)
//   exam_reports_paths: _text (nullable)
//   tiss_xml_path: text (nullable)
//   google_calendar_event_id: text (nullable)
//   google_drive_doc_id: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   pacote_opme_id: uuid (nullable)
//   anexo_guia_url: text (nullable)
//   anexo_guia_tipo: character varying (nullable)
//   alergias_paciente: boolean (nullable, default: false)
//   alergias_descricao: text (nullable)
//   previsao_tempo_minutos: integer (nullable)
//   tempo_internacao_dias: integer (nullable)
//   diagnostico_cid10_id: uuid (nullable)
//   reserva_uti: boolean (nullable)
// Table: pedidos_cirurgia_auditoria
//   id: uuid (not null, default: gen_random_uuid())
//   pedido_id: uuid (not null)
//   acao: text (not null)
//   campos_alterados: _text (not null)
//   usuario_id: uuid (not null)
//   criado_em: timestamp with time zone (not null)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: pedidos_docs_exports
//   id: uuid (not null, default: gen_random_uuid())
//   pedido_id: uuid (not null)
//   doc_id: text (not null)
//   doc_url: text (not null)
//   doc_type: text (not null)
//   generated_by: uuid (not null)
//   generated_at: timestamp with time zone (nullable, default: now())
//   shared_with_email: text (nullable)
// Table: pedidos_documentos
//   id: uuid (not null, default: gen_random_uuid())
//   pedido_id: uuid (not null)
//   documento_tipo: character varying (not null)
//   arquivo_nome: character varying (not null)
//   arquivo_tamanho: integer (not null)
//   arquivo_tipo: character varying (not null)
//   arquivo_hash: character varying (not null)
//   storage_path: character varying (not null)
//   uploaded_by: uuid (not null)
//   uploaded_at: timestamp with time zone (nullable, default: now())
//   obrigatorio: boolean (nullable, default: false)
//   descricao: text (nullable)
//   notas: text (nullable)
//   deleted_at: timestamp with time zone (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
// Table: procedures
//   id: uuid (not null, default: uuid_generate_v4())
//   name: text (not null)
//   tuss_code: text (not null)
//   setup_time_minutes: integer (nullable, default: 30)
//   surgical_time_minutes: integer (not null)
//   priority_weight: integer (nullable, default: 1)
//   requires_robot: boolean (nullable, default: true)
//   requires_proctor: boolean (nullable, default: false)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: profiles
//   id: uuid (not null)
//   name: text (nullable)
//   email: text (not null)
//   created_at: timestamp with time zone (not null, default: now())
//   is_active: boolean (not null, default: false)
//   crm: text (nullable)
//   phone: text (nullable)
//   city: text (nullable)
//   photo_url: text (nullable)
//   last_sign_in_at: timestamp with time zone (nullable)
//   requested_at: timestamp with time zone (nullable, default: now())
//   google_calendar_refresh_token: text (nullable)
// Table: resource_allocation
//   id: uuid (not null, default: gen_random_uuid())
//   pedido_id: uuid (not null)
//   surgical_room_id: uuid (not null)
//   robotic_system_id: uuid (not null)
//   surgical_block_id: uuid (not null)
//   allocated_surgeon_id: uuid (not null)
//   estimated_duration_minutes: integer (not null)
//   allocated_by: uuid (not null)
//   allocated_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
//   allocated_proctor_id: uuid (nullable)
//   allocation_status: allocation_status (not null, default: 'ALOCADO'::allocation_status)
//   selected_preference_order: integer (nullable)
//   is_fallback_allocation: boolean (nullable, default: false)
//   fallback_reason: text (nullable)
//   original_preference_id: uuid (nullable)
// Table: robotic_systems
//   id: uuid (not null, default: gen_random_uuid())
//   system_name: text (not null)
//   model: robotic_system_model (not null)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
//   facility_id: uuid (nullable)
//   serial_number: text (nullable)
//   installation_date: date (nullable)
//   last_maintenance_date: date (nullable)
//   next_maintenance_date: date (nullable)
//   is_operational: boolean (nullable, default: true)
//   notes: text (nullable)
// Table: sectors
//   id: uuid (not null, default: uuid_generate_v4())
//   name: text (not null)
//   role_target: user_role_type (nullable)
//   telegram_chat_id: text (nullable)
//   notify_on_status: _surgery_status (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: surgical_block_exceptions
//   id: uuid (not null, default: gen_random_uuid())
//   surgical_block_template_id: uuid (not null)
//   exception_date: date (not null)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
//   reason: text (nullable)
//   hospital_id: uuid (not null)
// Table: surgical_block_templates
//   id: uuid (not null, default: gen_random_uuid())
//   surgical_room_id: uuid (not null)
//   day_of_week: day_of_week (not null)
//   block_start_time: time without time zone (not null)
//   block_end_time: time without time zone (not null)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
//   is_active: boolean (not null, default: true)
//   notes: text (nullable)
//   hospital_id: uuid (not null)
// Table: surgical_blocks
//   id: uuid (not null, default: gen_random_uuid())
//   surgical_room_id: uuid (not null)
//   block_date: date (not null)
//   block_start_time: time without time zone (not null)
//   block_end_time: time without time zone (not null)
//   duration_minutes: integer (nullable)
//   assigned_surgeon_id: uuid (nullable)
//   assigned_proctor_id: uuid (nullable)
//   is_available: boolean (nullable, default: true)
//   notes: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
//   template_id: uuid (nullable)
//   hospital_id: uuid (not null)
// Table: surgical_request_block_preferences
//   id: uuid (not null, default: gen_random_uuid())
//   pedido_cirurgia_id: uuid (not null)
//   surgical_block_id: uuid (not null)
//   preference_order: integer (not null)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
//   hospital_id: uuid (not null)
// Table: surgical_rooms
//   id: uuid (not null, default: gen_random_uuid())
//   room_number: text (not null)
//   room_name: text (not null)
//   robotic_system_id: uuid (nullable)
//   capacity_patients: integer (nullable, default: 1)
//   is_active: boolean (nullable, default: true)
//   notes: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
//   hospital_id: uuid (not null)
// Table: user_roles
//   id: uuid (not null, default: uuid_generate_v4())
//   user_id: uuid (not null)
//   role: user_role_type (not null)
//   is_active: boolean (nullable, default: false)
//   granted_by: uuid (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: v_audit_log_with_context
//   id: uuid (nullable)
//   pedido_id: uuid (nullable)
//   changed_by: uuid (nullable)
//   changed_at: timestamp with time zone (nullable)
//   status_from: text (nullable)
//   status_to: text (nullable)
//   action: text (nullable)
//   action_type: audit_action_type (nullable)
//   action_context: text (nullable)
//   notes: text (nullable)
//   record_hash: character varying (nullable)
//   previous_hash: character varying (nullable)
//   hash_valid: boolean (nullable)
//   changed_by_email: character varying (nullable)
//   changed_by_name: text (nullable)
// Table: v_blocos_disponiveis
//   bloco_id: uuid (nullable)
//   block_date: date (nullable)
//   block_start_time: time without time zone (nullable)
//   block_end_time: time without time zone (nullable)
//   surgical_room_id: uuid (nullable)
//   hospital_id: uuid (nullable)
//   template_id: uuid (nullable)
//   num_cirurgioes_interessados: bigint (nullable)
//   status_bloco: text (nullable)
// Table: v_cirurgias_por_cirurgiao
//   cirurgiao: text (nullable)
//   crm: text (nullable)
//   total_cirurgias: bigint (nullable)
//   canceladas: bigint (nullable)
//   realizadas: bigint (nullable)
//   taxa_cancelamento_pct: numeric (nullable)
// Table: v_cirurgias_por_procedimento
//   procedimento: text (nullable)
//   total: bigint (nullable)
//   realizadas: bigint (nullable)
//   canceladas: bigint (nullable)
//   taxa_realizacao_pct: numeric (nullable)
// Table: v_cirurgias_por_status
//   status: surgery_status (nullable)
//   total: bigint (nullable)
//   percentual: numeric (nullable)
// Table: v_pedidos_pendentes_sla
//   id: uuid (nullable)
//   cirurgiao: text (nullable)
//   paciente: text (nullable)
//   procedimento: text (nullable)
//   scheduled_date: timestamp with time zone (nullable)
//   created_at: timestamp with time zone (nullable)
//   horas_pendente: numeric (nullable)
//   status_sla: text (nullable)
// Table: v_taxa_conversao
//   rascunhos: bigint (nullable)
//   em_processamento: bigint (nullable)
//   autorizados: bigint (nullable)
//   em_execucao: bigint (nullable)
//   realizados: bigint (nullable)
//   cancelados: bigint (nullable)
//   total_pedidos: bigint (nullable)
//   taxa_realizacao_geral_pct: numeric (nullable)
// Table: v_tempo_autorizacao
//   cirurgiao: text (nullable)
//   total_pedidos: bigint (nullable)
//   tempo_medio_horas: numeric (nullable)
//   tempo_minimo_horas: numeric (nullable)
//   tempo_maximo_horas: numeric (nullable)

// --- CONSTRAINTS ---
// Table: agendamento_propostas
//   CHECK agendamento_propostas_numero_proposta_check: CHECK ((numero_proposta = ANY (ARRAY[1, 2, 3])))
//   FOREIGN KEY agendamento_propostas_pedido_id_fkey: FOREIGN KEY (pedido_id) REFERENCES pedidos_cirurgia(id) ON DELETE CASCADE
//   UNIQUE agendamento_propostas_pedido_id_numero_proposta_key: UNIQUE (pedido_id, numero_proposta)
//   PRIMARY KEY agendamento_propostas_pkey: PRIMARY KEY (id)
//   CHECK agendamento_propostas_turno_check: CHECK (((turno)::text = ANY ((ARRAY['manhã'::character varying, 'tarde'::character varying])::text[])))
// Table: audit_log
//   FOREIGN KEY audit_log_changed_by_fkey: FOREIGN KEY (changed_by) REFERENCES profiles(id)
//   FOREIGN KEY audit_log_pedido_id_fkey: FOREIGN KEY (pedido_id) REFERENCES pedidos_cirurgia(id) ON DELETE CASCADE
//   PRIMARY KEY audit_log_pkey: PRIMARY KEY (id)
//   CHECK ck_critical_action_requires_context: CHECK ( CASE     WHEN (action_type = ANY (ARRAY['CANCELLED'::audit_action_type, 'AUDIT_PENDING'::audit_action_type, 'REJECTED'::audit_action_type, 'RESCHEDULED'::audit_action_type])) THEN ((action_context IS NOT NULL) AND (length(TRIM(BOTH FROM action_context)) > 0))     ELSE true END)
// Table: audit_logs
//   PRIMARY KEY audit_logs_pkey: PRIMARY KEY (id)
// Table: diagnosticos_cid10
//   UNIQUE diagnosticos_cid10_codigo_cid10_key: UNIQUE (codigo_cid10)
//   PRIMARY KEY diagnosticos_cid10_pkey: PRIMARY KEY (id)
// Table: google_oauth_tokens
//   PRIMARY KEY google_oauth_tokens_pkey: PRIMARY KEY (id)
//   FOREIGN KEY google_oauth_tokens_user_id_fkey: FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
//   UNIQUE google_oauth_tokens_user_id_key: UNIQUE (user_id)
// Table: hospital_users
//   FOREIGN KEY hospital_users_hospital_id_fkey: FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE
//   UNIQUE hospital_users_hospital_id_user_id_role_key: UNIQUE (hospital_id, user_id, role)
//   PRIMARY KEY hospital_users_pkey: PRIMARY KEY (id)
//   CHECK hospital_users_role_check: CHECK ((role = ANY (ARRAY['admin'::text, 'facility_manager'::text, 'surgeon'::text, 'resident'::text, 'nurse'::text])))
//   FOREIGN KEY hospital_users_user_id_fkey: FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
// Table: hospitals
//   UNIQUE hospitals_cnpj_key: UNIQUE (cnpj)
//   UNIQUE hospitals_hospital_name_key: UNIQUE (hospital_name)
//   PRIMARY KEY hospitals_pkey: PRIMARY KEY (id)
// Table: opme_items
//   UNIQUE opme_items_code_unique: UNIQUE (code)
//   CHECK opme_items_item_type_check: CHECK ((item_type = ANY (ARRAY['pinça_clicada'::text, 'uso_unico'::text, 'grampeador'::text, 'drape'::text, 'outro'::text])))
//   PRIMARY KEY opme_items_pkey: PRIMARY KEY (id)
// Table: pacotes_opme
//   CHECK pacotes_opme_nome_check: CHECK (((nome)::text = ANY ((ARRAY['Ouro'::character varying, 'Prata'::character varying])::text[])))
//   UNIQUE pacotes_opme_nome_key: UNIQUE (nome)
//   PRIMARY KEY pacotes_opme_pkey: PRIMARY KEY (id)
// Table: pacotes_opme_itens
//   FOREIGN KEY pacotes_opme_itens_pacote_id_fkey: FOREIGN KEY (pacote_id) REFERENCES pacotes_opme(id) ON DELETE CASCADE
//   PRIMARY KEY pacotes_opme_itens_pkey: PRIMARY KEY (id)
// Table: patients
//   UNIQUE patients_cpf_hash_key: UNIQUE (cpf_hash)
//   FOREIGN KEY patients_created_by_fkey: FOREIGN KEY (created_by) REFERENCES auth.users(id)
//   CHECK patients_full_name_not_empty: CHECK (((full_name IS NOT NULL) AND (full_name <> ''::text)))
//   CHECK patients_medical_record_not_empty: CHECK (((medical_record IS NULL) OR (medical_record <> ''::text)))
//   PRIMARY KEY patients_pkey: PRIMARY KEY (id)
// Table: pedido_opme_items
//   FOREIGN KEY pedido_opme_items_added_by_fkey: FOREIGN KEY (added_by) REFERENCES profiles(id)
//   FOREIGN KEY pedido_opme_items_opme_item_id_fkey: FOREIGN KEY (opme_item_id) REFERENCES opme_items(id)
//   FOREIGN KEY pedido_opme_items_pedido_id_fkey: FOREIGN KEY (pedido_id) REFERENCES pedidos_cirurgia(id) ON DELETE CASCADE
//   PRIMARY KEY pedido_opme_items_pkey: PRIMARY KEY (id)
//   CHECK pedido_opme_items_quantity_check: CHECK ((quantity > 0))
//   UNIQUE pedido_opme_items_unique: UNIQUE (pedido_id, opme_item_id)
// Table: pedidos_calendar_events
//   UNIQUE pedidos_calendar_events_pedido_id_calendar_type_surgeon_id_key: UNIQUE (pedido_id, calendar_type, surgeon_id)
//   FOREIGN KEY pedidos_calendar_events_pedido_id_fkey: FOREIGN KEY (pedido_id) REFERENCES pedidos_cirurgia(id) ON DELETE CASCADE
//   PRIMARY KEY pedidos_calendar_events_pkey: PRIMARY KEY (id)
//   FOREIGN KEY pedidos_calendar_events_surgeon_id_fkey: FOREIGN KEY (surgeon_id) REFERENCES auth.users(id)
// Table: pedidos_cirurgia
//   CHECK pedidos_cirurgia_asa_classification_check: CHECK ((asa_classification = ANY (ARRAY['ASA I'::text, 'ASA II'::text, 'ASA III'::text, 'ASA IV'::text, 'ASA V'::text])))
//   FOREIGN KEY pedidos_cirurgia_cancellation_actor_id_fkey: FOREIGN KEY (cancellation_actor_id) REFERENCES auth.users(id)
//   FOREIGN KEY pedidos_cirurgia_diagnostico_cid10_id_fkey: FOREIGN KEY (diagnostico_cid10_id) REFERENCES diagnosticos_cid10(id)
//   CHECK pedidos_cirurgia_guide_type_check: CHECK ((guide_type = ANY (ARRAY['TISS'::text, 'AIH'::text, 'Particular'::text])))
//   CHECK pedidos_cirurgia_laterality_check: CHECK ((laterality = ANY (ARRAY['Direito'::text, 'Esquerdo'::text, 'Bilateral'::text, 'N/A'::text])))
//   FOREIGN KEY pedidos_cirurgia_pacote_opme_id_fkey: FOREIGN KEY (pacote_opme_id) REFERENCES pacotes_opme(id)
//   FOREIGN KEY pedidos_cirurgia_patient_id_fkey: FOREIGN KEY (patient_id) REFERENCES patients(id)
//   PRIMARY KEY pedidos_cirurgia_pkey: PRIMARY KEY (id)
//   FOREIGN KEY pedidos_cirurgia_procedure_id_fkey: FOREIGN KEY (procedure_id) REFERENCES procedures(id)
//   FOREIGN KEY pedidos_cirurgia_proctor_id_fkey: FOREIGN KEY (proctor_id) REFERENCES auth.users(id)
//   FOREIGN KEY pedidos_cirurgia_secretary_id_fkey: FOREIGN KEY (secretary_id) REFERENCES auth.users(id)
//   FOREIGN KEY pedidos_cirurgia_surgeon_id_fkey: FOREIGN KEY (surgeon_id) REFERENCES profiles(id) ON DELETE RESTRICT
// Table: pedidos_cirurgia_auditoria
//   FOREIGN KEY pedidos_cirurgia_auditoria_pedido_id_fkey: FOREIGN KEY (pedido_id) REFERENCES pedidos_cirurgia(id) ON DELETE CASCADE
//   PRIMARY KEY pedidos_cirurgia_auditoria_pkey: PRIMARY KEY (id)
// Table: pedidos_docs_exports
//   UNIQUE pedidos_docs_exports_doc_id_key: UNIQUE (doc_id)
//   FOREIGN KEY pedidos_docs_exports_generated_by_fkey: FOREIGN KEY (generated_by) REFERENCES profiles(id)
//   FOREIGN KEY pedidos_docs_exports_generated_by_fkey1: FOREIGN KEY (generated_by) REFERENCES profiles(id)
//   FOREIGN KEY pedidos_docs_exports_pedido_id_fkey: FOREIGN KEY (pedido_id) REFERENCES pedidos_cirurgia(id) ON DELETE CASCADE
//   FOREIGN KEY pedidos_docs_exports_pedido_id_fkey1: FOREIGN KEY (pedido_id) REFERENCES pedidos_cirurgia(id)
//   PRIMARY KEY pedidos_docs_exports_pkey: PRIMARY KEY (id)
// Table: pedidos_documentos
//   FOREIGN KEY pedidos_documentos_pedido_id_fkey: FOREIGN KEY (pedido_id) REFERENCES pedidos_cirurgia(id) ON DELETE CASCADE
//   PRIMARY KEY pedidos_documentos_pkey: PRIMARY KEY (id)
//   FOREIGN KEY pedidos_documentos_uploaded_by_fkey: FOREIGN KEY (uploaded_by) REFERENCES auth.users(id)
// Table: procedures
//   PRIMARY KEY procedures_pkey: PRIMARY KEY (id)
//   UNIQUE procedures_tuss_code_key: UNIQUE (tuss_code)
// Table: profiles
//   FOREIGN KEY profiles_id_fkey: FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
//   PRIMARY KEY profiles_pkey: PRIMARY KEY (id)
// Table: resource_allocation
//   FOREIGN KEY resource_allocation_allocated_by_fkey: FOREIGN KEY (allocated_by) REFERENCES profiles(id) ON DELETE RESTRICT
//   FOREIGN KEY resource_allocation_allocated_proctor_id_fkey: FOREIGN KEY (allocated_proctor_id) REFERENCES profiles(id) ON DELETE SET NULL
//   FOREIGN KEY resource_allocation_allocated_surgeon_id_fkey: FOREIGN KEY (allocated_surgeon_id) REFERENCES profiles(id) ON DELETE RESTRICT
//   CHECK resource_allocation_estimated_duration_minutes_check: CHECK ((estimated_duration_minutes >= 1))
//   FOREIGN KEY resource_allocation_original_preference_id_fkey: FOREIGN KEY (original_preference_id) REFERENCES surgical_request_block_preferences(id) ON DELETE SET NULL
//   FOREIGN KEY resource_allocation_pedido_id_fkey: FOREIGN KEY (pedido_id) REFERENCES pedidos_cirurgia(id) ON DELETE CASCADE
//   PRIMARY KEY resource_allocation_pkey: PRIMARY KEY (id)
//   FOREIGN KEY resource_allocation_robotic_system_id_fkey: FOREIGN KEY (robotic_system_id) REFERENCES robotic_systems(id) ON DELETE CASCADE
//   FOREIGN KEY resource_allocation_surgical_block_id_fkey: FOREIGN KEY (surgical_block_id) REFERENCES surgical_blocks(id) ON DELETE CASCADE
//   FOREIGN KEY resource_allocation_surgical_room_id_fkey: FOREIGN KEY (surgical_room_id) REFERENCES surgical_rooms(id) ON DELETE CASCADE
// Table: robotic_systems
//   FOREIGN KEY robotic_systems_facility_id_fkey: FOREIGN KEY (facility_id) REFERENCES profiles(id)
//   PRIMARY KEY robotic_systems_pkey: PRIMARY KEY (id)
//   UNIQUE robotic_systems_serial_number_key: UNIQUE (serial_number)
// Table: sectors
//   UNIQUE sectors_name_key: UNIQUE (name)
//   PRIMARY KEY sectors_pkey: PRIMARY KEY (id)
// Table: surgical_block_exceptions
//   FOREIGN KEY surgical_block_exceptions_hospital_id_fkey: FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE
//   PRIMARY KEY surgical_block_exceptions_pkey: PRIMARY KEY (id)
//   FOREIGN KEY surgical_block_exceptions_surgical_block_template_id_fkey: FOREIGN KEY (surgical_block_template_id) REFERENCES surgical_block_templates(id) ON DELETE CASCADE
// Table: surgical_block_templates
//   FOREIGN KEY surgical_block_templates_hospital_id_fkey: FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE
//   PRIMARY KEY surgical_block_templates_pkey: PRIMARY KEY (id)
//   FOREIGN KEY surgical_block_templates_surgical_room_id_fkey: FOREIGN KEY (surgical_room_id) REFERENCES surgical_rooms(id) ON DELETE CASCADE
//   CHECK valid_block_times: CHECK ((block_start_time < block_end_time))
// Table: surgical_blocks
//   FOREIGN KEY surgical_blocks_assigned_proctor_id_fkey: FOREIGN KEY (assigned_proctor_id) REFERENCES profiles(id) ON DELETE SET NULL
//   FOREIGN KEY surgical_blocks_assigned_surgeon_id_fkey: FOREIGN KEY (assigned_surgeon_id) REFERENCES profiles(id) ON DELETE SET NULL
//   FOREIGN KEY surgical_blocks_hospital_id_fkey: FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE
//   PRIMARY KEY surgical_blocks_pkey: PRIMARY KEY (id)
//   FOREIGN KEY surgical_blocks_surgical_room_id_fkey: FOREIGN KEY (surgical_room_id) REFERENCES surgical_rooms(id) ON DELETE CASCADE
//   FOREIGN KEY surgical_blocks_template_id_fkey: FOREIGN KEY (template_id) REFERENCES surgical_block_templates(id) ON DELETE SET NULL
// Table: surgical_request_block_preferences
//   UNIQUE surgical_request_block_prefer_pedido_cirurgia_id_preference_key: UNIQUE (pedido_cirurgia_id, preference_order)
//   UNIQUE surgical_request_block_prefer_pedido_cirurgia_id_surgical_b_key: UNIQUE (pedido_cirurgia_id, surgical_block_id)
//   FOREIGN KEY surgical_request_block_preferences_hospital_id_fkey: FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE
//   FOREIGN KEY surgical_request_block_preferences_pedido_cirurgia_id_fkey: FOREIGN KEY (pedido_cirurgia_id) REFERENCES pedidos_cirurgia(id) ON DELETE CASCADE
//   PRIMARY KEY surgical_request_block_preferences_pkey: PRIMARY KEY (id)
//   CHECK surgical_request_block_preferences_preference_order_check: CHECK ((preference_order = ANY (ARRAY[1, 2, 3])))
//   FOREIGN KEY surgical_request_block_preferences_surgical_block_id_fkey: FOREIGN KEY (surgical_block_id) REFERENCES surgical_blocks(id) ON DELETE RESTRICT
// Table: surgical_rooms
//   FOREIGN KEY surgical_rooms_hospital_id_fkey: FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE
//   UNIQUE surgical_rooms_hospital_room_unique: UNIQUE (hospital_id, room_name)
//   PRIMARY KEY surgical_rooms_pkey: PRIMARY KEY (id)
//   FOREIGN KEY surgical_rooms_robotic_system_id_fkey: FOREIGN KEY (robotic_system_id) REFERENCES robotic_systems(id) ON DELETE SET NULL
//   UNIQUE surgical_rooms_room_number_key: UNIQUE (room_number)
// Table: user_roles
//   FOREIGN KEY user_roles_granted_by_fkey: FOREIGN KEY (granted_by) REFERENCES auth.users(id)
//   PRIMARY KEY user_roles_pkey: PRIMARY KEY (id)
//   FOREIGN KEY user_roles_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
//   UNIQUE user_roles_user_id_role_key: UNIQUE (user_id, role)

// --- ROW LEVEL SECURITY POLICIES ---
// Table: agendamento_propostas
//   Policy "agendamento_propostas_insert_surgeon" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: ((( SELECT pedidos_cirurgia.surgeon_id    FROM pedidos_cirurgia   WHERE (pedidos_cirurgia.id = agendamento_propostas.pedido_id)) = auth.uid()) OR has_role('admin'::text))
//   Policy "agendamento_propostas_select_surgeon" (SELECT, PERMISSIVE) roles={public}
//     USING: ((( SELECT pedidos_cirurgia.surgeon_id    FROM pedidos_cirurgia   WHERE (pedidos_cirurgia.id = agendamento_propostas.pedido_id)) = auth.uid()) OR has_role('admin'::text))
// Table: audit_log
//   Policy "Authenticated users can insert audit_log" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (changed_by = auth.uid())
//   Policy "Authenticated users can read audit_log" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
// Table: audit_logs
//   Policy "audit_logs_insert_system" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: true
//   Policy "audit_logs_select_admin" (SELECT, PERMISSIVE) roles={public}
//     USING: has_role('admin'::text)
// Table: diagnosticos_cid10
//   Policy "diagnosticos_cid10_select" (SELECT, PERMISSIVE) roles={public}
//     USING: (auth.role() = 'authenticated'::text)
// Table: google_oauth_tokens
//   Policy "google_oauth_tokens_insert" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (user_id = auth.uid())
//   Policy "google_oauth_tokens_select" (SELECT, PERMISSIVE) roles={public}
//     USING: (user_id = auth.uid())
//   Policy "google_oauth_tokens_update" (UPDATE, PERMISSIVE) roles={public}
//     USING: (user_id = auth.uid())
// Table: hospital_users
//   Policy "admin_manage_hospital_users" (ALL, PERMISSIVE) roles={public}
//     USING: has_role('admin'::text)
//   Policy "select_own_hospital_users" (SELECT, PERMISSIVE) roles={public}
//     USING: ((user_id = auth.uid()) OR has_role('admin'::text) OR (hospital_id IN ( SELECT get_user_managed_hospitals() AS get_user_managed_hospitals)))
// Table: hospitals
//   Policy "admin_manage_hospitals" (ALL, PERMISSIVE) roles={public}
//     USING: has_role('admin'::text)
//   Policy "select_active_hospitals" (SELECT, PERMISSIVE) roles={public}
//     USING: (is_active = true)
// Table: opme_items
//   Policy "Authenticated users can read opme_items" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "Only opme and admin can manage opme_items" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM user_roles ur   WHERE ((ur.user_id = auth.uid()) AND (ur.role = ANY (ARRAY['opme'::user_role_type, 'admin'::user_role_type])) AND (ur.is_active = true))))
//     WITH CHECK: (EXISTS ( SELECT 1    FROM user_roles ur   WHERE ((ur.user_id = auth.uid()) AND (ur.role = ANY (ARRAY['opme'::user_role_type, 'admin'::user_role_type])) AND (ur.is_active = true))))
//   Policy "opme_items_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM user_roles ur   WHERE ((ur.user_id = auth.uid()) AND (ur.role = ANY (ARRAY['opme'::user_role_type, 'admin'::user_role_type])) AND (ur.is_active = true))))
//     WITH CHECK: (EXISTS ( SELECT 1    FROM user_roles ur   WHERE ((ur.user_id = auth.uid()) AND (ur.role = ANY (ARRAY['opme'::user_role_type, 'admin'::user_role_type])) AND (ur.is_active = true))))
//   Policy "opme_items_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
// Table: pacotes_opme
//   Policy "pacotes_opme_select" (SELECT, PERMISSIVE) roles={public}
//     USING: (auth.role() = 'authenticated'::text)
// Table: pacotes_opme_itens
//   Policy "pacotes_opme_itens_select" (SELECT, PERMISSIVE) roles={public}
//     USING: (auth.role() = 'authenticated'::text)
// Table: patients
//   Policy "patients_delete" (DELETE, PERMISSIVE) roles={public}
//     USING: has_role('admin'::text)
//   Policy "patients_insert_owner" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: ((created_by = auth.uid()) OR has_role('surgeon'::text))
//   Policy "patients_select" (SELECT, PERMISSIVE) roles={public}
//     USING: ((created_by = auth.uid()) OR has_any_role(ARRAY['secretary'::text, 'opme'::text, 'billing'::text, 'nursing'::text, 'coordinator'::text, 'surgeon'::text, 'admin'::text]))
//   Policy "patients_select_admin" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: has_role('admin'::text)
//   Policy "patients_select_owner" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: ((created_by = auth.uid()) OR has_any_role(ARRAY['secretary'::text, 'admin'::text]))
//   Policy "patients_update" (UPDATE, PERMISSIVE) roles={public}
//     USING: has_any_role(ARRAY['secretary'::text, 'admin'::text])
//     WITH CHECK: has_any_role(ARRAY['secretary'::text, 'surgeon'::text, 'admin'::text])
//   Policy "patients_update_owner" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: ((created_by = auth.uid()) OR has_any_role(ARRAY['secretary'::text, 'admin'::text]))
// Table: pedido_opme_items
//   Policy "Authenticated users can read pedido_opme_items" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "Only opme and admin can manage pedido_opme_items" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM user_roles ur   WHERE ((ur.user_id = auth.uid()) AND (ur.role = ANY (ARRAY['opme'::user_role_type, 'admin'::user_role_type])) AND (ur.is_active = true))))
//     WITH CHECK: (EXISTS ( SELECT 1    FROM user_roles ur   WHERE ((ur.user_id = auth.uid()) AND (ur.role = ANY (ARRAY['opme'::user_role_type, 'admin'::user_role_type])) AND (ur.is_active = true))))
//   Policy "pedido_opme_items_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM user_roles ur   WHERE ((ur.user_id = auth.uid()) AND (ur.role = ANY (ARRAY['opme'::user_role_type, 'admin'::user_role_type])) AND (ur.is_active = true))))
//     WITH CHECK: (EXISTS ( SELECT 1    FROM user_roles ur   WHERE ((ur.user_id = auth.uid()) AND (ur.role = ANY (ARRAY['opme'::user_role_type, 'admin'::user_role_type])) AND (ur.is_active = true))))
//   Policy "pedido_opme_items_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
// Table: pedidos_calendar_events
//   Policy "allow_delete_calendar_events" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "allow_insert_calendar_events" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: true
//   Policy "allow_update_calendar_events" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
//   Policy "surgeon_see_own_events" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: ((surgeon_id = auth.uid()) OR ((calendar_type)::text = 'SERVICE_ACCOUNT'::text) OR (EXISTS ( SELECT 1    FROM user_roles   WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = 'admin'::user_role_type)))))
// Table: pedidos_cirurgia
//   Policy "pedidos_insert" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (has_any_role(ARRAY['surgeon'::text, 'secretary'::text]) AND (surgeon_id = auth.uid()))
//   Policy "pedidos_select_staff_all" (SELECT, PERMISSIVE) roles={public}
//     USING: has_any_role(ARRAY['secretary'::text, 'opme'::text, 'billing'::text, 'nursing'::text, 'coordinator'::text, 'admin'::text])
//   Policy "pedidos_select_surgeon_only" (SELECT, PERMISSIVE) roles={public}
//     USING: (has_role('surgeon'::text) AND (NOT has_any_role(ARRAY['secretary'::text, 'opme'::text, 'billing'::text, 'nursing'::text, 'coordinator'::text, 'admin'::text])) AND (surgeon_id = auth.uid()))
//   Policy "pedidos_update_admin" (UPDATE, PERMISSIVE) roles={public}
//     USING: has_role('admin'::text)
//   Policy "pedidos_update_billing" (UPDATE, PERMISSIVE) roles={public}
//     USING: (has_role('billing'::text) AND (status = ANY (ARRAY['3_EM_AUDITORIA'::surgery_status, '4_PENDENCIA_TECNICA'::surgery_status, '5_AUTORIZADO'::surgery_status])))
//   Policy "pedidos_update_coordinator" (UPDATE, PERMISSIVE) roles={public}
//     USING: (has_role('coordinator'::text) AND (status = ANY (ARRAY['5_AUTORIZADO'::surgery_status, '6_AGUARDANDO_MAPA'::surgery_status, '7_AGENDADO_CC'::surgery_status])))
//   Policy "pedidos_update_nursing" (UPDATE, PERMISSIVE) roles={public}
//     USING: (has_role('nursing'::text) AND (status = ANY (ARRAY['7_AGENDADO_CC'::surgery_status, '8_EM_EXECUCAO'::surgery_status, '9_REALIZADO'::surgery_status, '10_CANCELADO'::surgery_status])))
//   Policy "pedidos_update_opme" (UPDATE, PERMISSIVE) roles={public}
//     USING: (has_role('opme'::text) AND (status = '2_AGUARDANDO_OPME'::surgery_status))
//   Policy "pedidos_update_surgeon_only" (UPDATE, PERMISSIVE) roles={public}
//     USING: (has_role('surgeon'::text) AND (NOT has_any_role(ARRAY['secretary'::text, 'opme'::text, 'billing'::text, 'nursing'::text, 'coordinator'::text, 'admin'::text])) AND (surgeon_id = auth.uid()))
// Table: pedidos_cirurgia_auditoria
//   Policy "Usuários podem ler auditoria de seus pedidos" (SELECT, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM pedidos_cirurgia   WHERE ((pedidos_cirurgia.id = pedidos_cirurgia_auditoria.pedido_id) AND (pedidos_cirurgia.surgeon_id = auth.uid()))))
// Table: pedidos_docs_exports
//   Policy "pedidos_docs_select" (SELECT, PERMISSIVE) roles={public}
//     USING: (has_role('admin'::text) OR (generated_by = auth.uid()))
// Table: pedidos_documentos
//   Policy "pedidos_documentos_admin" (ALL, PERMISSIVE) roles={public}
//     USING: ((auth.jwt() ->> 'role'::text) = 'admin'::text)
//   Policy "pedidos_documentos_delete_surgeon" (UPDATE, PERMISSIVE) roles={public}
//     USING: ((EXISTS ( SELECT 1    FROM pedidos_cirurgia pc   WHERE ((pc.id = pedidos_documentos.pedido_id) AND (pc.surgeon_id = auth.uid())))) AND (uploaded_by = auth.uid()))
//     WITH CHECK: (EXISTS ( SELECT 1    FROM pedidos_cirurgia pc   WHERE ((pc.id = pedidos_documentos.pedido_id) AND (pc.surgeon_id = auth.uid()))))
//   Policy "pedidos_documentos_insert_surgeon" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: ((EXISTS ( SELECT 1    FROM pedidos_cirurgia pc   WHERE ((pc.id = pedidos_documentos.pedido_id) AND (pc.surgeon_id = auth.uid())))) AND (uploaded_by = auth.uid()))
//   Policy "pedidos_documentos_select_auditor" (SELECT, PERMISSIVE) roles={public}
//     USING: ((auth.jwt() ->> 'role'::text) = 'auditor'::text)
//   Policy "pedidos_documentos_select_surgeon" (SELECT, PERMISSIVE) roles={public}
//     USING: ((EXISTS ( SELECT 1    FROM pedidos_cirurgia pc   WHERE ((pc.id = pedidos_documentos.pedido_id) AND (pc.surgeon_id = auth.uid())))) OR ((auth.jwt() ->> 'role'::text) = 'admin'::text))
// Table: procedures
//   Policy "procedures_delete" (DELETE, PERMISSIVE) roles={public}
//     USING: has_role('admin'::text)
//   Policy "procedures_insert" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: has_any_role(ARRAY['admin'::text, 'nursing'::text])
//   Policy "procedures_select" (SELECT, PERMISSIVE) roles={public}
//     USING: (auth.role() = 'authenticated'::text)
//   Policy "procedures_select_dashboard" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "procedures_update" (UPDATE, PERMISSIVE) roles={public}
//     USING: has_any_role(ARRAY['admin'::text, 'nursing'::text])
// Table: profiles
//   Policy "Admin can delete any profile" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM user_roles ur   WHERE ((ur.user_id = auth.uid()) AND (ur.role = 'admin'::user_role_type) AND (ur.is_active = true))))
//   Policy "Admin can update any profile" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM user_roles   WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = 'admin'::user_role_type) AND (user_roles.is_active = true))))
//     WITH CHECK: (EXISTS ( SELECT 1    FROM user_roles   WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = 'admin'::user_role_type) AND (user_roles.is_active = true))))
//   Policy "Users can insert their own profile" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (auth.uid() = id)
//   Policy "profiles_select_all" (SELECT, PERMISSIVE) roles={public}
//     USING: true
//   Policy "profiles_select_dashboard" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "profiles_update_own" (UPDATE, PERMISSIVE) roles={public}
//     USING: (auth.uid() = id)
// Table: resource_allocation
//   Policy "allocations_manage_admin" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (has_role('admin'::text) OR has_role('facility_manager'::text))
//     WITH CHECK: (has_role('admin'::text) OR has_role('facility_manager'::text))
// Table: robotic_systems
//   Policy "robotic_systems_manage_admin" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM user_roles   WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = 'admin'::user_role_type) AND (user_roles.is_active = true))))
//     WITH CHECK: (EXISTS ( SELECT 1    FROM user_roles   WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = 'admin'::user_role_type) AND (user_roles.is_active = true))))
//   Policy "robotic_systems_select_all" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
// Table: sectors
//   Policy "sectors_all_admin" (ALL, PERMISSIVE) roles={public}
//     USING: has_role('admin'::text)
//   Policy "sectors_select" (SELECT, PERMISSIVE) roles={public}
//     USING: has_role('admin'::text)
// Table: surgical_block_exceptions
//   Policy "delete_exceptions_by_hospital" (DELETE, PERMISSIVE) roles={public}
//     USING: (hospital_id IN ( SELECT hospital_users.hospital_id    FROM hospital_users   WHERE ((hospital_users.user_id = auth.uid()) AND (hospital_users.role = ANY (ARRAY['facility_manager'::text, 'admin'::text])) AND (hospital_users.is_active = true))))
//   Policy "exceptions_all_admin" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (has_role('admin'::text) OR has_role('facility_manager'::text))
//     WITH CHECK: (has_role('admin'::text) OR has_role('facility_manager'::text))
//   Policy "insert_exceptions_by_hospital" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (hospital_id IN ( SELECT hospital_users.hospital_id    FROM hospital_users   WHERE ((hospital_users.user_id = auth.uid()) AND (hospital_users.role = ANY (ARRAY['facility_manager'::text, 'admin'::text])) AND (hospital_users.is_active = true))))
//   Policy "select_exceptions_by_hospital" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "update_exceptions_by_hospital" (UPDATE, PERMISSIVE) roles={public}
//     USING: (hospital_id IN ( SELECT hospital_users.hospital_id    FROM hospital_users   WHERE ((hospital_users.user_id = auth.uid()) AND (hospital_users.role = ANY (ARRAY['facility_manager'::text, 'admin'::text])) AND (hospital_users.is_active = true))))
// Table: surgical_block_templates
//   Policy "delete_templates_by_hospital" (DELETE, PERMISSIVE) roles={public}
//     USING: (hospital_id IN ( SELECT hospital_users.hospital_id    FROM hospital_users   WHERE ((hospital_users.user_id = auth.uid()) AND (hospital_users.role = ANY (ARRAY['facility_manager'::text, 'admin'::text])) AND (hospital_users.is_active = true))))
//   Policy "insert_templates_by_hospital" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (hospital_id IN ( SELECT hospital_users.hospital_id    FROM hospital_users   WHERE ((hospital_users.user_id = auth.uid()) AND (hospital_users.role = ANY (ARRAY['facility_manager'::text, 'admin'::text])) AND (hospital_users.is_active = true))))
//   Policy "select_templates_by_hospital" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "templates_all_admin" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (has_role('admin'::text) OR has_role('facility_manager'::text))
//     WITH CHECK: (has_role('admin'::text) OR has_role('facility_manager'::text))
//   Policy "update_templates_by_hospital" (UPDATE, PERMISSIVE) roles={public}
//     USING: (hospital_id IN ( SELECT hospital_users.hospital_id    FROM hospital_users   WHERE ((hospital_users.user_id = auth.uid()) AND (hospital_users.role = ANY (ARRAY['facility_manager'::text, 'admin'::text])) AND (hospital_users.is_active = true))))
// Table: surgical_blocks
//   Policy "delete_blocks_by_hospital" (DELETE, PERMISSIVE) roles={public}
//     USING: (hospital_id IN ( SELECT hospital_users.hospital_id    FROM hospital_users   WHERE ((hospital_users.user_id = auth.uid()) AND (hospital_users.role = ANY (ARRAY['facility_manager'::text, 'admin'::text])) AND (hospital_users.is_active = true))))
//   Policy "insert_blocks_by_hospital" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (hospital_id IN ( SELECT hospital_users.hospital_id    FROM hospital_users   WHERE ((hospital_users.user_id = auth.uid()) AND (hospital_users.role = ANY (ARRAY['facility_manager'::text, 'admin'::text])) AND (hospital_users.is_active = true))))
//   Policy "surgical_blocks_manage_admin" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM user_roles   WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = ANY (ARRAY['admin'::user_role_type, 'facility_manager'::user_role_type])) AND (user_roles.is_active = true))))
//     WITH CHECK: (EXISTS ( SELECT 1    FROM user_roles   WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = ANY (ARRAY['admin'::user_role_type, 'facility_manager'::user_role_type])) AND (user_roles.is_active = true))))
//   Policy "surgical_blocks_select_all" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "update_blocks_by_hospital" (UPDATE, PERMISSIVE) roles={public}
//     USING: (hospital_id IN ( SELECT hospital_users.hospital_id    FROM hospital_users   WHERE ((hospital_users.user_id = auth.uid()) AND (hospital_users.role = ANY (ARRAY['facility_manager'::text, 'admin'::text])) AND (hospital_users.is_active = true))))
// Table: surgical_request_block_preferences
//   Policy "delete_preferences_admin_only" (DELETE, PERMISSIVE) roles={public}
//     USING: has_role('admin'::text)
//   Policy "insert_preferences" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (auth.role() = 'authenticated'::text)
//   Policy "no_update_preferences" (UPDATE, PERMISSIVE) roles={public}
//     USING: false
//   Policy "prevent_preference_on_allocated_blocks" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (NOT (EXISTS ( SELECT 1    FROM surgical_blocks sb   WHERE ((sb.id = surgical_request_block_preferences.surgical_block_id) AND (sb.is_available = false)))))
//   Policy "select_preferences_by_hospital" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
// Table: surgical_rooms
//   Policy "Rooms manageable by admin or facility_manager" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (has_role('admin'::text) OR has_role('facility_manager'::text))
//     WITH CHECK: (has_role('admin'::text) OR has_role('facility_manager'::text))
//   Policy "delete_rooms_by_hospital" (DELETE, PERMISSIVE) roles={public}
//     USING: (hospital_id IN ( SELECT hospital_users.hospital_id    FROM hospital_users   WHERE ((hospital_users.user_id = auth.uid()) AND (hospital_users.role = ANY (ARRAY['facility_manager'::text, 'admin'::text])) AND (hospital_users.is_active = true))))
//   Policy "insert_rooms_by_hospital" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (hospital_id IN ( SELECT hospital_users.hospital_id    FROM hospital_users   WHERE ((hospital_users.user_id = auth.uid()) AND (hospital_users.role = ANY (ARRAY['facility_manager'::text, 'admin'::text])) AND (hospital_users.is_active = true))))
//   Policy "select_rooms_by_hospital" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "update_rooms_by_hospital" (UPDATE, PERMISSIVE) roles={public}
//     USING: (hospital_id IN ( SELECT hospital_users.hospital_id    FROM hospital_users   WHERE ((hospital_users.user_id = auth.uid()) AND (hospital_users.role = ANY (ARRAY['facility_manager'::text, 'admin'::text])) AND (hospital_users.is_active = true))))
// Table: user_roles
//   Policy "user_roles_delete_admin" (DELETE, PERMISSIVE) roles={public}
//     USING: has_role('admin'::text)
//   Policy "user_roles_insert_admin" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: has_role('admin'::text)
//   Policy "user_roles_select_own" (SELECT, PERMISSIVE) roles={public}
//     USING: ((user_id = auth.uid()) OR has_role('admin'::text))
//   Policy "user_roles_update_admin" (UPDATE, PERMISSIVE) roles={public}
//     USING: has_role('admin'::text)

// --- DATABASE FUNCTIONS ---
// FUNCTION create_auth_user(text, text, text)
//   CREATE OR REPLACE FUNCTION public.create_auth_user(email text, password text, user_role text)
//    RETURNS uuid
//    LANGUAGE plpgsql
//   AS $function$
//   DECLARE
//     v_user_id UUID;
//   BEGIN
//     v_user_id := gen_random_uuid();
//     INSERT INTO auth.users (
//       id, instance_id, email, encrypted_password, email_confirmed_at,
//       created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
//       is_super_admin, role, aud,
//       confirmation_token, recovery_token, email_change_token_new,
//       email_change, email_change_token_current,
//       phone, phone_change, phone_change_token, reauthentication_token
//     ) VALUES (
//       v_user_id,
//       '00000000-0000-0000-0000-000000000000',
//       email,
//       crypt(password, gen_salt('bf')),
//       now(), now(), now(),
//       jsonb_build_object('provider', 'email', 'providers', ARRAY['email']),
//       jsonb_build_object('user_role', user_role),
//       false, 'authenticated', 'authenticated',
//       '', '', '', '', '', NULL, '', '', ''
//     );
//
//     INSERT INTO public.user_roles (user_id, role)
//     VALUES (v_user_id, user_role::public.user_role_type)
//     ON CONFLICT (user_id, role) DO NOTHING;
//
//     RETURN v_user_id;
//   END;
//   $function$
//
// FUNCTION fn_audit_block_preferences_delete()
//   CREATE OR REPLACE FUNCTION public.fn_audit_block_preferences_delete()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   BEGIN
//     INSERT INTO audit_log (
//       action,
//       changed_by,
//       notes,
//       changed_at,
//       pedido_id,
//       status_to
//     )
//     VALUES (
//       'Deletar Preferência de Bloco',
//       auth.uid(),
//       FORMAT('pedido_cirurgia_id: %s | surgical_block_id: %s | preference_order: %s',
//         OLD.pedido_cirurgia_id::TEXT, OLD.surgical_block_id::TEXT, OLD.preference_order::TEXT),
//       NOW(),
//       OLD.pedido_cirurgia_id,
//       'N/A'
//     );
//
//     RETURN OLD;
//   END;
//   $function$
//
// FUNCTION fn_audit_log_hash_before_insert()
//   CREATE OR REPLACE FUNCTION public.fn_audit_log_hash_before_insert()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   DECLARE
//     v_previous_hash VARCHAR(64);
//   BEGIN
//     SELECT record_hash INTO v_previous_hash
//     FROM audit_log
//     WHERE pedido_id = NEW.pedido_id
//     ORDER BY changed_at DESC
//     LIMIT 1;
//
//     NEW.previous_hash := COALESCE(v_previous_hash, '0000000000000000000000000000000000000000000000000000000000000000');
//
//     NEW.record_hash := fn_calculate_record_hash(
//       NEW.pedido_id,
//       NEW.changed_by,
//       NEW.status_from,
//       NEW.status_to,
//       NEW.changed_at
//     );
//
//     RETURN NEW;
//   END;
//   $function$
//
// FUNCTION fn_audit_log_populate_action_type()
//   CREATE OR REPLACE FUNCTION public.fn_audit_log_populate_action_type()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   BEGIN
//     -- Se action_type não foi fornecido, mapear automaticamente
//     IF NEW.action_type IS NULL THEN
//       NEW.action_type := fn_map_status_to_action(NEW.status_from, NEW.status_to);
//     END IF;
//
//     RETURN NEW;
//   END;
//   $function$
//
// FUNCTION fn_audit_pedidos()
//   CREATE OR REPLACE FUNCTION public.fn_audit_pedidos()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//    SET search_path TO 'public'
//   AS $function$
//   DECLARE
//     v_actor_role TEXT;
//   BEGIN
//     SELECT role::text INTO v_actor_role
//     FROM public.user_roles
//     WHERE user_id = auth.uid() AND is_active = TRUE
//     LIMIT 1;
//
//     INSERT INTO public.audit_logs (
//       actor_id, actor_role, event_type,
//       table_name, record_id, old_value, new_value
//     ) VALUES (
//       auth.uid(),
//       v_actor_role,
//       CASE
//         WHEN TG_OP = 'INSERT' THEN 'PEDIDO_CRIADO'
//         WHEN TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN 'STATUS_CHANGE'
//         WHEN TG_OP = 'UPDATE' THEN 'PEDIDO_ATUALIZADO'
//         WHEN TG_OP = 'DELETE' THEN 'PEDIDO_DELETADO'
//       END,
//       TG_TABLE_NAME,
//       COALESCE(NEW.id, OLD.id),
//       CASE WHEN TG_OP != 'INSERT' THEN to_jsonb(OLD) ELSE NULL END,
//       CASE WHEN TG_OP != 'DELETE' THEN to_jsonb(NEW) ELSE NULL END
//     );
//
//     RETURN COALESCE(NEW, OLD);
//   END;
//   $function$
//
// FUNCTION fn_audit_roles()
//   CREATE OR REPLACE FUNCTION public.fn_audit_roles()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//    SET search_path TO 'public'
//   AS $function$
//   BEGIN
//     INSERT INTO public.audit_logs (
//       actor_id, event_type, table_name, record_id, old_value, new_value
//     ) VALUES (
//       auth.uid(), 'ROLE_CHANGE', TG_TABLE_NAME,
//       COALESCE(NEW.id, OLD.id),
//       CASE WHEN TG_OP != 'INSERT' THEN to_jsonb(OLD) ELSE NULL END,
//       CASE WHEN TG_OP != 'DELETE' THEN to_jsonb(NEW) ELSE NULL END
//     );
//     RETURN COALESCE(NEW, OLD);
//   END;
//   $function$
//
// FUNCTION fn_block_preferences_update()
//   CREATE OR REPLACE FUNCTION public.fn_block_preferences_update()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   BEGIN
//     RAISE EXCEPTION 'Erro: Preferências de blocos são imutáveis após criação. Não é permitido modificar registros existentes.';
//   END;
//   $function$
//
// FUNCTION fn_calculate_record_hash(uuid, uuid, text, text, timestamp with time zone)
//   CREATE OR REPLACE FUNCTION public.fn_calculate_record_hash(p_pedido_id uuid, p_changed_by uuid, p_status_from text, p_status_to text, p_changed_at timestamp with time zone)
//    RETURNS text
//    LANGUAGE plpgsql
//    IMMUTABLE
//   AS $function$
//   DECLARE
//     v_hash_input TEXT;
//     v_hash_output TEXT;
//   BEGIN
//     v_hash_input := CONCAT(
//       p_pedido_id::TEXT, '|',
//       p_changed_by::TEXT, '|',
//       COALESCE(p_status_from, ''), '|',
//       p_status_to, '|',
//       p_changed_at::TEXT
//     );
//
//     v_hash_output := encode(
//       digest(v_hash_input, 'sha256'),
//       'hex'
//     );
//
//     RETURN v_hash_output;
//   END;
//   $function$
//
// FUNCTION fn_generate_recurring_blocks(uuid, date, date)
//   CREATE OR REPLACE FUNCTION public.fn_generate_recurring_blocks(p_template_id uuid, p_start_date date, p_end_date date)
//    RETURNS TABLE(blocks_created integer, message text)
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//     v_template RECORD;
//     v_current_date DATE;
//     v_day_of_week INT;
//     v_template_day_of_week INT;
//     v_blocks_count INT := 0;
//     v_skipped_count INT := 0;
//     v_new_block_id UUID;
//   BEGIN
//     -- Obter informações do template
//     SELECT
//       sbt.id,
//       sbt.surgical_room_id,
//       sbt.day_of_week,
//       sbt.block_start_time,
//       sbt.block_end_time,
//       sbt.hospital_id
//     INTO v_template
//     FROM public.surgical_block_templates sbt
//     WHERE sbt.id = p_template_id;
//
//     -- Validar se template existe
//     IF v_template IS NULL THEN
//       RETURN QUERY SELECT 0::INT, 'Erro: Template não encontrado'::TEXT;
//       RETURN;
//     END IF;
//
//     -- Converter day_of_week do Enum para número (1=Monday, 7=Sunday)
//     v_template_day_of_week := CASE v_template.day_of_week
//       WHEN 'MONDAY' THEN 1
//       WHEN 'TUESDAY' THEN 2
//       WHEN 'WEDNESDAY' THEN 3
//       WHEN 'THURSDAY' THEN 4
//       WHEN 'FRIDAY' THEN 5
//       WHEN 'SATURDAY' THEN 6
//       WHEN 'SUNDAY' THEN 7
//     END;
//
//     -- Iterar sobre cada data no período
//     v_current_date := p_start_date;
//     WHILE v_current_date <= p_end_date LOOP
//       -- Obter dia da semana (1=Monday, 7=Sunday)
//       v_day_of_week := EXTRACT(ISODOW FROM v_current_date)::INT;
//
//       -- Se o dia da semana corresponde ao template E não é exceção
//       IF v_day_of_week = v_template_day_of_week
//          AND NOT public.fn_is_exception_date(p_template_id, v_current_date) THEN
//
//         -- Inserir novo bloco
//         INSERT INTO public.surgical_blocks (
//           id,
//           surgical_room_id,
//           block_date,
//           block_start_time,
//           block_end_time,
//           is_available,
//           template_id,
//           hospital_id,
//           created_at,
//           updated_at
//         )
//         VALUES (
//           gen_random_uuid(),
//           v_template.surgical_room_id,
//           v_current_date,
//           v_template.block_start_time,
//           v_template.block_end_time,
//           TRUE,
//           p_template_id,
//           v_template.hospital_id,
//           NOW(),
//           NOW()
//         );
//
//         v_blocks_count := v_blocks_count + 1;
//       ELSIF v_day_of_week = v_template_day_of_week
//             AND public.fn_is_exception_date(p_template_id, v_current_date) THEN
//         v_skipped_count := v_skipped_count + 1;
//       END IF;
//
//       -- Avançar para o próximo dia
//       v_current_date := v_current_date + INTERVAL '1 day';
//     END LOOP;
//
//     -- Registrar auditoria na tabela correta (audit_logs genérico)
//     INSERT INTO public.audit_logs (
//       actor_id,
//       event_type,
//       table_name,
//       record_id,
//       new_value
//     )
//     VALUES (
//       auth.uid(),
//       'GERAR_BLOCOS_RECORRENTES',
//       'surgical_blocks',
//       p_template_id,
//       jsonb_build_object('blocks_created', v_blocks_count, 'exceptions_skipped', v_skipped_count)
//     );
//
//     -- Retornar resultado
//     RETURN QUERY SELECT
//       v_blocks_count,
//       FORMAT('Sucesso: %s blocos criados, %s datas excluídas por exceção',
//         v_blocks_count, v_skipped_count)::TEXT;
//   END;
//   $function$
//
// FUNCTION fn_generate_recurring_blocks_12months(uuid)
//   CREATE OR REPLACE FUNCTION public.fn_generate_recurring_blocks_12months(p_template_id uuid)
//    RETURNS TABLE(blocks_created integer, message text)
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//     RETURN QUERY
//     SELECT * FROM public.fn_generate_recurring_blocks(
//       p_template_id,
//       CURRENT_DATE,
//       (CURRENT_DATE + INTERVAL '365 days')::DATE
//     );
//   END;
//   $function$
//
// FUNCTION fn_get_available_blocks_for_request(uuid)
//   CREATE OR REPLACE FUNCTION public.fn_get_available_blocks_for_request(p_pedido_cirurgia_id uuid)
//    RETURNS TABLE(id uuid, surgical_room_id uuid, room_name text, block_date date, block_start_time time without time zone, block_end_time time without time zone, is_available boolean, template_id uuid)
//    LANGUAGE plpgsql
//   AS $function$
//   DECLARE
//     v_requested_date DATE;
//   BEGIN
//     -- Obter data solicitada da cirurgia
//     SELECT (pc.scheduled_date AT TIME ZONE 'UTC')::DATE INTO v_requested_date
//     FROM pedidos_cirurgia pc
//     WHERE pc.id = p_pedido_cirurgia_id;
//
//     IF v_requested_date IS NULL THEN
//       v_requested_date := CURRENT_DATE;
//     END IF;
//
//     -- Retornar blocos elegíveis
//     RETURN QUERY
//     SELECT
//       sb.id,
//       sb.surgical_room_id,
//       sr_room.room_name,
//       sb.block_date,
//       sb.block_start_time,
//       sb.block_end_time,
//       sb.is_available,
//       sb.template_id
//     FROM surgical_blocks sb
//     INNER JOIN surgical_rooms sr_room ON sb.surgical_room_id = sr_room.id
//     WHERE sb.is_available = TRUE
//       AND sb.block_date >= v_requested_date
//     ORDER BY sb.block_date ASC, sb.block_start_time ASC;
//   END;
//   $function$
//
// FUNCTION fn_is_exception_date(uuid, date)
//   CREATE OR REPLACE FUNCTION public.fn_is_exception_date(p_template_id uuid, p_date date)
//    RETURNS boolean
//    LANGUAGE plpgsql
//   AS $function$
//   DECLARE
//     v_exception_count INT;
//   BEGIN
//     SELECT COUNT(*) INTO v_exception_count
//     FROM surgical_block_exceptions
//     WHERE surgical_block_template_id = p_template_id
//       AND exception_date = p_date;
//
//     RETURN v_exception_count > 0;
//   END;
//   $function$
//
// FUNCTION fn_map_status_to_action(character varying, character varying)
//   CREATE OR REPLACE FUNCTION public.fn_map_status_to_action(p_status_from character varying, p_status_to character varying)
//    RETURNS audit_action_type
//    LANGUAGE plpgsql
//    IMMUTABLE
//   AS $function$
//   BEGIN
//     RETURN CASE
//       WHEN p_status_from IS NULL AND p_status_to = '1_RASCUNHO' THEN 'CREATED'::audit_action_type
//       WHEN p_status_to = '2_SUBMETIDO' THEN 'SUBMITTED'::audit_action_type
//       WHEN p_status_to = '3_APROVADO' THEN 'APPROVED'::audit_action_type
//       WHEN p_status_to = '4_REJEITADO' THEN 'REJECTED'::audit_action_type
//       WHEN p_status_to = '7_AGENDADO_CC' THEN 'SCHEDULED'::audit_action_type
//       WHEN p_status_to = '8_EM_EXECUCAO' THEN 'IN_EXECUTION'::audit_action_type
//       WHEN p_status_to = '9_REALIZADO' THEN 'COMPLETED'::audit_action_type
//       WHEN p_status_to = '10_CANCELADO' THEN 'CANCELLED'::audit_action_type
//       ELSE NULL::audit_action_type
//     END;
//   END;
//   $function$
//
// FUNCTION fn_update_pedido_on_allocation()
//   CREATE OR REPLACE FUNCTION public.fn_update_pedido_on_allocation()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   DECLARE
//     v_current_status VARCHAR;
//     v_notes TEXT;
//   BEGIN
//     SELECT status INTO v_current_status
//     FROM public.pedidos_cirurgia
//     WHERE id = NEW.pedido_id;
//
//     IF NEW.is_fallback_allocation THEN
//       v_notes := 'Alocado fora das preferências. Motivo: ' || COALESCE(NEW.fallback_reason, 'Não informado');
//     ELSIF NEW.selected_preference_order IS NOT NULL THEN
//       v_notes := 'Alocado na ' || NEW.selected_preference_order || 'ª Preferência do cirurgião.';
//     ELSE
//       v_notes := 'Alocado (sem preferências registradas).';
//     END IF;
//
//     IF NEW.allocation_status IN ('ALOCADO', 'CONFIRMADO') THEN
//       UPDATE public.surgical_blocks SET is_available = false WHERE id = NEW.surgical_block_id;
//
//       IF v_current_status IN ('6_AGUARDANDO_MAPA', '5_AUTORIZADO') THEN
//         UPDATE public.pedidos_cirurgia
//         SET status = '7_AGENDADO_CC',
//             updated_at = NOW()
//         WHERE id = NEW.pedido_id;
//
//         INSERT INTO public.audit_log (
//           pedido_id, action, changed_by, status_from, status_to, changed_at, notes
//         ) VALUES (
//           NEW.pedido_id, 'Alocar Sala/Robô', NEW.allocated_by, v_current_status, '7_AGENDADO_CC', NOW(), v_notes
//         );
//       END IF;
//     END IF;
//
//     IF NEW.allocation_status = 'CANCELADO' THEN
//       IF NOT EXISTS (
//         SELECT 1 FROM public.resource_allocation
//         WHERE surgical_block_id = NEW.surgical_block_id
//         AND allocation_status IN ('ALOCADO', 'CONFIRMADO')
//         AND id != NEW.id
//       ) THEN
//         UPDATE public.surgical_blocks SET is_available = true WHERE id = NEW.surgical_block_id;
//       END IF;
//
//       IF v_current_status = '7_AGENDADO_CC' THEN
//         UPDATE public.pedidos_cirurgia
//         SET status = '6_AGUARDANDO_MAPA',
//             updated_at = NOW()
//         WHERE id = NEW.pedido_id;
//
//         INSERT INTO public.audit_log (
//           pedido_id, action, changed_by, status_from, status_to, changed_at, notes
//         ) VALUES (
//           NEW.pedido_id, 'Cancelar Alocação', NEW.allocated_by, '7_AGENDADO_CC', '6_AGUARDANDO_MAPA', NOW(), 'Alocação cancelada.'
//         );
//       END IF;
//     END IF;
//
//     RETURN NEW;
//   END;
//   $function$
//
// FUNCTION fn_update_pedidos_documentos_timestamp()
//   CREATE OR REPLACE FUNCTION public.fn_update_pedidos_documentos_timestamp()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   BEGIN
//     NEW.updated_at := now();
//     RETURN NEW;
//   END;
//   $function$
//
// FUNCTION fn_validate_audit_integrity(uuid)
//   CREATE OR REPLACE FUNCTION public.fn_validate_audit_integrity(p_pedido_id uuid)
//    RETURNS TABLE(id uuid, changed_at timestamp with time zone, status_to text, record_hash character varying, previous_hash character varying, hash_valid boolean, integrity_status text)
//    LANGUAGE plpgsql
//   AS $function$
//   BEGIN
//     RETURN QUERY
//     SELECT
//       a.id,
//       a.changed_at,
//       a.status_to,
//       a.record_hash,
//       a.previous_hash,
//       (a.previous_hash = COALESCE(
//         LAG(a.record_hash) OVER (ORDER BY a.changed_at),
//         '0000000000000000000000000000000000000000000000000000000000000000'
//       )) AS hash_valid,
//       CASE
//         WHEN a.previous_hash = COALESCE(
//           LAG(a.record_hash) OVER (ORDER BY a.changed_at),
//           '0000000000000000000000000000000000000000000000000000000000000000'
//         ) THEN 'ÍNTEGRO'
//         ELSE 'COMPROMETIDO'
//       END AS integrity_status
//     FROM audit_log a
//     WHERE a.pedido_id = p_pedido_id
//     ORDER BY a.changed_at ASC;
//   END;
//   $function$
//
// FUNCTION fn_validate_block_for_preference(uuid, uuid)
//   CREATE OR REPLACE FUNCTION public.fn_validate_block_for_preference(p_surgical_block_id uuid, p_pedido_cirurgia_id uuid)
//    RETURNS TABLE(is_valid boolean, validation_message text)
//    LANGUAGE plpgsql
//   AS $function$
//   DECLARE
//     v_block RECORD;
//     v_request RECORD;
//     v_preference_count INT;
//   BEGIN
//     -- Obter informações do bloco
//     SELECT
//       sb.id,
//       sb.is_available,
//       sb.block_date,
//       sb.surgical_room_id
//     INTO v_block
//     FROM surgical_blocks sb
//     WHERE sb.id = p_surgical_block_id;
//
//     -- Obter informações da cirurgia
//     SELECT
//       pc.id,
//       pc.scheduled_date as requested_date
//     INTO v_request
//     FROM pedidos_cirurgia pc
//     WHERE pc.id = p_pedido_cirurgia_id;
//
//     -- Validação 1: Bloco existe?
//     IF v_block IS NULL THEN
//       RETURN QUERY SELECT FALSE, 'Erro: Bloco cirúrgico não encontrado'::TEXT;
//       RETURN;
//     END IF;
//
//     -- Validação 2: Cirurgia existe?
//     IF v_request IS NULL THEN
//       RETURN QUERY SELECT FALSE, 'Erro: Solicitação de cirurgia não encontrada'::TEXT;
//       RETURN;
//     END IF;
//
//     -- Validação 3: Bloco está disponível?
//     IF v_block.is_available = FALSE THEN
//       RETURN QUERY SELECT FALSE, 'Erro: Bloco não está disponível (is_available = false)'::TEXT;
//       RETURN;
//     END IF;
//
//     -- Validação 4: Data do bloco >= data da cirurgia?
//     IF v_request.requested_date IS NOT NULL AND v_block.block_date < (v_request.requested_date AT TIME ZONE 'UTC')::DATE THEN
//       RETURN QUERY SELECT FALSE, FORMAT('Erro: Data do bloco (%s) é anterior à data solicitada (%s)',
//         v_block.block_date::TEXT, (v_request.requested_date AT TIME ZONE 'UTC')::DATE::TEXT)::TEXT;
//       RETURN;
//     END IF;
//
//     -- Validação 5: Bloco já foi selecionado como preferência para esta cirurgia?
//     SELECT COUNT(*) INTO v_preference_count
//     FROM surgical_request_block_preferences
//     WHERE pedido_cirurgia_id = p_pedido_cirurgia_id
//       AND surgical_block_id = p_surgical_block_id;
//
//     IF v_preference_count > 0 THEN
//       RETURN QUERY SELECT FALSE, 'Erro: Este bloco já foi selecionado como preferência para esta cirurgia'::TEXT;
//       RETURN;
//     END IF;
//
//     -- Todas as validações passaram
//     RETURN QUERY SELECT TRUE, 'Bloco é elegível para seleção'::TEXT;
//   END;
//   $function$
//
// FUNCTION fn_validate_block_preferences_on_insert()
//   CREATE OR REPLACE FUNCTION public.fn_validate_block_preferences_on_insert()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   DECLARE
//     v_validation RECORD;
//     v_preference_count INT;
//   BEGIN
//     -- Validar o bloco
//     SELECT * INTO v_validation
//     FROM fn_validate_block_for_preference(NEW.surgical_block_id, NEW.pedido_cirurgia_id);
//
//     IF v_validation.is_valid = FALSE THEN
//       RAISE EXCEPTION 'Validação de preferência falhou: %', v_validation.validation_message;
//     END IF;
//
//     -- Validar que não há mais de 3 preferências para esta cirurgia
//     SELECT COUNT(*) INTO v_preference_count
//     FROM surgical_request_block_preferences
//     WHERE pedido_cirurgia_id = NEW.pedido_cirurgia_id;
//
//     IF v_preference_count >= 3 THEN
//       RAISE EXCEPTION 'Erro: Máximo de 3 preferências por cirurgia já atingido';
//     END IF;
//
//     -- Validar que preference_order é 1, 2 ou 3
//     IF NEW.preference_order NOT IN (1, 2, 3) THEN
//       RAISE EXCEPTION 'Erro: preference_order deve ser 1, 2 ou 3';
//     END IF;
//
//     RETURN NEW;
//   END;
//   $function$
//
// FUNCTION fn_validate_resource_allocation()
//   CREATE OR REPLACE FUNCTION public.fn_validate_resource_allocation()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   DECLARE
//     v_block_duration INT;
//     v_conflict_count INT;
//     v_surgeon_conflict INT;
//     v_block_date DATE;
//     v_block_start_time TIME;
//     v_block_end_time TIME;
//   BEGIN
//     -- Obter informações do bloco cirúrgico
//     SELECT
//       sb.block_date,
//       sb.block_start_time,
//       sb.block_end_time,
//       sb.duration_minutes
//     INTO
//       v_block_date,
//       v_block_start_time,
//       v_block_end_time,
//       v_block_duration
//     FROM surgical_blocks sb
//     WHERE sb.id = NEW.surgical_block_id;
//
//     -- Validação 1: Duração estimada não pode exceder duração do bloco
//     IF v_block_duration < NEW.estimated_duration_minutes THEN
//       RAISE EXCEPTION 'Erro: Duração estimada (% min) excede duração do bloco (% min)',
//         NEW.estimated_duration_minutes, v_block_duration;
//     END IF;
//
//     -- Validação 2: Conflito de sala/robô no mesmo horário
//     SELECT COUNT(*) INTO v_conflict_count
//     FROM resource_allocation ra
//     JOIN surgical_blocks sb ON ra.surgical_block_id = sb.id
//     WHERE ra.surgical_room_id = NEW.surgical_room_id
//       AND ra.robotic_system_id = NEW.robotic_system_id
//       AND sb.block_date = v_block_date
//       AND ra.allocation_status != 'CANCELADO'
//       AND ra.id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000');
//
//     IF v_conflict_count > 0 THEN
//       RAISE EXCEPTION 'Erro: Sala/Robô já alocados neste horário (%). Escolha outro bloco.',
//         v_block_date;
//     END IF;
//
//     -- Validação 3: Conflito de cirurgião no mesmo horário
//     SELECT COUNT(*) INTO v_surgeon_conflict
//     FROM resource_allocation ra
//     JOIN surgical_blocks sb ON ra.surgical_block_id = sb.id
//     WHERE ra.allocated_surgeon_id = NEW.allocated_surgeon_id
//       AND sb.block_date = v_block_date
//       AND ra.allocation_status != 'CANCELADO'
//       AND ra.id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000');
//
//     IF v_surgeon_conflict > 0 THEN
//       RAISE EXCEPTION 'Erro: Cirurgião já alocado neste horário (%). Escolha outro bloco ou cirurgião.',
//         v_block_date;
//     END IF;
//
//     RETURN NEW;
//   END;
//   $function$
//
// FUNCTION get_default_hospital_id()
//   CREATE OR REPLACE FUNCTION public.get_default_hospital_id()
//    RETURNS uuid
//    LANGUAGE plpgsql
//    IMMUTABLE
//   AS $function$
//   BEGIN
//     RETURN (SELECT id FROM hospitals WHERE hospital_name = 'Hospital Padrão' LIMIT 1);
//   END;
//   $function$
//
// FUNCTION get_user_managed_hospitals()
//   CREATE OR REPLACE FUNCTION public.get_user_managed_hospitals()
//    RETURNS SETOF uuid
//    LANGUAGE sql
//    SECURITY DEFINER
//    SET search_path TO 'public'
//   AS $function$
//     SELECT hospital_id
//     FROM public.hospital_users
//     WHERE user_id = auth.uid() AND role = 'facility_manager' AND is_active = true;
//   $function$
//
// FUNCTION get_user_role()
//   CREATE OR REPLACE FUNCTION public.get_user_role()
//    RETURNS text
//    LANGUAGE sql
//    SECURITY DEFINER
//    SET search_path TO 'public'
//   AS $function$
//     SELECT role FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1;
//   $function$
//
// FUNCTION get_user_roles()
//   CREATE OR REPLACE FUNCTION public.get_user_roles()
//    RETURNS text[]
//    LANGUAGE sql
//    SECURITY DEFINER
//    SET search_path TO 'public'
//   AS $function$
//     SELECT ARRAY_AGG(role::text)
//     FROM public.user_roles
//     WHERE user_id = auth.uid()
//       AND is_active = TRUE;
//   $function$
//
// FUNCTION handle_new_user()
//   CREATE OR REPLACE FUNCTION public.handle_new_user()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//     INSERT INTO public.profiles (id, email, name, crm, phone, city, photo_url)
//     VALUES (
//       NEW.id,
//       NEW.email,
//       NEW.raw_user_meta_data->>'full_name',
//       NEW.raw_user_meta_data->>'crm',
//       NEW.raw_user_meta_data->>'phone',
//       NEW.raw_user_meta_data->>'city',
//       NEW.raw_user_meta_data->>'photo_url'
//     )
//     ON CONFLICT (id) DO NOTHING;
//
//     -- Ensure roles are processed if provided via signUp metadata
//     IF NEW.raw_user_meta_data->>'user_role' IS NOT NULL THEN
//       INSERT INTO public.user_roles (user_id, role)
//       VALUES (NEW.id, (NEW.raw_user_meta_data->>'user_role')::public.user_role_type)
//       ON CONFLICT (user_id, role) DO NOTHING;
//     END IF;
//
//     RETURN NEW;
//   END;
//   $function$
//
// FUNCTION handle_user_email_update()
//   CREATE OR REPLACE FUNCTION public.handle_user_email_update()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//     UPDATE public.profiles SET email = NEW.email WHERE id = NEW.id;
//     RETURN NEW;
//   END;
//   $function$
//
// FUNCTION has_any_role(text[])
//   CREATE OR REPLACE FUNCTION public.has_any_role(required_roles text[])
//    RETURNS boolean
//    LANGUAGE sql
//    SECURITY DEFINER
//    SET search_path TO 'public'
//   AS $function$
//     SELECT EXISTS (
//       SELECT 1 FROM public.user_roles
//       WHERE user_id = auth.uid()
//         AND role::text = ANY(required_roles)
//         AND is_active = TRUE
//     );
//   $function$
//
// FUNCTION has_role(text)
//   CREATE OR REPLACE FUNCTION public.has_role(required_role text)
//    RETURNS boolean
//    LANGUAGE sql
//    SECURITY DEFINER
//    SET search_path TO 'public'
//   AS $function$
//     SELECT EXISTS (
//       SELECT 1 FROM public.user_roles
//       WHERE user_id = auth.uid()
//         AND role::text = required_role
//         AND is_active = TRUE
//     );
//   $function$
//
// FUNCTION is_admin()
//   CREATE OR REPLACE FUNCTION public.is_admin()
//    RETURNS boolean
//    LANGUAGE sql
//    SECURITY DEFINER
//   AS $function$
//     SELECT EXISTS (
//       SELECT 1 FROM public.user_roles
//       WHERE user_id = auth.uid() AND role IN ('admin', 'superusuario')
//     );
//   $function$
//
// FUNCTION notify_sector_on_status_change()
//   CREATE OR REPLACE FUNCTION public.notify_sector_on_status_change()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   BEGIN
//     RETURN NEW;
//   END;
//   $function$
//
// FUNCTION preencher_opme_automatico()
//   CREATE OR REPLACE FUNCTION public.preencher_opme_automatico()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   BEGIN
//     -- Se status mudou para 2_AGUARDANDO_OPME e há pacote_opme_id
//     IF NEW.status::text = '2_AGUARDANDO_OPME' AND NEW.pacote_opme_id IS NOT NULL THEN
//       -- Limpar itens anteriores (se houver)
//       DELETE FROM pedido_opme_items WHERE pedido_id = NEW.id;
//
//       -- Inserir itens do pacote com mapeamento correto
//       INSERT INTO pedido_opme_items (pedido_id, opme_item_id, quantity, created_at)
//       SELECT
//         NEW.id,
//         poi.id,
//         poi.quantidade,
//         NOW()
//       FROM pacotes_opme_itens poi
//       WHERE poi.pacote_id = NEW.pacote_opme_id;
//     END IF;
//     RETURN NEW;
//   END;
//   $function$
//
// FUNCTION register_pinça_consumption(uuid, integer, text)
//   CREATE OR REPLACE FUNCTION public."register_pinça_consumption"(p_pedido_opme_item_id uuid, p_lives_consumed integer, p_lot_used text DEFAULT NULL::text)
//    RETURNS TABLE(success boolean, message text)
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//     v_opme_item_id UUID;
//     v_current_lives INT;
//     v_item_type TEXT;
//     v_quantity INT;
//   BEGIN
//     -- Obter dados do item de OPME
//     SELECT
//       poi.opme_item_id,
//       poi.quantity,
//       oi.current_lives,
//       oi.item_type
//     INTO v_opme_item_id, v_quantity, v_current_lives, v_item_type
//     FROM pedido_opme_items poi
//     JOIN opme_items oi ON poi.opme_item_id = oi.id
//     WHERE poi.id = p_pedido_opme_item_id;
//
//     IF v_opme_item_id IS NULL THEN
//       RETURN QUERY SELECT FALSE, 'Item de OPME não encontrado';
//       RETURN;
//     END IF;
//
//     -- Validar consumo
//     IF p_lives_consumed > v_quantity THEN
//       RETURN QUERY SELECT FALSE, 'Consumo registrado (' || p_lives_consumed::TEXT || ') excede quantidade solicitada (' || v_quantity::TEXT || ')';
//       RETURN;
//     END IF;
//
//     -- Registrar consumo em pedido_opme_items
//     UPDATE pedido_opme_items
//     SET
//       lives_consumed = p_lives_consumed,
//       lot_used = p_lot_used,
//       updated_at = NOW()
//     WHERE id = p_pedido_opme_item_id;
//
//     -- Se é pinça clicada, decrementar current_lives em opme_items
//     IF v_item_type = 'pinça_clicada' THEN
//       UPDATE opme_items
//       SET
//         current_lives = current_lives - p_lives_consumed,
//         updated_at = NOW()
//       WHERE id = v_opme_item_id;
//     END IF;
//
//     RETURN QUERY SELECT TRUE, 'Consumo registrado com sucesso. Vidas remanescentes: ' || (v_current_lives - p_lives_consumed)::TEXT;
//   END;
//   $function$
//
// FUNCTION set_created_by()
//   CREATE OR REPLACE FUNCTION public.set_created_by()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   BEGIN
//     IF NEW.created_by IS NULL THEN
//       NEW.created_by := auth.uid();
//     END IF;
//     RETURN NEW;
//   END;
//   $function$
//
// FUNCTION update_pedido_cirurgia(uuid, text, text)
//   CREATE OR REPLACE FUNCTION public.update_pedido_cirurgia(p_pedido_id uuid, p_new_status text, p_notes text DEFAULT NULL::text)
//    RETURNS TABLE(success boolean, message text, pedido_id uuid)
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//     v_current_status TEXT;
//     v_validation_result RECORD;
//     v_surgeon_id UUID;
//     v_current_user_id UUID;
//   BEGIN
//     v_current_user_id := auth.uid();
//
//     -- Obter status atual e surgeon_id
//     SELECT status, surgeon_id INTO v_current_status, v_surgeon_id
//     FROM pedidos_cirurgia
//     WHERE id = p_pedido_id;
//
//     IF v_current_status IS NULL THEN
//       RETURN QUERY SELECT FALSE, 'Pedido não encontrado', p_pedido_id;
//       RETURN;
//     END IF;
//
//     -- Validar transição de estado (regras de negócio)
//     IF NOT is_valid_transition(v_current_status, p_new_status) THEN
//       RETURN QUERY SELECT FALSE, 'Transição de estado inválida: ' || v_current_status || ' → ' || p_new_status, p_pedido_id;
//       RETURN;
//     END IF;
//
//     -- ✅ NOVA VALIDAÇÃO: Se transição é para 7_AGENDADO_CC, validar pinças
//     IF p_new_status = '7_AGENDADO_CC' THEN
//       SELECT * INTO v_validation_result
//       FROM validate_pinças_before_scheduling(p_pedido_id);
//
//       IF NOT v_validation_result.valid THEN
//         RETURN QUERY SELECT FALSE, v_validation_result.message, p_pedido_id;
//         RETURN;
//       END IF;
//     END IF;
//
//     -- Atualizar status
//     UPDATE pedidos_cirurgia
//     SET
//       status = p_new_status,
//       updated_at = NOW()
//     WHERE id = p_pedido_id;
//
//     -- Registrar auditoria
//     INSERT INTO pedidos_cirurgia_auditoria (pedido_id, status_anterior, status_novo, usuario_id, notas)
//     VALUES (p_pedido_id, v_current_status, p_new_status, v_current_user_id, p_notes);
//
//     RETURN QUERY SELECT TRUE, 'Status atualizado com sucesso para ' || p_new_status, p_pedido_id;
//   END;
//   $function$
//
// FUNCTION update_surgical_requests_timestamp()
//   CREATE OR REPLACE FUNCTION public.update_surgical_requests_timestamp()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   BEGIN
//     NEW.updated_at = now();
//     RETURN NEW;
//   END;
//   $function$
//
// FUNCTION validate_patient_creation()
//   CREATE OR REPLACE FUNCTION public.validate_patient_creation()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//     user_role TEXT;
//   BEGIN
//     -- Obter role do usuário autenticado via user_roles
//     SELECT role::text INTO user_role
//     FROM public.user_roles
//     WHERE user_id = auth.uid() AND is_active = true
//     LIMIT 1;
//
//     -- Se role não foi encontrada, usar 'authenticated' como padrão
//     IF user_role IS NULL THEN
//       user_role := 'authenticated';
//     END IF;
//
//     -- Validar campos obrigatórios para SURGEON
//     IF user_role = 'surgeon' THEN
//       IF NEW.full_name IS NULL OR NEW.full_name = '' THEN
//         RAISE EXCEPTION 'full_name é obrigatório para cirurgião';
//       END IF;
//       IF NEW.cpf_hash IS NULL OR NEW.cpf_hash = '' THEN
//         RAISE EXCEPTION 'cpf_hash é obrigatório para cirurgião';
//       END IF;
//       -- medical_record pode ser NULL para cirurgião
//       NEW.medical_record := COALESCE(NEW.medical_record, NULL);
//     END IF;
//
//     -- Validar campos obrigatórios para SECRETARY/ADMIN
//     IF user_role IN ('secretary', 'admin') THEN
//       IF NEW.full_name IS NULL OR NEW.full_name = '' THEN
//         RAISE EXCEPTION 'full_name é obrigatório';
//       END IF;
//       IF NEW.cpf_hash IS NULL OR NEW.cpf_hash = '' THEN
//         RAISE EXCEPTION 'cpf_hash é obrigatório';
//       END IF;
//       IF NEW.medical_record IS NULL OR NEW.medical_record = '' THEN
//         RAISE EXCEPTION 'medical_record é obrigatório para secretária/admin';
//       END IF;
//     END IF;
//
//     RETURN NEW;
//   END;
//   $function$
//
// FUNCTION validate_pinças_before_scheduling(uuid)
//   CREATE OR REPLACE FUNCTION public."validate_pinças_before_scheduling"(p_pedido_id uuid)
//    RETURNS TABLE(valid boolean, message text)
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//     v_item RECORD;
//     v_current_lives INT;
//     v_quantity INT;
//     v_item_type TEXT;
//     v_item_name TEXT;
//   BEGIN
//     -- Iterar sobre todos os itens de OPME solicitados no pedido
//     FOR v_item IN
//       SELECT
//         poi.id,
//         poi.opme_item_id,
//         poi.quantity,
//         oi.item_type,
//         oi.name,
//         oi.current_lives
//       FROM pedido_opme_items poi
//       JOIN opme_items oi ON poi.opme_item_id = oi.id
//       WHERE poi.pedido_id = p_pedido_id
//     LOOP
//       v_item_type := v_item.item_type;
//       v_quantity := v_item.quantity;
//       v_current_lives := v_item.current_lives;
//       v_item_name := v_item.name;
//
//       -- Se é pinça clicada, validar vidas remanescentes
//       IF v_item_type = 'pinça_clicada' THEN
//         IF v_current_lives IS NULL OR v_current_lives < v_quantity THEN
//           RETURN QUERY SELECT
//             FALSE,
//             'Pinça ' || v_item_name || ' não possui vidas suficientes. Disponível: ' || COALESCE(v_current_lives::TEXT, '0') || ', Solicitado: ' || v_quantity::TEXT;
//           RETURN;
//         END IF;
//       END IF;
//       -- Se é uso único, não validar vidas (sempre permitido)
//     END LOOP;
//
//     -- Se passou em todas as validações
//     RETURN QUERY SELECT TRUE, 'Todas as pinças estão disponíveis para agendamento';
//   END;
//   $function$
//

// --- TRIGGERS ---
// Table: audit_log
//   Send Email on Surgery Cancelled: CREATE TRIGGER "Send Email on Surgery Cancelled" AFTER INSERT ON public.audit_log FOR EACH ROW WHEN ((new.status_to = '10_CANCELADO'::text)) EXECUTE FUNCTION supabase_functions.http_request('https://iumxxwtcohabjgynxciv.supabase.co/functions/v1/send-email-surgery-cancelled', 'POST', '{"Content-type":"application/json"}', '{}', '5000')
//   Send Email on Surgery Created: CREATE TRIGGER "Send Email on Surgery Created" AFTER INSERT ON public.audit_log FOR EACH ROW WHEN ((new.action = 'created'::text)) EXECUTE FUNCTION supabase_functions.http_request('https://iumxxwtcohabjgynxciv.supabase.co/functions/v1/send-email-surgery-created', 'POST', '{"Content-type":"application/json"}', '{}', '5000')
//   notify-telegram-audit: CREATE TRIGGER "notify-telegram-audit" AFTER INSERT ON public.audit_log FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request('https://iumxxwtcohabjgynxciv.supabase.co/functions/v1/notify-telegram', 'POST', '{"Content-type":"application/json"}', '{}', '5000')
//   trg_audit_log_hash_before_insert: CREATE TRIGGER trg_audit_log_hash_before_insert BEFORE INSERT ON public.audit_log FOR EACH ROW EXECUTE FUNCTION fn_audit_log_hash_before_insert()
//   trg_audit_log_populate_action_type: CREATE TRIGGER trg_audit_log_populate_action_type BEFORE INSERT ON public.audit_log FOR EACH ROW EXECUTE FUNCTION fn_audit_log_populate_action_type()
// Table: patients
//   set_created_by_trigger: CREATE TRIGGER set_created_by_trigger BEFORE INSERT ON public.patients FOR EACH ROW EXECUTE FUNCTION set_created_by()
//   trigger_validate_patient_creation: CREATE TRIGGER trigger_validate_patient_creation BEFORE INSERT ON public.patients FOR EACH ROW EXECUTE FUNCTION validate_patient_creation()
// Table: pedidos_cirurgia
//   trg_audit_pedidos: CREATE TRIGGER trg_audit_pedidos AFTER INSERT OR DELETE OR UPDATE ON public.pedidos_cirurgia FOR EACH ROW EXECUTE FUNCTION fn_audit_pedidos()
//   trigger_preencher_opme: CREATE TRIGGER trigger_preencher_opme AFTER UPDATE ON public.pedidos_cirurgia FOR EACH ROW EXECUTE FUNCTION preencher_opme_automatico()
// Table: pedidos_documentos
//   trg_update_pedidos_documentos_timestamp: CREATE TRIGGER trg_update_pedidos_documentos_timestamp BEFORE UPDATE ON public.pedidos_documentos FOR EACH ROW EXECUTE FUNCTION fn_update_pedidos_documentos_timestamp()
// Table: profiles
//   Send Welcome Email on New User: CREATE TRIGGER "Send Welcome Email on New User" AFTER INSERT ON public.profiles FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request('https://iumxxwtcohabjgynxciv.supabase.co/functions/v1/send-email-welcome', 'POST', '{"Content-type":"application/json"}', '{}', '5000')
// Table: resource_allocation
//   trg_update_pedido_on_allocation: CREATE TRIGGER trg_update_pedido_on_allocation AFTER INSERT OR UPDATE ON public.resource_allocation FOR EACH ROW EXECUTE FUNCTION fn_update_pedido_on_allocation()
//   trg_validate_resource_allocation: CREATE TRIGGER trg_validate_resource_allocation BEFORE INSERT OR UPDATE ON public.resource_allocation FOR EACH ROW EXECUTE FUNCTION fn_validate_resource_allocation()
//   update_resource_allocation_timestamp: CREATE TRIGGER update_resource_allocation_timestamp BEFORE UPDATE ON public.resource_allocation FOR EACH ROW EXECUTE FUNCTION update_surgical_requests_timestamp()
// Table: surgical_block_exceptions
//   update_sbe_timestamp: CREATE TRIGGER update_sbe_timestamp BEFORE UPDATE ON public.surgical_block_exceptions FOR EACH ROW EXECUTE FUNCTION update_surgical_requests_timestamp()
// Table: surgical_block_templates
//   update_sbt_timestamp: CREATE TRIGGER update_sbt_timestamp BEFORE UPDATE ON public.surgical_block_templates FOR EACH ROW EXECUTE FUNCTION update_surgical_requests_timestamp()
// Table: surgical_request_block_preferences
//   trg_audit_block_preferences_delete: CREATE TRIGGER trg_audit_block_preferences_delete BEFORE DELETE ON public.surgical_request_block_preferences FOR EACH ROW EXECUTE FUNCTION fn_audit_block_preferences_delete()
//   trg_block_preferences_immutable: CREATE TRIGGER trg_block_preferences_immutable BEFORE UPDATE ON public.surgical_request_block_preferences FOR EACH ROW EXECUTE FUNCTION fn_block_preferences_update()
//   trg_validate_block_preferences_on_insert: CREATE TRIGGER trg_validate_block_preferences_on_insert BEFORE INSERT ON public.surgical_request_block_preferences FOR EACH ROW EXECUTE FUNCTION fn_validate_block_preferences_on_insert()
// Table: user_roles
//   trg_audit_roles: CREATE TRIGGER trg_audit_roles AFTER INSERT OR DELETE OR UPDATE ON public.user_roles FOR EACH ROW EXECUTE FUNCTION fn_audit_roles()

// --- INDEXES ---
// Table: agendamento_propostas
//   CREATE UNIQUE INDEX agendamento_propostas_pedido_id_numero_proposta_key ON public.agendamento_propostas USING btree (pedido_id, numero_proposta)
//   CREATE INDEX idx_agendamento_propostas_pedido ON public.agendamento_propostas USING btree (pedido_id)
// Table: audit_log
//   CREATE INDEX idx_audit_log_pedido_changed_at ON public.audit_log USING btree (pedido_id, changed_at)
//   CREATE INDEX idx_audit_log_record_hash ON public.audit_log USING btree (record_hash)
// Table: audit_logs
//   CREATE INDEX idx_audit_logs_actor ON public.audit_logs USING btree (actor_id)
//   CREATE INDEX idx_audit_logs_created ON public.audit_logs USING btree (created_at DESC)
//   CREATE INDEX idx_audit_logs_event ON public.audit_logs USING btree (event_type)
//   CREATE INDEX idx_audit_logs_record ON public.audit_logs USING btree (record_id)
// Table: diagnosticos_cid10
//   CREATE UNIQUE INDEX diagnosticos_cid10_codigo_cid10_key ON public.diagnosticos_cid10 USING btree (codigo_cid10)
//   CREATE INDEX idx_diagnosticos_cid10_codigo ON public.diagnosticos_cid10 USING btree (codigo_cid10)
//   CREATE INDEX idx_diagnosticos_cid10_descricao ON public.diagnosticos_cid10 USING gin (to_tsvector('portuguese'::regconfig, descricao))
// Table: google_oauth_tokens
//   CREATE UNIQUE INDEX google_oauth_tokens_user_id_key ON public.google_oauth_tokens USING btree (user_id)
//   CREATE INDEX idx_google_oauth_tokens_user_id ON public.google_oauth_tokens USING btree (user_id)
// Table: hospital_users
//   CREATE UNIQUE INDEX hospital_users_hospital_id_user_id_role_key ON public.hospital_users USING btree (hospital_id, user_id, role)
//   CREATE INDEX idx_hospital_users_hospital_id ON public.hospital_users USING btree (hospital_id)
//   CREATE INDEX idx_hospital_users_is_active ON public.hospital_users USING btree (is_active)
//   CREATE INDEX idx_hospital_users_role ON public.hospital_users USING btree (role)
//   CREATE INDEX idx_hospital_users_user_id ON public.hospital_users USING btree (user_id)
// Table: hospitals
//   CREATE UNIQUE INDEX hospitals_cnpj_key ON public.hospitals USING btree (cnpj)
//   CREATE UNIQUE INDEX hospitals_hospital_name_key ON public.hospitals USING btree (hospital_name)
//   CREATE INDEX idx_hospitals_cnpj ON public.hospitals USING btree (cnpj)
//   CREATE INDEX idx_hospitals_is_active ON public.hospitals USING btree (is_active)
//   CREATE INDEX idx_hospitals_name ON public.hospitals USING btree (hospital_name)
// Table: opme_items
//   CREATE UNIQUE INDEX opme_items_code_unique ON public.opme_items USING btree (code)
// Table: pacotes_opme
//   CREATE UNIQUE INDEX pacotes_opme_nome_key ON public.pacotes_opme USING btree (nome)
// Table: pacotes_opme_itens
//   CREATE INDEX idx_pacotes_opme_itens_pacote ON public.pacotes_opme_itens USING btree (pacote_id)
// Table: patients
//   CREATE INDEX idx_patients_profissao ON public.patients USING btree (profissao)
//   CREATE INDEX idx_patients_telefone ON public.patients USING btree (telefone)
//   CREATE UNIQUE INDEX patients_cpf_hash_key ON public.patients USING btree (cpf_hash)
// Table: pedido_opme_items
//   CREATE UNIQUE INDEX pedido_opme_items_unique ON public.pedido_opme_items USING btree (pedido_id, opme_item_id)
// Table: pedidos_calendar_events
//   CREATE INDEX idx_pedidos_calendar_events_pedido_id ON public.pedidos_calendar_events USING btree (pedido_id)
//   CREATE INDEX idx_pedidos_calendar_events_surgeon_id ON public.pedidos_calendar_events USING btree (surgeon_id)
//   CREATE UNIQUE INDEX pedidos_calendar_events_pedido_id_calendar_type_surgeon_id_key ON public.pedidos_calendar_events USING btree (pedido_id, calendar_type, surgeon_id)
// Table: pedidos_cirurgia
//   CREATE INDEX idx_pedidos_diagnostico_cid10 ON public.pedidos_cirurgia USING btree (diagnostico_cid10_id)
//   CREATE INDEX idx_pedidos_pacote_opme ON public.pedidos_cirurgia USING btree (pacote_opme_id)
// Table: pedidos_cirurgia_auditoria
//   CREATE INDEX idx_auditoria_criado_em ON public.pedidos_cirurgia_auditoria USING btree (criado_em DESC)
//   CREATE INDEX idx_auditoria_pedido_id ON public.pedidos_cirurgia_auditoria USING btree (pedido_id)
// Table: pedidos_docs_exports
//   CREATE INDEX idx_pedidos_docs_generated_at ON public.pedidos_docs_exports USING btree (generated_at DESC)
//   CREATE INDEX idx_pedidos_docs_pedido_id ON public.pedidos_docs_exports USING btree (pedido_id)
//   CREATE UNIQUE INDEX pedidos_docs_exports_doc_id_key ON public.pedidos_docs_exports USING btree (doc_id)
// Table: pedidos_documentos
//   CREATE INDEX idx_pedidos_documentos_arquivo_hash ON public.pedidos_documentos USING btree (arquivo_hash)
//   CREATE INDEX idx_pedidos_documentos_documento_tipo ON public.pedidos_documentos USING btree (documento_tipo)
//   CREATE INDEX idx_pedidos_documentos_pedido_id ON public.pedidos_documentos USING btree (pedido_id)
//   CREATE INDEX idx_pedidos_documentos_uploaded_by ON public.pedidos_documentos USING btree (uploaded_by)
// Table: procedures
//   CREATE UNIQUE INDEX procedures_tuss_code_key ON public.procedures USING btree (tuss_code)
// Table: resource_allocation
//   CREATE INDEX idx_resource_allocation_allocated_surgeon_id ON public.resource_allocation USING btree (allocated_surgeon_id)
//   CREATE INDEX idx_resource_allocation_pedido_id ON public.resource_allocation USING btree (pedido_id)
//   CREATE INDEX idx_resource_allocation_surgical_block_id ON public.resource_allocation USING btree (surgical_block_id)
//   CREATE INDEX idx_resource_allocation_surgical_room_id ON public.resource_allocation USING btree (surgical_room_id)
// Table: robotic_systems
//   CREATE INDEX idx_robotic_systems_facility_id ON public.robotic_systems USING btree (facility_id)
//   CREATE INDEX idx_robotic_systems_is_operational ON public.robotic_systems USING btree (is_operational)
//   CREATE UNIQUE INDEX robotic_systems_serial_number_key ON public.robotic_systems USING btree (serial_number)
// Table: sectors
//   CREATE UNIQUE INDEX sectors_name_key ON public.sectors USING btree (name)
// Table: surgical_block_exceptions
//   CREATE INDEX idx_sbe_date ON public.surgical_block_exceptions USING btree (exception_date)
//   CREATE INDEX idx_sbe_template ON public.surgical_block_exceptions USING btree (surgical_block_template_id)
//   CREATE INDEX idx_surgical_block_exceptions_hospital_id ON public.surgical_block_exceptions USING btree (hospital_id)
// Table: surgical_block_templates
//   CREATE INDEX idx_sbt_active ON public.surgical_block_templates USING btree (is_active)
//   CREATE INDEX idx_sbt_room ON public.surgical_block_templates USING btree (surgical_room_id)
//   CREATE INDEX idx_surgical_block_templates_hospital_id ON public.surgical_block_templates USING btree (hospital_id)
// Table: surgical_blocks
//   CREATE INDEX idx_surgical_blocks_available ON public.surgical_blocks USING btree (is_available)
//   CREATE INDEX idx_surgical_blocks_hospital_id ON public.surgical_blocks USING btree (hospital_id)
//   CREATE INDEX idx_surgical_blocks_room_date ON public.surgical_blocks USING btree (surgical_room_id, block_date)
//   CREATE INDEX idx_surgical_blocks_surgeon ON public.surgical_blocks USING btree (assigned_surgeon_id)
// Table: surgical_request_block_preferences
//   CREATE INDEX idx_srbp_block ON public.surgical_request_block_preferences USING btree (surgical_block_id)
//   CREATE INDEX idx_srbp_pedido ON public.surgical_request_block_preferences USING btree (pedido_cirurgia_id)
//   CREATE INDEX idx_srbp_pedido_order ON public.surgical_request_block_preferences USING btree (pedido_cirurgia_id, preference_order)
//   CREATE INDEX idx_surgical_request_block_preferences_hospital_id ON public.surgical_request_block_preferences USING btree (hospital_id)
//   CREATE UNIQUE INDEX surgical_request_block_prefer_pedido_cirurgia_id_preference_key ON public.surgical_request_block_preferences USING btree (pedido_cirurgia_id, preference_order)
//   CREATE UNIQUE INDEX surgical_request_block_prefer_pedido_cirurgia_id_surgical_b_key ON public.surgical_request_block_preferences USING btree (pedido_cirurgia_id, surgical_block_id)
// Table: surgical_rooms
//   CREATE INDEX idx_surgical_rooms_hospital_id ON public.surgical_rooms USING btree (hospital_id)
//   CREATE INDEX idx_surgical_rooms_is_active ON public.surgical_rooms USING btree (is_active)
//   CREATE UNIQUE INDEX surgical_rooms_hospital_room_unique ON public.surgical_rooms USING btree (hospital_id, room_name)
//   CREATE UNIQUE INDEX surgical_rooms_room_number_key ON public.surgical_rooms USING btree (room_number)
// Table: user_roles
//   CREATE UNIQUE INDEX user_roles_user_id_role_key ON public.user_roles USING btree (user_id, role)

// --- MATERIALIZED VIEWS ---
// VIEW mv_kpi_cirurgias:
//   SELECT pc.id,
//       pc.status,
//       pc.scheduled_date,
//       pc.estimated_room_time_min,
//       pc.asa_classification,
//       pc.needs_icu,
//       pc.insurance_provider_code,
//       pr.tuss_code,
//       pr.name AS procedure_name,
//       encode(digest((pc.patient_id)::text, 'sha256'::text), 'hex'::text) AS patient_hash,
//       pc.created_at
//      FROM (pedidos_cirurgia pc
//        JOIN procedures pr ON ((pr.id = pc.procedure_id)));
