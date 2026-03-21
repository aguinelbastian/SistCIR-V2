-- LGPD/HIPAA Compliance: This table only tracks technical identifiers (Event IDs, UUIDs).
-- Patient PII MUST NOT be stored here.
CREATE TABLE IF NOT EXISTS public.pedidos_calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id UUID NOT NULL REFERENCES public.pedidos_cirurgia(id) ON DELETE CASCADE,
  calendar_type VARCHAR(50) NOT NULL, -- 'SERVICE_ACCOUNT' or 'PERSONAL'
  surgeon_id UUID REFERENCES auth.users(id), -- NULL for SERVICE_ACCOUNT
  google_event_id TEXT NOT NULL,
  google_calendar_id TEXT NOT NULL,
  event_title VARCHAR(255) NOT NULL,
  event_description TEXT,
  event_start TIMESTAMP NOT NULL,
  event_end TIMESTAMP NOT NULL,
  sync_status VARCHAR(50) DEFAULT 'SYNCED',
  sync_error TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(pedido_id, calendar_type, surgeon_id)
);

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS google_calendar_refresh_token TEXT;

ALTER TABLE public.pedidos_calendar_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "surgeon_see_own_events" ON public.pedidos_calendar_events;
CREATE POLICY "surgeon_see_own_events" ON public.pedidos_calendar_events
  FOR SELECT TO authenticated
  USING (
    surgeon_id = auth.uid() 
    OR calendar_type = 'SERVICE_ACCOUNT' 
    OR EXISTS(SELECT 1 FROM public.user_roles WHERE user_roles.user_id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "allow_insert_calendar_events" ON public.pedidos_calendar_events;
CREATE POLICY "allow_insert_calendar_events" ON public.pedidos_calendar_events
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "allow_update_calendar_events" ON public.pedidos_calendar_events;
CREATE POLICY "allow_update_calendar_events" ON public.pedidos_calendar_events
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "allow_delete_calendar_events" ON public.pedidos_calendar_events;
CREATE POLICY "allow_delete_calendar_events" ON public.pedidos_calendar_events
  FOR DELETE TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_pedidos_calendar_events_pedido_id ON public.pedidos_calendar_events(pedido_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_calendar_events_surgeon_id ON public.pedidos_calendar_events(surgeon_id);
