import MiniSearch from "minisearch"
import { type SearchDocument, type SearchResult } from "../types/search"

let publicSearchIndex: MiniSearch<SearchDocument> | null = null
let searchIndexCache: SearchDocument[] | null = null

export async function buildSearchIndex(): Promise<SearchDocument[]> {
  if (searchIndexCache && publicSearchIndex) return searchIndexCache

  const apiUrl = (import.meta.env.DEV ? (import.meta.env.VITE_API_URL || "http://localhost:3001") : "")

  try {
    const [projectsRes, articlesRes, skillsRes, certsRes] = await Promise.all([
      fetch(`${apiUrl}/api/public/projects`),
      fetch(`${apiUrl}/api/public/articles`),
      fetch(`${apiUrl}/api/public/skills`),
      fetch(`${apiUrl}/api/public/certifications`)
    ])

    const projects = projectsRes.ok ? await projectsRes.json() : []
    const articles = articlesRes.ok ? await articlesRes.json() : []
    const skills = skillsRes.ok ? await skillsRes.json() : []
    const certs = certsRes.ok ? await certsRes.json() : []

    const docs: SearchDocument[] = []

    if (Array.isArray(projects)) {
      projects.forEach(p => {
        docs.push({
          id: `proj_${p.id}`,
          type: "Project",
          title: p.title,
          description: p.excerpt || p.content,
          url: `/projects/${p.slug}`,
          category: p.category,
          tags: p.tags,
        })
      })
    }

    if (Array.isArray(articles)) {
      articles.forEach(a => {
        docs.push({
          id: `art_${a.id}`,
          type: "Article",
          title: a.title,
          description: a.excerpt || a.content,
          url: `/writing/${a.slug}`,
          category: a.category,
          tags: a.tags,
        })
      })
    }

    if (Array.isArray(skills)) {
      skills.forEach(s => {
        docs.push({
          id: `skill_${s.id}`,
          type: "Skill",
          title: s.name,
          description: s.category,
          url: "/skills",
          category: s.category,
        })
      })
    }
    
    if (Array.isArray(certs)) {
      certs.forEach(c => {
        docs.push({
          id: `cert_${c.id}`,
          type: "Certification",
          title: c.name,
          description: c.issuer,
          url: "/certifications",
          category: c.category,
        })
      })
    }

    // Static Pages
    const pages = [
      { title: "Home", url: "/", desc: "Homepage and featured highlights" },
      { title: "About", url: "/about", desc: "Professional background and approach" },
      { title: "Projects", url: "/projects", desc: "Selected software engineering work" },
      { title: "Experience", url: "/experience", desc: "Career history and roles" },
      { title: "Writing", url: "/writing", desc: "Articles, tutorials, and case studies" },
      { title: "Skills", url: "/skills", desc: "Technology matrix and core capabilities" },
      { title: "Certifications", url: "/certifications", desc: "Formal credentials and education" },
      { title: "Resume", url: "/resume", desc: "Professional resume and PDF download" },
      { title: "Contact", url: "/contact", desc: "Get in touch and find social links" },
    ]

    pages.forEach(p => {
      docs.push({
        id: `page_${p.title.toLowerCase()}`,
        type: "Page",
        title: p.title,
        description: p.desc,
        url: p.url,
      })
    })

    searchIndexCache = docs

    // Initialize Minisearch
    publicSearchIndex = new MiniSearch({
      fields: ['title', 'description', 'category', 'tags'],
      storeFields: ['title', 'description', 'url', 'type', 'category', 'tags']
    })
    
    publicSearchIndex.addAll(docs)

    return docs
  } catch (error) {
    console.error("Failed to build public search index:", error)
    return []
  }
}

export function performSearch(query: string, _index: SearchDocument[]): SearchResult[] {
  if (!query.trim() || !publicSearchIndex) return []

  const lowerQuery = query.toLowerCase()

  // Intent parsing (e.g., "projects using react")
  let typeFilter = ""
  if (lowerQuery.includes("project")) typeFilter = "Project"
  else if (lowerQuery.includes("article") || lowerQuery.includes("post")) typeFilter = "Article"
  else if (lowerQuery.includes("skill")) typeFilter = "Skill"
  
  // Extract core search term if intent-based
  let searchTerm = query
  const match = lowerQuery.match(/(projects|articles|posts) (using|with|about) (.*)/)
  if (match && match[3]) {
    searchTerm = match[3]
  }

  const results = publicSearchIndex.search(searchTerm, {
    fuzzy: 0.2,
    prefix: true,
    filter: (result) => {
      if (typeFilter && result.type !== typeFilter) return false
      return true
    }
  })

  // Format and cast back to our component expectations
  return results.map(r => ({
    id: r.id,
    type: r.type as any, // Cast to SearchCategory
    title: r.title,
    description: r.description,
    url: r.url,
    category: r.category,
    tags: r.tags,
    score: r.score
  }))
}
