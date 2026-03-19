-- Fix function handle_new_user to properly cast user_role to user_role_type
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, name, crm, phone, city, photo_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'crm',
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'city',
    NEW.raw_user_meta_data->>'photo_url'
  )
  ON CONFLICT (id) DO NOTHING;

  -- Ensure roles are processed if provided via signUp metadata
  IF NEW.raw_user_meta_data->>'user_role' IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, (NEW.raw_user_meta_data->>'user_role')::public.user_role_type)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$function$;

-- Fix function create_auth_user to properly cast user_role and insert mandatory auth.users columns
CREATE OR REPLACE FUNCTION public.create_auth_user(email text, password text, user_role text)
RETURNS uuid
LANGUAGE plpgsql
AS $function$
DECLARE
  v_user_id UUID;
BEGIN
  v_user_id := gen_random_uuid();
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
    is_super_admin, role, aud,
    confirmation_token, recovery_token, email_change_token_new,
    email_change, email_change_token_current,
    phone, phone_change, phone_change_token, reauthentication_token
  ) VALUES (
    v_user_id,
    '00000000-0000-0000-0000-000000000000',
    email,
    crypt(password, gen_salt('bf')),
    now(), now(), now(),
    jsonb_build_object('provider', 'email', 'providers', ARRAY['email']),
    jsonb_build_object('user_role', user_role),
    false, 'authenticated', 'authenticated',
    '', '', '', '', '', NULL, '', '', ''
  );

  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_user_id, user_role::public.user_role_type)
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN v_user_id;
END;
$function$;

-- Fix RLS for pedido_opme_items
ALTER TABLE public.pedido_opme_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "pedido_opme_items_select" ON public.pedido_opme_items;
CREATE POLICY "pedido_opme_items_select" ON public.pedido_opme_items
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "pedido_opme_items_insert" ON public.pedido_opme_items;
CREATE POLICY "pedido_opme_items_insert" ON public.pedido_opme_items
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "pedido_opme_items_update" ON public.pedido_opme_items;
CREATE POLICY "pedido_opme_items_update" ON public.pedido_opme_items
  FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "pedido_opme_items_delete" ON public.pedido_opme_items;
CREATE POLICY "pedido_opme_items_delete" ON public.pedido_opme_items
  FOR DELETE TO authenticated USING (true);

-- Seed Data for Testing
DO $$
DECLARE
  v_proc1_id uuid := gen_random_uuid();
  v_proc2_id uuid := gen_random_uuid();
  v_opme1_id uuid := gen_random_uuid();
  v_opme2_id uuid := gen_random_uuid();
  v_patient1_id uuid := gen_random_uuid();
BEGIN
  -- Insert Procedures
  INSERT INTO public.procedures (id, name, tuss_code, surgical_time_minutes, requires_robot)
  VALUES
    (v_proc1_id, 'Prostatectomia Radical Robótica', '31201138', 180, true),
    (v_proc2_id, 'Colecistectomia Videolaparoscópica', '31001090', 90, false)
  ON CONFLICT (tuss_code) DO NOTHING;

  -- Insert OPME
  INSERT INTO public.opme_items (id, name, tuss_code, item_type)
  VALUES
    (v_opme1_id, 'Pinça Maryland Bipolar Robótica', '70001', 'pinça_clicada'),
    (v_opme2_id, 'Tesoura ProGrasp Robótica', '70002', 'pinça_clicada')
  ON CONFLICT DO NOTHING;

  -- Insert a Mock Patient
  INSERT INTO public.patients (id, full_name, cpf_hash, medical_record, date_of_birth)
  VALUES
    (v_patient1_id, 'João da Silva (Paciente Teste)', '12345678909', 'PRONT-001', '1980-05-15')
  ON CONFLICT (cpf_hash) DO NOTHING;

  -- Seed a test user (Admin)
  -- Uses the recommended approach for auth.users
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@sistcir.com') THEN
    DECLARE
      v_admin_id uuid := gen_random_uuid();
    BEGIN
      INSERT INTO auth.users (
        id, instance_id, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
        is_super_admin, role, aud,
        confirmation_token, recovery_token, email_change_token_new,
        email_change, email_change_token_current,
        phone, phone_change, phone_change_token, reauthentication_token
      ) VALUES (
        v_admin_id, '00000000-0000-0000-0000-000000000000', 'admin@sistcir.com',
        crypt('Admin123!', gen_salt('bf')), NOW(), NOW(), NOW(),
        '{"provider": "email", "providers": ["email"]}', '{"name": "Admin Sistema", "user_role": "admin"}',
        false, 'authenticated', 'authenticated',
        '', '', '', '', '', NULL, '', '', ''
      );
      
      -- Insert Admin Role explicitly (will use ON CONFLICT to avoid duplicate if trigger already inserted it)
      INSERT INTO public.user_roles (user_id, role, is_active)
      VALUES (v_admin_id, 'admin', true)
      ON CONFLICT (user_id, role) DO NOTHING;
    END;
  END IF;
END $$;
