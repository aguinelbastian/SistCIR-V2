import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { RoboticSystemForm } from './components/RoboticSystemForm'
import { createRoboticSystem } from '@/services/robotic-systems'

export default function RoboticSystemCreate() {
  const navigate = useNavigate()

  const handleSubmit = async (data: any) => {
    try {
      await createRoboticSystem(data)
      toast.success('Sistema robótico criado com sucesso.')
      navigate('/sistemas-roboticos')
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || 'Erro ao criar sistema robótico.')
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Novo Sistema Robótico</h1>
        <p className="text-muted-foreground">Cadastre um novo equipamento da Vinci.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Sistema</CardTitle>
          <CardDescription>Preencha os dados do novo sistema robótico abaixo.</CardDescription>
        </CardHeader>
        <CardContent>
          <RoboticSystemForm onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  )
}
