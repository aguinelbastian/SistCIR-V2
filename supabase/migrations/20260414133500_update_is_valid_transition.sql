CREATE OR REPLACE FUNCTION public.is_valid_transition(p_current_status text, p_new_status text)
 RETURNS boolean
 LANGUAGE plpgsql
 IMMUTABLE
AS $function$
BEGIN
  -- Definir transições válidas (máquina de estados linear)
  RETURN CASE
    WHEN p_current_status = '1_RASCUNHO' AND p_new_status = '2_AGUARDANDO_OPME' THEN TRUE
    WHEN p_current_status = '2_AGUARDANDO_OPME' AND p_new_status = '3_EM_AUDITORIA' THEN TRUE
    WHEN p_current_status = '3_EM_AUDITORIA' AND p_new_status = '4_PENDENCIA_TECNICA' THEN TRUE
    WHEN p_current_status = '3_EM_AUDITORIA' AND p_new_status = '5_AUTORIZADO' THEN TRUE
    WHEN p_current_status = '4_PENDENCIA_TECNICA' AND p_new_status = '3_EM_AUDITORIA' THEN TRUE
    WHEN p_current_status = '5_AUTORIZADO' AND p_new_status = '6_AGUARDANDO_ALOCACAO' THEN TRUE
    WHEN p_current_status = '6_AGUARDANDO_ALOCACAO' AND p_new_status = '7_AGENDADO_CC' THEN TRUE
    WHEN p_current_status = '7_AGENDADO_CC' AND p_new_status = '8_EM_EXECUCAO' THEN TRUE
    WHEN p_current_status = '8_EM_EXECUCAO' AND p_new_status = '9_REALIZADO' THEN TRUE
    WHEN p_current_status IN ('1_RASCUNHO', '2_AGUARDANDO_OPME', '3_EM_AUDITORIA', '4_PENDENCIA_TECNICA', '5_AUTORIZADO', '6_AGUARDANDO_ALOCACAO', '7_AGENDADO_CC', '8_EM_EXECUCAO', '9_REALIZADO') AND p_new_status = '10_CANCELADO' THEN TRUE
    ELSE FALSE
  END;
END;
$function$;
