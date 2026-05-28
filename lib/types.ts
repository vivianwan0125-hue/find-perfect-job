export type PositionType = string
export type JobStatus = '待投递' | '已投递' | '笔试' | '面试' | 'Offer' | '已拒绝'
export type Priority = '高' | '中' | '低'

export interface Job {
  id: string
  company_name: string
  position_name: string
  position_type: PositionType
  work_location: string | null
  deadline: string | null
  requirements: string | null
  apply_url: string | null
  status: JobStatus
  priority: Priority
  notes: string | null
  source: string
  is_new: boolean
  created_at: string
  updated_at: string
}

export interface CrawlerSite {
  id: string
  name: string
  url: string
  is_enabled: boolean
  last_crawled_at: string | null
  jobs_count: number
  created_at: string
}

export interface AppSettings {
  id: number
  ai_base_url: string | null
  ai_api_key: string | null
  ai_model: string | null
  position_types: string[] | null
  updated_at: string
}

export interface JobFilters {
  search: string
  position_type: string
  status: string
  priority: string
}

export interface ExtractedJobData {
  company_name?: string
  position_name?: string
  position_type?: PositionType
  work_location?: string
  deadline?: string
  requirements?: string
  apply_url?: string
}

export const POSITION_TYPES: PositionType[] = ['研发', '售前工程师', '海外销售', '其他']
export const JOB_STATUSES: JobStatus[] = ['待投递', '已投递', '笔试', '面试', 'Offer', '已拒绝']
export const PRIORITIES: Priority[] = ['高', '中', '低']

export const STATUS_NEXT: Record<JobStatus, JobStatus | null> = {
  '待投递': '已投递',
  '已投递': '笔试',
  '笔试': '面试',
  '面试': 'Offer',
  'Offer': null,
  '已拒绝': null,
}
