import { type SearchDocument, type SearchResult } from "../types/search"
import { getProjects } from "../data/projects"
import { getArticles } from "../data/articles"
import { getExperience } from "../data/experience"
import { getSkills } from "../data/skills"
import { getCertifications } from "../data/certifications"

let searchIndexCache: SearchDocument[] | null = null

export async function buildSearchIndex(): Promise<SearchDocument[]> {
  if (searchIndexCache) return searchIndexCache

  const [projects, articles, experience, skills, certifications] = await Promise.all([
    getProjects(),
    getArticles(),
    getExperience(),
    getSkills(),
    getCertifications()
  ])

  const docs: SearchDocument[] = []

  // Map Projects
  projects.forEach(p => {
    docs.push({
      id: `proj_${p.id}`,
      type: "Project",
      title: p.title,
      description: p.shortDescription,
      url: `/projects/${p.slug}`,
      technologies: p.technologies,
    })
  })

  // Map Articles
  articles.forEach(a => {
    docs.push({
      id: `art_${a.id}`,
      type: "Article",
      title: a.title,
      description: a.excerpt,
      url: `/writing/${a.slug}`,
      category: a.category,
      tags: a.tags,
    })
  })

  // Map Experience
  experience.forEach(e => {
    docs.push({
      id: `exp_${e.id}`,
      type: "Experience",
      title: `${e.role} at ${e.company}`,
      description: e.summary,
      url: "/experience",
      technologies: e.technologies,
    })
  })

  // Map Skills
  skills.forEach(s => {
    docs.push({
      id: `skill_${s.id}`,
      type: "Skill",
      title: s.name,
      url: "/skills",
      technologies: s.technologies,
    })
  })

  // Map Certifications
  certifications.forEach(c => {
    docs.push({
      id: `cert_${c.id}`,
      type: "Certification",
      title: c.name,
      description: c.issuer,
      url: "/certifications",
      category: c.category,
      tags: c.skills,
    })
  })

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
  return docs
}

function normalize(str: string): string {
  return str.toLowerCase().trim().replace(/[^a-z0-9]/g, "")
}

export function performSearch(query: string, index: SearchDocument[]): SearchResult[] {
  if (!query.trim()) return []

  const normalizedQuery = query.toLowerCase().trim()
  const exactQuery = normalize(query)

  const results = index.map(doc => {
    let score = 0
    const title = doc.title.toLowerCase()
    
    // Exact title match (normalized)
    if (normalize(doc.title) === exactQuery) {
      score += 100
    }
    // Prefix match
    else if (title.startsWith(normalizedQuery)) {
      score += 90
    }
    // Keyword match
    else if (title.includes(normalizedQuery)) {
      score += 80
    }

    // Description match
    if (doc.description && doc.description.toLowerCase().includes(normalizedQuery)) {
      score += 50
    }

    // Category / Tags match
    if (doc.category && doc.category.toLowerCase().includes(normalizedQuery)) {
      score += 60
    }
    if (doc.tags && doc.tags.some(t => t.toLowerCase().includes(normalizedQuery))) {
      score += 60
    }
    
    // Tech match
    if (doc.technologies && doc.technologies.some(t => t.toLowerCase().includes(normalizedQuery))) {
      score += 50
    }

    return { ...doc, score }
  })

  return results
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
}
