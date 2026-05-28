import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'
import BackgroundIllustration from '@/components/BackgroundIllustration'

export const metadata: Metadata = {
  title: '秋招追踪器',
  description: '秋招岗位管理系统 — 2027届求职',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <Navigation />
        <main className="relative z-10 min-h-screen pb-24">
          {children}
        </main>
        <BackgroundIllustration />
        <div className="easter-egg">✦ 2027 小涵必拿offer ✦</div>
      </body>
    </html>
  )
}
