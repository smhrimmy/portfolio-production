import { Router } from "express"
import { prisma } from "../../config/db.js"

const router = Router()

// GET /api/public/seo/routes
// Returns all published SEO routes
router.get("/routes", async (_req, res) => {
  try {
    const routes = await prisma.seoRoute.findMany({
      where: { publishStatus: "published" },
      orderBy: { path: "asc" }
    })
    res.json(routes)
  } catch (error) {
    res.status(500).json({ error: { code: "SERVER_ERROR", message: "Failed to fetch SEO routes" } })
  }
})

// GET /api/public/seo/sitemap.xml
// Dynamically generates the sitemap based on published content
router.get("/sitemap.xml", async (_req, res) => {
  try {
    const baseUrl = process.env.VITE_CLIENT_URL || "https://portfolio.os"
    const urls: { loc: string; lastmod: string; changefreq: string; priority: string }[] = []

    // 1. Static Routes (from SeoRoute)
    const staticRoutes = await prisma.seoRoute.findMany({
      where: { publishStatus: "published", noIndex: false }
    })
    
    staticRoutes.forEach((route: any) => {
      urls.push({
        loc: `${baseUrl}${route.path}`,
        lastmod: route.updatedAt.toISOString(),
        changefreq: "weekly",
        priority: route.path === "/" ? "1.0" : "0.8"
      })
    })

    // 2. Projects
    const projects = await prisma.project.findMany({
      where: { publishStatus: "published" }
    })
    projects.forEach((project: any) => {
      // Check if project has its own noIndex flag inside seoConfig
      let noIndex = false
      if (project.seoConfig) {
        try {
          const seo = JSON.parse(project.seoConfig)
          if (seo.noIndex) noIndex = true
        } catch(e) {}
      }
      
      if (!noIndex) {
        urls.push({
          loc: `${baseUrl}/projects/${project.slug}`,
          lastmod: project.updatedAt.toISOString(),
          changefreq: "monthly",
          priority: "0.9"
        })
      }
    })

    // 3. Articles
    const articles = await prisma.article.findMany({
      where: { publishStatus: "published" }
    })
    articles.forEach((article: any) => {
      let noIndex = false
      if (article.seoConfig) {
        try {
          const seo = JSON.parse(article.seoConfig)
          if (seo.noIndex) noIndex = true
        } catch(e) {}
      }
      
      if (!noIndex) {
        urls.push({
          loc: `${baseUrl}/writing/${article.slug}`,
          lastmod: article.updatedAt.toISOString(),
          changefreq: "monthly",
          priority: "0.8"
        })
      }
    })

    // 4. Experiments
    const experiments = await prisma.experiment.findMany({
      where: { publishStatus: "published" }
    })
    experiments.forEach((exp: any) => {
      urls.push({
        loc: `${baseUrl}/lab/${exp.slug}`,
        lastmod: exp.updatedAt.toISOString(),
        changefreq: "monthly",
        priority: "0.7"
      })
    })

    // Generate XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`
    urls.forEach(url => {
      xml += `  <url>\n`
      xml += `    <loc>${url.loc}</loc>\n`
      xml += `    <lastmod>${url.lastmod}</lastmod>\n`
      xml += `    <changefreq>${url.changefreq}</changefreq>\n`
      xml += `    <priority>${url.priority}</priority>\n`
      xml += `  </url>\n`
    })
    xml += `</urlset>`

    res.header('Content-Type', 'application/xml')
    res.send(xml)
  } catch (error) {
    res.status(500).send("Error generating sitemap")
  }
})

// GET /api/public/seo/robots.txt
router.get("/robots.txt", async (_req, res) => {
  try {
    const baseUrl = process.env.VITE_CLIENT_URL || "https://portfolio.os"
    
    // In a real app, this could be driven by a SiteSettings toggle
    // For now, allow all except admin
    let txt = `User-agent: *\n`
    txt += `Allow: /\n`
    txt += `Disallow: /admin/\n\n`
    txt += `Sitemap: ${baseUrl}/api/public/seo/sitemap.xml\n`

    res.header('Content-Type', 'text/plain')
    res.send(txt)
  } catch (error) {
    res.status(500).send("Error generating robots.txt")
  }
})

export default router
