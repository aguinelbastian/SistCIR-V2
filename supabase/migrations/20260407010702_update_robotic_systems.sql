-- Add new columns safely to existing robotic_systems table
DO $$
BEGIN
  -- Add facility_id if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'robotic_systems' AND column_name = 'facility_id') THEN
    ALTER TABLE public.robotic_systems ADD COLUMN facility_id UUID;
    
    -- Add the foreign key constraint explicitly to have a known name
    ALTER TABLE public.robotic_systems 
      ADD CONSTRAINT robotic_systems_facility_id_fkey 
      FOREIGN KEY (facility_id) REFERENCES public.profiles(id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'robotic_systems' AND column_name = 'serial_number') THEN
    ALTER TABLE public.robotic_systems ADD COLUMN serial_number TEXT UNIQUE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'robotic_systems' AND column_name = 'installation_date') THEN
    ALTER TABLE public.robotic_systems ADD COLUMN installation_date DATE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'robotic_systems' AND column_name = 'last_maintenance_date') THEN
    ALTER TABLE public.robotic_systems ADD COLUMN last_maintenance_date DATE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'robotic_systems' AND column_name = 'next_maintenance_date') THEN
    ALTER TABLE public.robotic_systems ADD COLUMN next_maintenance_date DATE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'robotic_systems' AND column_name = 'is_operational') THEN
    ALTER TABLE public.robotic_systems ADD COLUMN is_operational BOOLEAN DEFAULT true;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'robotic_systems' AND column_name = 'notes') THEN
    ALTER TABLE public.robotic_systems ADD COLUMN notes TEXT;
  END IF;

  -- Rename 'name' to 'system_name'
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'robotic_systems' AND column_name = 'name') THEN
    ALTER TABLE public.robotic_systems RENAME COLUMN name TO system_name;
  END IF;
END $$;

-- Create missing indexes
CREATE INDEX IF NOT EXISTS idx_robotic_systems_facility_id ON public.robotic_systems(facility_id);
CREATE INDEX IF NOT EXISTS idx_robotic_systems_is_operational ON public.robotic_systems(is_operational);

-- Drop old RLS policies to recreate them based on the new facility_id requirement
DROP POLICY IF EXISTS "Robotic systems manageable by admin" ON public.robotic_systems;
DROP POLICY IF EXISTS "Robotic systems visible to all authenticated" ON public.robotic_systems;

-- Create new RLS policies following the standard
CREATE POLICY "robotic_systems_select" ON public.robotic_systems
  FOR SELECT TO authenticated 
  USING (facility_id = auth.uid() OR has_role('admin') OR has_role('facility_manager'));

CREATE POLICY "robotic_systems_all_admin" ON public.robotic_systems
  FOR ALL TO authenticated 
  USING (has_role('admin') OR has_role('facility_manager'))
  WITH CHECK (has_role('admin') OR has_role('facility_manager'));
