import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCw, AlertCircle } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface ReportCardProps {
  title: string
  icon: React.ElementType
  loading: boolean
  error: string | null
  lastUpdated: Date | null
  onRefresh: () => void
  children: React.ReactNode
  className?: string
  contentClassName?: string
}

export function ReportCard({
  title,
  icon: Icon,
  loading,
  error,
  lastUpdated,
  onRefresh,
  children,
  className,
  contentClassName,
}: ReportCardProps) {
  const timeString = lastUpdated
    ? lastUpdated.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : ''

  return (
    <Card className={cn('flex flex-col h-full shadow-sm border-border/50', className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 border-b border-border/30 mb-4 bg-muted/20">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Icon className="w-4 h-4 text-primary" />
          {title}
        </CardTitle>
        <div className="flex items-center gap-2">
          {timeString && (
            <span className="text-xs text-muted-foreground hidden sm:inline-block">
              Atualizado: {timeString}
            </span>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            onClick={onRefresh}
            disabled={loading}
            title="Atualizar"
          >
            <RefreshCw className={cn('w-3 h-3', loading && 'animate-spin text-primary')} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className={cn('flex-1 min-h-[300px]', contentClassName)}>
        {error ? (
          <div className="flex flex-col items-center justify-center h-full text-destructive text-sm text-center p-4 opacity-80 animate-fade-in">
            <AlertCircle className="w-8 h-8 mb-3 opacity-50" />
            <p className="font-medium">Erro ao carregar dados.</p>
            <p className="text-xs mt-1">Tentando novamente em instantes...</p>
          </div>
        ) : loading && !lastUpdated ? (
          <div className="h-full w-full flex items-center justify-center p-4">
            <Skeleton className="w-full h-full min-h-[200px] rounded-xl" />
          </div>
        ) : (
          <div className="h-full w-full animate-fade-in">{children}</div>
        )}
      </CardContent>
    </Card>
  )
}
