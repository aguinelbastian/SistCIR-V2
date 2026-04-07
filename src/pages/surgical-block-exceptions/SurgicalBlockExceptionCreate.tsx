import { ChevronLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { SurgicalBlockExceptionForm } from '@/components/surgical-block-exceptions/SurgicalBlockExceptionForm'

export default function SurgicalBlockExceptionCreate() {
  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/excecoes-blocos">
            <ChevronLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nova Exceção</h1>
          <p className="text-muted-foreground mt-1">
            Registre um bloqueio para um modelo de bloco.
          </p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Detalhes da Exceção</CardTitle>
          <CardDescription>Informe a data e o motivo do cancelamento recorrente.</CardDescription>
        </CardHeader>
        <CardContent>
          <SurgicalBlockExceptionForm />
        </CardContent>
      </Card>
    </div>
  )
}
