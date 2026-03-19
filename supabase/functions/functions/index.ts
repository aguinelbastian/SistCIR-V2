import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req: Request) => {
  return new Response(
    JSON.stringify({ message: "Edge function 'functions' is running successfully." }),
    { headers: { 'Content-Type': 'application/json' } },
  )
})
