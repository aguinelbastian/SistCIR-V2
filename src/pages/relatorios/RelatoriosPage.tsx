import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { StatusChart } from './components/StatusChart'
import { SurgeonsChart } from './components/SurgeonsChart'
import { ProceduresChart } from './components/ProceduresChart'
import { ConversionChart } from './components/ConversionChart'
import { LeadTimeChart } from './components/LeadTimeChart'
import { SlaTable } from './components/SlaTable'
import { TrendingUp } from 'lucide-react'

export default function RelatoriosPage() {
  const { hasRole, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !hasRole('admin') && !hasRole('coordinator')) {
      navigate('/dashboard', { replace: true })
    }
  }, [loading, hasRole, navigate])

  if (loading || (!hasRole('admin') && !hasRole('coordinator'))) {
    return null
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg text-primary">
              <TrendingUp className="w-6 h-6" />
            </div>
            Painel de Indicadores
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitoramento de produtividade, SLA e conversões em tempo real.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatusChart />
        <ConversionChart />
        <SurgeonsChart />
        <ProceduresChart />
        <LeadTimeChart />
        <SlaTable />
      </div>
    </div>
  )
}
