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
    <nav className="glass-nav sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Sparkles size={18} className="text-morandi-purple-dark group-hover:rotate-12 transition-transform" />
          <span
            className="font-semibold text-base"
            style={{ color: '#7A6A8E', letterSpacing: '0.02em' }}
          >
            秋招追踪器
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all',
                  active
                    ? 'bg-white/70 text-morandi-purple-dark shadow-sm'
                    : 'text-morandi-text-light hover:bg-white/40 hover:text-morandi-text'
                )}
                style={active ? { color: '#8A74A8' } : { color: '#8A7E8E' }}
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
