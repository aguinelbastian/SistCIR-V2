-- Fix fn_generate_recurring_blocks function to use hospital_id instead of facility_id
CREATE OR REPLACE FUNCTION public.fn_generate_recurring_blocks(p_template_id uuid, p_start_date date, p_end_date date)
 RETURNS TABLE(blocks_created integer, message text)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_template RECORD;
  v_current_date DATE;
  v_day_of_week INT;
  v_template_day_of_week INT;
  v_blocks_count INT := 0;
  v_skipped_count INT := 0;
  v_new_block_id UUID;
BEGIN
  -- Obter informações do template
  SELECT 
    sbt.id,
    sbt.surgical_room_id,
    sbt.day_of_week,
    sbt.block_start_time,
    sbt.block_end_time,
    sbt.hospital_id
  INTO v_template
  FROM public.surgical_block_templates sbt
  WHERE sbt.id = p_template_id;
  
  -- Validar se template existe
  IF v_template IS NULL THEN
    RETURN QUERY SELECT 0::INT, 'Erro: Template não encontrado'::TEXT;
    RETURN;
  END IF;
  
  -- Converter day_of_week do Enum para número (1=Monday, 7=Sunday)
  v_template_day_of_week := CASE v_template.day_of_week
    WHEN 'MONDAY' THEN 1
    WHEN 'TUESDAY' THEN 2
    WHEN 'WEDNESDAY' THEN 3
    WHEN 'THURSDAY' THEN 4
    WHEN 'FRIDAY' THEN 5
    WHEN 'SATURDAY' THEN 6
    WHEN 'SUNDAY' THEN 7
  END;
  
  -- Iterar sobre cada data no período
  v_current_date := p_start_date;
  WHILE v_current_date <= p_end_date LOOP
    -- Obter dia da semana (1=Monday, 7=Sunday)
    v_day_of_week := EXTRACT(ISODOW FROM v_current_date)::INT;
    
    -- Se o dia da semana corresponde ao template E não é exceção
    IF v_day_of_week = v_template_day_of_week 
       AND NOT public.fn_is_exception_date(p_template_id, v_current_date) THEN
      
      -- Inserir novo bloco
      INSERT INTO public.surgical_blocks (
        id,
        surgical_room_id,
        block_date,
        block_start_time,
        block_end_time,
        is_available,
        template_id,
        hospital_id,
        created_at,
        updated_at
      )
      VALUES (
        gen_random_uuid(),
        v_template.surgical_room_id,
        v_current_date,
        v_template.block_start_time,
        v_template.block_end_time,
        TRUE,
        p_template_id,
        v_template.hospital_id,
        NOW(),
        NOW()
      );
      
      v_blocks_count := v_blocks_count + 1;
    ELSIF v_day_of_week = v_template_day_of_week 
          AND public.fn_is_exception_date(p_template_id, v_current_date) THEN
      v_skipped_count := v_skipped_count + 1;
    END IF;
    
    -- Avançar para o próximo dia
    v_current_date := v_current_date + INTERVAL '1 day';
  END LOOP;
  
  -- Registrar auditoria na tabela correta (audit_logs genérico)
  INSERT INTO public.audit_logs (
    actor_id,
    event_type,
    table_name,
    record_id,
    new_value
  )
  VALUES (
    auth.uid(),
    'GERAR_BLOCOS_RECORRENTES',
    'surgical_blocks',
    p_template_id,
    jsonb_build_object('blocks_created', v_blocks_count, 'exceptions_skipped', v_skipped_count)
  );
  
  -- Retornar resultado
  RETURN QUERY SELECT 
    v_blocks_count,
    FORMAT('Sucesso: %s blocos criados, %s datas excluídas por exceção',
      v_blocks_count, v_skipped_count)::TEXT;
END;
$function$;
