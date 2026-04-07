import { Link, useLocation } from 'react-router-dom'
import {
  Activity,
  LayoutDashboard,
  Users,
  FileText,
  Stethoscope,
  ShieldAlert,
  Package,
  UserCircle,
  TrendingUp,
  Clock,
  Calendar,
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

        {(hasRole('admin') || hasRole('opme')) && (
          <SidebarGroup className="mt-auto mb-4">
            <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground font-semibold px-4">
              Administração
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {hasRole('admin') && (
                  <>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={location.pathname === '/admin'}>
                        <Link to="/admin">
                          <ShieldAlert className="w-4 h-4 mr-3 text-red-500" />
                          <span>Acessos</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={location.pathname === '/admin/usuarios'}>
                        <Link to="/admin/usuarios">
                          <Users className="w-4 h-4 mr-3 text-red-500" />
                          <span>Usuários</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </>
                )}
                {(hasRole('admin') || hasRole('opme')) && (
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname === '/admin/opme'}>
                      <Link to="/admin/opme">
                        <Package className="w-4 h-4 mr-3 text-orange-500" />
                        <span>Catálogo OPME</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
                {(hasRole('admin') || hasRole('facility_manager')) && (
                  <>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        isActive={location.pathname.startsWith('/salas-cirurgicas')}
                      >
                        <Link to="/salas-cirurgicas">
                          <Activity className="w-4 h-4 mr-3 text-blue-500" />
                          <span>Salas Cirúrgicas</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        isActive={location.pathname.startsWith('/sistemas-roboticos')}
                      >
                        <Link to="/sistemas-roboticos">
                          <Activity className="w-4 h-4 mr-3 text-purple-500" />
                          <span>Sistemas Robóticos</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        isActive={location.pathname.startsWith('/blocos-cirurgicos')}
                      >
                        <Link to="/blocos-cirurgicos">
                          <Clock className="w-4 h-4 mr-3 text-emerald-500" />
                          <span>Blocos Cirúrgicos</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        isActive={location.pathname.startsWith('/alocacao-recursos')}
                      >
                        <Link to="/alocacao-recursos">
                          <Calendar className="w-4 h-4 mr-3 text-indigo-500" />
                          <span>Alocação de Recursos</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  )
}
