

const API_URL = (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_API_URL : null) || (typeof import.meta !== 'undefined' && import.meta.env?.DEV ? "http://localhost:3001" : "")

export async function getCertifications(): Promise<any[]> {
  try {
    const res = await fetch(`${API_URL}/api/public/certifications`)
    if (!res.ok) return []
    const certs = await res.json()
    // Parse skills from JSON string if needed
    return certs.map((c: any) => ({
      ...c,
      skills: c.skills ? JSON.parse(c.skills) : [],
      expiryDate: c.expirationDate,
      credentialUrl: c.url
    }))
  } catch (err) {
    console.error("Failed to fetch certifications", err)
    return []
  }
}

export async function getFeaturedCertifications(): Promise<any[]> {
  try {
    const certs = await getCertifications()
    return certs.slice(0, 4) // No featured flag on Prisma model, take first 4
  } catch (err) {
    return []
  }
}

export async function getCertificationCategories(): Promise<string[]> {
  // Not strictly stored in Prisma right now, but we can extract if we add category later
  return []
}
