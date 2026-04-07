-- Fix RLS for robotic_systems to allow all authenticated users to view
DROP POLICY IF EXISTS "robotic_systems_select" ON public.robotic_systems;
CREATE POLICY "robotic_systems_select" ON public.robotic_systems
  FOR SELECT TO authenticated USING (true);

-- Fix RLS for surgical_blocks to allow all authenticated users to view
DROP POLICY IF EXISTS "select_blocks_by_hospital" ON public.surgical_blocks;
CREATE POLICY "select_blocks_by_hospital" ON public.surgical_blocks
  FOR SELECT TO authenticated USING (true);

-- Fix RLS for surgical_rooms to allow all authenticated users to view
DROP POLICY IF EXISTS "select_rooms_by_hospital" ON public.surgical_rooms;
CREATE POLICY "select_rooms_by_hospital" ON public.surgical_rooms
  FOR SELECT TO authenticated USING (true);

-- Fix RLS for surgical_block_templates to allow all authenticated users to view
DROP POLICY IF EXISTS "select_templates_by_hospital" ON public.surgical_block_templates;
CREATE POLICY "select_templates_by_hospital" ON public.surgical_block_templates
  FOR SELECT TO authenticated USING (true);

-- Fix RLS for surgical_block_exceptions to allow all authenticated users to view
DROP POLICY IF EXISTS "select_exceptions_by_hospital" ON public.surgical_block_exceptions;
CREATE POLICY "select_exceptions_by_hospital" ON public.surgical_block_exceptions
  FOR SELECT TO authenticated USING (true);

-- Fix RLS for surgical_request_block_preferences to allow all authenticated users to view
DROP POLICY IF EXISTS "select_preferences_by_hospital" ON public.surgical_request_block_preferences;
CREATE POLICY "select_preferences_by_hospital" ON public.surgical_request_block_preferences
  FOR SELECT TO authenticated USING (true);
