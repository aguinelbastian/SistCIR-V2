import { Link, useLocation } from 'react-router-dom'
import {
  Activity,
  LayoutDashboard,
  Users,
  FileText,
  Stethoscope,
  Package,
  UserCircle,
  TrendingUp,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from '@/components/ui/sidebar'
import { useAuth } from '@/hooks/use-auth'

export function AppSidebar() {
  const location = useLocation()
  const { hasRole } = useAuth()

  const routes = [
    { title: 'Painel Geral', url: '/dashboard', icon: LayoutDashboard },
    { title: 'Minha Conta', url: '/minha-conta', icon: UserCircle },
    { title: 'Pedidos Cirúrgicos', url: '/pedidos', icon: FileText },
    { title: 'Pacientes', url: '/pacientes', icon: Users },
    { title: 'Procedimentos', url: '/procedimentos', icon: Activity },
    { title: 'Estoque OPME', url: '/opme', icon: Package },
    { title: 'Preferências de Blocos', url: '/preferencias-blocos', icon: Activity },
  ]

  const showReports = hasRole('admin') || hasRole('coordinator')

  return (
    <Sidebar>
      <SidebarHeader className="h-16 flex items-center justify-center border-b px-4">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 font-bold text-xl text-primary w-full px-2 hover:opacity-90 transition-opacity"
        >
          <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
            <Stethoscope className="w-5 h-5" />
          </div>
          <span>SistCIR v2</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mt-4 mb-2 px-4">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {routes.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      location.pathname === item.url || location.pathname.startsWith(`${item.url}/`)
                    }
                  >
                    <Link to={item.url}>
                      <item.icon className="w-4 h-4 mr-3 opacity-70" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {showReports && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={location.pathname === '/relatorios'}>
                    <Link to="/relatorios">
                      <TrendingUp className="w-4 h-4 mr-3 text-primary" />
                      <span className="font-medium">Relatórios</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
