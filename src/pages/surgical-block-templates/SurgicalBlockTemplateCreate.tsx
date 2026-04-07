import { ChevronLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { SurgicalBlockTemplateForm } from '@/components/surgical-block-templates/SurgicalBlockTemplateForm'

export default function SurgicalBlockTemplateCreate() {
  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/modelos-blocos">
            <ChevronLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Novo Modelo</h1>
          <p className="text-muted-foreground mt-1">Crie um novo padrão de blocos recorrentes.</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Detalhes do Modelo</CardTitle>
          <CardDescription>
            Preencha os campos abaixo para configurar o modelo de bloco.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SurgicalBlockTemplateForm />
        </CardContent>
      </Card>
    </div>
  )
}
