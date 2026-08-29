import { searchIndex, useIntelligenceStore } from "../../stores/intelligenceStore"

export async function buildLocalIndex(token: string) {
  const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:3001" : "")
  
  try {
    // We only fetch data to index locally. This is safe and requires no external API keys.
    const [projectsRes, articlesRes, skillsRes] = await Promise.all([
      fetch(`${apiUrl}/api/admin/projects`, { headers: { Authorization: `Bearer ${token}` } }),
      fetch(`${apiUrl}/api/admin/articles`, { headers: { Authorization: `Bearer ${token}` } }),
      fetch(`${apiUrl}/api/admin/skills`, { headers: { Authorization: `Bearer ${token}` } })
    ])

    const projects = await projectsRes.json()
    const articles = await articlesRes.json()
    const skills = await skillsRes.json()

    // Clear existing index before rebuilding
    searchIndex.removeAll()

    const documents: any[] = []

    if (Array.isArray(projects)) {
      projects.forEach(p => {
        documents.push({
          id: `proj_${p.id}`,
          type: "project",
          title: p.title,
          content: p.content,
          excerpt: p.excerpt,
          category: p.category,
          slug: p.slug,
          tags: p.tags,
          raw: p // keep raw data for querying
        })
      })
    }

    if (Array.isArray(articles)) {
      articles.forEach(a => {
        documents.push({
          id: `art_${a.id}`,
          type: "article",
          title: a.title,
          content: a.content,
          excerpt: a.excerpt,
          category: a.category,
          slug: a.slug,
          tags: a.tags,
          raw: a
        })
      })
    }
    
    if (Array.isArray(skills)) {
      skills.forEach(s => {
        documents.push({
          id: `skill_${s.id}`,
          type: "skill",
          title: s.name,
          content: `${s.category} ${s.name}`,
          category: s.category,
          slug: "skills",
          raw: s
        })
      })
    }

    searchIndex.addAll(documents)

    // Store raw lists in a window variable or local cache for programmatic "How many..." queries
    ;(window as any).__pdl_data = {
      projects: Array.isArray(projects) ? projects : [],
      articles: Array.isArray(articles) ? articles : [],
      skills: Array.isArray(skills) ? skills : []
    }

    useIntelligenceStore.getState().setStats({
      projectCount: Array.isArray(projects) ? projects.length : 0,
      articleCount: Array.isArray(articles) ? articles.length : 0,
      skillCount: Array.isArray(skills) ? skills.length : 0,
      lastUpdated: Date.now()
    })

    const { generateInsights } = await import("./insights")
    const insights = generateInsights((window as any).__pdl_data)
    useIntelligenceStore.getState().setInsights(insights)

    useIntelligenceStore.getState().setIsIndexed(true)
    console.log("[PDL Intelligence] Local index built successfully.")
    
  } catch (error) {
    console.error("[PDL Intelligence] Failed to build local index:", error)
  }
}
