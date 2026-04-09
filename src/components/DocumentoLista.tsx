import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { FileText, Download, Trash2, AlertCircle } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

interface Documento {
  id: string
  arquivo_nome: string
  documento_tipo: string
  arquivo_tamanho: number
  uploaded_at: string
  storage_path: string
}

interface DocumentoListaProps {
  pedidoId: string
  refreshTrigger?: number
  onDeleted?: () => void
}

export function DocumentoLista({ pedidoId, refreshTrigger = 0, onDeleted }: DocumentoListaProps) {
  const { session } = useAuth()
  const [documentos, setDocumentos] = useState<Documento[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const loadDocumentos = useCallback(async () => {
    if (!session || !pedidoId) return

    setLoading(true)
    const { data, error } = await supabase
      .from('pedidos_documentos')
      .select('id, arquivo_nome, documento_tipo, arquivo_tamanho, uploaded_at, storage_path')
      .eq('pedido_id', pedidoId)
      .is('deleted_at', null)
      .order('uploaded_at', { ascending: false })

    if (error) {
      toast.error('Erro ao carregar documentos.')
      console.error(error)
    } else {
      setDocumentos(data || [])
    }
    setLoading(false)
  }, [pedidoId, session])

  useEffect(() => {
    loadDocumentos()
  }, [loadDocumentos, refreshTrigger])

  if (!session) {
    return (
      <div className="p-4 bg-muted/50 rounded-lg flex items-center gap-2 text-muted-foreground mt-4">
        <AlertCircle className="w-5 h-5" />
        <span>Você precisa estar logado para visualizar documentos.</span>
      </div>
    )
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const formatType = (tipo: string) => {
    const map: Record<string, string> = {
      JUSTIFICATIVA_CLINICA: 'Justificativa Clínica',
      EXAME_COMPLEMENTAR: 'Exame Complementar',
      AUTORIZACAO_OPERADORA: 'Autorização',
      TERMO_CONSENTIMENTO: 'Termo de Consentimento',
      OUTRO: 'Outro',
    }
    return map[tipo] || tipo
  }

  const handleDownload = async (path: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage.from('pedidos-documentos').download(path)

      if (error) throw error

      const url = URL.createObjectURL(data)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error: any) {
      console.error(error)
      toast.error('Erro ao baixar documento.')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente remover este documento?')) return

    setDeletingId(id)
    try {
      const { error } = await supabase
        .from('pedidos_documentos')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error

      toast.success('Documento removido com sucesso.')
      if (onDeleted) onDeleted()
      loadDocumentos()
    } catch (error: any) {
      console.error(error)
      toast.error('Erro ao remover documento.')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-3 mt-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    )
  }

  if (documentos.length === 0) {
    return (
      <div className="p-8 text-center border rounded-lg bg-card text-muted-foreground mt-4 border-dashed">
        <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>Nenhum documento anexado a este pedido.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3 mt-4">
      {documentos.map((doc) => (
        <div
          key={doc.id}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border rounded-lg bg-card gap-4"
        >
          <div className="flex items-start gap-3 overflow-hidden w-full sm:w-auto">
            <div className="p-2 bg-primary/10 text-primary rounded-md shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-sm truncate" title={doc.arquivo_nome}>
                {doc.arquivo_nome}
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-1">
                <span className="bg-muted px-2 py-0.5 rounded">
                  {formatType(doc.documento_tipo)}
                </span>
                <span className="flex items-center">{formatSize(doc.arquivo_tamanho)}</span>
                <span className="flex items-center">•</span>
                <span className="flex items-center">
                  {new Date(doc.uploaded_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 w-full sm:w-auto justify-end">
            <Button
              size="sm"
              variant="outline"
              className="gap-1 flex-1 sm:flex-none"
              onClick={() => handleDownload(doc.storage_path, doc.arquivo_nome)}
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Baixar</span>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              disabled={deletingId === doc.id}
              onClick={() => handleDelete(doc.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
