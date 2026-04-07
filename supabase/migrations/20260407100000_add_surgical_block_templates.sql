DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'day_of_week') THEN
    CREATE TYPE day_of_week AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.surgical_block_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    surgical_room_id UUID NOT NULL REFERENCES public.surgical_rooms(id) ON DELETE CASCADE,
    day_of_week day_of_week NOT NULL,
    block_start_time TIME NOT NULL,
    block_end_time TIME NOT NULL,
    facility_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_active BOOLEAN NOT NULL DEFAULT true,
    notes TEXT,
    CONSTRAINT valid_block_times CHECK (block_start_time < block_end_time)
);

CREATE TABLE IF NOT EXISTS public.surgical_block_exceptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    surgical_block_template_id UUID NOT NULL REFERENCES public.surgical_block_templates(id) ON DELETE CASCADE,
    exception_date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reason TEXT
);

CREATE INDEX IF NOT EXISTS idx_sbt_room ON public.surgical_block_templates(surgical_room_id);
CREATE INDEX IF NOT EXISTS idx_sbt_facility ON public.surgical_block_templates(facility_id);
CREATE INDEX IF NOT EXISTS idx_sbt_active ON public.surgical_block_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_sbe_template ON public.surgical_block_exceptions(surgical_block_template_id);
CREATE INDEX IF NOT EXISTS idx_sbe_date ON public.surgical_block_exceptions(exception_date);

CREATE OR REPLACE TRIGGER update_sbt_timestamp BEFORE UPDATE ON public.surgical_block_templates FOR EACH ROW EXECUTE FUNCTION update_surgical_requests_timestamp();
CREATE OR REPLACE TRIGGER update_sbe_timestamp BEFORE UPDATE ON public.surgical_block_exceptions FOR EACH ROW EXECUTE FUNCTION update_surgical_requests_timestamp();

ALTER TABLE public.surgical_block_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.surgical_block_exceptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "templates_select" ON public.surgical_block_templates;
CREATE POLICY "templates_select" ON public.surgical_block_templates FOR SELECT TO authenticated USING (facility_id = auth.uid() OR has_role('admin') OR has_role('facility_manager'));

DROP POLICY IF EXISTS "templates_all_admin" ON public.surgical_block_templates;
CREATE POLICY "templates_all_admin" ON public.surgical_block_templates FOR ALL TO authenticated USING (has_role('admin') OR has_role('facility_manager')) WITH CHECK (has_role('admin') OR has_role('facility_manager'));

DROP POLICY IF EXISTS "exceptions_select" ON public.surgical_block_exceptions;
CREATE POLICY "exceptions_select" ON public.surgical_block_exceptions FOR SELECT TO authenticated USING (
    surgical_block_template_id IN (SELECT id FROM public.surgical_block_templates WHERE facility_id = auth.uid())
    OR has_role('admin') OR has_role('facility_manager')
);

DROP POLICY IF EXISTS "exceptions_all_admin" ON public.surgical_block_exceptions;
CREATE POLICY "exceptions_all_admin" ON public.surgical_block_exceptions FOR ALL TO authenticated USING (has_role('admin') OR has_role('facility_manager')) WITH CHECK (has_role('admin') OR has_role('facility_manager'));
