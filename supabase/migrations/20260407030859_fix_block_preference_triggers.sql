-- Drop old function signatures if they exist with the old argument types
DROP FUNCTION IF EXISTS public.fn_validate_block_for_preference(uuid, uuid);
DROP FUNCTION IF EXISTS public.fn_get_available_blocks_for_request(uuid);

CREATE OR REPLACE FUNCTION public.fn_validate_block_for_preference(p_surgical_block_id uuid, p_pedido_cirurgia_id uuid)
 RETURNS TABLE(is_valid boolean, validation_message text)
 LANGUAGE plpgsql
AS $function$
DECLARE
  v_block RECORD;
  v_request RECORD;
  v_preference_count INT;
BEGIN
  -- Obter informações do bloco
  SELECT 
    sb.id,
    sb.is_available,
    sb.block_date,
    sb.surgical_room_id
  INTO v_block
  FROM surgical_blocks sb
  WHERE sb.id = p_surgical_block_id;
  
  -- Obter informações da cirurgia
  SELECT 
    pc.id,
    pc.scheduled_date as requested_date
  INTO v_request
  FROM pedidos_cirurgia pc
  WHERE pc.id = p_pedido_cirurgia_id;
  
  -- Validação 1: Bloco existe?
  IF v_block IS NULL THEN
    RETURN QUERY SELECT FALSE, 'Erro: Bloco cirúrgico não encontrado'::TEXT;
    RETURN;
  END IF;
  
  -- Validação 2: Cirurgia existe?
  IF v_request IS NULL THEN
    RETURN QUERY SELECT FALSE, 'Erro: Solicitação de cirurgia não encontrada'::TEXT;
    RETURN;
  END IF;
  
  -- Validação 3: Bloco está disponível?
  IF v_block.is_available = FALSE THEN
    RETURN QUERY SELECT FALSE, 'Erro: Bloco não está disponível (is_available = false)'::TEXT;
    RETURN;
  END IF;
  
  -- Validação 4: Data do bloco >= data da cirurgia?
  IF v_request.requested_date IS NOT NULL AND v_block.block_date < (v_request.requested_date AT TIME ZONE 'UTC')::DATE THEN
    RETURN QUERY SELECT FALSE, FORMAT('Erro: Data do bloco (%s) é anterior à data solicitada (%s)',
      v_block.block_date::TEXT, (v_request.requested_date AT TIME ZONE 'UTC')::DATE::TEXT)::TEXT;
    RETURN;
  END IF;
  
  -- Validação 5: Bloco já foi selecionado como preferência para esta cirurgia?
  SELECT COUNT(*) INTO v_preference_count
  FROM surgical_request_block_preferences
  WHERE pedido_cirurgia_id = p_pedido_cirurgia_id
    AND surgical_block_id = p_surgical_block_id;
  
  IF v_preference_count > 0 THEN
    RETURN QUERY SELECT FALSE, 'Erro: Este bloco já foi selecionado como preferência para esta cirurgia'::TEXT;
    RETURN;
  END IF;
  
  -- Todas as validações passaram
  RETURN QUERY SELECT TRUE, 'Bloco é elegível para seleção'::TEXT;
END;
$function$;

CREATE OR REPLACE FUNCTION public.fn_validate_block_preferences_on_insert()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
  v_validation RECORD;
  v_preference_count INT;
BEGIN
  -- Validar o bloco
  SELECT * INTO v_validation
  FROM fn_validate_block_for_preference(NEW.surgical_block_id, NEW.pedido_cirurgia_id);
  
  IF v_validation.is_valid = FALSE THEN
    RAISE EXCEPTION 'Validação de preferência falhou: %', v_validation.validation_message;
  END IF;
  
  -- Validar que não há mais de 3 preferências para esta cirurgia
  SELECT COUNT(*) INTO v_preference_count
  FROM surgical_request_block_preferences
  WHERE pedido_cirurgia_id = NEW.pedido_cirurgia_id;
  
  IF v_preference_count >= 3 THEN
    RAISE EXCEPTION 'Erro: Máximo de 3 preferências por cirurgia já atingido';
  END IF;
  
  -- Validar que preference_order é 1, 2 ou 3
  IF NEW.preference_order NOT IN (1, 2, 3) THEN
    RAISE EXCEPTION 'Erro: preference_order deve ser 1, 2 ou 3';
  END IF;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.fn_audit_block_preferences_delete()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  INSERT INTO audit_log (
    action,
    changed_by,
    notes,
    changed_at,
    pedido_id,
    status_to
  )
  VALUES (
    'Deletar Preferência de Bloco',
    auth.uid(),
    FORMAT('pedido_cirurgia_id: %s | surgical_block_id: %s | preference_order: %s',
      OLD.pedido_cirurgia_id::TEXT, OLD.surgical_block_id::TEXT, OLD.preference_order::TEXT),
    NOW(),
    OLD.pedido_cirurgia_id,
    'N/A'
  );
  
  RETURN OLD;
END;
$function$;

CREATE OR REPLACE FUNCTION public.fn_get_available_blocks_for_request(p_pedido_cirurgia_id uuid)
 RETURNS TABLE(id uuid, surgical_room_id uuid, room_name text, block_date date, block_start_time time without time zone, block_end_time time without time zone, is_available boolean, template_id uuid)
 LANGUAGE plpgsql
AS $function$
DECLARE
  v_requested_date DATE;
BEGIN
  -- Obter data solicitada da cirurgia
  SELECT (pc.scheduled_date AT TIME ZONE 'UTC')::DATE INTO v_requested_date
  FROM pedidos_cirurgia pc
  WHERE pc.id = p_pedido_cirurgia_id;
  
  IF v_requested_date IS NULL THEN
    v_requested_date := CURRENT_DATE;
  END IF;
  
  -- Retornar blocos elegíveis
  RETURN QUERY
  SELECT 
    sb.id,
    sb.surgical_room_id,
    sr_room.room_name,
    sb.block_date,
    sb.block_start_time,
    sb.block_end_time,
    sb.is_available,
    sb.template_id
  FROM surgical_blocks sb
  INNER JOIN surgical_rooms sr_room ON sb.surgical_room_id = sr_room.id
  WHERE sb.is_available = TRUE
    AND sb.block_date >= v_requested_date
  ORDER BY sb.block_date ASC, sb.block_start_time ASC;
END;
$function$;
