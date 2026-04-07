CREATE TABLE IF NOT EXISTS public.surgical_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    surgical_room_id UUID NOT NULL REFERENCES public.surgical_rooms(id) ON DELETE CASCADE,
    block_date DATE NOT NULL,
    block_start_time TIME NOT NULL,
    block_end_time TIME NOT NULL,
    duration_minutes INTEGER GENERATED ALWAYS AS (
        CAST(EXTRACT(EPOCH FROM (block_end_time - block_start_time)) / 60 AS INTEGER)
    ) STORED,
    assigned_surgeon_id UUID,
    assigned_proctor_id UUID,
    is_available BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT surgical_blocks_assigned_surgeon_id_fkey FOREIGN KEY (assigned_surgeon_id) REFERENCES public.profiles(id) ON DELETE SET NULL,
    CONSTRAINT surgical_blocks_assigned_proctor_id_fkey FOREIGN KEY (assigned_proctor_id) REFERENCES public.profiles(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_surgical_blocks_room_date ON public.surgical_blocks (surgical_room_id, block_date);
CREATE INDEX IF NOT EXISTS idx_surgical_blocks_surgeon ON public.surgical_blocks (assigned_surgeon_id);
CREATE INDEX IF NOT EXISTS idx_surgical_blocks_available ON public.surgical_blocks (is_available);

ALTER TABLE public.surgical_blocks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Blocks viewable by facility owner or admin" ON public.surgical_blocks;
CREATE POLICY "Blocks viewable by facility owner or admin" ON public.surgical_blocks
  FOR SELECT TO authenticated 
  USING (
    EXISTS (SELECT 1 FROM public.surgical_rooms sr WHERE sr.id = surgical_blocks.surgical_room_id AND sr.facility_id = auth.uid())
    OR has_role('admin') OR has_role('facility_manager')
  );

DROP POLICY IF EXISTS "Blocks manageable by admin or facility_manager" ON public.surgical_blocks;
CREATE POLICY "Blocks manageable by admin or facility_manager" ON public.surgical_blocks
  FOR ALL TO authenticated 
  USING (has_role('admin') OR has_role('facility_manager'))
  WITH CHECK (has_role('admin') OR has_role('facility_manager'));
