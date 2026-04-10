import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'

export function PincasValidationCard({ pedidoId }: { pedidoId: string }) {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchItems() {
      const { data, error } = await supabase
        .from('pedido_opme_items')
        .select(`
          id,
          quantity,
          opme_items (
            id,
            name,
            item_type,
            current_lives,
            max_lives
          )
        `)
        .eq('pedido_id', pedidoId)

      if (!error && data) {
        setItems(data)
      }
      setLoading(false)
    }
    fetchItems()
  }, [pedidoId])

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground p-4 bg-muted/30 rounded-md border">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">Verificando pinças e OPME...</span>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <Card className="border-dashed bg-muted/30 shadow-none">
        <CardContent className="p-4 text-center text-sm text-muted-foreground">
          Nenhum item OPME/Pinça solicitado para este pedido.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-primary/20 shadow-sm animate-in fade-in duration-300">
      <CardHeader className="bg-muted/30 border-b pb-3 pt-4">
        <CardTitle className="text-base flex items-center gap-2">
          Validação de Pinças Robóticas e OPME
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/50">
          {items.map((item) => {
            const opme = item.opme_items
            if (!opme) return null

            const isClicada = opme.item_type === 'pinça_clicada'
            const isSuficiente =
              !isClicada || (opme.current_lives !== null && opme.current_lives >= item.quantity)

            return (
              <div key={item.id} className="p-4 flex items-start gap-3 bg-card">
                <div className="mt-0.5">
                  {isSuficiente ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-destructive" />
                  )}
                </div>
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm text-foreground">{opme.name}</p>
                    <Badge
                      variant={isSuficiente ? 'outline' : 'destructive'}
                      className={
                        isSuficiente
                          ? 'text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400'
                          : ''
                      }
                    >
                      {isSuficiente ? 'Suficiente' : 'Insuficiente'}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground flex flex-col sm:flex-row sm:gap-4 gap-1">
                    <span>Tipo: {isClicada ? 'Pinça Clicada' : 'Uso Único'}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>Solicitado: {item.quantity}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>
                      Disponível:{' '}
                      {isClicada ? `${opme.current_lives ?? 0} vidas` : 'Sem limite de vidas'}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
