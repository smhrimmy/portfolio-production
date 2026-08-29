export interface Insight {
  id: string
  type: "seo" | "content" | "growth" | "readability"
  severity: "high" | "medium" | "low"
  message: string
  entityType?: "project" | "article" | "skill" | "global"
  entityId?: string
  actionLabel?: string
  actionUrl?: string
}

const STOP_WORDS = new Set(["the", "and", "a", "to", "of", "in", "i", "is", "that", "it", "on", "you", "this", "for", "but", "with", "are", "have", "be", "at", "or", "as", "was", "so", "if", "out", "not", "my"])

// Calculate Flesch Reading Ease
export function calculateReadability(text: string = ""): number {
  if (!text) return 0
  const words = text.split(/\s+/).length
  const sentences = text.split(/[.!?]+/).length - 1 || 1
  
  // Rough syllable approximation
  const syllables = text.toLowerCase().split(/[aeiouy]+/).length - 1 || 1
  
  const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words)
  return Math.max(0, Math.min(100, score))
}

export function extractKeywords(text: string = ""): string[] {
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/)
  const counts: Record<string, number> = {}
  
  for (const w of words) {
    if (w.length > 2 && !STOP_WORDS.has(w)) {
      counts[w] = (counts[w] || 0) + 1
    }
  }
  
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(e => e[0])
}

export function generateInsights(data: any): Insight[] {
  const insights: Insight[] = []
  
  const projects = data.projects || []
  const articles = data.articles || []

  // 1. Growth Insights
  if (projects.length < 3) {
    insights.push({
      id: "growth-projects",
      type: "growth",
      severity: "high",
      message: `Your portfolio works best with 6+ projects. You currently have ${projects.length}.`,
      entityType: "global",
      actionLabel: "Add Project",
      actionUrl: "/admin/content/projects"
    })
  }

  if (articles.length === 0) {
    insights.push({
      id: "growth-articles",
      type: "growth",
      severity: "medium",
      message: "Starting a blog can improve your SEO and demonstrate thought leadership.",
      entityType: "global",
      actionLabel: "Write Article",
      actionUrl: "/admin/content/articles"
    })
  }

  // 2. SEO & Content Doctor for Projects
  projects.forEach((p: any) => {
    if (!p.excerpt || p.excerpt.length < 10) {
      insights.push({
        id: `seo-proj-${p.id}-desc`,
        type: "seo",
        severity: "medium",
        message: `Project "${p.title}" is missing a meta description (excerpt).`,
        entityType: "project",
        entityId: p.id,
        actionLabel: "Fix Description",
        actionUrl: "/admin/content/projects"
      })
    }
    
    if (!p.coverMediaId && !p.content?.includes("![")) {
      insights.push({
        id: `content-proj-${p.id}-img`,
        type: "content",
        severity: "high",
        message: `Project "${p.title}" has no cover image or internal images.`,
        entityType: "project",
        entityId: p.id,
        actionLabel: "Add Media",
        actionUrl: "/admin/content/projects"
      })
    }
  })

  // 3. SEO, Content & Readability for Articles
  articles.forEach((a: any) => {
    if (!a.excerpt || a.excerpt.length < 10) {
      insights.push({
        id: `seo-art-${a.id}-desc`,
        type: "seo",
        severity: "medium",
        message: `Article "${a.title}" needs an excerpt for SEO.`,
        entityType: "article",
        entityId: a.id,
        actionLabel: "Fix SEO",
        actionUrl: "/admin/content/articles"
      })
    }

    const wordCount = a.content?.split(/\s+/).length || 0
    if (wordCount < 300) {
      insights.push({
        id: `content-art-${a.id}-length`,
        type: "content",
        severity: "low",
        message: `Article "${a.title}" is very short (${wordCount} words). Aim for 300+ words.`,
        entityType: "article",
        entityId: a.id,
        actionLabel: "Expand Content",
        actionUrl: "/admin/content/articles"
      })
    }

    const readability = calculateReadability(a.content)
    if (readability < 30 && wordCount > 50) {
      insights.push({
        id: `readability-art-${a.id}`,
        type: "readability",
        severity: "low",
        message: `Article "${a.title}" might be hard to read (Score: ${Math.round(readability)}). Try shorter sentences.`,
        entityType: "article",
        entityId: a.id,
        actionLabel: "Edit Article",
        actionUrl: "/admin/content/articles"
      })
    }
  })

  return insights.sort((a, b) => {
    const weights = { high: 3, medium: 2, low: 1 }
    return weights[b.severity] - weights[a.severity]
  })
}
