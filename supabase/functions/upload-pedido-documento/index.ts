import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Tipos de arquivo permitidos
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/jpeg",
  "image/png",
  "image/webp",
];

// Tamanho máximo: 50MB
const MAX_FILE_SIZE = 50 * 1024 * 1024;

// Tipos de documento obrigatórios por procedimento
const DOCUMENTO_OBRIGATORIO_POR_PROCEDIMENTO: Record<string, string[]> = {
  "PROSTATECTOMIA_RADICAL_ROBOTICA": [
    "JUSTIFICATIVA_CLINICA",
    "EXAME_COMPLEMENTAR",
  ],
  "NEFRECTOMIA_PARCIAL_ROBOTICA": [
    "JUSTIFICATIVA_CLINICA",
    "EXAME_COMPLEMENTAR",
  ],
  "CISTOPROSTATECTOMIA_ROBOTICA": [
    "JUSTIFICATIVA_CLINICA",
    "EXAME_COMPLEMENTAR",
    "TERMO_CONSENTIMENTO",
  ],
};

// Função para calcular SHA-256
async function calculateSHA256(data: Uint8Array): Promise<string> {
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

serve(async (req) => {
  // CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  try {
    // Validar método
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Método não permitido" }),
        { status: 405 }
      );
    }

    // Extrair token do header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Token de autenticação ausente" }),
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");

    // Validar token
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Token inválido ou expirado" }),
        { status: 401 }
      );
    }

    // Extrair FormData
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const pedidoId = formData.get("pedido_id") as string;
    const documentoTipo = formData.get("documento_tipo") as string;
    const descricao = formData.get("descricao") as string;

    // Validações
    if (!file) {
      return new Response(
        JSON.stringify({ error: "Arquivo não fornecido" }),
        { status: 400 }
      );
    }

    if (!pedidoId) {
      return new Response(
        JSON.stringify({ error: "pedido_id não fornecido" }),
        { status: 400 }
      );
    }

    if (!documentoTipo) {
      return new Response(
        JSON.stringify({ error: "documento_tipo não fornecido" }),
        { status: 400 }
      );
    }

    // Validar tipo de arquivo
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return new Response(
        JSON.stringify({
          error: `Tipo de arquivo não permitido. Tipos aceitos: ${ALLOWED_MIME_TYPES.join(", ")}`,
        }),
        { status: 400 }
      );
    }

    // Validar tamanho
    if (file.size > MAX_FILE_SIZE) {
      return new Response(
        JSON.stringify({
          error: `Arquivo muito grande. Tamanho máximo: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
        }),
        { status: 400 }
      );
    }

    // Validar que o cirurgião é o proprietário do pedido
    const { data: pedido, error: pedidoError } = await supabase
      .from("pedidos_cirurgia")
      .select("id, surgeon_id, procedimento_tuss")
      .eq("id", pedidoId)
      .single();

    if (pedidoError || !pedido) {
      return new Response(
        JSON.stringify({ error: "Pedido não encontrado" }),
        { status: 404 }
      );
    }

    if (pedido.surgeon_id !== user.id) {
      return new Response(
        JSON.stringify({
          error: "Você não tem permissão para fazer upload neste pedido",
        }),
        { status: 403 }
      );
    }

    // Calcular hash do arquivo
    const fileBuffer = await file.arrayBuffer();
    const fileHash = await calculateSHA256(new Uint8Array(fileBuffer));

    // Verificar se arquivo já foi enviado (duplicação)
    const { data: existingDoc } = await supabase
      .from("pedidos_documentos")
      .select("id")
      .eq("pedido_id", pedidoId)
      .eq("arquivo_hash", fileHash)
      .is("deleted_at", null)
      .single();

    if (existingDoc) {
      return new Response(
        JSON.stringify({
          error: "Este arquivo já foi enviado para este pedido",
        }),
        { status: 409 }
      );
    }

    // Gerar caminho no Storage
    const timestamp = Date.now();
    const storagePath = `${pedidoId}/${timestamp}-${file.name}`;

    // Upload para Storage
    const { error: uploadError } = await supabase.storage
      .from("pedidos-documentos")
      .upload(storagePath, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return new Response(
        JSON.stringify({ error: "Erro ao fazer upload do arquivo" }),
        { status: 500 }
      );
    }

    // Registrar na tabela pedidos_documentos
    const { data: documento, error: dbError } = await supabase
      .from("pedidos_documentos")
      .insert({
        pedido_id: pedidoId,
        documento_tipo: documentoTipo,
        arquivo_nome: file.name,
        arquivo_tamanho: file.size,
        arquivo_tipo: file.type,
        arquivo_hash: fileHash,
        storage_path: storagePath,
        uploaded_by: user.id,
        descricao: descricao || null,
        notas: `Upload realizado por ${user.email} em ${new Date().toISOString()}`,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database insert error:", dbError);
      // Tentar remover arquivo do Storage se falhar a inserção no BD
      await supabase.storage.from("pedidos-documentos").remove([storagePath]);
      return new Response(
        JSON.stringify({
          error: "Erro ao registrar documento no banco de dados",
        }),
        { status: 500 }
      );
    }

    // Registrar na auditoria
    await supabase.from("audit_log").insert({
      pedido_id: pedidoId,
      changed_by: user.id,
      status_from: null,
      status_to: null,
      action: `DOCUMENTO_ANEXADO: ${documentoTipo}`,
      action_type: "CREATED",
      action_context: `Arquivo: ${file.name} (${(file.size / 1024).toFixed(2)}KB)`,
      notes: `Hash: ${fileHash}`,
    });

    return new Response(
      JSON.stringify({
        success: true,
        documento: documento,
        message: "Documento anexado com sucesso",
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Erro interno do servidor" }),
      { status: 500 }
    );
  }
});