DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'allocation_status') THEN
    CREATE TYPE public.allocation_status AS ENUM ('ALOCADO', 'CONFIRMADO', 'CANCELADO');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.resource_allocation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id UUID NOT NULL REFERENCES public.pedidos_cirurgia(id) ON DELETE CASCADE,
  surgical_room_id UUID NOT NULL REFERENCES public.surgical_rooms(id) ON DELETE CASCADE,
  robotic_system_id UUID NOT NULL REFERENCES public.robotic_systems(id) ON DELETE CASCADE,
  surgical_block_id UUID NOT NULL REFERENCES public.surgical_blocks(id) ON DELETE CASCADE,
  allocated_surgeon_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  estimated_duration_minutes INTEGER NOT NULL CHECK (estimated_duration_minutes >= 1),
  allocated_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  allocated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  allocated_proctor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  allocation_status public.allocation_status NOT NULL DEFAULT 'ALOCADO'
);

CREATE INDEX IF NOT EXISTS idx_resource_allocation_pedido_id ON public.resource_allocation(pedido_id);
CREATE INDEX IF NOT EXISTS idx_resource_allocation_surgical_room_id ON public.resource_allocation(surgical_room_id);
CREATE INDEX IF NOT EXISTS idx_resource_allocation_surgical_block_id ON public.resource_allocation(surgical_block_id);
CREATE INDEX IF NOT EXISTS idx_resource_allocation_allocated_surgeon_id ON public.resource_allocation(allocated_surgeon_id);

DROP TRIGGER IF EXISTS update_resource_allocation_timestamp ON public.resource_allocation;
CREATE TRIGGER update_resource_allocation_timestamp
  BEFORE UPDATE ON public.resource_allocation
  FOR EACH ROW EXECUTE FUNCTION public.update_surgical_requests_timestamp();

ALTER TABLE public.resource_allocation ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allocations_select" ON public.resource_allocation;
CREATE POLICY "allocations_select" ON public.resource_allocation
  FOR SELECT TO authenticated
  USING (
    (surgical_room_id IN (SELECT id FROM public.surgical_rooms WHERE facility_id = auth.uid()))
    OR public.has_role('admin') OR public.has_role('facility_manager')
  );

DROP POLICY IF EXISTS "allocations_manage_admin" ON public.resource_allocation;
CREATE POLICY "allocations_manage_admin" ON public.resource_allocation
  FOR ALL TO authenticated
  USING (public.has_role('admin') OR public.has_role('facility_manager'))
  WITH CHECK (public.has_role('admin') OR public.has_role('facility_manager'));
