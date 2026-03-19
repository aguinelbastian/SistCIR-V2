import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'

export const ProtectedRoute = () => {
  const { user, loading, isActive } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground animate-pulse">
        Carregando SistCIR...
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Se o usuário não está ativo e não está na página de aguardando, redirecionar para aguardando
  if (!isActive && location.pathname !== '/aguardando') {
    return <Navigate to="/aguardando" replace />
  }

  // Se o usuário está ativo mas tenta ir para a sala de espera, mandar para o dashboard
  if (isActive && location.pathname === '/aguardando') {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
