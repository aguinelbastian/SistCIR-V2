import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import { PedidoForm } from '@/components/pedidos/PedidoForm'

export default function PedidoCreate() {
  const navigate = useNavigate()

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-12">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nova Solicitação</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados do Pedido Cirúrgico</CardTitle>
          <CardDescription>
            Preencha os dados abaixo para iniciar uma nova solicitação de cirurgia.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PedidoForm onSuccess={() => navigate('/pedidos')} />
        </CardContent>
      </Card>
    </div>
  )
}
