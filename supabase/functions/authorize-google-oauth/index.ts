import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const googleOAuthClientId = Deno.env.get("GOOGLE_OAUTH_CLIENT_ID")!;
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  try {
    const redirectUri = `${supabaseUrl}/auth/v1/callback`;
    const scope = encodeURIComponent(
      "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/documents"
    );
    const state = crypto.getRandomValues(new Uint8Array(16)).toString();

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleOAuthClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&state=${state}&access_type=offline&prompt=consent`;

    return new Response(
      JSON.stringify({ authUrl }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    console.error("❌ Erro em authorize-google-oauth:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
});