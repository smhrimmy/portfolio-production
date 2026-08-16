import { Router } from "express"
import { prisma } from "../../config/db.js"

const router = Router()

// GET /api/public/experiments
router.get("/", async (_req, res) => {
  try {
    const experiments = await prisma.experiment.findMany({
      where: {
        publishStatus: "published"
      },
      orderBy: [
        { featured: "desc" },
        { order: "asc" },
        { publishDate: "desc" }
      ],
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        category: true,
        coverMediaId: true,
        techStack: true,
        featured: true,
        publishDate: true
      }
    })
    
    // Parse JSON string fields
    const parsedExperiments = experiments.map(exp => ({
      ...exp,
      techStack: exp.techStack ? JSON.parse(exp.techStack) : []
    }))

    res.json(parsedExperiments)
  } catch (error) {
    res.status(500).json({ error: { code: "SERVER_ERROR", message: "Failed to fetch experiments" } })
  }
})

// GET /api/public/experiments/:slug
router.get("/:slug", async (req, res) => {
  try {
    const experiment = await prisma.experiment.findFirst({
      where: {
        slug: req.params.slug,
        publishStatus: "published"
      }
    })

    if (!experiment) {
      return res.status(404).json({ error: { code: "NOT_FOUND", message: "Experiment not found" } })
    }

    // Parse JSON string fields
    const parsedExperiment = {
      ...experiment,
      techStack: experiment.techStack ? JSON.parse(experiment.techStack) : [],
      gallery: experiment.gallery ? JSON.parse(experiment.gallery) : [],
      seoConfig: experiment.seoConfig ? JSON.parse(experiment.seoConfig) : null
    }

    res.json(parsedExperiment)
  } catch (error) {
    res.status(500).json({ error: { code: "SERVER_ERROR", message: "Failed to fetch experiment details" } })
  }
})

export default router
