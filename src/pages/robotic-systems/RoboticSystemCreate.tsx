import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RoboticSystemForm } from './components/RoboticSystemForm'
import { createRoboticSystem } from '@/services/robotic-systems'
import { RoboticSystem } from '@/types/sistcir'

export default function RoboticSystemCreate() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (data: Partial<RoboticSystem>) => {
    setIsLoading(true)
    try {
      await createRoboticSystem(data)
      toast.success('Sistema robótico cadastrado com sucesso!')
      navigate('/sistemas-roboticos')
    } catch (error: any) {
      console.error(error)
      toast.error('Erro ao cadastrar sistema robótico: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/sistemas-roboticos')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Novo Sistema Robótico</h1>
          <p className="text-muted-foreground">Cadastre um novo robô da Vinci na unidade.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes do Equipamento</CardTitle>
        </CardHeader>
        <CardContent>
          <RoboticSystemForm onSubmit={handleSubmit} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  )
}
