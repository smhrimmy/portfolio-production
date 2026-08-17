/**
 * API origin for browser requests.
 * Production on Vercel uses same-origin `/api` (empty base).
 * Local Vite proxies `/api` to the Express server unless VITE_API_URL is set.
 */
export function getApiBaseUrl(): string {
  const explicit = import.meta.env.VITE_API_URL
  if (typeof explicit === "string" && explicit.trim().length > 0) {
    return explicit.replace(/\/$/, "")
  }
  return ""
}

export function apiUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`
  return `${getApiBaseUrl()}${normalized}`
}
