import { Badge } from '@/components/ui/badge'
import { STATUS_MAP } from '@/lib/constants'
import { SurgeryStatus } from '@/types/sistcir'
import { cn } from '@/lib/utils'

export function StatusBadge({ status, className }: { status: string | null; className?: string }) {
  if (!status) return null
  const config = STATUS_MAP[status as SurgeryStatus] || {
    label: status,
    color: 'bg-gray-100 text-gray-800',
  }

  return (
    <Badge
      variant="outline"
      className={cn('font-medium shadow-sm whitespace-nowrap', config.color, className)}
    >
      {config.label}
    </Badge>
  )
}
