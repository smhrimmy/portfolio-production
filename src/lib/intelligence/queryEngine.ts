import { searchIndex, useIntelligenceStore } from "../../stores/intelligenceStore"

export function processQuery(query: string) {
  const lowerQuery = query.toLowerCase()
  const data = (window as any).__pdl_data || { projects: [], articles: [], skills: [] }
  const stats = useIntelligenceStore.getState().stats

  // 1. COUNT INTENT
  if (/how many (projects|articles|posts|skills)/.test(lowerQuery) || /(count|number of) (projects|articles|posts|skills)/.test(lowerQuery)) {
    if (lowerQuery.includes("project")) {
      return {
        text: `You currently have ${stats.projectCount} projects in your portfolio.`,
        actions: [{ label: "View Projects", onClick: "/admin/content/projects" }]
      }
    }
    if (lowerQuery.includes("article") || lowerQuery.includes("post")) {
      return {
        text: `You have written ${stats.articleCount} articles.`,
        actions: [{ label: "View Articles", onClick: "/admin/content/articles" }]
      }
    }
    if (lowerQuery.includes("skill")) {
      return {
        text: `You have ${stats.skillCount} skills listed.`,
        actions: [{ label: "View Skills", onClick: "/admin/content/skills" }]
      }
    }
  }

  // 1b. COUNT MATCHING (e.g. How many projects feature React?)
  if (/how many projects (feature|have|use) (.*)/.test(lowerQuery)) {
    const match = lowerQuery.match(/how many projects (feature|have|use) (.*)/)
    if (match && match[2]) {
      const term = match[2].replace("?", "").trim()
      const results = searchIndex.search(term, { filter: (res) => res.type === "project" })
      return {
        text: `I found ${results.length} projects featuring "${term}".`,
        actions: results.length > 0 ? [{ label: "View Projects", onClick: "/admin/content/projects" }] : []
      }
    }
  }

  // 2. LATEST/RECENT INTENT
  if (/(latest|recent|newest) (blog post|post|article|project)/.test(lowerQuery)) {
    if (lowerQuery.includes("project") && data.projects.length > 0) {
      // Assuming they are sorted or we sort by createdAt
      const sorted = [...data.projects].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      const latest = sorted[0]
      return {
        text: `Your most recent project is **${latest.title}**.`,
        actions: [
          { label: "Edit Project", onClick: "/admin/content/projects" },
          { label: "Preview", onClick: `/projects/${latest.slug}` }
        ]
      }
    }
    if ((lowerQuery.includes("post") || lowerQuery.includes("article")) && data.articles.length > 0) {
      const sorted = [...data.articles].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      const latest = sorted[0]
      return {
        text: `Your latest blog post is **${latest.title}**.`,
        actions: [
          { label: "Edit Post", onClick: "/admin/content/articles" },
          { label: "Preview", onClick: `/writing/${latest.slug}` }
        ]
      }
    }
  }

  // 3. MISSING DATA INTENT (e.g. Show projects without images)
  if (/(show|find|what).*(projects without images|missing)/.test(lowerQuery)) {
    const noImages = data.projects.filter((p: any) => !p.coverMediaId && !p.content?.includes("![") && !p.content?.includes("<img"))
    return {
      text: noImages.length > 0 
        ? `I found ${noImages.length} projects that appear to be missing cover images or media: ${noImages.map((p: any) => p.title).join(", ")}.`
        : "All your projects seem to have media!",
      actions: [{ label: "Edit Projects", onClick: "/admin/content/projects" }]
    }
  }

  if (/which sections are empty/.test(lowerQuery)) {
    const empty = []
    if (stats.projectCount === 0) empty.push("Projects")
    if (stats.articleCount === 0) empty.push("Articles")
    if (stats.skillCount === 0) empty.push("Skills")
    
    return {
      text: empty.length > 0 
        ? `The following sections are currently empty: ${empty.join(", ")}.`
        : "Your core content sections all have data!",
      actions: empty.length > 0 ? [{ label: `Add ${empty[0]}`, onClick: `/admin/content/${empty[0].toLowerCase()}` }] : []
    }
  }

  if (/what should i improve/.test(lowerQuery)) {
    // Simple rule-based heuristics
    const tips = []
    if (stats.projectCount < 3) tips.push("Add more projects (aim for at least 3).")
    if (stats.articleCount === 0) tips.push("Start a blog to share your knowledge.")
    
    const drafts = data.projects.filter((p: any) => p.publishStatus === "draft").length + 
                   data.articles.filter((a: any) => a.publishStatus === "draft").length
    if (drafts > 0) tips.push(`You have ${drafts} drafts waiting to be published.`)

    return {
      text: tips.length > 0 
        ? `Here are a few quick suggestions:\n- ${tips.join("\n- ")}`
        : "Your portfolio looks very healthy! Keep up the great work.",
      actions: []
    }
  }

  // 4. DATE INTENT (When did I work at / When does cert expire)
  if (/when did i work at (.*)/.test(lowerQuery)) {
    // Requires experience data, which isn't indexed by default but we can mock or query if we fetched it.
    // For now, gracefully degrade.
    return {
      text: "I don't have experience records indexed in this session yet, but you can check your Experience page.",
      actions: [{ label: "View Experience", onClick: "/admin/content/experience" }]
    }
  }

  if (/when does my (.*) cert expire/.test(lowerQuery) || /expire/.test(lowerQuery)) {
    return {
      text: "I don't have that information in your portfolio yet.",
      actions: [{ label: "Check Certifications", onClick: "/admin/content/certifications" }]
    }
  }

  // 5. THEME / STATE INTENT
  if (/which theme is active/.test(lowerQuery) || /what theme/.test(lowerQuery)) {
    // Read from localStorage (Zustand theme store)
    let activeTheme = "minimal"
    try {
      const themeStoreStr = localStorage.getItem("portfolio-theme-store")
      if (themeStoreStr) {
        const parsed = JSON.parse(themeStoreStr)
        activeTheme = parsed.state?.theme || "minimal"
      }
    } catch(e) {}

    return {
      text: `Your current active theme is **${activeTheme}**.`,
      actions: [{ label: "Change Theme", onClick: "/admin/design/theme" }]
    }
  }

  // 6. RECENT CHANGES (Audit log mock)
  if (/what changed in the last 7 days/.test(lowerQuery) || /recent changes/.test(lowerQuery)) {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    let count = 0
    data.projects.forEach((p: any) => { if (new Date(p.updatedAt) >= sevenDaysAgo) count++ })
    data.articles.forEach((a: any) => { if (new Date(a.updatedAt) >= sevenDaysAgo) count++ })

    return {
      text: `You have modified ${count} items (projects/articles) in the last 7 days.`,
      actions: []
    }
  }

  // 7. SEMANTIC / FUZZY FALLBACK
  const results = searchIndex.search(lowerQuery, { fuzzy: 0.2, prefix: true })
  
  if (results.length > 0) {
    const topMatch = results[0]
    return {
      text: `I found ${results.length} results matching "${query}". The top match is a ${topMatch.type} titled "**${topMatch.title}**".`,
      actions: [
        { label: `Edit ${topMatch.type}`, onClick: `/admin/content/${topMatch.type}s` }
      ]
    }
  }

  // FAILSAFE
  return {
    text: "I don't have that information in your portfolio yet.",
    actions: []
  }
}
