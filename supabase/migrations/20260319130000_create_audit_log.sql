CREATE TABLE public.audit_log (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id     UUID NOT NULL REFERENCES public.pedidos_cirurgia(id) ON DELETE CASCADE,
  changed_by    UUID NOT NULL REFERENCES public.profiles(id),
  changed_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  status_from   TEXT,
  status_to     TEXT NOT NULL,
  action        TEXT NOT NULL,
  notes         TEXT
);

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read audit_log"
  ON public.audit_log FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert audit_log"
  ON public.audit_log FOR INSERT
  TO authenticated WITH CHECK (changed_by = auth.uid());
