'use client'

import { useState, useEffect, useCallback } from 'react'
import { Job, JobFilters } from '@/lib/types'
import JobCard from '@/components/JobCard'
import JobFiltersBar from '@/components/JobFilters'
import JobModal from '@/components/JobModal'
import { Plus, Download, RefreshCw } from 'lucide-react'

const DEFAULT_FILTERS: JobFilters = { search: '', position_type: '', status: '', priority: '' }

export default function HomePage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [filters, setFilters] = useState<JobFilters>(DEFAULT_FILTERS)
  const [loading, setLoading] = useState(true)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [exporting, setExporting] = useState(false)

  const fetchJobs = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.search) params.set('search', filters.search)
      if (filters.position_type) params.set('position_type', filters.position_type)
      if (filters.status) params.set('status', filters.status)
      if (filters.priority) params.set('priority', filters.priority)
      const res = await fetch(`/api/jobs?${params}`)
      const json = await res.json()
      setJobs(json.data ?? [])
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => { fetchJobs() }, [fetchJobs])

  async function handleSave(data: Partial<Job>) {
    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error || '保存失败')
    await fetchJobs()
  }

  async function handleEdit(data: Partial<Job>) {
    if (!selectedJob) return
    const res = await fetch(`/api/jobs/${selectedJob.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error || '保存失败')
    await fetchJobs()
  }

  async function handleDelete() {
    if (!selectedJob) return
    const res = await fetch(`/api/jobs/${selectedJob.id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('删除失败')
    await fetchJobs()
  }

  async function handleMarkRead(id: string) {
    await fetch(`/api/jobs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_new: false }),
    })
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, is_new: false } : j)))
  }

  async function handleExport() {
    setExporting(true)
    try {
      const res = await fetch('/api/export')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `jobs_${new Date().toISOString().slice(0, 10)}.xlsx`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setExporting(false)
    }
  }

  // Stats
  const newCount = jobs.filter((j) => j.is_new).length
  const offerCount = jobs.filter((j) => j.status === 'Offer').length

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Stats banner */}
      <div className="flex items-center gap-4 mb-5 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: '#5A4E5E' }}>岗位管理</h1>
          <p className="text-sm" style={{ color: '#9A8E9E' }}>
            共 {jobs.length} 个岗位
            {newCount > 0 && <span className="ml-2 text-morandi-purple-dark font-medium">· {newCount} 个新岗位</span>}
            {offerCount > 0 && <span className="ml-2 font-medium" style={{ color: '#4A8A6A' }}>· {offerCount} 个 Offer 🎉</span>}
          </p>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={fetchJobs}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm border border-[rgba(196,181,212,0.4)] bg-white/50 hover:bg-white/70 transition-colors"
            style={{ color: '#8A7E8E' }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            刷新
          </button>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm border border-[rgba(196,181,212,0.4)] bg-white/50 hover:bg-white/70 transition-colors disabled:opacity-50"
            style={{ color: '#8A7E8E' }}
          >
            <Download size={14} />
            导出 Excel
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-white"
            style={{ background: 'linear-gradient(135deg,#C4B5D4,#E8C4C4)' }}
          >
            <Plus size={15} />
            添加岗位
          </button>
        </div>
      </div>

      {/* Filters */}
      <JobFiltersBar filters={filters} onChange={setFilters} total={jobs.length} />

      {/* Job grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-[rgba(196,181,212,0.8)] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm" style={{ color: '#B0A4B4' }}>加载中...</p>
          </div>
        </div>
      ) : jobs.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <p className="text-4xl mb-3">🌸</p>
          <p className="font-medium mb-1" style={{ color: '#7A6E7E' }}>暂无岗位</p>
          <p className="text-sm" style={{ color: '#B0A4B4' }}>点击右上角「添加岗位」开始记录吧</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onClick={(j) => {
                setSelectedJob(j)
                if (j.is_new) handleMarkRead(j.id)
              }}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {showAddModal && (
        <JobModal
          onClose={() => setShowAddModal(false)}
          onSave={handleSave}
        />
      )}
      {selectedJob && (
        <JobModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onSave={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
