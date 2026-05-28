import { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { getErrorMessage } from '@/lib/utils'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const db = await createAdminClient()
    const { data, error } = await db.from('jobs').select('*').eq('id', id).single()
    if (error) throw error
    return Response.json({ data })
  } catch (error) {
    return Response.json({ error: getErrorMessage(error) }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const db = await createAdminClient()

    const updates: Record<string, unknown> = {}
    const allowedFields = [
      'company_name', 'position_name', 'position_type', 'work_location',
      'deadline', 'requirements', 'apply_url', 'status', 'priority',
      'notes', 'source', 'is_new',
    ]
    for (const field of allowedFields) {
      if (field in body) updates[field] = body[field]
    }

    const { data, error } = await db
      .from('jobs')
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
    const { error } = await db.from('jobs').delete().eq('id', id)
    if (error) throw error
    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: getErrorMessage(error) }, { status: 500 })
  }
}
