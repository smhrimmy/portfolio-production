export interface SiteSettings {
  id: string
  titleTemplate: string
  description: string
  resumeCtaText: string
  resumeCtaLink: string | null
  contactEmail: string
  availability: string
  seoDefaults: string
  features: string
}

const defaultSettings: SiteSettings = {
  id: "default",
  titleTemplate: "%s | Portfolio OS",
  description: "A sophisticated personal operating system.",
  resumeCtaText: "Download Resume",
  resumeCtaLink: null,
  contactEmail: "hello@example.com",
  availability: "available",
  seoDefaults: "{}",
  features: "{}"
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const apiUrl = (typeof import.meta !== "undefined" && import.meta.env?.DEV ? (import.meta.env.VITE_API_URL || "http://localhost:3001") : "")
    const res = await fetch(`${apiUrl}/api/public/settings`)
    if (res.ok) {
      return await res.json()
    }
  } catch (error) {
    console.warn("Failed to fetch settings from API, falling back to defaults:", error)
  }
  return defaultSettings
}
