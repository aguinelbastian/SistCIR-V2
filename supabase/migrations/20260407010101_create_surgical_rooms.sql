-- Adicionar nova role
ALTER TYPE public.user_role_type ADD VALUE IF NOT EXISTS 'facility_manager';

-- Criar enum e tabela para os sistemas robóticos (necessário para a FK)
DO $DO$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'robotic_system_model') THEN
    CREATE TYPE public.robotic_system_model AS ENUM ('da Vinci Xi', 'da Vinci X', 'da Vinci SP');
  END IF;
END $DO$;

CREATE TABLE IF NOT EXISTS public.robotic_systems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    model public.robotic_system_model NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Criar tabela de salas cirúrgicas
CREATE TABLE IF NOT EXISTS public.surgical_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_number TEXT NOT NULL UNIQUE,
    room_name TEXT NOT NULL,
    facility_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    robotic_system_id UUID REFERENCES public.robotic_systems(id) ON DELETE SET NULL,
    capacity_patients INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Índices de performance solicitados
CREATE INDEX IF NOT EXISTS idx_surgical_rooms_facility_id ON public.surgical_rooms(facility_id);
CREATE INDEX IF NOT EXISTS idx_surgical_rooms_is_active ON public.surgical_rooms(is_active);

-- Habilitar RLS
ALTER TABLE public.robotic_systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.surgical_rooms ENABLE ROW LEVEL SECURITY;

-- Políticas para robotic_systems (Visualização pública, gestão admin)
DROP POLICY IF EXISTS "Robotic systems visible to all authenticated" ON public.robotic_systems;
CREATE POLICY "Robotic systems visible to all authenticated" ON public.robotic_systems
    FOR SELECT TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Robotic systems manageable by admin" ON public.robotic_systems;
CREATE POLICY "Robotic systems manageable by admin" ON public.robotic_systems
    FOR ALL TO authenticated
    USING (public.has_role('admin') OR public.has_role('facility_manager'))
    WITH CHECK (public.has_role('admin') OR public.has_role('facility_manager'));

-- Políticas para surgical_rooms (Conforme especificado)
DROP POLICY IF EXISTS "Rooms visible to facility owner" ON public.surgical_rooms;
CREATE POLICY "Rooms visible to facility owner" ON public.surgical_rooms
    FOR SELECT TO authenticated
    USING (facility_id = auth.uid() OR public.has_role('admin') OR public.has_role('facility_manager'));

DROP POLICY IF EXISTS "Rooms manageable by admin or facility_manager" ON public.surgical_rooms;
CREATE POLICY "Rooms manageable by admin or facility_manager" ON public.surgical_rooms
    FOR ALL TO authenticated
    USING (public.has_role('admin') OR public.has_role('facility_manager'))
    WITH CHECK (public.has_role('admin') OR public.has_role('facility_manager'));
