-- Drop trigger if exists to ensure idempotency
DROP TRIGGER IF EXISTS "Send Welcome Email on New User" ON public.profiles;

-- Create the trigger webhook to call the edge function on INSERT
CREATE TRIGGER "Send Welcome Email on New User"
AFTER INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION supabase_functions.http_request(
  'https://iumxxwtcohabjgynxciv.supabase.co/functions/v1/send-email-welcome',
  'POST',
  '{"Content-type":"application/json"}',
  '{}',
  '5000'
);
