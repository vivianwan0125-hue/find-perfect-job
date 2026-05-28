import { NextRequest } from 'next/server'
import { getErrorMessage } from '@/lib/utils'
import { createAdminClient } from '@/lib/supabase'

export async function GET() {
  try {
    const db = await createAdminClient()
    const { data, error } = await db
      .from('crawler_sites')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return Response.json({ data })
  } catch (error) {
    return Response.json({ error: getErrorMessage(error) }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body.name || !body.url) {
      return Response.json({ error: '名称和URL不能为空' }, { status: 400 })
    }

    const db = await createAdminClient()
    const { data, error } = await db
      .from('crawler_sites')
      .insert([{ name: body.name, url: body.url, is_enabled: true }])
      .select()
      .single()

    if (error) throw error
    return Response.json({ data }, { status: 201 })
  } catch (error) {
    return Response.json({ error: getErrorMessage(error) }, { status: 500 })
  }
}
