-- Fix infinite recursion in hospital_users policy
-- We use a SECURITY DEFINER function to bypass RLS when looking up the user's managed hospitals.

CREATE OR REPLACE FUNCTION public.get_user_managed_hospitals()
RETURNS SETOF uuid
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT hospital_id 
  FROM public.hospital_users 
  WHERE user_id = auth.uid() AND role = 'facility_manager' AND is_active = true;
$function$;

DROP POLICY IF EXISTS "select_own_hospital_users" ON public.hospital_users;

CREATE POLICY "select_own_hospital_users" ON public.hospital_users
  FOR SELECT TO public
  USING (
    user_id = auth.uid() 
    OR has_role('admin'::text) 
    OR hospital_id IN (SELECT public.get_user_managed_hospitals())
  );
