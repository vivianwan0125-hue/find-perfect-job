import { createClient } from '@supabase/supabase-js'
import { proxyFetch } from './proxy-fetch'

// Server-side admin client — call inside request handlers only
export async function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url) throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set')
  const key = serviceKey ?? anonKey ?? ''

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: proxyFetch },
  })
}
