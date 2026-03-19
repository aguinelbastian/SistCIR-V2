import { Badge } from '@/components/ui/badge'
import { STATUS_MAP, SurgeryStatus } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function StatusBadge({ status, className }: { status: string | null; className?: string }) {
  if (!status) return null
  const config = STATUS_MAP[status as SurgeryStatus] || {
    label: status,
    color: 'bg-gray-100 text-gray-800',
  }

  return (
    <Badge variant="outline" className={cn('font-medium', config.color, className)}>
      {config.label}
    </Badge>
  )
}
