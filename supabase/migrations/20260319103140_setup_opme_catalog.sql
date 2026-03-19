-- 1. Create tables if they don't exist
CREATE TABLE IF NOT EXISTS public.opme_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    manufacturer TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- Including columns that might be required by older migrations/views
    name TEXT DEFAULT 'N/A',
    tuss_code TEXT DEFAULT 'N/A',
    item_type TEXT DEFAULT 'outro'
);

CREATE TABLE IF NOT EXISTS public.pedido_opme_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pedido_id UUID NOT NULL REFERENCES public.pedidos_cirurgia(id) ON DELETE CASCADE,
    opme_item_id UUID NOT NULL REFERENCES public.opme_items(id),
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    authorization_code TEXT,
    authorized_at TIMESTAMPTZ,
    notes TEXT,
    added_by UUID NOT NULL REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (pedido_id, opme_item_id)
);

-- 2. Alter existing tables to match the spec safely (in case they already exist)
ALTER TABLE public.opme_items ADD COLUMN IF NOT EXISTS code TEXT;
ALTER TABLE public.opme_items ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.opme_items ADD COLUMN IF NOT EXISTS manufacturer TEXT;
ALTER TABLE public.opme_items ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Safely populate data for existing rows before applying NOT NULL constraints
UPDATE public.opme_items SET code = id::text WHERE code IS NULL;
UPDATE public.opme_items SET description = COALESCE(name, 'N/A') WHERE description IS NULL;
UPDATE public.opme_items SET manufacturer = 'N/A' WHERE manufacturer IS NULL;
UPDATE public.opme_items SET is_active = TRUE WHERE is_active IS NULL;

ALTER TABLE public.opme_items ALTER COLUMN code SET NOT NULL;
ALTER TABLE public.opme_items ALTER COLUMN description SET NOT NULL;
ALTER TABLE public.opme_items ALTER COLUMN manufacturer SET NOT NULL;
ALTER TABLE public.opme_items ALTER COLUMN is_active SET NOT NULL;
ALTER TABLE public.opme_items ALTER COLUMN created_at SET NOT NULL;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'opme_items_code_key') AND NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'opme_items_code_unique') THEN
        ALTER TABLE public.opme_items ADD CONSTRAINT opme_items_code_key UNIQUE (code);
    END IF;
END $$;

ALTER TABLE public.pedido_opme_items ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1;
ALTER TABLE public.pedido_opme_items ADD COLUMN IF NOT EXISTS authorization_code TEXT;
ALTER TABLE public.pedido_opme_items ADD COLUMN IF NOT EXISTS authorized_at TIMESTAMPTZ;
ALTER TABLE public.pedido_opme_items ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.pedido_opme_items ADD COLUMN IF NOT EXISTS added_by UUID;

-- Ensure added_by has a value for any existing records
UPDATE public.pedido_opme_items poi
SET added_by = pc.surgeon_id
FROM public.pedidos_cirurgia pc
WHERE poi.pedido_id = pc.id AND poi.added_by IS NULL;

-- Remove orphans if they couldn't be resolved
DELETE FROM public.pedido_opme_items WHERE added_by IS NULL;

ALTER TABLE public.pedido_opme_items ALTER COLUMN added_by SET NOT NULL;
ALTER TABLE public.pedido_opme_items ALTER COLUMN quantity SET NOT NULL;
ALTER TABLE public.pedido_opme_items ALTER COLUMN created_at SET NOT NULL;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'pedido_opme_items_quantity_check') THEN
        ALTER TABLE public.pedido_opme_items ADD CONSTRAINT pedido_opme_items_quantity_check CHECK (quantity > 0);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'pedido_opme_items_pedido_id_opme_item_id_key') AND NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'pedido_opme_items_unique') THEN
        ALTER TABLE public.pedido_opme_items ADD CONSTRAINT pedido_opme_items_pedido_id_opme_item_id_key UNIQUE (pedido_id, opme_item_id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'pedido_opme_items_added_by_fkey') THEN
        ALTER TABLE public.pedido_opme_items ADD CONSTRAINT pedido_opme_items_added_by_fkey FOREIGN KEY (added_by) REFERENCES public.profiles(id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'pedido_opme_items_pedido_id_fkey') THEN
        ALTER TABLE public.pedido_opme_items ADD CONSTRAINT pedido_opme_items_pedido_id_fkey FOREIGN KEY (pedido_id) REFERENCES public.pedidos_cirurgia(id) ON DELETE CASCADE;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'pedido_opme_items_opme_item_id_fkey') THEN
        ALTER TABLE public.pedido_opme_items ADD CONSTRAINT pedido_opme_items_opme_item_id_fkey FOREIGN KEY (opme_item_id) REFERENCES public.opme_items(id);
    END IF;
END $$;


-- 3. Row Level Security Policies
ALTER TABLE public.opme_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedido_opme_items ENABLE ROW LEVEL SECURITY;

-- opme_items policies
DROP POLICY IF EXISTS "Authenticated users can read opme_items" ON public.opme_items;
CREATE POLICY "Authenticated users can read opme_items" 
ON public.opme_items FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Only opme and admin can manage opme_items" ON public.opme_items;
CREATE POLICY "Only opme and admin can manage opme_items" 
ON public.opme_items FOR ALL TO authenticated 
USING (
  EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('opme', 'admin') AND ur.is_active = true)
)
WITH CHECK (
  EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('opme', 'admin') AND ur.is_active = true)
);

-- pedido_opme_items policies
DROP POLICY IF EXISTS "Authenticated users can read pedido_opme_items" ON public.pedido_opme_items;
CREATE POLICY "Authenticated users can read pedido_opme_items" 
ON public.pedido_opme_items FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Only opme and admin can manage pedido_opme_items" ON public.pedido_opme_items;
CREATE POLICY "Only opme and admin can manage pedido_opme_items" 
ON public.pedido_opme_items FOR ALL TO authenticated 
USING (
  EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('opme', 'admin') AND ur.is_active = true)
)
WITH CHECK (
  EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('opme', 'admin') AND ur.is_active = true)
);

-- 4. Seed Data
INSERT INTO public.opme_items (code, description, manufacturer, name, tuss_code, item_type)
VALUES
  ('ROB-001', 'Porta-agulha robótico 8mm', 'Intuitive Surgical', 'Porta-agulha robótico 8mm', 'ROB-001', 'outro'),
  ('ROB-002', 'Tesoura robótica curved monopolar', 'Intuitive Surgical', 'Tesoura robótica curved monopolar', 'ROB-002', 'outro'),
  ('ROB-003', 'Grampeador linear robótico 45mm', 'Intuitive Surgical', 'Grampeador linear robótico 45mm', 'ROB-003', 'outro'),
  ('ROB-004', 'Clip de titânio médio-grande', 'Teleflex', 'Clip de titânio médio-grande', 'ROB-004', 'outro'),
  ('ROB-005', 'Bolsa de extração endoscópica 15mm', 'Applied Medical', 'Bolsa de extração endoscópica 15mm', 'ROB-005', 'outro')
ON CONFLICT (code) DO UPDATE 
SET description = EXCLUDED.description,
    manufacturer = EXCLUDED.manufacturer,
    is_active = true;
