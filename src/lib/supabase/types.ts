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
          changed_at: string
          changed_by: string
          id: string
          notes: string | null
          pedido_id: string
          status_from: string | null
          status_to: string
        }
        Insert: {
          action: string
          changed_at?: string
          changed_by: string
          id?: string
          notes?: string | null
          pedido_id: string
          status_from?: string | null
          status_to: string
        }
        Update: {
          action?: string
          changed_at?: string
          changed_by?: string
          id?: string
          notes?: string | null
          pedido_id?: string
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
          full_name: string
          id: string
          insurance_card_number: string | null
          insurance_plan: string | null
          insurance_provider: string | null
          medical_record: string
          updated_at: string | null
        }
        Insert: {
          cns?: string | null
          cpf_hash: string
          created_at?: string | null
          created_by?: string | null
          date_of_birth?: string | null
          full_name: string
          id?: string
          insurance_card_number?: string | null
          insurance_plan?: string | null
          insurance_provider?: string | null
          medical_record: string
          updated_at?: string | null
        }
        Update: {
          cns?: string | null
          cpf_hash?: string
          created_at?: string | null
          created_by?: string | null
          date_of_birth?: string | null
          full_name?: string
          id?: string
          insurance_card_number?: string | null
          insurance_plan?: string | null
          insurance_provider?: string | null
          medical_record?: string
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
      robotic_systems: {
        Row: {
          created_at: string
          id: string
          model: Database['public']['Enums']['robotic_system_model']
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          model: Database['public']['Enums']['robotic_system_model']
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          model?: Database['public']['Enums']['robotic_system_model']
          name?: string
          updated_at?: string
        }
        Relationships: []
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
      surgical_rooms: {
        Row: {
          capacity_patients: number | null
          created_at: string
          facility_id: string
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
          facility_id: string
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
          facility_id?: string
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
            foreignKeyName: 'surgical_rooms_facility_id_fkey'
            columns: ['facility_id']
            isOneToOne: false
            referencedRelation: 'profiles'
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
      get_user_role: { Args: never; Returns: string }
      get_user_roles: { Args: never; Returns: string[] }
      has_any_role: { Args: { required_roles: string[] }; Returns: boolean }
      has_role: { Args: { required_role: string }; Returns: boolean }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
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
//   medical_record: text (not null)
//   date_of_birth: date (nullable)
//   insurance_provider: text (nullable)
//   insurance_plan: text (nullable)
//   insurance_card_number: text (nullable)
//   created_by: uuid (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
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
// Table: robotic_systems
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   model: robotic_system_model (not null)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: sectors
//   id: uuid (not null, default: uuid_generate_v4())
//   name: text (not null)
//   role_target: user_role_type (nullable)
//   telegram_chat_id: text (nullable)
//   notify_on_status: _surgery_status (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: surgical_rooms
//   id: uuid (not null, default: gen_random_uuid())
//   room_number: text (not null)
//   room_name: text (not null)
//   facility_id: uuid (not null)
//   robotic_system_id: uuid (nullable)
//   capacity_patients: integer (nullable, default: 1)
//   is_active: boolean (nullable, default: true)
//   notes: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: user_roles
//   id: uuid (not null, default: uuid_generate_v4())
//   user_id: uuid (not null)
//   role: user_role_type (not null)
//   is_active: boolean (nullable, default: false)
//   granted_by: uuid (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
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
// Table: audit_logs
//   PRIMARY KEY audit_logs_pkey: PRIMARY KEY (id)
// Table: diagnosticos_cid10
//   UNIQUE diagnosticos_cid10_codigo_cid10_key: UNIQUE (codigo_cid10)
//   PRIMARY KEY diagnosticos_cid10_pkey: PRIMARY KEY (id)
// Table: google_oauth_tokens
//   PRIMARY KEY google_oauth_tokens_pkey: PRIMARY KEY (id)
//   FOREIGN KEY google_oauth_tokens_user_id_fkey: FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
//   UNIQUE google_oauth_tokens_user_id_key: UNIQUE (user_id)
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
// Table: procedures
//   PRIMARY KEY procedures_pkey: PRIMARY KEY (id)
//   UNIQUE procedures_tuss_code_key: UNIQUE (tuss_code)
// Table: profiles
//   FOREIGN KEY profiles_id_fkey: FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
//   PRIMARY KEY profiles_pkey: PRIMARY KEY (id)
// Table: robotic_systems
//   PRIMARY KEY robotic_systems_pkey: PRIMARY KEY (id)
// Table: sectors
//   UNIQUE sectors_name_key: UNIQUE (name)
//   PRIMARY KEY sectors_pkey: PRIMARY KEY (id)
// Table: surgical_rooms
//   FOREIGN KEY surgical_rooms_facility_id_fkey: FOREIGN KEY (facility_id) REFERENCES profiles(id) ON DELETE CASCADE
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
//     WITH CHECK: (created_by = auth.uid())
//   Policy "patients_select" (SELECT, PERMISSIVE) roles={public}
//     USING: ((created_by = auth.uid()) OR has_any_role(ARRAY['secretary'::text, 'opme'::text, 'billing'::text, 'nursing'::text, 'coordinator'::text, 'admin'::text]))
//   Policy "patients_select_admin" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: has_role('admin'::text)
//   Policy "patients_select_owner" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: ((created_by = auth.uid()) OR has_any_role(ARRAY['secretary'::text, 'admin'::text]))
//   Policy "patients_update" (UPDATE, PERMISSIVE) roles={public}
//     USING: has_any_role(ARRAY['secretary'::text, 'admin'::text])
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
// Table: robotic_systems
//   Policy "Robotic systems manageable by admin" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (has_role('admin'::text) OR has_role('facility_manager'::text))
//     WITH CHECK: (has_role('admin'::text) OR has_role('facility_manager'::text))
//   Policy "Robotic systems visible to all authenticated" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
// Table: sectors
//   Policy "sectors_all_admin" (ALL, PERMISSIVE) roles={public}
//     USING: has_role('admin'::text)
//   Policy "sectors_select" (SELECT, PERMISSIVE) roles={public}
//     USING: has_role('admin'::text)
// Table: surgical_rooms
//   Policy "Rooms manageable by admin or facility_manager" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (has_role('admin'::text) OR has_role('facility_manager'::text))
//     WITH CHECK: (has_role('admin'::text) OR has_role('facility_manager'::text))
//   Policy "Rooms visible to facility owner" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: ((facility_id = auth.uid()) OR has_role('admin'::text) OR has_role('facility_manager'::text))
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

// --- TRIGGERS ---
// Table: audit_log
//   Send Email on Surgery Cancelled: CREATE TRIGGER "Send Email on Surgery Cancelled" AFTER INSERT ON public.audit_log FOR EACH ROW WHEN ((new.status_to = '10_CANCELADO'::text)) EXECUTE FUNCTION supabase_functions.http_request('https://iumxxwtcohabjgynxciv.supabase.co/functions/v1/send-email-surgery-cancelled', 'POST', '{"Content-type":"application/json"}', '{}', '5000')
//   Send Email on Surgery Created: CREATE TRIGGER "Send Email on Surgery Created" AFTER INSERT ON public.audit_log FOR EACH ROW WHEN ((new.action = 'created'::text)) EXECUTE FUNCTION supabase_functions.http_request('https://iumxxwtcohabjgynxciv.supabase.co/functions/v1/send-email-surgery-created', 'POST', '{"Content-type":"application/json"}', '{}', '5000')
//   notify-telegram-audit: CREATE TRIGGER "notify-telegram-audit" AFTER INSERT ON public.audit_log FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request('https://iumxxwtcohabjgynxciv.supabase.co/functions/v1/notify-telegram', 'POST', '{"Content-type":"application/json"}', '{}', '5000')
// Table: patients
//   set_created_by_trigger: CREATE TRIGGER set_created_by_trigger BEFORE INSERT ON public.patients FOR EACH ROW EXECUTE FUNCTION set_created_by()
// Table: pedidos_cirurgia
//   trg_audit_pedidos: CREATE TRIGGER trg_audit_pedidos AFTER INSERT OR DELETE OR UPDATE ON public.pedidos_cirurgia FOR EACH ROW EXECUTE FUNCTION fn_audit_pedidos()
//   trigger_preencher_opme: CREATE TRIGGER trigger_preencher_opme AFTER UPDATE ON public.pedidos_cirurgia FOR EACH ROW EXECUTE FUNCTION preencher_opme_automatico()
// Table: profiles
//   Send Welcome Email on New User: CREATE TRIGGER "Send Welcome Email on New User" AFTER INSERT ON public.profiles FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request('https://iumxxwtcohabjgynxciv.supabase.co/functions/v1/send-email-welcome', 'POST', '{"Content-type":"application/json"}', '{}', '5000')
// Table: user_roles
//   trg_audit_roles: CREATE TRIGGER trg_audit_roles AFTER INSERT OR DELETE OR UPDATE ON public.user_roles FOR EACH ROW EXECUTE FUNCTION fn_audit_roles()

// --- INDEXES ---
// Table: agendamento_propostas
//   CREATE UNIQUE INDEX agendamento_propostas_pedido_id_numero_proposta_key ON public.agendamento_propostas USING btree (pedido_id, numero_proposta)
//   CREATE INDEX idx_agendamento_propostas_pedido ON public.agendamento_propostas USING btree (pedido_id)
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
// Table: opme_items
//   CREATE UNIQUE INDEX opme_items_code_unique ON public.opme_items USING btree (code)
// Table: pacotes_opme
//   CREATE UNIQUE INDEX pacotes_opme_nome_key ON public.pacotes_opme USING btree (nome)
// Table: pacotes_opme_itens
//   CREATE INDEX idx_pacotes_opme_itens_pacote ON public.pacotes_opme_itens USING btree (pacote_id)
// Table: patients
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
// Table: procedures
//   CREATE UNIQUE INDEX procedures_tuss_code_key ON public.procedures USING btree (tuss_code)
// Table: sectors
//   CREATE UNIQUE INDEX sectors_name_key ON public.sectors USING btree (name)
// Table: surgical_rooms
//   CREATE INDEX idx_surgical_rooms_facility_id ON public.surgical_rooms USING btree (facility_id)
//   CREATE INDEX idx_surgical_rooms_is_active ON public.surgical_rooms USING btree (is_active)
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
