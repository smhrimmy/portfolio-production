import { Router } from "express"
import { prisma } from "../../config/db.js"

export const publicProjectsRouter = Router()

// GET /api/public/projects - Returns all published projects
publicProjectsRouter.get("/", async (_req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: {
        publishStatus: "published"
      },
      orderBy: {
        createdAt: "desc"
      }
    })
    res.json(projects)
  } catch (error) {
    console.error("Failed to fetch public projects:", error)
    res.status(500).json({ error: "Failed to fetch projects" })
  }
})

// GET /api/public/projects/:slug - Returns a specific published project
publicProjectsRouter.get("/:slug", async (req, res) => {
  try {
    const project = await prisma.project.findFirst({
      where: {
        slug: req.params.slug,
        publishStatus: "published"
      }
    })
    
    if (!project) {
      return res.status(404).json({ error: "Project not found" })
    }
    
    res.json(project)
  } catch (error) {
    console.error("Failed to fetch public project:", error)
    res.status(500).json({ error: "Failed to fetch project" })
  }
})
