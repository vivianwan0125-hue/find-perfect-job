'use client'

import { JobFilters, JOB_STATUSES, PRIORITIES } from '@/lib/types'
import { Search, X } from 'lucide-react'

interface JobFiltersProps {
  filters: JobFilters
  onChange: (f: JobFilters) => void
  total: number
  positionTypes: string[]
}

export default function JobFiltersBar({ filters, onChange, total, positionTypes }: JobFiltersProps) {
  const set = (key: keyof JobFilters, val: string) => onChange({ ...filters, [key]: val })
  const hasActive = filters.search || filters.position_type || filters.status || filters.priority
  const reset = () => onChange({ search: '', position_type: '', status: '', priority: '' })

  const selectClass = `
    text-sm rounded-xl px-3 py-1.5 cursor-pointer appearance-none
    border border-[rgba(196,181,212,0.4)] bg-white/50 backdrop-blur-sm
    focus:outline-none focus:border-[rgba(196,181,212,0.8)]
    text-[#6A5E7E] min-w-[90px]
  `

  return (
    <div className="glass-card p-3 mb-4 flex flex-wrap items-center gap-2">
      {/* Search */}
      <div className="relative flex-1 min-w-[180px]">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B0A4B4]" />
        <input
          type="text"
          placeholder="搜索公司或岗位..."
          value={filters.search}
          onChange={(e) => set('search', e.target.value)}
          className="w-full pl-8 pr-3 py-1.5 text-sm rounded-xl border border-[rgba(196,181,212,0.4)] bg-white/50 text-[#5A4E5E] placeholder-[#B0A4B4]"
        />
      </div>

      {/* Filters */}
      <select value={filters.position_type} onChange={(e) => set('position_type', e.target.value)} className={selectClass}>
        <option value="">全部类型</option>
        {positionTypes.map((t) => <option key={t}>{t}</option>)}
      </select>

      <select value={filters.status} onChange={(e) => set('status', e.target.value)} className={selectClass}>
        <option value="">全部状态</option>
        {JOB_STATUSES.map((s) => <option key={s}>{s}</option>)}
      </select>

      <select value={filters.priority} onChange={(e) => set('priority', e.target.value)} className={selectClass}>
        <option value="">全部优先级</option>
        {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
      </select>

      {hasActive && (
        <button
          onClick={reset}
          className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-xl text-[#9A8E9E] hover:bg-white/50 transition-colors border border-[rgba(196,181,212,0.3)]"
        >
          <X size={12} /> 重置
        </button>
      )}

      <span className="text-xs text-[#B0A4B4] ml-auto whitespace-nowrap">{total} 个岗位</span>
    </div>
  )
}
