import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const googleOAuthClientId = Deno.env.get("GOOGLE_OAUTH_CLIENT_ID")!;
const googleOAuthClientSecret = Deno.env.get("GOOGLE_OAUTH_CLIENT_SECRET")!;

serve(async (req: Request) => {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    console.log("📋 Callback recebido:", { code: code?.substring(0, 20), state });

    if (!code) {
      throw new Error("Authorization code não fornecido");
    }

    if (!state) {
      throw new Error("State parameter não fornecido");
    }

    // Conectar ao Supabase com Service Role Key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Validar state
    console.log("🔍 Validando state...");
    const { data: tokenData, error: tokenError } = await supabase
      .from("google_oauth_tokens")
      .select("user_id, oauth_state, oauth_state_created_at")
      .eq("oauth_state", state)
      .single();

    if (tokenError || !tokenData) {
      console.error("❌ State inválido:", tokenError);
      throw new Error("State inválido ou expirado");
    }

    // Verificar se state não expirou (5 minutos)
    const stateCreatedAt = new Date(tokenData.oauth_state_created_at);
    const now = new Date();
    const diffMinutes = (now.getTime() - stateCreatedAt.getTime()) / (1000 * 60);

    if (diffMinutes > 5) {
      throw new Error("State expirado");
    }

    const userId = tokenData.user_id;
    console.log("✅ State válido para usuário:", userId);

    // Trocar authorization_code por access_token
    console.log("🔄 Trocando authorization_code por access_token...");
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: googleOAuthClientId,
        client_secret: googleOAuthClientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: `${supabaseUrl}/auth/v1/callback`,
      }).toString(),
    });

    const googleTokenData = await tokenResponse.json();

    if (!googleTokenData.access_token) {
      console.error("❌ Erro ao obter token:", googleTokenData);
      throw new Error(
        `Erro ao obter token: ${googleTokenData.error_description}`
      );
    }

    console.log("✅ Access token obtido do Google");

    // Armazenar tokens na tabela google_oauth_tokens
    const expiresAt = new Date(
      Date.now() + googleTokenData.expires_in * 1000
    );

    console.log("💾 Armazenando tokens no banco...");
    const { error: updateError } = await supabase
      .from("google_oauth_tokens")
      .update({
        access_token: googleTokenData.access_token,
        refresh_token: googleTokenData.refresh_token || null,
        expires_at: expiresAt.toISOString(),
        oauth_state: null,
        oauth_state_created_at: null,
      })
      .eq("user_id", userId);

    if (updateError) {
      console.error("❌ Erro ao armazenar token:", updateError);
      throw new Error(`Erro ao armazenar token: ${updateError.message}`);
    }

    console.log(`✅ Token OAuth armazenado para usuário: ${userId}`);

    // Redirecionar para página de sucesso
    return new Response(
      JSON.stringify({
        message: "Autorização bem-sucedida",
        user_id: userId,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("❌ Erro em google-oauth-callback:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});