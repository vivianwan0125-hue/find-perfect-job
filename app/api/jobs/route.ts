import { NextRequest } from 'next/server'
import { getErrorMessage } from '@/lib/utils'
import { createAdminClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const position_type = searchParams.get('position_type') || ''
    const status = searchParams.get('status') || ''
    const priority = searchParams.get('priority') || ''

    const db = await createAdminClient()
    let query = db.from('jobs').select('*').order('created_at', { ascending: false })

    if (search) {
      query = query.or(`company_name.ilike.%${search}%,position_name.ilike.%${search}%`)
    }
    if (position_type) query = query.eq('position_type', position_type)
    if (status) query = query.eq('status', status)
    if (priority) query = query.eq('priority', priority)

    const { data, error } = await query
    if (error) throw error

    return Response.json({ data })
  } catch (error) {
    return Response.json({ error: getErrorMessage(error) }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const db = await createAdminClient()

    const { data, error } = await db
      .from('jobs')
      .insert([{
        company_name: body.company_name,
        position_name: body.position_name,
        position_type: body.position_type || '其他',
        work_location: body.work_location || null,
        deadline: body.deadline || null,
        requirements: body.requirements || null,
        apply_url: body.apply_url || null,
        status: body.status || '待投递',
        priority: body.priority || '中',
        notes: body.notes || null,
        source: body.source || '手动添加',
        is_new: body.is_new ?? true,
      }])
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return Response.json({ error: '该岗位已存在（公司+岗位名+地点重复）' }, { status: 409 })
      }
      throw error
    }

    return Response.json({ data }, { status: 201 })
  } catch (error) {
    return Response.json({ error: getErrorMessage(error) }, { status: 500 })
  }
}
