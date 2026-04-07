CREATE TABLE IF NOT EXISTS public.surgical_request_block_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pedido_cirurgia_id UUID NOT NULL REFERENCES public.pedidos_cirurgia(id) ON DELETE CASCADE,
    surgical_block_id UUID NOT NULL REFERENCES public.surgical_blocks(id) ON DELETE RESTRICT,
    preference_order INT NOT NULL CHECK (preference_order IN (1, 2, 3)),
    facility_id UUID NOT NULL REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (pedido_cirurgia_id, preference_order),
    UNIQUE (pedido_cirurgia_id, surgical_block_id)
);

CREATE INDEX IF NOT EXISTS idx_srbp_pedido ON public.surgical_request_block_preferences(pedido_cirurgia_id);
CREATE INDEX IF NOT EXISTS idx_srbp_block ON public.surgical_request_block_preferences(surgical_block_id);
CREATE INDEX IF NOT EXISTS idx_srbp_facility ON public.surgical_request_block_preferences(facility_id);
CREATE INDEX IF NOT EXISTS idx_srbp_pedido_order ON public.surgical_request_block_preferences(pedido_cirurgia_id, preference_order);

ALTER TABLE public.surgical_request_block_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_preferences" ON public.surgical_request_block_preferences;
CREATE POLICY "select_preferences" ON public.surgical_request_block_preferences
  FOR SELECT TO authenticated
  USING (
    (EXISTS (SELECT 1 FROM public.pedidos_cirurgia pc WHERE pc.id = pedido_cirurgia_id AND pc.surgeon_id = auth.uid()))
    OR facility_id = auth.uid()
    OR public.has_role('admin')
    OR public.has_role('facility_manager')
  );

DROP POLICY IF EXISTS "insert_preferences" ON public.surgical_request_block_preferences;
CREATE POLICY "insert_preferences" ON public.surgical_request_block_preferences
  FOR INSERT TO authenticated
  WITH CHECK (
    (EXISTS (SELECT 1 FROM public.pedidos_cirurgia pc WHERE pc.id = pedido_cirurgia_id AND pc.surgeon_id = auth.uid()))
    OR facility_id = auth.uid()
    OR public.has_role('admin')
    OR public.has_role('facility_manager')
  );

DROP POLICY IF EXISTS "delete_preferences" ON public.surgical_request_block_preferences;
CREATE POLICY "delete_preferences" ON public.surgical_request_block_preferences
  FOR DELETE TO authenticated
  USING (
    facility_id = auth.uid()
    OR public.has_role('admin')
    OR public.has_role('facility_manager')
  );
