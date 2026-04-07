import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RoboticSystemForm } from './components/RoboticSystemForm'
import { getRoboticSystem, updateRoboticSystem } from '@/services/robotic-systems'
import { RoboticSystem } from '@/types/sistcir'

export default function RoboticSystemEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [system, setSystem] = useState<RoboticSystem | null>(null)

  useEffect(() => {
    if (id) {
      getRoboticSystem(id)
        .then(setSystem)
        .catch((error) => {
          toast.error('Erro ao carregar dados do sistema robótico.')
          console.error(error)
          navigate('/sistemas-roboticos')
        })
    }
  }, [id, navigate])

  const handleSubmit = async (data: Partial<RoboticSystem>) => {
    if (!id) return
    setIsLoading(true)
    try {
      await updateRoboticSystem(id, data)
      toast.success('Sistema robótico atualizado com sucesso!')
      navigate('/sistemas-roboticos')
    } catch (error: any) {
      console.error(error)
      toast.error('Erro ao atualizar sistema robótico: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (!system) {
    return <div className="p-8 text-center text-muted-foreground">Carregando...</div>
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/sistemas-roboticos')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editar Sistema Robótico</h1>
          <p className="text-muted-foreground">{system.system_name}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes do Equipamento</CardTitle>
        </CardHeader>
        <CardContent>
          <RoboticSystemForm initialData={system} onSubmit={handleSubmit} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  )
}
