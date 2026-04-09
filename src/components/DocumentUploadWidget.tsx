import { useState, useRef } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { Upload, AlertCircle } from 'lucide-react'

const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png',
  'image/webp',
]
const MAX_SIZE = 50 * 1024 * 1024 // 50MB

interface DocumentUploadWidgetProps {
  pedidoId: string
  onUploadSuccess?: () => void
}

export function DocumentUploadWidget({ pedidoId, onUploadSuccess }: DocumentUploadWidgetProps) {
  const { session, user } = useAuth()
  const [file, setFile] = useState<File | null>(null)
  const [tipo, setTipo] = useState<string>('')
  const [descricao, setDescricao] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!session) {
    return (
      <div className="p-4 bg-muted/50 rounded-lg flex items-center gap-2 text-muted-foreground">
        <AlertCircle className="w-5 h-5" />
        <span>Você precisa estar logado para anexar documentos.</span>
      </div>
    )
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return

    if (!ALLOWED_TYPES.includes(selected.type)) {
      toast.error('Tipo de arquivo não permitido.')
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    if (selected.size > MAX_SIZE) {
      toast.error('O arquivo excede o limite de 50MB.')
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    setFile(selected)
  }

  const handleUpload = async () => {
    if (!file) return toast.error('Selecione um arquivo.')
    if (!tipo) return toast.error('Selecione o tipo do documento.')

    if (!user) return toast.error('Usuário não autenticado.')

    setIsUploading(true)
    setProgress(10)

    try {
      const fileBuffer = await file.arrayBuffer()
      setProgress(20)

      // Calcula SHA-256 usando Web Crypto API nativa do navegador
      const hashBuffer = await crypto.subtle.digest('SHA-256', fileBuffer)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const fileHash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')

      setProgress(30)

      // Verifica duplicidade no banco
      const { data: existingDoc } = await supabase
        .from('pedidos_documentos')
        .select('id')
        .eq('pedido_id', pedidoId)
        .eq('arquivo_hash', fileHash)
        .is('deleted_at', null)
        .maybeSingle()

      if (existingDoc) {
        throw new Error('Este arquivo já foi enviado para este pedido.')
      }

      setProgress(40)

      const timestamp = Date.now()
      const storagePath = `${pedidoId}/${timestamp}-${file.name}`

      // Upload via Storage direto no cliente (protegido por RLS)
      const { error: uploadError } = await supabase.storage
        .from('pedidos-documentos')
        .upload(storagePath, fileBuffer, {
          contentType: file.type,
          upsert: false,
        })

      if (uploadError) {
        throw new Error('Erro ao fazer upload do arquivo.')
      }

      setProgress(70)

      // Registra documento no banco de dados (protegido por RLS)
      const { error: dbError } = await supabase.from('pedidos_documentos').insert({
        pedido_id: pedidoId,
        documento_tipo: tipo,
        arquivo_nome: file.name,
        arquivo_tamanho: file.size,
        arquivo_tipo: file.type,
        arquivo_hash: fileHash,
        storage_path: storagePath,
        uploaded_by: user.id,
        descricao: descricao || null,
        notas: `Upload realizado por ${user.id} em ${new Date().toISOString()}`,
      })

      if (dbError) {
        await supabase.storage.from('pedidos-documentos').remove([storagePath])
        throw new Error('Erro ao registrar documento no banco de dados.')
      }

      setProgress(85)

      // Registra na auditoria (protegido por RLS)
      const { data: pedidoData } = await supabase
        .from('pedidos_cirurgia')
        .select('status')
        .eq('id', pedidoId)
        .single()

      const currentStatus = pedidoData?.status || '1_RASCUNHO'

      await supabase.from('audit_log').insert({
        pedido_id: pedidoId,
        changed_by: user.id,
        status_from: currentStatus,
        status_to: currentStatus,
        action: `DOCUMENTO_ANEXADO: ${tipo}`,
        action_type: 'CREATED',
        action_context: `Arquivo: ${file.name} (${(file.size / 1024).toFixed(2)}KB)`,
        notes: `Hash: ${fileHash}`,
      })

      setProgress(100)
      toast.success('Documento anexado com sucesso!')

      setFile(null)
      setTipo('')
      setDescricao('')
      if (fileInputRef.current) fileInputRef.current.value = ''

      if (onUploadSuccess) onUploadSuccess()
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || 'Erro ao anexar documento.')
    } finally {
      setTimeout(() => {
        setIsUploading(false)
        setProgress(0)
      }, 500)
    }
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card">
      <h3 className="font-semibold text-lg flex items-center gap-2">
        <Upload className="w-5 h-5 text-primary" />
        Anexar Documento
      </h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="tipo-doc">Tipo de Documento *</Label>
          <Select value={tipo} onValueChange={setTipo} disabled={isUploading}>
            <SelectTrigger id="tipo-doc">
              <SelectValue placeholder="Selecione o tipo..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="JUSTIFICATIVA_CLINICA">Justificativa Clínica</SelectItem>
              <SelectItem value="EXAME_COMPLEMENTAR">Exame Complementar</SelectItem>
              <SelectItem value="AUTORIZACAO_OPERADORA">Autorização da Operadora</SelectItem>
              <SelectItem value="TERMO_CONSENTIMENTO">Termo de Consentimento</SelectItem>
              <SelectItem value="OUTRO">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="arquivo">Arquivo * (Max: 50MB)</Label>
          <Input
            id="arquivo"
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={ALLOWED_TYPES.join(',')}
            disabled={isUploading}
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="descricao">Descrição (Opcional)</Label>
          <Input
            id="descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Breve descrição do documento..."
            disabled={isUploading}
          />
        </div>
      </div>

      {isUploading && progress > 0 && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Enviando...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={handleUpload} disabled={!file || !tipo || isUploading}>
          {isUploading ? 'Enviando...' : 'Anexar Documento'}
        </Button>
      </div>
    </div>
  )
}
