CREATE OR REPLACE FUNCTION public.validate_patient_creation()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  user_role TEXT;
BEGIN
  -- Obter role do usuário autenticado via user_roles
  SELECT role::text INTO user_role
  FROM public.user_roles
  WHERE user_id = auth.uid() AND is_active = true
  LIMIT 1;

  -- Se role não foi encontrada, usar 'authenticated' como padrão
  IF user_role IS NULL THEN
    user_role := 'authenticated';
  END IF;

  -- Validar campos obrigatórios para SURGEON
  IF user_role = 'surgeon' THEN
    IF NEW.full_name IS NULL OR NEW.full_name = '' THEN
      RAISE EXCEPTION 'full_name é obrigatório para cirurgião';
    END IF;
    IF NEW.cpf_hash IS NULL OR NEW.cpf_hash = '' THEN
      RAISE EXCEPTION 'cpf_hash é obrigatório para cirurgião';
    END IF;
    -- medical_record pode ser NULL para cirurgião
    NEW.medical_record := COALESCE(NEW.medical_record, NULL);
  END IF;

  -- Validar campos obrigatórios para SECRETARY/ADMIN
  IF user_role IN ('secretary', 'admin') THEN
    IF NEW.full_name IS NULL OR NEW.full_name = '' THEN
      RAISE EXCEPTION 'full_name é obrigatório';
    END IF;
    IF NEW.cpf_hash IS NULL OR NEW.cpf_hash = '' THEN
      RAISE EXCEPTION 'cpf_hash é obrigatório';
    END IF;
    IF NEW.medical_record IS NULL OR NEW.medical_record = '' THEN
      RAISE EXCEPTION 'medical_record é obrigatório para secretária/admin';
    END IF;
  END IF;

  RETURN NEW;
END;
$function$;
