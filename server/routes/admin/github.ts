import { Router } from "express"
import { z } from "zod"
import { prisma } from "../../config/db.js"
import { requireAdmin } from "../../middleware/auth.js"

const router = Router()
router.use(requireAdmin)

const GithubConfigSchema = z.object({
  username: z.string().min(1),
  accessToken: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
})

const GithubRepoUpdateSchema = z.object({
  isFeatured: z.boolean().optional(),
  order: z.number().int().optional(),
  publishStatus: z.enum(["draft", "published", "archived"]).optional()
})

// GET /api/admin/github/config
router.get("/config", async (_req, res) => {
  try {
    let config = await prisma.githubConfig.findFirst()
    if (!config) {
      config = await prisma.githubConfig.create({
        data: { username: "octocat" }
      })
    }
    // Mask the token before sending
    if (config.accessToken) {
      config.accessToken = "••••••••••••••••"
    }
    res.json(config)
  } catch (error) {
    res.status(500).json({ error: { code: "SERVER_ERROR", message: "Failed to fetch GitHub config" } })
  }
})

// PUT /api/admin/github/config
router.put("/config", async (req, res) => {
  try {
    const data = GithubConfigSchema.parse(req.body)
    const existing = await prisma.githubConfig.findFirst()

    // If the token is masked, don't override the actual token
    if (existing && data.accessToken === "••••••••••••••••") {
      delete data.accessToken
    }

    let config
    if (existing) {
      config = await prisma.githubConfig.update({
        where: { id: existing.id },
        data: {
          ...data,
          version: { increment: 1 }
        }
      })
    } else {
      config = await prisma.githubConfig.create({ data })
    }

    await prisma.auditLog.create({
      data: {
        entity: "GithubConfig",
        entityId: config.id,
        action: "update",
        user: (req as any).user.id,
        changes: JSON.stringify({ ...data, accessToken: data.accessToken ? "[HIDDEN]" : null })
      }
    })

    if (config.accessToken) {
      config.accessToken = "••••••••••••••••"
    }
    res.json(config)
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: { code: "VALIDATION_ERROR", message: (error as any).errors[0].message } })
    } else {
      res.status(500).json({ error: { code: "SERVER_ERROR", message: "Failed to update GitHub config" } })
    }
  }
})

// POST /api/admin/github/sync
router.post("/sync", async (req, res) => {
  try {
    const config = await prisma.githubConfig.findFirst()
    if (!config || !config.username) {
      return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "GitHub username is not configured" } })
    }

    const headers: Record<string, string> = {
      "Accept": "application/vnd.github.v3+json",
      "User-Agent": "Portfolio-OS-CMS"
    }
    
    if (config.accessToken) {
      headers["Authorization"] = `token ${config.accessToken}`
    }

    // Fetch user repos (up to 100 for now)
    const response = await fetch(`https://api.github.com/users/${config.username}/repos?per_page=100&sort=updated`, { headers })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error("GitHub API Error:", errorText)
      return res.status(response.status).json({ error: { code: "GITHUB_API_ERROR", message: "Failed to fetch from GitHub API" } })
    }

    const repos = (await response.json()) as any[]
    
    let syncedCount = 0
    for (const repo of repos) {
      // Don't import forks unless we explicitly want to, but for portfolio usually we don't.
      if (repo.fork) continue;
      
      const repoData = {
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description,
        url: repo.html_url,
        homepage: repo.homepage,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language,
        topics: JSON.stringify(repo.topics || []),
      }

      await prisma.githubRepository.upsert({
        where: { repoId: repo.id },
        update: repoData,
        create: {
          ...repoData,
          repoId: repo.id,
          publishStatus: "published", // Auto publish by default so they're available
        }
      })
      syncedCount++
    }

    const updatedConfig = await prisma.githubConfig.update({
      where: { id: config.id },
      data: { lastSynced: new Date() }
    })

    await prisma.auditLog.create({
      data: {
        entity: "GithubConfig",
        entityId: config.id,
        action: "sync",
        user: (req as any).user.id,
        changes: JSON.stringify({ syncedCount })
      }
    })

    res.json({ success: true, syncedCount, lastSynced: updatedConfig.lastSynced })
  } catch (error) {
    console.error("GitHub Sync Error:", error)
    res.status(500).json({ error: { code: "SERVER_ERROR", message: "An error occurred during GitHub sync" } })
  }
})

// GET /api/admin/github/repositories
router.get("/repositories", async (_req, res) => {
  try {
    const repos = await prisma.githubRepository.findMany({
      orderBy: [
        { isFeatured: "desc" },
        { order: "asc" },
        { stars: "desc" }
      ]
    })
    res.json(repos)
  } catch (error) {
    res.status(500).json({ error: { code: "SERVER_ERROR", message: "Failed to fetch repositories" } })
  }
})

// PATCH /api/admin/github/repositories/:id
router.patch("/repositories/:id", async (req, res) => {
  try {
    const { id } = req.params
    const data = GithubRepoUpdateSchema.parse(req.body)
    
    const repo = await prisma.githubRepository.update({
      where: { id },
      data: {
        ...data,
        version: { increment: 1 }
      }
    })

    await prisma.auditLog.create({
      data: {
        entity: "GithubRepository",
        entityId: id,
        action: "update",
        user: (req as any).user.id,
        changes: JSON.stringify(data)
      }
    })
    
    res.json(repo)
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: { code: "VALIDATION_ERROR", message: (error as any).errors[0].message } })
    } else {
      res.status(500).json({ error: { code: "SERVER_ERROR", message: "Failed to update repository" } })
    }
  }
})

export default router
