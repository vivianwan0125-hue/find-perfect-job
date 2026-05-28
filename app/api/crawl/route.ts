import { NextRequest } from 'next/server'
import { getErrorMessage } from '@/lib/utils'
import { runCrawl } from '@/lib/crawlLogic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const results = await runCrawl(body.siteId)
    return Response.json({ results })
  } catch (error) {
    return Response.json({ error: getErrorMessage(error) }, { status: 500 })
  }
}
