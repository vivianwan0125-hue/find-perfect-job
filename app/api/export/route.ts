import { createAdminClient } from '@/lib/supabase'
import { getErrorMessage } from '@/lib/utils'
import * as XLSX from 'xlsx'

export async function GET() {
  try {
    const db = await createAdminClient()
    const { data, error } = await db
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    const rows = (data ?? []).map((job) => ({
      公司名: job.company_name,
      岗位名称: job.position_name,
      岗位类型: job.position_type,
      工作地点: job.work_location ?? '',
      截止日期: job.deadline ?? '',
      投递状态: job.status,
      优先级: job.priority,
      投递链接: job.apply_url ?? '',
      岗位要求: job.requirements ?? '',
      备注: job.notes ?? '',
      来源: job.source,
      是否新岗位: job.is_new ? '是' : '否',
      创建时间: job.created_at,
    }))

    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, '岗位列表')

    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })

    return new Response(buf, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="jobs_${new Date().toISOString().slice(0, 10)}.xlsx"`,
      },
    })
  } catch (error) {
    return Response.json({ error: getErrorMessage(error) }, { status: 500 })
  }
}
