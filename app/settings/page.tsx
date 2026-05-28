'use client'

import { useState, useEffect } from 'react'
import { CrawlerSite, POSITION_TYPES } from '@/lib/types'
import { Save, Plus, Trash2, Play, Power, Loader2, CheckCircle2, AlertCircle, X } from 'lucide-react'

const inputClass = `
  w-full px-3 py-2 rounded-xl text-sm
  border border-[rgba(196,181,212,0.4)] bg-white/60
  text-[#5A4E5E] placeholder-[#B0A4B4]
  focus:outline-none
`

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-card p-5 mb-4">
      <h2 className="text-base font-semibold mb-4" style={{ color: '#6A5E7E' }}>{title}</h2>
      {children}
    </div>
  )
}

export default function SettingsPage() {
  // AI Settings
  const [aiForm, setAiForm] = useState({ ai_base_url: '', ai_api_key: '', ai_model: '' })
  const [aiSaving, setAiSaving] = useState(false)
  const [aiMsg, setAiMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  // Position Types
  const [positionTypes, setPositionTypes] = useState<string[]>(POSITION_TYPES)
  const [newType, setNewType] = useState('')
  const [typesSaving, setTypesSaving] = useState(false)

  // Crawler Sites
  const [sites, setSites] = useState<CrawlerSite[]>([])
  const [sitesLoading, setSitesLoading] = useState(true)
  const [newSite, setNewSite] = useState({ name: '', url: '' })
  const [addingsite, setAddingSite] = useState(false)
  const [crawlingId, setCrawlingId] = useState<string | null>(null)
  const [crawlResults, setCrawlResults] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchSettings()
    fetchSites()
  }, [])

  async function fetchSettings() {
    const res = await fetch('/api/settings')
    const json = await res.json()
    if (json.data) {
      setAiForm({
        ai_base_url: json.data.ai_base_url ?? 'https://api.openai.com/v1',
        ai_api_key: json.data.ai_api_key ?? '',
        ai_model: json.data.ai_model ?? 'gpt-4o-mini',
      })
      if (Array.isArray(json.data.position_types) && json.data.position_types.length > 0) {
        setPositionTypes(json.data.position_types)
      }
    }
  }

  async function savePositionTypes(types: string[]) {
    setTypesSaving(true)
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ position_types: types }),
      })
    } finally {
      setTypesSaving(false)
    }
  }

  function addType() {
    const t = newType.trim()
    if (!t || positionTypes.includes(t)) return
    const next = [...positionTypes, t]
    setPositionTypes(next)
    setNewType('')
    savePositionTypes(next)
  }

  function removeType(t: string) {
    if (positionTypes.length <= 1) return
    const next = positionTypes.filter((x) => x !== t)
    setPositionTypes(next)
    savePositionTypes(next)
  }

  async function fetchSites() {
    setSitesLoading(true)
    try {
      const res = await fetch('/api/sites')
      const json = await res.json()
      setSites(json.data ?? [])
    } finally {
      setSitesLoading(false)
    }
  }

  async function saveAiSettings(e: React.FormEvent) {
    e.preventDefault()
    setAiSaving(true)
    setAiMsg(null)
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aiForm),
      })
      if (res.ok) {
        setAiMsg({ type: 'ok', text: 'AI 接口配置已保存' })
        fetchSettings()
      } else {
        const j = await res.json()
        setAiMsg({ type: 'err', text: j.error || '保存失败' })
      }
    } finally {
      setAiSaving(false)
      setTimeout(() => setAiMsg(null), 4000)
    }
  }

  async function addSite(e: React.FormEvent) {
    e.preventDefault()
    if (!newSite.name || !newSite.url) return
    setAddingSite(true)
    try {
      const res = await fetch('/api/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSite),
      })
      if (res.ok) {
        setNewSite({ name: '', url: '' })
        fetchSites()
      }
    } finally {
      setAddingSite(false)
    }
  }

  async function toggleSite(site: CrawlerSite) {
    await fetch(`/api/sites/${site.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_enabled: !site.is_enabled }),
    })
    fetchSites()
  }

  async function deleteSite(id: string) {
    if (!confirm('确定删除该网站吗？')) return
    await fetch(`/api/sites/${id}`, { method: 'DELETE' })
    fetchSites()
  }

  async function crawlNow(site: CrawlerSite) {
    setCrawlingId(site.id)
    setCrawlResults((prev) => ({ ...prev, [site.id]: '' }))
    try {
      const res = await fetch('/api/crawl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteId: site.id }),
      })
      const json = await res.json()
      const result = json.results?.[0]
      if (result?.error) {
        setCrawlResults((prev) => ({ ...prev, [site.id]: `错误: ${result.error}` }))
      } else {
        setCrawlResults((prev) => ({ ...prev, [site.id]: `完成，新增 ${result?.newJobsCount ?? 0} 个岗位` }))
        fetchSites()
      }
    } catch (e) {
      setCrawlResults((prev) => ({ ...prev, [site.id]: `网络错误: ${String(e)}` }))
    } finally {
      setCrawlingId(null)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold mb-5" style={{ color: '#5A4E5E' }}>设置</h1>

      {/* AI Config */}
      <SectionCard title="🤖 AI 接口配置">
        <form onSubmit={saveAiSettings} className="space-y-3">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#7A6E7E' }}>
              Base URL（OpenAI 兼容格式）
            </label>
            <input
              className={inputClass}
              value={aiForm.ai_base_url}
              onChange={(e) => setAiForm((f) => ({ ...f, ai_base_url: e.target.value }))}
              placeholder="https://api.openai.com/v1"
            />
            <p className="text-xs mt-1" style={{ color: '#B0A4B4' }}>
              DeepSeek: https://api.deepseek.com/v1 ｜ OpenAI: https://api.openai.com/v1
            </p>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#7A6E7E' }}>API Key</label>
            <input
              type="password"
              className={inputClass}
              value={aiForm.ai_api_key}
              onChange={(e) => setAiForm((f) => ({ ...f, ai_api_key: e.target.value }))}
              placeholder="sk-..."
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#7A6E7E' }}>模型名称</label>
            <input
              className={inputClass}
              value={aiForm.ai_model}
              onChange={(e) => setAiForm((f) => ({ ...f, ai_model: e.target.value }))}
              placeholder="gpt-4o-mini / deepseek-chat"
            />
          </div>

          {aiMsg && (
            <div
              className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl"
              style={{
                background: aiMsg.type === 'ok' ? 'rgba(181,206,188,0.2)' : 'rgba(200,120,120,0.1)',
                color: aiMsg.type === 'ok' ? '#4E7A5A' : '#C07070',
              }}
            >
              {aiMsg.type === 'ok' ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
              {aiMsg.text}
            </div>
          )}

          <button
            type="submit"
            disabled={aiSaving}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-medium text-white disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg,#C4B5D4,#E8C4C4)' }}
          >
            {aiSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            保存配置
          </button>
        </form>
      </SectionCard>

      {/* Position Types */}
      <SectionCard title="🏷️ 岗位类型管理">
        <p className="text-xs mb-3" style={{ color: '#B0A4B4' }}>
          自定义岗位类型，添加岗位和筛选时都会同步更新。至少保留一个类型。
        </p>

        {/* Current types */}
        <div className="flex flex-wrap gap-2 mb-4">
          {positionTypes.map((t) => (
            <span
              key={t}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-sm"
              style={{ background: 'rgba(196,181,212,0.2)', color: '#7A6A8E', border: '1px solid rgba(196,181,212,0.4)' }}
            >
              {t}
              <button
                onClick={() => removeType(t)}
                disabled={positionTypes.length <= 1}
                className="hover:opacity-60 transition-opacity disabled:opacity-30"
                title="删除"
              >
                <X size={12} />
              </button>
            </span>
          ))}
          {typesSaving && <Loader2 size={14} className="animate-spin self-center" style={{ color: '#C4B5D4' }} />}
        </div>

        {/* Add new type */}
        <div className="flex gap-2">
          <input
            className={`${inputClass} flex-1`}
            placeholder="输入新类型名称，如：产品经理"
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addType())}
          />
          <button
            onClick={addType}
            disabled={!newType.trim() || positionTypes.includes(newType.trim())}
            className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium text-white disabled:opacity-50 whitespace-nowrap"
            style={{ background: 'linear-gradient(135deg,#C4B5D4,#E8C4C4)' }}
          >
            <Plus size={13} />
            添加
          </button>
        </div>
      </SectionCard>

      {/* Crawler Sites */}
      <SectionCard title="🕷️ 爬虫网站管理">
        {/* Add new site */}
        <form onSubmit={addSite} className="flex gap-2 mb-4">
          <input
            className={`${inputClass} flex-1`}
            placeholder="网站名称（如：清华就业网）"
            value={newSite.name}
            onChange={(e) => setNewSite((f) => ({ ...f, name: e.target.value }))}
          />
          <input
            className={`${inputClass} flex-1`}
            placeholder="https://..."
            value={newSite.url}
            onChange={(e) => setNewSite((f) => ({ ...f, url: e.target.value }))}
          />
          <button
            type="submit"
            disabled={addingsite || !newSite.name || !newSite.url}
            className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium text-white disabled:opacity-50 whitespace-nowrap"
            style={{ background: 'linear-gradient(135deg,#C4B5D4,#B5CEBC)' }}
          >
            {addingsite ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
            添加
          </button>
        </form>

        {/* Sites list */}
        {sitesLoading ? (
          <div className="flex justify-center py-6">
            <Loader2 size={20} className="animate-spin" style={{ color: '#C4B5D4' }} />
          </div>
        ) : sites.length === 0 ? (
          <p className="text-sm text-center py-6" style={{ color: '#B0A4B4' }}>暂无监控网站</p>
        ) : (
          <div className="space-y-2">
            {sites.map((site) => (
              <div
                key={site.id}
                className="p-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(196,181,212,0.25)' }}
              >
                <div className="flex items-center gap-3">
                  {/* Toggle */}
                  <button
                    onClick={() => toggleSite(site)}
                    className="shrink-0 transition-colors"
                    style={{ color: site.is_enabled ? '#8ABAAA' : '#C4B5D4' }}
                    title={site.is_enabled ? '点击停用' : '点击启用'}
                  >
                    <Power size={16} />
                  </button>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium" style={{ color: '#5A4E5E' }}>{site.name}</span>
                      {!site.is_enabled && (
                        <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(196,181,212,0.2)', color: '#9A8EA4' }}>已停用</span>
                      )}
                    </div>
                    <a
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs truncate block hover:underline"
                      style={{ color: '#A896C4', maxWidth: '320px' }}
                    >
                      {site.url}
                    </a>
                    <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: '#B0A4B4' }}>
                      <span>上次爬取: {site.last_crawled_at ? new Date(site.last_crawled_at).toLocaleString('zh-CN') : '从未'}</span>
                      <span>本次新增: {site.jobs_count} 个</span>
                    </div>
                    {crawlResults[site.id] && (
                      <p className="text-xs mt-1" style={{ color: crawlResults[site.id].startsWith('错误') ? '#C07070' : '#4E7A5A' }}>
                        {crawlResults[site.id]}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => crawlNow(site)}
                      disabled={crawlingId === site.id}
                      className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border border-[rgba(196,181,212,0.4)] hover:bg-white/60 disabled:opacity-50 transition-colors"
                      style={{ color: '#8A7A9A' }}
                    >
                      {crawlingId === site.id
                        ? <Loader2 size={12} className="animate-spin" />
                        : <Play size={12} />}
                      立即爬取
                    </button>
                    <button
                      onClick={() => deleteSite(site.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      style={{ color: '#C09090' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-3 p-3 rounded-xl text-xs" style={{ background: 'rgba(181,206,188,0.12)', color: '#6A8E70' }}>
          💡 Cron 任务每天 UTC 09:00（北京时间 17:00）自动爬取所有启用网站。
          静态页面用 cheerio 抓取，JS 渲染页面本地运行时自动降级到 playwright。
        </div>
      </SectionCard>
    </div>
  )
}
