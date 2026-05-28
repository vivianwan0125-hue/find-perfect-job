import { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { getErrorMessage } from '@/lib/utils'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const db = await createAdminClient()

    const updates: Record<string, unknown> = {}
    if ('name' in body) updates.name = body.name
    if ('url' in body) updates.url = body.url
    if ('is_enabled' in body) updates.is_enabled = body.is_enabled

    const { data, error } = await db
      .from('crawler_sites')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return Response.json({ data })
  } catch (error) {
    return Response.json({ error: getErrorMessage(error) }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const db = await createAdminClient()
    const { error } = await db.from('crawler_sites').delete().eq('id', id)
    if (error) throw error
    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: getErrorMessage(error) }, { status: 500 })
  }
}
