-- 1. Alter opme_items table to include new fields safely
ALTER TABLE public.opme_items ADD COLUMN IF NOT EXISTS code TEXT;
ALTER TABLE public.opme_items ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.opme_items ADD COLUMN IF NOT EXISTS manufacturer TEXT;
ALTER TABLE public.opme_items ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Set default values
UPDATE public.opme_items 
SET 
    code = COALESCE(code, tuss_code || '-' || substr(id::text, 1, 8)),
    description = COALESCE(description, name, 'N/A'),
    manufacturer = COALESCE(manufacturer, 'Desconhecido');

-- Remove any duplicates in 'code' that might have caused the unique index error
WITH duplicates AS (
    SELECT id, code, row_number() OVER (PARTITION BY code ORDER BY created_at ASC) as rn
    FROM public.opme_items
)
UPDATE public.opme_items
SET code = code || '-' || substr(id::text, 1, 4)
WHERE id IN (SELECT id FROM duplicates WHERE rn > 1);

-- Double check duplicates one more time just in case there's still a collision
WITH duplicates AS (
    SELECT id, code, row_number() OVER (PARTITION BY code ORDER BY created_at ASC) as rn
    FROM public.opme_items
)
UPDATE public.opme_items
SET code = id::text
WHERE id IN (SELECT id FROM duplicates WHERE rn > 1);

-- Apply constraints safely
ALTER TABLE public.opme_items ALTER COLUMN code SET NOT NULL;
ALTER TABLE public.opme_items ALTER COLUMN description SET NOT NULL;
ALTER TABLE public.opme_items ALTER COLUMN manufacturer SET NOT NULL;
ALTER TABLE public.opme_items ALTER COLUMN is_active SET NOT NULL;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'opme_items_code_unique') THEN
        ALTER TABLE public.opme_items ADD CONSTRAINT opme_items_code_unique UNIQUE (code);
    END IF;
END $$;

-- 2. Alter pedido_opme_items to include authorization tracking and tracking who added
ALTER TABLE public.pedido_opme_items ADD COLUMN IF NOT EXISTS authorization_code TEXT;
ALTER TABLE public.pedido_opme_items ADD COLUMN IF NOT EXISTS authorized_at TIMESTAMPTZ;
ALTER TABLE public.pedido_opme_items ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.pedido_opme_items ADD COLUMN IF NOT EXISTS added_by UUID;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'pedido_opme_items_added_by_fkey') THEN
        ALTER TABLE public.pedido_opme_items ADD CONSTRAINT pedido_opme_items_added_by_fkey FOREIGN KEY (added_by) REFERENCES public.profiles(id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'pedido_opme_items_unique') THEN
        ALTER TABLE public.pedido_opme_items ADD CONSTRAINT pedido_opme_items_unique UNIQUE (pedido_id, opme_item_id);
    END IF;
END $$;

-- 3. Update RLS Policies for opme_items
DROP POLICY IF EXISTS "opme_insert" ON public.opme_items;
DROP POLICY IF EXISTS "opme_select" ON public.opme_items;
DROP POLICY IF EXISTS "opme_update" ON public.opme_items;
DROP POLICY IF EXISTS "opme_items_select" ON public.opme_items;
DROP POLICY IF EXISTS "opme_items_all" ON public.opme_items;

CREATE POLICY "opme_items_select" ON public.opme_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "opme_items_all" ON public.opme_items FOR ALL TO authenticated 
  USING (
    EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('opme', 'admin') AND ur.is_active = true)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('opme', 'admin') AND ur.is_active = true)
  );

-- 4. Update RLS Policies for pedido_opme_items
DROP POLICY IF EXISTS "opme_items_insert" ON public.pedido_opme_items;
DROP POLICY IF EXISTS "opme_items_select" ON public.pedido_opme_items;
DROP POLICY IF EXISTS "opme_items_update" ON public.pedido_opme_items;
DROP POLICY IF EXISTS "pedido_opme_items_delete" ON public.pedido_opme_items;
DROP POLICY IF EXISTS "pedido_opme_items_insert" ON public.pedido_opme_items;
DROP POLICY IF EXISTS "pedido_opme_items_select" ON public.pedido_opme_items;
DROP POLICY IF EXISTS "pedido_opme_items_update" ON public.pedido_opme_items;
DROP POLICY IF EXISTS "pedido_opme_items_all" ON public.pedido_opme_items;

CREATE POLICY "pedido_opme_items_select" ON public.pedido_opme_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "pedido_opme_items_all" ON public.pedido_opme_items FOR ALL TO authenticated 
  USING (
    EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('opme', 'admin') AND ur.is_active = true)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('opme', 'admin') AND ur.is_active = true)
  );

-- 5. Seed Initial OPME Materials
INSERT INTO public.opme_items (code, description, manufacturer, name, tuss_code, item_type) VALUES
  ('ROB-001', 'Porta-agulha robótico 8mm', 'Intuitive Surgical', 'Porta-agulha robótico 8mm', 'ROB-001', 'outro'),
  ('ROB-002', 'Tesoura robótica curved monopolar', 'Intuitive Surgical', 'Tesoura robótica curved monopolar', 'ROB-002', 'outro'),
  ('ROB-003', 'Grampeador linear robótico 45mm', 'Intuitive Surgical', 'Grampeador linear robótico 45mm', 'ROB-003', 'outro'),
  ('ROB-004', 'Clip de titânio médio-grande', 'Teleflex', 'Clip de titânio médio-grande', 'ROB-004', 'outro'),
  ('ROB-005', 'Bolsa de extração endoscópica 15mm', 'Applied Medical', 'Bolsa de extração endoscópica 15mm', 'ROB-005', 'outro')
ON CONFLICT (code) DO NOTHING;
