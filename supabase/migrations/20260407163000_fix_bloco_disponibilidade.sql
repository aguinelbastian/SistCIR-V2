-- Fix the allocation to correctly mark blocks as unavailable
CREATE OR REPLACE FUNCTION public.fn_update_pedido_on_allocation()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
  v_current_status VARCHAR;
  v_notes TEXT;
BEGIN
  SELECT status INTO v_current_status
  FROM public.pedidos_cirurgia
  WHERE id = NEW.pedido_id;
  
  IF NEW.is_fallback_allocation THEN
    v_notes := 'Alocado fora das preferências. Motivo: ' || COALESCE(NEW.fallback_reason, 'Não informado');
  ELSIF NEW.selected_preference_order IS NOT NULL THEN
    v_notes := 'Alocado na ' || NEW.selected_preference_order || 'ª Preferência do cirurgião.';
  ELSE
    v_notes := 'Alocado (sem preferências registradas).';
  END IF;

  IF NEW.allocation_status IN ('ALOCADO', 'CONFIRMADO') THEN
    UPDATE public.surgical_blocks SET is_available = false WHERE id = NEW.surgical_block_id;

    IF v_current_status IN ('6_AGUARDANDO_ALOCACAO', '5_AUTORIZADO') THEN
      UPDATE public.pedidos_cirurgia
      SET status = '7_AGENDADO_CC',
          updated_at = NOW()
      WHERE id = NEW.pedido_id;
      
      INSERT INTO public.audit_log (
        pedido_id, action, changed_by, status_from, status_to, changed_at, notes
      ) VALUES (
        NEW.pedido_id, 'Alocar Sala/Robô', NEW.allocated_by, v_current_status, '7_AGENDADO_CC', NOW(), v_notes
      );
    END IF;
  END IF;
  
  IF NEW.allocation_status = 'CANCELADO' THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.resource_allocation 
      WHERE surgical_block_id = NEW.surgical_block_id 
      AND allocation_status IN ('ALOCADO', 'CONFIRMADO') 
      AND id != NEW.id
    ) THEN
      UPDATE public.surgical_blocks SET is_available = true WHERE id = NEW.surgical_block_id;
    END IF;

    IF v_current_status = '7_AGENDADO_CC' THEN
      UPDATE public.pedidos_cirurgia
      SET status = '6_AGUARDANDO_ALOCACAO',
          updated_at = NOW()
      WHERE id = NEW.pedido_id;
      
      INSERT INTO public.audit_log (
        pedido_id, action, changed_by, status_from, status_to, changed_at, notes
      ) VALUES (
        NEW.pedido_id, 'Cancelar Alocação', NEW.allocated_by, '7_AGENDADO_CC', '6_AGUARDANDO_ALOCACAO', NOW(), 'Alocação cancelada.'
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Update existing allocated blocks to ensure is_available = false
UPDATE public.surgical_blocks sb
SET is_available = false
WHERE EXISTS (
  SELECT 1 FROM public.resource_allocation ra 
  WHERE ra.surgical_block_id = sb.id 
  AND ra.allocation_status IN ('ALOCADO', 'CONFIRMADO')
);

-- Recreate view to be robust and dynamically determine status
DROP VIEW IF EXISTS public.v_blocos_disponiveis;
CREATE VIEW public.v_blocos_disponiveis AS
SELECT 
    sb.id AS bloco_id,
    sb.block_date,
    sb.block_start_time,
    sb.block_end_time,
    sb.surgical_room_id,
    sb.hospital_id,
    sb.template_id,
    (
        SELECT count(*) 
        FROM public.surgical_request_block_preferences srbp 
        JOIN public.pedidos_cirurgia pc ON pc.id = srbp.pedido_cirurgia_id 
        WHERE srbp.surgical_block_id = sb.id 
        AND pc.status NOT IN ('7_AGENDADO_CC', '8_EM_EXECUCAO', '9_REALIZADO', '10_CANCELADO')
    ) AS num_cirurgioes_interessados,
    CASE
        WHEN EXISTS (
            SELECT 1 FROM public.resource_allocation ra 
            WHERE ra.surgical_block_id = sb.id 
            AND ra.allocation_status IN ('ALOCADO', 'CONFIRMADO')
        ) THEN 'ALOCADO'
        WHEN NOT sb.is_available THEN 'ALOCADO'
        WHEN EXISTS (
            SELECT 1 FROM public.surgical_request_block_preferences srbp
            JOIN public.pedidos_cirurgia pc ON pc.id = srbp.pedido_cirurgia_id 
            WHERE srbp.surgical_block_id = sb.id
            AND pc.status NOT IN ('7_AGENDADO_CC', '8_EM_EXECUCAO', '9_REALIZADO', '10_CANCELADO')
        ) THEN 'RESERVADO_PREFERENCIA'
        ELSE 'DISPONIVEL'
    END AS status_bloco
FROM public.surgical_blocks sb;
