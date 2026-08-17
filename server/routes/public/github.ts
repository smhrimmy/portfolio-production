import { Router } from "express"
import { prisma } from "../../config/db.js"

const router = Router()

// GET /api/public/github/repositories
router.get("/repositories", async (_req, res) => {
  try {
    const repos = await prisma.githubRepository.findMany({
      where: {
        publishStatus: "published"
      },
      orderBy: [
        { isFeatured: "desc" },
        { order: "asc" },
        { stars: "desc" }
      ]
    })
    
    // Parse topics back to array
    const parsedRepos = repos.map((r: any) => ({
      ...r,
      topics: r.topics ? JSON.parse(r.topics) : []
    }))
    
    res.json(parsedRepos)
  } catch (error) {
    res.status(500).json({ error: { code: "SERVER_ERROR", message: "Failed to fetch repositories" } })
  }
})

// GET /api/public/github/stats
// Provides aggregated stats from the cached data
router.get("/stats", async (_req, res) => {
  try {
    const repos = await prisma.githubRepository.findMany({
      where: { publishStatus: "published" }
    })
    
    const stats = {
      totalStars: repos.reduce((sum: number, r: any) => sum + r.stars, 0),
      totalForks: repos.reduce((sum: number, r: any) => sum + r.forks, 0),
      totalRepos: repos.length,
      languages: {} as Record<string, number>
    }
    
    repos.forEach((r: any) => {
      if (r.language) {
        stats.languages[r.language] = (stats.languages[r.language] || 0) + 1
      }
    })
    
    res.json(stats)
  } catch (error) {
    res.status(500).json({ error: { code: "SERVER_ERROR", message: "Failed to fetch GitHub stats" } })
  }
})

export default router
