'use client'

import { Job } from '@/lib/types'
import { StatusBadge, PriorityBadge } from './StatusBadge'
import { isDeadlineSoon, formatDeadline, cn, truncate } from '@/lib/utils'
import { MapPin, Calendar, ExternalLink, Zap } from 'lucide-react'

interface JobCardProps {
  job: Job
  onClick: (job: Job) => void
}

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg,#C4B5D4,#E8C4C4)',
  'linear-gradient(135deg,#B5CEBC,#C4B5D4)',
  'linear-gradient(135deg,#E8C4C4,#D4BC98)',
  'linear-gradient(135deg,#A8CCDC,#C4B5D4)',
]

function avatarGradient(name: string) {
  const code = name.charCodeAt(0) || 0
  return AVATAR_GRADIENTS[code % AVATAR_GRADIENTS.length]
}

export default function JobCard({ job, onClick }: JobCardProps) {
  const soon = isDeadlineSoon(job.deadline)

  return (
    <div
      className={cn('glass-card p-4 cursor-pointer', soon && 'deadline-soon')}
      onClick={() => onClick(job)}
    >
      {/* Top row: avatar + company info + status */}
      <div className="flex gap-3 mb-3">
        {/* Company avatar */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-base font-bold flex-shrink-0 shadow-sm"
          style={{ background: avatarGradient(job.company_name) }}
        >
          {job.company_name.charAt(0)}
        </div>

        {/* Company + position */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-semibold text-sm leading-tight truncate" style={{ color: '#5A4E5E' }}>
                  {job.company_name}
                </h3>
                {job.is_new && <span className="new-badge">新</span>}
              </div>
              <p className="text-xs mt-0.5 truncate" style={{ color: '#8A7E8E' }}>
                {job.position_name}
              </p>
            </div>
            <StatusBadge status={job.status} />
          </div>

          {/* Tags */}
          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(196,181,212,0.18)', color: '#8A7A9A' }}
            >
              {job.position_type}
            </span>
            <PriorityBadge priority={job.priority} />
          </div>
        </div>
      </div>

      {/* Info rows */}
      <div className="space-y-1.5">
        {job.work_location && (
          <div className="flex items-center gap-1.5 text-xs" style={{ color: '#8A7E8E' }}>
            <MapPin size={12} />
            <span>{job.work_location}</span>
          </div>
        )}
        {job.deadline && (
          <div
            className={cn('flex items-center gap-1.5 text-xs', soon && 'font-semibold')}
            style={{ color: soon ? '#C47A50' : '#8A7E8E' }}
          >
            <Calendar size={12} />
            <span>{formatDeadline(job.deadline)}</span>
            {soon && <Zap size={11} className="text-orange-400" />}
          </div>
        )}
        {job.requirements && (
          <p className="text-xs leading-relaxed" style={{ color: '#9A8E9E' }}>
            {truncate(job.requirements, 75)}
          </p>
        )}
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between mt-3 pt-2.5"
        style={{ borderTop: '1px solid rgba(196,181,212,0.18)' }}
      >
        <span className="text-xs" style={{ color: '#B0A4B4' }}>
          {job.source}
        </span>
        {job.apply_url && (
          <a
            href={job.apply_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs hover:opacity-70 transition-opacity"
            style={{ color: '#A896C4' }}
            onClick={(e) => e.stopPropagation()}
          >
            投递链接
            <ExternalLink size={11} />
          </a>
        )}
      </div>
    </div>
  )
}
