import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Users } from 'lucide-react'
import AddRoleCard from './components/AddRoleCard'
import ActiveUsersTab from './components/ActiveUsersTab'
import PendingUsersTab from './components/PendingUsersTab'

export default function UsersPage() {
  const { hasRole, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const [profiles, setProfiles] = useState<any[]>([])
  const [userRoles, setUserRoles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)
    const [pRes, rRes] = await Promise.all([
      supabase.from('profiles').select('*'),
      supabase.from('user_roles').select('*'),
    ])
    if (pRes.data) setProfiles(pRes.data)
    if (rRes.data) setUserRoles(rRes.data)
    setLoading(false)
  }

  useEffect(() => {
    if (!authLoading && !hasRole('admin')) {
      navigate('/dashboard')
    }
  }, [authLoading, hasRole, navigate])

  useEffect(() => {
    if (hasRole('admin')) {
      loadData()
    }
  }, [hasRole])

  if (authLoading || !hasRole('admin')) return null

  const pendingProfiles = profiles
    .filter((p) => !p.is_active)
    .sort(
      (a, b) => new Date(a.requested_at || 0).getTime() - new Date(b.requested_at || 0).getTime(),
    )

  const activeProfiles = profiles.filter((p) => p.is_active)

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Users className="w-8 h-8 text-primary" /> Gerenciamento de Usuários
        </h1>
        <p className="text-muted-foreground mt-1">
          Gerencie acessos, atribua papéis e aprove novos cadastros no sistema.
        </p>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">Usuários Ativos</TabsTrigger>
          <TabsTrigger value="pending" className="relative">
            Aguardando Aprovação
            {pendingProfiles.length > 0 ? (
              <Badge className="ml-2 px-1.5 py-0.5 text-[10px] min-w-[20px] justify-center bg-red-500 hover:bg-red-600">
                {pendingProfiles.length}
              </Badge>
            ) : (
              <Badge className="ml-2 px-1.5 py-0.5 text-[10px] min-w-[20px] justify-center bg-gray-200 text-gray-500 hover:bg-gray-200">
                0
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          <AddRoleCard profiles={activeProfiles} userRoles={userRoles} reload={loadData} />
          <ActiveUsersTab
            profiles={activeProfiles}
            userRoles={userRoles}
            loading={loading}
            reload={loadData}
          />
        </TabsContent>

        <TabsContent value="pending">
          <PendingUsersTab profiles={pendingProfiles} loading={loading} reload={loadData} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
