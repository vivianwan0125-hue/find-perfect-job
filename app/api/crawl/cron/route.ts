import { NextRequest } from 'next/server'
import { getErrorMessage } from '@/lib/utils'
import { runCrawl } from '@/lib/crawlLogic'

// Vercel Cron Job — runs daily at 09:00 UTC (北京时间 17:00)
// Configured in vercel.json
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const results = await runCrawl()
    const total = results.reduce((sum, r) => sum + (r.newJobsCount ?? 0), 0)
    return Response.json({
      ok: true,
      timestamp: new Date().toISOString(),
      sitesProcessed: results.length,
      totalNewJobs: total,
      results,
    })
  } catch (error) {
    return Response.json({ error: getErrorMessage(error) }, { status: 500 })
  }
}
