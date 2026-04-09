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
  const { session } = useAuth()
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

    setIsUploading(true)
    setProgress(10)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('pedido_id', pedidoId)
      formData.append('documento_tipo', tipo)
      if (descricao) formData.append('descricao', descricao)

      const {
        data: { session },
      } = await supabase.auth.getSession()
      const token = session?.access_token

      if (!token) throw new Error('Não autenticado')

      setProgress(40)

      const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/upload-pedido-documento`

      const interval = setInterval(() => {
        setProgress((p) => Math.min(p + 10, 90))
      }, 500)

      const res = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      clearInterval(interval)

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Erro ao enviar arquivo')
      }

      setProgress(100)
      toast.success('Documento anexado com sucesso!')

      setFile(null)
      setTipo('')
      setDescricao('')
      if (fileInputRef.current) fileInputRef.current.value = ''

      if (onUploadSuccess) onUploadSuccess()
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || 'Erro ao anexar documento')
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
