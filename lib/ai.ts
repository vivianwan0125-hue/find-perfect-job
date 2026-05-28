import { ExtractedJobData } from './types'
import { proxyFetch } from './proxy-fetch'

const EXTRACTION_PROMPT = `你是一个招聘信息提取助手。请从以下网页内容中提取岗位信息，返回严格的JSON格式（不要有markdown代码块）。

提取字段说明：
- company_name: 公司名称
- position_name: 岗位名称
- position_type: 岗位类型，只能是 "研发"/"售前工程师"/"海外销售"/"其他" 之一
- work_location: 工作地点（城市）
- deadline: 截止日期，格式为 YYYY-MM-DD，如果没有则为null
- requirements: 岗位要求（简要概括，200字以内）
- apply_url: 投递链接（如果在内容中找到）

只返回JSON对象，不要任何其他文字。示例格式：
{"company_name":"腾讯","position_name":"后端工程师","position_type":"研发","work_location":"深圳","deadline":"2025-09-30","requirements":"3年以上后端经验...","apply_url":"https://example.com/apply"}`

export async function extractJobWithAI(
  pageContent: string,
  config: { baseUrl: string; apiKey: string; model: string }
): Promise<ExtractedJobData> {
  const { baseUrl, apiKey, model } = config

  const trimmedContent = pageContent.slice(0, 8000)

  const response = await proxyFetch(`${baseUrl.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: EXTRACTION_PROMPT },
        { role: 'user', content: `网页内容：\n\n${trimmedContent}` },
      ],
      temperature: 0.1,
      max_tokens: 1000,
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`AI API 调用失败: ${response.status} ${err}`)
  }

  const data = await response.json()
  const content = data.choices?.[0]?.message?.content?.trim()

  if (!content) throw new Error('AI 返回空内容')

  try {
    // Strip markdown code blocks if present
    const cleaned = content.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim()
    return JSON.parse(cleaned)
  } catch {
    throw new Error(`AI 返回格式错误: ${content.slice(0, 200)}`)
  }
}
