-- Enable pg_net extension to allow database to send HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Create the trigger function that calls the Edge Function
CREATE OR REPLACE FUNCTION public.fn_webhook_notify_telegram()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_url TEXT;
  v_auth_header TEXT;
  v_request_body JSONB;
BEGIN
  -- Construct the Edge Function URL
  -- Uses the project URL from settings if available, otherwise falls back to the known project domain
  v_url := COALESCE(
    current_setting('app.settings.project_url', true),
    'https://iumxxwtcohabjgynxciv.supabase.co'
  ) || '/functions/v1/notify-telegram';

  -- Construct the Authorization Header
  -- Uses the service role key from settings to securely authenticate with the Edge Function
  v_auth_header := 'Bearer ' || COALESCE(
    current_setting('app.settings.service_role_key', true),
    'REPLACE_WITH_YOUR_SERVICE_ROLE_KEY'
  );

  -- Build the JSON payload matching standard Supabase Webhook format
  v_request_body := jsonb_build_object(
    'type', TG_OP,
    'table', TG_TABLE_NAME,
    'schema', TG_TABLE_SCHEMA,
    'record', row_to_json(NEW)
  );

  -- Dispatch asynchronous HTTP POST request
  -- Using net.http_post ensures the database transaction is not blocked by network latency
  PERFORM net.http_post(
    url := v_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', v_auth_header
    ),
    body := v_request_body
  );

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Catch any errors so they don't abort the original INSERT transaction
  RETURN NEW;
END;
$$;

-- Attach the trigger to the audit_log table
DROP TRIGGER IF EXISTS trg_audit_log_notify_telegram ON public.audit_log;
CREATE TRIGGER trg_audit_log_notify_telegram
AFTER INSERT ON public.audit_log
FOR EACH ROW
EXECUTE FUNCTION public.fn_webhook_notify_telegram();
