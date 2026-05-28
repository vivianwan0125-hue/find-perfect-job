import { NextRequest } from 'next/server'
import { getErrorMessage } from '@/lib/utils'
import { createAdminClient } from '@/lib/supabase'
import { fetchPageContent } from '@/lib/scraper'
import { extractJobWithAI } from '@/lib/ai'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()
    if (!url) return Response.json({ error: '缺少 url 参数' }, { status: 400 })

    const db = await createAdminClient()
    const { data: settings } = await db.from('settings').select('*').eq('id', 1).maybeSingle()

    if (!settings?.ai_api_key) {
      return Response.json({ error: '请先在设置页面配置 AI 接口' }, { status: 400 })
    }

    const pageContent = await fetchPageContent(url)
    if (!pageContent || pageContent.length < 50) {
      return Response.json({ error: '无法抓取页面内容，请检查链接是否有效' }, { status: 400 })
    }

    const extracted = await extractJobWithAI(pageContent, {
      baseUrl: settings.ai_base_url || 'https://api.openai.com/v1',
      apiKey: settings.ai_api_key,
      model: settings.ai_model || 'gpt-4o-mini',
    })

    if (!extracted.apply_url) extracted.apply_url = url

    return Response.json({ data: extracted })
  } catch (error) {
    return Response.json({ error: getErrorMessage(error) }, { status: 500 })
  }
}
