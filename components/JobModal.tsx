'use client'

import { useState, useEffect } from 'react'
import { Job, POSITION_TYPES, JOB_STATUSES, PRIORITIES, STATUS_NEXT } from '@/lib/types'
import { X, Link2, Loader2, Trash2, ArrowRight, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

interface JobModalProps {
  job?: Job | null
  onClose: () => void
  onSave: (data: Partial<Job>) => Promise<void>
  onDelete?: () => Promise<void>
}

const inputClass = `
  w-full px-3 py-2 rounded-xl text-sm
  border border-[rgba(196,181,212,0.4)] bg-white/60
  text-[#5A4E5E] placeholder-[#B0A4B4]
  focus:outline-none focus:border-[rgba(196,181,212,0.8)] focus:shadow-[0_0_0_3px_rgba(196,181,212,0.15)]
`

export default function JobModal({ job, onClose, onSave, onDelete }: JobModalProps) {
  const isEdit = !!job
  const [form, setForm] = useState<Partial<Job>>({
    company_name: '', position_name: '', position_type: '其他',
    work_location: '', deadline: '', requirements: '',
    apply_url: '', status: '待投递', priority: '中', notes: '', source: '手动添加',
  })
  const [parseUrl, setParseUrl] = useState('')
  const [parsing, setParsing] = useState(false)
  const [parseError, setParseError] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    if (job) {
      setForm({
        company_name: job.company_name,
        position_name: job.position_name,
        position_type: job.position_type,
        work_location: job.work_location ?? '',
        deadline: job.deadline ?? '',
        requirements: job.requirements ?? '',
        apply_url: job.apply_url ?? '',
        status: job.status,
        priority: job.priority,
        notes: job.notes ?? '',
        source: job.source,
      })
    }
  }, [job])

  const set = (key: keyof Job, val: unknown) => setForm((f) => ({ ...f, [key]: val }))

  async function handleParseUrl() {
    if (!parseUrl.trim()) return
    setParsing(true)
    setParseError('')
    try {
      const res = await fetch('/api/parse-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: parseUrl.trim() }),
      })
      const json = await res.json()
      if (!res.ok) { setParseError(json.error || '解析失败'); return }
      setForm((f) => ({ ...f, ...json.data, source: '链接解析' }))
    } catch (e) {
      setParseError(String(e))
    } finally {
      setParsing(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.company_name || !form.position_name) {
      setError('公司名和岗位名不能为空')
      return
    }
    setSaving(true)
    setError('')
    try {
      await onSave(form)
      onClose()
    } catch (e) {
      setError(String(e))
    } finally {
      setSaving(false)
    }
  }

  async function handleNextStatus() {
    if (!job || !STATUS_NEXT[job.status]) return
    setSaving(true)
    try {
      await onSave({ status: STATUS_NEXT[job.status]! })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  const nextStatus = job ? STATUS_NEXT[job.status] : null

  return (
    <div className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative"
        onClick={(e) => e.stopPropagation()}
        style={{ background: 'rgba(255,255,255,0.82)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold" style={{ color: '#5A4E5E' }}>
            {isEdit ? '编辑岗位' : '添加岗位'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-black/5 transition-colors">
            <X size={18} style={{ color: '#9A8E9E' }} />
          </button>
        </div>

        {/* URL Parser (only for new) */}
        {!isEdit && (
          <div className="mb-5 p-3 rounded-xl" style={{ background: 'rgba(196,181,212,0.1)', border: '1px dashed rgba(196,181,212,0.5)' }}>
            <p className="text-xs font-medium mb-2" style={{ color: '#8A7A9A' }}>🔗 粘贴招聘链接自动解析</p>
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://..."
                value={parseUrl}
                onChange={(e) => setParseUrl(e.target.value)}
                className={cn(inputClass, 'flex-1')}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleParseUrl())}
              />
              <button
                type="button"
                onClick={handleParseUrl}
                disabled={parsing || !parseUrl}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-white transition-opacity disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg,#C4B5D4,#E8C4C4)' }}
              >
                {parsing ? <Loader2 size={14} className="animate-spin" /> : <Link2 size={14} />}
                {parsing ? '解析中' : '解析'}
              </button>
            </div>
            {parseError && <p className="text-xs mt-1.5" style={{ color: '#C07070' }}>{parseError}</p>}
          </div>
        )}

        {/* Quick status advance (edit only) */}
        {isEdit && nextStatus && (
          <div className="mb-4 flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(181,206,188,0.15)', border: '1px solid rgba(181,206,188,0.4)' }}>
            <span className="text-xs font-medium" style={{ color: '#5A7A60' }}>快速推进状态</span>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(181,206,188,0.3)', color: '#4E7A5A' }}>{job?.status}</span>
            <ArrowRight size={13} style={{ color: '#8ABAAA' }} />
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(196,181,212,0.3)', color: '#7A6A8E' }}>{nextStatus}</span>
            <button
              type="button"
              onClick={handleNextStatus}
              disabled={saving}
              className="ml-auto text-xs px-3 py-1.5 rounded-lg font-medium text-white disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg,#B5CEBC,#C4B5D4)' }}
            >
              确认推进
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#7A6E7E' }}>公司名 *</label>
              <input className={inputClass} value={form.company_name} onChange={(e) => set('company_name', e.target.value)} placeholder="腾讯" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#7A6E7E' }}>岗位名称 *</label>
              <input className={inputClass} value={form.position_name} onChange={(e) => set('position_name', e.target.value)} placeholder="后端工程师" />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#7A6E7E' }}>岗位类型</label>
              <select className={inputClass} value={form.position_type} onChange={(e) => set('position_type', e.target.value)}>
                {POSITION_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#7A6E7E' }}>工作地点</label>
              <input className={inputClass} value={form.work_location ?? ''} onChange={(e) => set('work_location', e.target.value)} placeholder="北京" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#7A6E7E' }}>截止日期</label>
              <input type="date" className={inputClass} value={form.deadline ?? ''} onChange={(e) => set('deadline', e.target.value)} />
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#7A6E7E' }}>投递状态</label>
              <select className={inputClass} value={form.status} onChange={(e) => set('status', e.target.value)}>
                {JOB_STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#7A6E7E' }}>优先级</label>
              <select className={inputClass} value={form.priority} onChange={(e) => set('priority', e.target.value)}>
                {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>

          {/* Apply URL */}
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#7A6E7E' }}>投递链接</label>
            <div className="flex gap-2">
              <input
                type="url"
                className={cn(inputClass, 'flex-1')}
                value={form.apply_url ?? ''}
                onChange={(e) => set('apply_url', e.target.value)}
                placeholder="https://..."
              />
              {form.apply_url && (
                <a href={form.apply_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center px-3 rounded-xl border border-[rgba(196,181,212,0.4)] bg-white/60 hover:bg-white/80 transition-colors"
                  style={{ color: '#A896C4' }}>
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#7A6E7E' }}>岗位要求</label>
            <textarea
              className={cn(inputClass, 'min-h-[80px] resize-y')}
              value={form.requirements ?? ''}
              onChange={(e) => set('requirements', e.target.value)}
              placeholder="岗位要求、技能要求..."
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#7A6E7E' }}>备注</label>
            <textarea
              className={cn(inputClass, 'min-h-[60px] resize-y')}
              value={form.notes ?? ''}
              onChange={(e) => set('notes', e.target.value)}
              placeholder="个人备注..."
            />
          </div>

          {/* Source */}
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#7A6E7E' }}>来源</label>
            <input className={inputClass} value={form.source} onChange={(e) => set('source', e.target.value)} placeholder="手动添加" />
          </div>

          {error && <p className="text-xs px-3 py-2 rounded-lg" style={{ background: 'rgba(200,120,120,0.1)', color: '#C07070' }}>{error}</p>}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-1">
            {isEdit && onDelete && (
              <>
                {confirmDelete ? (
                  <button
                    type="button"
                    onClick={async () => { setSaving(true); await onDelete?.(); onClose() }}
                    className="text-xs px-3 py-2 rounded-xl font-medium text-white"
                    style={{ background: '#C08080' }}
                  >
                    确认删除
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    className="flex items-center gap-1 text-xs px-3 py-2 rounded-xl border border-[rgba(200,120,120,0.3)] hover:bg-[rgba(200,120,120,0.08)] transition-colors"
                    style={{ color: '#B07878' }}
                  >
                    <Trash2 size={12} /> 删除
                  </button>
                )}
              </>
            )}
            <div className="ml-auto flex gap-2">
              <button type="button" onClick={onClose}
                className="text-sm px-4 py-2 rounded-xl border border-[rgba(196,181,212,0.4)] hover:bg-white/50 transition-colors"
                style={{ color: '#8A7E8E' }}>
                取消
              </button>
              <button type="submit" disabled={saving}
                className="flex items-center gap-1.5 text-sm px-5 py-2 rounded-xl font-medium text-white disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg,#C4B5D4,#E8C4C4)' }}>
                {saving ? <Loader2 size={14} className="animate-spin" /> : null}
                {isEdit ? '保存' : '添加'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
