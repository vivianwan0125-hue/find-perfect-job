'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Briefcase, Settings, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', label: '岗位列表', icon: Briefcase },
  { href: '/settings', label: '设置', icon: Settings },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50" style={{ background: 'transparent' }}>
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Sparkles
            size={18}
            className="group-hover:rotate-12 transition-transform"
            style={{ color: '#9A86B0', filter: 'drop-shadow(0 1px 2px rgba(255,255,255,0.6))' }}
          />
          <span
            className="font-semibold text-base tracking-wide"
            style={{
              color: '#7A6A8A',
              textShadow: '0 1px 4px rgba(255,255,255,0.7), 0 0 10px rgba(255,255,255,0.4)',
            }}
          >
            秋招追踪器
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all',
                  active ? 'bg-white/30 backdrop-blur-sm' : 'hover:bg-white/20'
                )}
                style={{
                  color: active ? '#6A5A7E' : '#7A6A8A',
                  textShadow: '0 1px 4px rgba(255,255,255,0.65)',
                }}
              >
                <Icon size={15} />
                {label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
