import { createAdminClient } from './supabase'
import { fetchPageContent } from './scraper'
import { extractJobWithAI } from './ai'
import { proxyFetch } from './proxy-fetch'

// ─── 高校就业网 API 平台配置 ───────────────────────────────────────────────
// 使用 mobile.php/enrollment/getlist 接口的高校就业网，
// 添加爬虫网站时填写学校主页 URL（如 https://career.buct.edu.cn），
// 系统自动识别并走 API 模式，无需 HTML 爬取。

const UNIVERSITY_CAREER_PLATFORMS: Record<string, {
  auth: string
  schoolId: string
  schoolCode: string
}> = {
  'career.buct.edu.cn': {
    auth: 'Baisc MTAyNDY6MTAyNDY=',
    schoolId: '3c23ba6a-c20f-9474-5fb2-65e128f17727',
    schoolCode: '10010',
  },
}

const TIMESTAMP_2025 = 1735689600 // 2025-01-01 00:00:00 UTC

async function fetchUniversityCareerItems(
  hostname: string,
  config: { auth: string; schoolId: string; schoolCode: string }
): Promise<Array<{ title: string; text: string; applyUrl: string }>> {
  const baseUrl = `https://${hostname}`

  // 先访问主页拿 session cookie
  let cookie = ''
  try {
    const initRes = await proxyFetch(baseUrl)
    const setCookie = initRes.headers.get('set-cookie') ?? ''
    const m = setCookie.match(/sl-session=([^;]+)/)
    if (m) cookie = `sl-session=${m[1]}`
  } catch { /* 忽略，继续尝试 */ }

  const body = new URLSearchParams({
    school_id: config.schoolId,
    login_user_id: '1',
    login_admin_school_code: config.schoolCode,
    login_admin_school_id: config.schoolId,
    page: '1',
    limit: '50',
  })

  const res = await proxyFetch(`${baseUrl}/mobile.php/enrollment/getlist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'auth': config.auth,
      'X-Requested-With': 'XMLHttpRequest',
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: body.toString(),
  })

  if (!res.ok) throw new Error(`高校就业网 API 请求失败: ${res.status}`)

  const data = await res.json()
  if (data.code !== 0) throw new Error(`高校就业网 API 错误: ${data.msg}`)

  const list = (data.data?.list ?? []) as Array<{
    id: string
    title: string
    remarks: string
    addtime: number
  }>

  return list
    .filter(item => item.addtime >= TIMESTAMP_2025)
    .map(item => ({
      title: item.title,
      text: `招聘标题：${item.title}\n\n详情：${(item.remarks ?? '').slice(0, 4000)}`,
      applyUrl: `${baseUrl}/Zhaopin/xiaozhao.html?id=${item.id}&type=0`,
    }))
}

// ──────────────────────────────────────────────────────────────────────────

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
    const aiConfig = {
      baseUrl: settings.ai_base_url ?? 'https://api.openai.com/v1',
      apiKey: settings.ai_api_key,
      model: settings.ai_model ?? 'gpt-4o-mini',
    }

    // 判断是否为高校就业网 API 平台
    let hostname = ''
    try { hostname = new URL(site.url).hostname } catch { /* ignore */ }
    const uniConfig = UNIVERSITY_CAREER_PLATFORMS[hostname]

    type Item = { title: string; text: string; applyUrl?: string }
    let items: Item[] = []

    if (uniConfig) {
      // API 模式：直接调接口，拿结构化 JSON
      items = await fetchUniversityCareerItems(hostname, uniConfig)
    } else {
      // HTML 模式：抓页面，整页作为一个条目
      const pageContent = await fetchPageContent(site.url)
      if (!pageContent || pageContent.length < 50) throw new Error('无法获取页面内容')
      items = [{ title: site.name, text: pageContent }]
    }

    for (const item of items) {
      const extracted = await extractJobWithAI(item.text, aiConfig)
      const jobs = Array.isArray(extracted) ? extracted : [extracted]

      for (const job of jobs) {
        if (!job.company_name || !job.position_name) continue

        // 补充投递链接（API 模式已知，HTML 模式 AI 自行提取）
        if (!job.apply_url && item.applyUrl) job.apply_url = item.applyUrl

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
