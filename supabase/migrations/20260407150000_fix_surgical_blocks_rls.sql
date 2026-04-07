-- Drop existing select policy to recreate it clean
DROP POLICY IF EXISTS "select_blocks_by_hospital" ON public.surgical_blocks;
DROP POLICY IF EXISTS "Blocks manageable by admin or facility_manager" ON public.surgical_blocks;

-- 1. Create open SELECT policy for all authenticated users
CREATE POLICY "surgical_blocks_select_all" ON public.surgical_blocks
  FOR SELECT TO authenticated USING (true);

-- 2. Ensure only admins and facility_managers can ALL (insert/update/delete)
CREATE POLICY "surgical_blocks_manage_admin" ON public.surgical_blocks
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_roles.user_id = auth.uid() 
      AND user_roles.role IN ('admin', 'facility_manager')
      AND user_roles.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_roles.user_id = auth.uid() 
      AND user_roles.role IN ('admin', 'facility_manager')
      AND user_roles.is_active = true
    )
  );

-- Fix RLS for Robotic Systems
DROP POLICY IF EXISTS "robotic_systems_select" ON public.robotic_systems;
DROP POLICY IF EXISTS "robotic_systems_all_admin" ON public.robotic_systems;

CREATE POLICY "robotic_systems_select_all" ON public.robotic_systems
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "robotic_systems_manage_admin" ON public.robotic_systems
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_roles.user_id = auth.uid() 
      AND user_roles.role IN ('admin')
      AND user_roles.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_roles.user_id = auth.uid() 
      AND user_roles.role IN ('admin')
      AND user_roles.is_active = true
    )
  );
