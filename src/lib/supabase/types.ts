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
      opme_items: {
        Row: {
          created_at: string | null
          current_lives: number | null
          id: string
          is_available: boolean | null
          item_type: string
          lot_number: string | null
          max_lives: number | null
          name: string
          serial_number: string | null
          tuss_code: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_lives?: number | null
          id?: string
          is_available?: boolean | null
          item_type: string
          lot_number?: string | null
          max_lives?: number | null
          name: string
          serial_number?: string | null
          tuss_code: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_lives?: number | null
          id?: string
          is_available?: boolean | null
          item_type?: string
          lot_number?: string | null
          max_lives?: number | null
          name?: string
          serial_number?: string | null
          tuss_code?: string
          updated_at?: string | null
        }
        Relationships: []
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
          created_at: string | null
          id: string
          lives_consumed: number | null
          lot_used: string | null
          opme_item_id: string
          pedido_id: string
          quantity: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          lives_consumed?: number | null
          lot_used?: string | null
          opme_item_id: string
          pedido_id: string
          quantity?: number
        }
        Update: {
          created_at?: string | null
          id?: string
          lives_consumed?: number | null
          lot_used?: string | null
          opme_item_id?: string
          pedido_id?: string
          quantity?: number
        }
        Relationships: [
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
        ]
      }
      pedidos_cirurgia: {
        Row: {
          adjuvant_procedures: Json | null
          anesthesiologist_name: string | null
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
          patient_id: string
          procedure_id: string
          proctor_crm: string | null
          proctor_id: string | null
          robot_platform: string | null
          scheduled_date: string | null
          secretary_id: string | null
          status: Database['public']['Enums']['surgery_status'] | null
          surgeon_id: string
          surgical_technique: string | null
          tiss_xml_path: string | null
          updated_at: string | null
        }
        Insert: {
          adjuvant_procedures?: Json | null
          anesthesiologist_name?: string | null
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
          patient_id: string
          procedure_id: string
          proctor_crm?: string | null
          proctor_id?: string | null
          robot_platform?: string | null
          scheduled_date?: string | null
          secretary_id?: string | null
          status?: Database['public']['Enums']['surgery_status'] | null
          surgeon_id: string
          surgical_technique?: string | null
          tiss_xml_path?: string | null
          updated_at?: string | null
        }
        Update: {
          adjuvant_procedures?: Json | null
          anesthesiologist_name?: string | null
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
          patient_id?: string
          procedure_id?: string
          proctor_crm?: string | null
          proctor_id?: string | null
          robot_platform?: string | null
          scheduled_date?: string | null
          secretary_id?: string | null
          status?: Database['public']['Enums']['surgery_status'] | null
          surgeon_id?: string
          surgical_technique?: string | null
          tiss_xml_path?: string | null
          updated_at?: string | null
        }
        Relationships: [
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
          id: string
          is_active: boolean
          name: string | null
          phone: string | null
          photo_url: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string
          crm?: string | null
          email: string
          id: string
          is_active?: boolean
          name?: string | null
          phone?: string | null
          photo_url?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string
          crm?: string | null
          email?: string
          id?: string
          is_active?: boolean
          name?: string | null
          phone?: string | null
          photo_url?: string | null
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
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
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
//   created_at: timestamp with time zone (nullable, default: now())
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
// Table: sectors
//   id: uuid (not null, default: uuid_generate_v4())
//   name: text (not null)
//   role_target: user_role_type (nullable)
//   telegram_chat_id: text (nullable)
//   notify_on_status: _surgery_status (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: user_roles
//   id: uuid (not null, default: uuid_generate_v4())
//   user_id: uuid (not null)
//   role: user_role_type (not null)
//   is_active: boolean (nullable, default: false)
//   granted_by: uuid (nullable)
//   created_at: timestamp with time zone (nullable, default: now())

// --- CONSTRAINTS ---
// Table: audit_logs
//   PRIMARY KEY audit_logs_pkey: PRIMARY KEY (id)
// Table: opme_items
//   CHECK opme_items_item_type_check: CHECK ((item_type = ANY (ARRAY['pinça_clicada'::text, 'uso_unico'::text, 'grampeador'::text, 'drape'::text, 'outro'::text])))
//   PRIMARY KEY opme_items_pkey: PRIMARY KEY (id)
// Table: patients
//   UNIQUE patients_cpf_hash_key: UNIQUE (cpf_hash)
//   FOREIGN KEY patients_created_by_fkey: FOREIGN KEY (created_by) REFERENCES auth.users(id)
//   PRIMARY KEY patients_pkey: PRIMARY KEY (id)
// Table: pedido_opme_items
//   FOREIGN KEY pedido_opme_items_opme_item_id_fkey: FOREIGN KEY (opme_item_id) REFERENCES opme_items(id)
//   FOREIGN KEY pedido_opme_items_pedido_id_fkey: FOREIGN KEY (pedido_id) REFERENCES pedidos_cirurgia(id) ON DELETE CASCADE
//   PRIMARY KEY pedido_opme_items_pkey: PRIMARY KEY (id)
// Table: pedidos_cirurgia
//   CHECK pedidos_cirurgia_asa_classification_check: CHECK ((asa_classification = ANY (ARRAY['ASA I'::text, 'ASA II'::text, 'ASA III'::text, 'ASA IV'::text, 'ASA V'::text])))
//   FOREIGN KEY pedidos_cirurgia_cancellation_actor_id_fkey: FOREIGN KEY (cancellation_actor_id) REFERENCES auth.users(id)
//   CHECK pedidos_cirurgia_guide_type_check: CHECK ((guide_type = ANY (ARRAY['TISS'::text, 'AIH'::text, 'Particular'::text])))
//   CHECK pedidos_cirurgia_laterality_check: CHECK ((laterality = ANY (ARRAY['Direito'::text, 'Esquerdo'::text, 'Bilateral'::text, 'N/A'::text])))
//   FOREIGN KEY pedidos_cirurgia_patient_id_fkey: FOREIGN KEY (patient_id) REFERENCES patients(id)
//   PRIMARY KEY pedidos_cirurgia_pkey: PRIMARY KEY (id)
//   FOREIGN KEY pedidos_cirurgia_procedure_id_fkey: FOREIGN KEY (procedure_id) REFERENCES procedures(id)
//   FOREIGN KEY pedidos_cirurgia_proctor_id_fkey: FOREIGN KEY (proctor_id) REFERENCES auth.users(id)
//   FOREIGN KEY pedidos_cirurgia_secretary_id_fkey: FOREIGN KEY (secretary_id) REFERENCES auth.users(id)
//   FOREIGN KEY pedidos_cirurgia_surgeon_id_fkey: FOREIGN KEY (surgeon_id) REFERENCES profiles(id) ON DELETE RESTRICT
// Table: procedures
//   PRIMARY KEY procedures_pkey: PRIMARY KEY (id)
//   UNIQUE procedures_tuss_code_key: UNIQUE (tuss_code)
// Table: profiles
//   FOREIGN KEY profiles_id_fkey: FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
//   PRIMARY KEY profiles_pkey: PRIMARY KEY (id)
// Table: sectors
//   UNIQUE sectors_name_key: UNIQUE (name)
//   PRIMARY KEY sectors_pkey: PRIMARY KEY (id)
// Table: user_roles
//   FOREIGN KEY user_roles_granted_by_fkey: FOREIGN KEY (granted_by) REFERENCES auth.users(id)
//   PRIMARY KEY user_roles_pkey: PRIMARY KEY (id)
//   FOREIGN KEY user_roles_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
//   UNIQUE user_roles_user_id_role_key: UNIQUE (user_id, role)

// --- ROW LEVEL SECURITY POLICIES ---
// Table: audit_logs
//   Policy "audit_logs_insert_system" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: true
//   Policy "audit_logs_select_admin" (SELECT, PERMISSIVE) roles={public}
//     USING: has_role('admin'::text)
// Table: opme_items
//   Policy "opme_insert" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: has_any_role(ARRAY['opme'::text, 'admin'::text])
//   Policy "opme_select" (SELECT, PERMISSIVE) roles={public}
//     USING: has_any_role(ARRAY['surgeon'::text, 'secretary'::text, 'opme'::text, 'nursing'::text, 'coordinator'::text, 'admin'::text])
//   Policy "opme_update" (UPDATE, PERMISSIVE) roles={public}
//     USING: has_any_role(ARRAY['opme'::text, 'nursing'::text, 'admin'::text])
// Table: patients
//   Policy "patients_delete" (DELETE, PERMISSIVE) roles={public}
//     USING: has_role('admin'::text)
//   Policy "patients_insert" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: has_any_role(ARRAY['surgeon'::text, 'secretary'::text, 'admin'::text])
//   Policy "patients_select" (SELECT, PERMISSIVE) roles={public}
//     USING: ((created_by = auth.uid()) OR has_any_role(ARRAY['secretary'::text, 'opme'::text, 'billing'::text, 'nursing'::text, 'coordinator'::text, 'admin'::text]))
//   Policy "patients_select_dashboard" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "patients_update" (UPDATE, PERMISSIVE) roles={public}
//     USING: has_any_role(ARRAY['secretary'::text, 'admin'::text])
// Table: pedido_opme_items
//   Policy "opme_items_insert" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: has_any_role(ARRAY['surgeon'::text, 'secretary'::text, 'opme'::text, 'admin'::text])
//   Policy "opme_items_select" (SELECT, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM pedidos_cirurgia pc   WHERE ((pc.id = pedido_opme_items.pedido_id) AND ((pc.surgeon_id = auth.uid()) OR has_any_role(ARRAY['opme'::text, 'nursing'::text, 'coordinator'::text, 'billing'::text, 'admin'::text])))))
//   Policy "opme_items_update" (UPDATE, PERMISSIVE) roles={public}
//     USING: has_any_role(ARRAY['opme'::text, 'nursing'::text, 'admin'::text])
//   Policy "pedido_opme_items_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "pedido_opme_items_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: true
//   Policy "pedido_opme_items_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "pedido_opme_items_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: true
// Table: pedidos_cirurgia
//   Policy "pedidos_insert" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (has_any_role(ARRAY['surgeon'::text, 'secretary'::text]) AND (surgeon_id = auth.uid()))
//   Policy "pedidos_select" (SELECT, PERMISSIVE) roles={public}
//     USING: ((surgeon_id = auth.uid()) OR has_any_role(ARRAY['secretary'::text, 'opme'::text, 'billing'::text, 'nursing'::text, 'coordinator'::text, 'admin'::text]))
//   Policy "pedidos_select_dashboard" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "pedidos_update_admin" (UPDATE, PERMISSIVE) roles={public}
//     USING: has_role('admin'::text)
//   Policy "pedidos_update_billing" (UPDATE, PERMISSIVE) roles={public}
//     USING: (has_role('billing'::text) AND (status = ANY (ARRAY['3_EM_AUDITORIA'::surgery_status, '4_PENDENCIA_TECNICA'::surgery_status, '5_AUTORIZADO'::surgery_status])))
//   Policy "pedidos_update_coordinator" (UPDATE, PERMISSIVE) roles={public}
//     USING: (has_role('coordinator'::text) AND (status = ANY (ARRAY['6_AGUARDANDO_MAPA'::surgery_status, '7_AGENDADO_CC'::surgery_status])))
//   Policy "pedidos_update_nursing" (UPDATE, PERMISSIVE) roles={public}
//     USING: (has_role('nursing'::text) AND (status = ANY (ARRAY['7_AGENDADO_CC'::surgery_status, '8_EM_EXECUCAO'::surgery_status, '9_REALIZADO'::surgery_status, '10_CANCELADO'::surgery_status])))
//   Policy "pedidos_update_opme" (UPDATE, PERMISSIVE) roles={public}
//     USING: (has_role('opme'::text) AND (status = '2_AGUARDANDO_OPME'::surgery_status))
//   Policy "pedidos_update_surgeon" (UPDATE, PERMISSIVE) roles={public}
//     USING: ((surgeon_id = auth.uid()) AND has_role('surgeon'::text))
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
//   Policy "profiles_select_all" (SELECT, PERMISSIVE) roles={public}
//     USING: true
//   Policy "profiles_select_dashboard" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "profiles_update_own" (UPDATE, PERMISSIVE) roles={public}
//     USING: (auth.uid() = id)
// Table: sectors
//   Policy "sectors_all_admin" (ALL, PERMISSIVE) roles={public}
//     USING: has_role('admin'::text)
//   Policy "sectors_select" (SELECT, PERMISSIVE) roles={public}
//     USING: has_role('admin'::text)
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
// Table: pedidos_cirurgia
//   trg_audit_pedidos: CREATE TRIGGER trg_audit_pedidos AFTER INSERT OR DELETE OR UPDATE ON public.pedidos_cirurgia FOR EACH ROW EXECUTE FUNCTION fn_audit_pedidos()
// Table: user_roles
//   trg_audit_roles: CREATE TRIGGER trg_audit_roles AFTER INSERT OR DELETE OR UPDATE ON public.user_roles FOR EACH ROW EXECUTE FUNCTION fn_audit_roles()

// --- INDEXES ---
// Table: audit_logs
//   CREATE INDEX idx_audit_logs_actor ON public.audit_logs USING btree (actor_id)
//   CREATE INDEX idx_audit_logs_created ON public.audit_logs USING btree (created_at DESC)
//   CREATE INDEX idx_audit_logs_event ON public.audit_logs USING btree (event_type)
//   CREATE INDEX idx_audit_logs_record ON public.audit_logs USING btree (record_id)
// Table: patients
//   CREATE UNIQUE INDEX patients_cpf_hash_key ON public.patients USING btree (cpf_hash)
// Table: procedures
//   CREATE UNIQUE INDEX procedures_tuss_code_key ON public.procedures USING btree (tuss_code)
// Table: sectors
//   CREATE UNIQUE INDEX sectors_name_key ON public.sectors USING btree (name)
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
