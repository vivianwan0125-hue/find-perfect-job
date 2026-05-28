import { NextRequest, NextResponse } from 'next/server'

const COOKIE = 'app_session'
const PASSWORD = process.env.APP_PASSWORD ?? '2525'
const SALT = 'find-perfect-job-2027'

async function expectedToken(): Promise<string> {
  const data = new TextEncoder().encode(PASSWORD + SALT)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function proxy(request: NextRequest) {
  const cookie = request.cookies.get(COOKIE)?.value
  const token = await expectedToken()
  if (cookie === token) return NextResponse.next()
  return NextResponse.redirect(new URL('/login', request.url))
}

export const config = {
  // Protect everything except Next.js internals, favicon, login page, and auth API
  matcher: ['/((?!_next|favicon.ico|login|api/auth).*)'],
}
