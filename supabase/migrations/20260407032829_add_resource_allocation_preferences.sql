DO $$
BEGIN
  ALTER TABLE public.resource_allocation
  ADD COLUMN IF NOT EXISTS selected_preference_order INT,
  ADD COLUMN IF NOT EXISTS is_fallback_allocation BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS fallback_reason TEXT,
  ADD COLUMN IF NOT EXISTS original_preference_id UUID REFERENCES public.surgical_request_block_preferences(id) ON DELETE SET NULL;
END $$;

CREATE OR REPLACE FUNCTION public.fn_update_pedido_on_allocation()
RETURNS trigger AS $function$
DECLARE
  v_current_status VARCHAR;
  v_notes TEXT;
BEGIN
  SELECT status INTO v_current_status
  FROM pedidos_cirurgia
  WHERE id = NEW.pedido_id;
  
  IF NEW.is_fallback_allocation THEN
    v_notes := 'Alocado fora das preferências. Motivo: ' || COALESCE(NEW.fallback_reason, 'Não informado');
  ELSIF NEW.selected_preference_order IS NOT NULL THEN
    v_notes := 'Alocado na ' || NEW.selected_preference_order || 'ª Preferência do cirurgião.';
  ELSE
    v_notes := 'Alocado (sem preferências registradas).';
  END IF;

  IF NEW.allocation_status = 'ALOCADO' THEN
    IF v_current_status IN ('6_AGUARDANDO_ALOCACAO', '5_AUTORIZADO') THEN
      UPDATE pedidos_cirurgia
      SET status = '7_AGENDADO_CC',
          updated_at = NOW()
      WHERE id = NEW.pedido_id;
      
      INSERT INTO audit_log (
        pedido_id, action, changed_by, status_from, status_to, changed_at, notes
      ) VALUES (
        NEW.pedido_id, 'Alocar Sala/Robô', NEW.allocated_by, v_current_status, '7_AGENDADO_CC', NOW(), v_notes
      );
    END IF;
  END IF;
  
  IF NEW.allocation_status = 'CANCELADO' THEN
    IF v_current_status = '7_AGENDADO_CC' THEN
      UPDATE pedidos_cirurgia
      SET status = '6_AGUARDANDO_ALOCACAO',
          updated_at = NOW()
      WHERE id = NEW.pedido_id;
      
      INSERT INTO audit_log (
        pedido_id, action, changed_by, status_from, status_to, changed_at, notes
      ) VALUES (
        NEW.pedido_id, 'Cancelar Alocação', NEW.allocated_by, '7_AGENDADO_CC', '6_AGUARDANDO_ALOCACAO', NOW(), 'Alocação cancelada.'
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$function$ LANGUAGE plpgsql;
