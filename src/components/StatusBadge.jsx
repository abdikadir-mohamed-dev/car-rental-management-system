import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const STYLES = {
  confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
  active: 'bg-amber-100 text-amber-800 border-amber-200',
  completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  cancelled: 'bg-slate-100 text-slate-500 border-slate-200',
  available: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  booked: 'bg-amber-100 text-amber-800 border-amber-200',
  maintenance: 'bg-rose-100 text-rose-700 border-rose-200',
  retired: 'bg-slate-100 text-slate-500 border-slate-200',
}

export default function StatusBadge({ status }) {
  return (
    <Badge variant="outline" className={cn('capitalize border', STYLES[status] ?? 'bg-slate-100')}>
      {status}
    </Badge>
  )
}
