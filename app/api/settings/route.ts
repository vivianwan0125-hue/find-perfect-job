import { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { getErrorMessage } from '@/lib/utils'

export async function GET() {
  try {
    const db = await createAdminClient()
    const { data, error } = await db.from('settings').select('*').eq('id', 1).maybeSingle()

    if (error) return Response.json({ error: getErrorMessage(error) }, { status: 500 })

    const DEFAULT_TYPES = ['研发', '售前工程师', '海外销售', '其他']

    if (!data) {
      return Response.json({
        data: { id: 1, ai_base_url: 'https://api.openai.com/v1', ai_api_key: null, ai_model: 'gpt-4o-mini', position_types: DEFAULT_TYPES },
      })
    }

    const masked = {
      ...data,
      ai_api_key: data.ai_api_key ? '••••••••' + data.ai_api_key.slice(-4) : null,
      position_types: (data.position_types && data.position_types.length > 0) ? data.position_types : DEFAULT_TYPES,
    }
    return Response.json({ data: masked })
  } catch (err) {
    return Response.json({ error: getErrorMessage(err) }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const db = await createAdminClient()

    const updates: Record<string, unknown> = { id: 1 }
    if ('ai_base_url' in body) updates.ai_base_url = body.ai_base_url || null
    if ('ai_model' in body) updates.ai_model = body.ai_model || null
    // Only overwrite the key if user typed a new one (not the masked '••••…xxxx' placeholder)
    if (body.ai_api_key && !body.ai_api_key.startsWith('••••')) {
      updates.ai_api_key = body.ai_api_key
    }
    if ('position_types' in body && Array.isArray(body.position_types)) {
      updates.position_types = body.position_types
    }

    // upsert handles both "row exists" and "row missing" cases
    const { data, error } = await db
      .from('settings')
      .upsert(updates)
      .select()
      .single()

    if (error) return Response.json({ error: getErrorMessage(error) }, { status: 500 })
    return Response.json({ data })
  } catch (err) {
    console.error('[PUT /api/settings] threw:', err)
    if (err instanceof Error && err.cause) console.error('  cause:', err.cause)
    return Response.json({ error: getErrorMessage(err) }, { status: 500 })
  }
}
