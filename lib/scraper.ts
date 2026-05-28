import * as cheerio from 'cheerio'
import { proxyFetch } from './proxy-fetch'

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

/**
 * Fetch page HTML using native fetch (works on Vercel).
 * Falls back to playwright for JS-rendered pages when running locally.
 */
export async function fetchPageContent(url: string): Promise<string> {
  let html = await fetchWithFetch(url)
  const text = extractText(html)

  // If extracted text is too short, try playwright (local dev only)
  if (text.length < 200) {
    const playwrightHtml = await fetchWithPlaywright(url)
    if (playwrightHtml.length > html.length) {
      html = playwrightHtml
    }
  }

  return extractText(html)
}

async function fetchWithFetch(url: string): Promise<string> {
  const res = await proxyFetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    },
    signal: AbortSignal.timeout(20000),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`)
  return res.text()
}

async function fetchWithPlaywright(url: string): Promise<string> {
  try {
    // Dynamic import so it doesn't crash on Vercel if playwright isn't installed
    const { chromium } = await import('playwright')
    const browser = await chromium.launch({ headless: true })
    try {
      const page = await browser.newPage()
      await page.setExtraHTTPHeaders({ 'User-Agent': USER_AGENT })
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 })
      await page.waitForTimeout(2000)
      return await page.content()
    } finally {
      await browser.close()
    }
  } catch {
    // Playwright not available (Vercel serverless) or error — return empty
    return ''
  }
}

function extractText(html: string): string {
  if (!html) return ''
  const $ = cheerio.load(html)
  // Remove script, style, nav, footer noise
  $('script, style, nav, footer, header, [class*="menu"], [class*="nav"]').remove()
  return $('body').text().replace(/\s+/g, ' ').trim()
}
