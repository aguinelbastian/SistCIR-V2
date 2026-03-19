-- Webhook: Send Email on Surgery Created
CREATE TRIGGER "Send Email on Surgery Created"
  AFTER INSERT ON public.audit_log
  FOR EACH ROW
  WHEN (NEW.action = 'created')
  EXECUTE FUNCTION supabase_functions.http_request(
    'https://iumxxwtcohabjgynxciv.supabase.co/functions/v1/send-email-surgery-created',
    'POST',
    '{"Content-type":"application/json"}',
    '{}',
    '5000'
  );

-- Webhook: Send Email on Surgery Cancelled
CREATE TRIGGER "Send Email on Surgery Cancelled"
  AFTER INSERT ON public.audit_log
  FOR EACH ROW
  WHEN (NEW.status_to = '10_CANCELADO')
  EXECUTE FUNCTION supabase_functions.http_request(
    'https://iumxxwtcohabjgynxciv.supabase.co/functions/v1/send-email-surgery-cancelled',
    'POST',
    '{"Content-type":"application/json"}',
    '{}',
    '5000'
  );
