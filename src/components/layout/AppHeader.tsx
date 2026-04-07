import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar'
import {
  LogOut,
  User as UserIcon,
  Settings,
  ShieldAlert,
  Users,
  Package,
  Activity,
  Clock,
  LayoutTemplate,
  CalendarOff,
  Calendar,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function AppHeader() {
  const { user, signOut, hasRole } = useAuth()
  const showAdminMenu = hasRole('admin') || hasRole('opme') || hasRole('facility_manager')

  return (
    <header className="h-16 flex items-center justify-between px-4 border-b bg-background shadow-sm sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-colors" />
        <h2 className="font-semibold text-sm md:text-lg hidden sm:block tracking-tight">
          Serviço de Cirurgia Robótica
        </h2>
      </div>

      <div className="flex items-center gap-3">
        {showAdminMenu && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Settings className="w-4 h-4" />
                <span className="hidden md:inline">Administração</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              {hasRole('admin') && (
                <>
                  <DropdownMenuLabel>Acessos e Usuários</DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="cursor-pointer flex items-center w-full">
                      <ShieldAlert className="w-4 h-4 mr-2 text-red-500" /> Níveis de Acesso
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/admin/usuarios" className="cursor-pointer flex items-center w-full">
                      <Users className="w-4 h-4 mr-2 text-red-500" /> Gerenciar Usuários
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}

              {(hasRole('admin') || hasRole('opme')) && (
                <>
                  <DropdownMenuLabel>Gestão de Materiais</DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link to="/opme" className="cursor-pointer flex items-center w-full">
                      <Package className="w-4 h-4 mr-2 text-orange-500" /> Catálogo OPME
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}

              {(hasRole('admin') || hasRole('nursing')) && (
                <>
                  <DropdownMenuLabel>Catálogos</DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link to="/procedimentos" className="cursor-pointer flex items-center w-full">
                      <Activity className="w-4 h-4 mr-2 text-indigo-500" /> Procedimentos
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}

              {(hasRole('admin') || hasRole('facility_manager')) && (
                <>
                  <DropdownMenuLabel>Recursos e Agendamentos</DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/salas-cirurgicas"
                      className="cursor-pointer flex items-center w-full"
                    >
                      <Activity className="w-4 h-4 mr-2 text-blue-500" /> Salas Cirúrgicas
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/sistemas-roboticos"
                      className="cursor-pointer flex items-center w-full"
                    >
                      <Activity className="w-4 h-4 mr-2 text-purple-500" /> Sistemas Robóticos
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/blocos-cirurgicos"
                      className="cursor-pointer flex items-center w-full"
                    >
                      <Clock className="w-4 h-4 mr-2 text-emerald-500" /> Blocos Cirúrgicos
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/modelos-blocos" className="cursor-pointer flex items-center w-full">
                      <LayoutTemplate className="w-4 h-4 mr-2 text-pink-500" /> Modelos de Blocos
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/excecoes-blocos" className="cursor-pointer flex items-center w-full">
                      <CalendarOff className="w-4 h-4 mr-2 text-yellow-500" /> Exceções de Blocos
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/alocacao-recursos"
                      className="cursor-pointer flex items-center w-full"
                    >
                      <Calendar className="w-4 h-4 mr-2 text-indigo-500" /> Alocação de Recursos
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full border">
          <UserIcon className="w-4 h-4" />
          <span className="font-medium truncate max-w-[200px]">{user?.email}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => signOut()}
          title="Sair do Sistema"
          className="text-muted-foreground hover:text-red-600 hover:bg-red-50"
        >
          <LogOut className="w-5 h-5" />
        </Button>
      </div>
    </header>
  )
}
