import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

Deno.serve(async () => {
  return new Response(
    JSON.stringify({
      status: 'ok',
      message: 'Placeholder edge function to resolve entrypoint error.',
    }),
    { headers: { 'Content-Type': 'application/json' } },
  )
})
