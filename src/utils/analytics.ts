export interface AnalyticsEventPayload {
  eventType: string
  path: string
  referrer?: string
  entityType?: string
  entityId?: string
}

// Simple heuristic to determine device type
const getDeviceType = () => {
  const ua = navigator.userAgent
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return "tablet"
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) return "mobile"
  return "desktop"
}

// Simple heuristic for browser
const getBrowser = () => {
  const ua = navigator.userAgent
  if (ua.indexOf("Firefox") > -1) return "firefox"
  if (ua.indexOf("Opera") > -1 || ua.indexOf("OPR") > -1) return "opera"
  if (ua.indexOf("Trident") > -1) return "ie"
  if (ua.indexOf("Edge") > -1) return "edge"
  if (ua.indexOf("Chrome") > -1) return "chrome"
  if (ua.indexOf("Safari") > -1) return "safari"
  return "unknown"
}

export const trackEvent = async (payload: AnalyticsEventPayload) => {
  try {
    const apiUrl = (import.meta.env.DEV ? (import.meta.env.VITE_API_URL || "http://localhost:3001") : "")
    
    // Only track if not in admin and not in development (optional, but good practice)
    if (payload.path.startsWith('/admin')) return
    
    await fetch(`${apiUrl}/api/public/analytics`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        device: getDeviceType(),
        browser: getBrowser(),
        // Collect document referrer only on first load or direct navigation, 
        // fallback to standard document.referrer
        referrer: document.referrer || null
      })
    })
  } catch (error) {
    // Fail silently, analytics should not block the main thread or cause errors
    console.debug("Analytics tracking failed:", error)
  }
}
