import { NextRequest } from 'next/server'

const COOKIE = 'app_session'
const PASSWORD = process.env.APP_PASSWORD ?? '2525'
const SALT = 'find-perfect-job-2027'

async function makeToken(): Promise<string> {
  const data = new TextEncoder().encode(PASSWORD + SALT)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function POST(request: NextRequest) {
  const { password } = await request.json()

  if (password !== PASSWORD) {
    return Response.json({ error: '密码错误' }, { status: 401 })
  }

  const token = await makeToken()
  const response = Response.json({ ok: true })
  // 30 days, HttpOnly so JS can't touch it
  response.headers.set(
    'Set-Cookie',
    `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}`
  )
  return response
}
