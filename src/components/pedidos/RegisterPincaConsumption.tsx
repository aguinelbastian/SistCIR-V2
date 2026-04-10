import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader2, ActivitySquare } from 'lucide-react'

export function RegisterPincaConsumption({ pedidoId }: { pedidoId: string }) {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submittingId, setSubmittingId] = useState<string | null>(null)

  const fetchItems = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('pedido_opme_items')
      .select(`
        id,
        quantity,
        lives_consumed,
        lot_used,
        opme_items (
          id,
          name,
          item_type,
          current_lives
        )
      `)
      .eq('pedido_id', pedidoId)

    if (!error && data) {
      setItems(data.filter((i) => i.opme_items?.item_type === 'pinça_clicada'))
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchItems()
  }, [pedidoId])

  const handleRegister = async (itemId: string, livesConsumed: number, lotUsed: string) => {
    if (livesConsumed < 0) {
      toast.error('O número de vidas consumidas não pode ser negativo.')
      return
    }

    setSubmittingId(itemId)
    try {
      const { data, error } = await supabase.rpc('register_pinça_consumption', {
        p_pedido_opme_item_id: itemId,
        p_lives_consumed: livesConsumed,
        p_lot_used: lotUsed || null,
      })

      if (error) throw error

      if (data && data.length > 0) {
        if (data[0].success) {
          toast.success(data[0].message)
          await fetchItems()
        } else {
          toast.error(data[0].message)
        }
      }
    } catch (e: any) {
      toast.error('Erro ao registrar consumo: ' + e.message)
    } finally {
      setSubmittingId(null)
    }
  }

  if (loading) {
    return (
      <Card className="border-dashed animate-fade-in mt-6">
        <CardContent className="p-6 flex items-center justify-center text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" /> Carregando pinças para registro...
        </CardContent>
      </Card>
    )
  }

  if (items.length === 0) return null

  return (
    <Card className="border-primary/20 shadow-sm mt-6 animate-fade-in">
      <CardHeader className="bg-primary/5 border-b pb-3 pt-4">
        <CardTitle className="text-base flex items-center gap-2 text-primary">
          <ActivitySquare className="h-5 w-5" />
          Registro de Consumo (Pinças Robóticas)
        </CardTitle>
        <CardDescription>
          Registre o consumo de vidas das pinças utilizadas durante a cirurgia.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/50">
          {items.map((item) => (
            <ConsumptionForm
              key={item.id}
              item={item}
              onRegister={handleRegister}
              isSubmitting={submittingId === item.id}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function ConsumptionForm({
  item,
  onRegister,
  isSubmitting,
}: {
  item: any
  onRegister: any
  isSubmitting: boolean
}) {
  const isAlreadyRegistered = item.lives_consumed !== null && item.lives_consumed > 0

  const [lives, setLives] = useState<number>(item.lives_consumed || item.quantity || 1)
  const [lot, setLot] = useState<string>(item.lot_used || '')

  return (
    <div className="p-4 space-y-4 bg-card">
      <div>
        <p className="font-medium text-sm text-foreground">{item.opme_items.name}</p>
        <div className="text-xs text-muted-foreground flex gap-3 mt-1">
          <span>Solicitado: {item.quantity}</span>
          <span>•</span>
          <span>Vidas em estoque: {item.opme_items.current_lives ?? 'N/A'}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
        <div className="space-y-2 sm:col-span-4">
          <Label className="text-xs">Vidas Consumidas</Label>
          <Input
            type="number"
            min="0"
            max={item.quantity * 10}
            value={lives}
            onChange={(e) => setLives(parseInt(e.target.value) || 0)}
            disabled={isAlreadyRegistered || isSubmitting}
            className="h-9"
          />
        </div>
        <div className="space-y-2 sm:col-span-4">
          <Label className="text-xs">Lote Utilizado (Opcional)</Label>
          <Input
            type="text"
            placeholder="Nº do lote"
            value={lot}
            onChange={(e) => setLot(e.target.value)}
            disabled={isAlreadyRegistered || isSubmitting}
            className="h-9"
          />
        </div>
        <div className="sm:col-span-4">
          <Button
            className="w-full h-9"
            disabled={isAlreadyRegistered || isSubmitting || lives <= 0}
            onClick={() => onRegister(item.id, lives, lot)}
            variant={isAlreadyRegistered ? 'outline' : 'default'}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" /> Registrando...
              </>
            ) : isAlreadyRegistered ? (
              'Registrado'
            ) : (
              'Registrar Consumo'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
