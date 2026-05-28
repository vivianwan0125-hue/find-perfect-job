import { JobStatus, Priority } from '@/lib/types'
import { cn } from '@/lib/utils'

export function StatusBadge({ status }: { status: JobStatus }) {
  return (
    <span className={cn('inline-block px-2.5 py-0.5 rounded-full text-xs font-medium', `status-${status}`)}>
      {status}
    </span>
  )
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const icons: Record<Priority, string> = { '高': '🔴', '中': '🟡', '低': '🟢' }
  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium', `priority-${priority}`)}>
      <span style={{ fontSize: '0.55rem' }}>{icons[priority]}</span>
      {priority}
    </span>
  )
}
