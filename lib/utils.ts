import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { differenceInDays, parseISO, isValid } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isDeadlineSoon(deadline: string | null): boolean {
  if (!deadline) return false
  const d = parseISO(deadline)
  if (!isValid(d)) return false
  const diff = differenceInDays(d, new Date())
  return diff >= 0 && diff <= 7
}

export function isDeadlinePassed(deadline: string | null): boolean {
  if (!deadline) return false
  const d = parseISO(deadline)
  if (!isValid(d)) return false
  return differenceInDays(d, new Date()) < 0
}

export function formatDeadline(deadline: string | null): string {
  if (!deadline) return '无截止日期'
  const d = parseISO(deadline)
  if (!isValid(d)) return deadline
  const diff = differenceInDays(d, new Date())
  if (diff < 0) return `已过期 ${Math.abs(diff)} 天`
  if (diff === 0) return '今天截止'
  if (diff <= 7) return `还剩 ${diff} 天`
  return deadline
}

export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str
  return str.slice(0, maxLen) + '…'
}

/** Extract a human-readable message from any thrown value (Error, Supabase PostgrestError, string, etc.) */
export function getErrorMessage(err: unknown): string {
  if (typeof err === 'string') return err
  if (err instanceof Error) return err.message
  if (typeof err === 'object' && err !== null) {
    const e = err as Record<string, unknown>
    if (typeof e.message === 'string') return e.message
    if (typeof e.error_description === 'string') return e.error_description
    return JSON.stringify(e)
  }
  return String(err)
}
