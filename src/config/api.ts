/**
 * Global API URL resolver:
 * - In Production (Vercel): Always uses same-origin relative URLs ("")
 * - In Local Development: Uses http://localhost:3001
 */
export const getApiUrl = (): string => {
  if (typeof window !== 'undefined' && !import.meta.env.DEV) {
    return ''
  }
  return import.meta.env?.VITE_API_URL || (import.meta.env?.DEV ? 'http://localhost:3001' : '')
}

export const API_URL = getApiUrl()
