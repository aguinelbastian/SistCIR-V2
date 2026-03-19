import { Link, useLocation } from 'react-router-dom'
import { Home, Stethoscope, Users, Box, ListVideo, LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ROLE_LABELS } from '@/lib/constants'

export function AppSidebar() {
  const { user, roles, signOut } = useAuth()
  const location = useLocation()

  const mainRole = roles[0] || 'user'
  const displayRole = ROLE_LABELS[mainRole] || mainRole

  const menuItems = [
    { title: 'Dashboard', path: '/', icon: Home },
    { title: 'Pedidos de Cirurgia', path: '/pedidos', icon: Stethoscope },
    { title: 'Pacientes', path: '/pacientes', icon: Users },
    { title: 'Procedimentos', path: '/procedimentos', icon: ListVideo },
    { title: 'Estoque OPME', path: '/opme', icon: Box },
  ]

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border h-16 flex items-center px-4">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-md flex-shrink-0">
            <Stethoscope className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight truncate">SistCIR v2</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.path}
                    tooltip={item.title}
                  >
                    <Link to={item.path}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 mb-4 overflow-hidden">
          <Avatar className="h-9 w-9 bg-sidebar-accent">
            <AvatarFallback className="text-sidebar-accent-foreground">
              {user?.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col truncate group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-medium truncate">{user?.email}</span>
            <span className="text-xs text-sidebar-foreground/70 truncate">{displayRole}</span>
          </div>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={signOut}
              className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <LogOut />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
