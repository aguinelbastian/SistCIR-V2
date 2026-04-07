import { useState, useEffect } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Activity, LogOut, Menu, ChevronDown } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase/client'

export default function Layout() {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isNursing, setIsNursing] = useState(false)

  useEffect(() => {
    async function checkRoles() {
      if (!user) return
      const { data } = await supabase.rpc('get_user_roles')
      if (data) {
        setIsAdmin(data.includes('admin') || data.includes('facility_manager'))
        setIsNursing(data.includes('nursing'))
      }
    }
    checkRoles()
  }, [user])

  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Pedidos', path: '/pedidos' },
    { name: 'Pacientes', path: '/pacientes' },
    { name: 'Procedimentos', path: '/procedimentos' },
    { name: 'OPME', path: '/opme' },
  ]

  const adminItems = [
    { name: 'Painel Admin', path: '/admin' },
    { name: 'Usuários', path: '/admin/usuarios' },
    { name: 'Salas', path: '/salas-cirurgicas' },
    { name: 'Robôs', path: '/sistemas-roboticos' },
    { name: 'Blocos', path: '/blocos-cirurgicos' },
    { name: 'Modelos', path: '/modelos-blocos' },
    { name: 'Exceções de Blocos', path: '/excecoes-blocos' },
    { name: 'Preferências', path: '/preferencias-blocos' },
    { name: 'Alocação', path: '/alocacao-recursos' },
    { name: 'Relatórios', path: '/relatorios' },
  ]

  const getInitials = (name: string) => name?.substring(0, 2).toUpperCase() || 'US'

  return (
    <div className="min-h-screen flex flex-col w-full bg-slate-50/50">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 shadow-sm">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col">
            <nav className="grid gap-2 text-lg font-medium">
              <Link to="/" className="flex items-center gap-2 text-lg font-semibold mb-4">
                <Activity className="h-6 w-6 text-primary" />
                <span>SistCIR</span>
              </Link>
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'px-3 py-2 rounded-md',
                    location.pathname.startsWith(item.path)
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {item.name}
                </Link>
              ))}
              {isAdmin && (
                <>
                  <div className="my-2 border-t" />
                  <div className="px-3 py-1 text-sm font-semibold text-muted-foreground uppercase">
                    Administração
                  </div>
                  {adminItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        'px-3 py-2 rounded-md text-sm',
                        location.pathname === item.path
                          ? 'bg-primary/10 text-primary font-semibold'
                          : 'text-muted-foreground hover:text-foreground',
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>

        <Link to="/" className="hidden md:flex items-center gap-2 font-bold text-xl mr-6">
          <Activity className="h-6 w-6 text-primary" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
            SistCIR
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 md:gap-2 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent',
                location.pathname.startsWith(item.path)
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground',
              )}
            >
              {item.name}
            </Link>
          ))}

          {isAdmin && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    'px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1',
                    location.pathname.startsWith('/admin') ||
                      location.pathname.startsWith('/salas') ||
                      location.pathname.startsWith('/blocos') ||
                      location.pathname.startsWith('/modelos') ||
                      location.pathname.startsWith('/alocacao') ||
                      location.pathname.startsWith('/relatorios')
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground',
                  )}
                >
                  Administração <ChevronDown className="w-4 h-4 opacity-50 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {adminItems.map((item) => (
                  <DropdownMenuItem key={item.path} asChild>
                    <Link
                      to={item.path}
                      className={cn(
                        'w-full cursor-pointer',
                        location.pathname === item.path && 'font-bold text-primary',
                      )}
                    >
                      {item.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full ring-2 ring-primary/20 hover:ring-primary/50 transition-all"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {getInitials(user?.user_metadata?.full_name || user?.email || '')}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.user_metadata?.full_name || 'Usuário'}
                </p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link to="/minha-conta">Perfil e Configurações</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => signOut()}
              className="text-red-500 focus:text-red-600 focus:bg-red-50 cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" /> Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 animate-fade-in">
        <Outlet />
      </main>
    </div>
  )
}
