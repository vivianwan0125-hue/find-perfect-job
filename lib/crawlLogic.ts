import { createAdminClient } from './supabase'
import { fetchPageContent } from './scraper'
import { extractJobWithAI } from './ai'

export async function runCrawl(siteId?: string) {
  const db = await createAdminClient()

  const { data: settings } = await db.from('settings').select('*').eq('id', 1).single()
  if (!settings?.ai_api_key) {
    throw new Error('AI 接口未配置')
  }

  let sitesQuery = db.from('crawler_sites').select('*').eq('is_enabled', true)
  if (siteId) sitesQuery = sitesQuery.eq('id', siteId)
  const { data: sites, error: sitesError } = await sitesQuery
  if (sitesError) throw sitesError

  const results = []
  for (const site of sites ?? []) {
    const result = await crawlOneSite(site, settings, db)
    results.push(result)
  }
  return results
}

async function crawlOneSite(
  site: { id: string; name: string; url: string },
  settings: { ai_base_url?: string | null; ai_api_key: string; ai_model?: string | null },
  db: Awaited<ReturnType<typeof createAdminClient>>
) {
  let newJobsCount = 0
  let errorMsg = null

  try {
    const pageContent = await fetchPageContent(site.url)
    if (!pageContent || pageContent.length < 50) throw new Error('无法获取页面内容')

    const extracted = await extractJobWithAI(pageContent, {
      baseUrl: settings.ai_base_url ?? 'https://api.openai.com/v1',
      apiKey: settings.ai_api_key,
      model: settings.ai_model ?? 'gpt-4o-mini',
    })

    const jobs = Array.isArray(extracted) ? extracted : [extracted]

    for (const job of jobs) {
      if (!job.company_name || !job.position_name) continue

      // Dedup check
      const { data: existing } = await db
        .from('jobs')
        .select('id')
        .eq('company_name', job.company_name)
        .eq('position_name', job.position_name)
        .eq('work_location', job.work_location ?? '')
        .maybeSingle()

      if (existing) continue

      const { error } = await db.from('jobs').insert([{
        ...job,
        source: `爬虫抓取-${site.name}`,
        is_new: true,
        status: '待投递',
        priority: '中',
      }])
      if (!error) newJobsCount++
    }

    await db.from('crawler_sites').update({
      last_crawled_at: new Date().toISOString(),
      jobs_count: newJobsCount,
    }).eq('id', site.id)
  } catch (err) {
    errorMsg = String(err)
  }

  return { siteId: site.id, siteName: site.name, newJobsCount, error: errorMsg }
}
