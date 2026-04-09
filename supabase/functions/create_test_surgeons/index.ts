import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const surgeons = [
  { name: "Dr. Carlos Silva", email: "carlos.silva@sistcir.com.br", crm: "123456" },
  { name: "Dra. Fernanda Costa", email: "fernanda.costa@sistcir.com.br", crm: "123457" },
  { name: "Dr. Roberto Oliveira", email: "roberto.oliveira@sistcir.com.br", crm: "123458" },
  { name: "Dra. Juliana Martins", email: "juliana.martins@sistcir.com.br", crm: "123459" },
  { name: "Dr. André Pereira", email: "andre.pereira@sistcir.com.br", crm: "123460" },
  { name: "Dra. Mariana Gomes", email: "mariana.gomes@sistcir.com.br", crm: "123461" },
  { name: "Dr. Lucas Ferreira", email: "lucas.ferreira@sistcir.com.br", crm: "123462" },
  { name: "Dra. Patricia Alves", email: "patricia.alves@sistcir.com.br", crm: "123463" },
  { name: "Dr. Felipe Santos", email: "felipe.santos@sistcir.com.br", crm: "123464" },
  { name: "Dra. Beatriz Rocha", email: "beatriz.rocha@sistcir.com.br", crm: "123465" },
];

Deno.serve(async (req) => {
  try {
    const results = [];

    for (const surgeon of surgeons) {
      // Criar usuário via Admin API
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: surgeon.email,
        password: "abc123456",
        email_confirm: true,
      });

      if (authError) {
        results.push({
          surgeon: surgeon.name,
          status: "error",
          message: authError.message,
        });
        continue;
      }

      // Inserir perfil em profiles
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: authUser.user.id,
          name: surgeon.name,
          email: surgeon.email,
          crm: surgeon.crm,
          is_active: true,
          created_at: new Date().toISOString(),
        });

      if (profileError) {
        results.push({
          surgeon: surgeon.name,
          status: "error",
          message: profileError.message,
        });
        continue;
      }

      results.push({
        surgeon: surgeon.name,
        status: "success",
        user_id: authUser.user.id,
      });
    }

    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});