/**
 * Proxy-aware fetch for server-side HTTP calls.
 *
 * Local dev (behind VPN): routes through the local proxy client
 *   (Clash / V2Ray / etc.) so DNS and foreign domains work.
 *   Proxy URL = HTTPS_PROXY env var, or defaults to 127.0.0.1:7897.
 *
 * Vercel / production (VERCEL=1 set automatically): Vercel's network
 *   needs no proxy, so we fall back to native globalThis.fetch directly.
 */

import type { Dispatcher } from 'undici'

const isVercel = !!process.env.VERCEL
const explicitProxy = process.env.HTTPS_PROXY || process.env.HTTP_PROXY || process.env.ALL_PROXY

let dispatcher: Dispatcher | undefined
let ready = false

async function getDispatcher(): Promise<Dispatcher | undefined> {
  if (ready) return dispatcher
  // On Vercel with no explicit proxy → skip, use native fetch
  if (isVercel && !explicitProxy) {
    ready = true
    return undefined
  }
  try {
    const { ProxyAgent } = await import('undici')
    dispatcher = new ProxyAgent(explicitProxy || 'http://127.0.0.1:7897')
  } catch {
    dispatcher = undefined
  }
  ready = true
  return dispatcher
}

export async function proxyFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const d = await getDispatcher()

  // No proxy configured → use native fetch (Vercel, or proxy not available)
  if (!d) return globalThis.fetch(input as RequestInfo, init)

  const { fetch: undiciFetch } = await import('undici')
  return undiciFetch(input as Parameters<typeof undiciFetch>[0], {
    ...(init as Parameters<typeof undiciFetch>[1]),
    dispatcher: d,
  }) as unknown as Promise<Response>
}
