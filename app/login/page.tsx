'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Loader2 } from 'lucide-react'
import BackgroundIllustration from '@/components/BackgroundIllustration'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        router.push('/')
        router.refresh()
      } else {
        const json = await res.json()
        setError(json.error || '密码错误')
        setPassword('')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <BackgroundIllustration />
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <div
          className="glass-card p-8 w-full max-w-xs text-center"
          style={{ background: 'rgba(255,255,255,0.72)' }}
        >
          {/* Icon */}
          <div
            className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#C4B5D4,#E8C4C4)' }}
          >
            <Lock size={22} className="text-white" />
          </div>

          <h1 className="text-lg font-semibold mb-1" style={{ color: '#5A4E5E' }}>
            秋招追踪器
          </h1>
          <p className="text-sm mb-6" style={{ color: '#B0A4B4' }}>请输入访问密码</p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="password"
              placeholder="密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-center text-lg tracking-[0.3em] border border-[rgba(196,181,212,0.4)] bg-white/60 text-[#5A4E5E] placeholder-[#C8BED0] focus:outline-none focus:border-[rgba(196,181,212,0.8)]"
              autoFocus
            />

            {error && (
              <p className="text-xs" style={{ color: '#C07070' }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-3 rounded-xl font-medium text-white transition-opacity disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg,#C4B5D4,#E8C4C4)' }}
            >
              {loading
                ? <Loader2 size={16} className="animate-spin mx-auto" />
                : '进入'}
            </button>
          </form>
        </div>

        <p className="mt-5 text-xs" style={{ color: 'rgba(122,106,138,0.4)', letterSpacing: '0.1em' }}>
          ✦ 2027 小涵必拿offer ✦
        </p>
      </div>
    </>
  )
}
