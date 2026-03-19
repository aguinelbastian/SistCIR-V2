import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { LogOut, User as UserIcon } from 'lucide-react'

export function AppHeader() {
  const { user, signOut } = useAuth()

  return (
    <header className="h-16 flex items-center justify-between px-4 border-b bg-background shadow-sm sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-colors" />
        <h2 className="font-semibold text-sm md:text-lg hidden sm:block tracking-tight">
          Serviço de Cirurgia Robótica
        </h2>
      </div>
      <div className="flex items-center gap-3">
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
