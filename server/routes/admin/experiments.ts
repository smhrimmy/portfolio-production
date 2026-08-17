import { Router } from "express"
import { z } from "zod"
import { prisma } from "../../config/db.js"
import { requireAdmin } from "../../middleware/auth.js"

const router = Router()
router.use(requireAdmin)

const ExperimentSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  content: z.string().default(""),
  category: z.string().min(1),
  coverMediaId: z.string().nullable().optional(),
  gallery: z.string().default("[]"),
  techStack: z.string().default("[]"),
  githubUrl: z.string().nullable().optional(),
  demoUrl: z.string().nullable().optional(),
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
  seoConfig: z.string().nullable().optional(),
})

const PublishSchema = z.object({
  publishStatus: z.enum(["draft", "published", "archived"]),
})

// GET /api/admin/experiments
router.get("/", async (_req, res) => {
  try {
    const experiments = await prisma.experiment.findMany({
      orderBy: [
        { featured: "desc" },
        { order: "asc" },
        { createdAt: "desc" }
      ]
    })
    res.json(experiments)
  } catch (error) {
    res.status(500).json({ error: { code: "SERVER_ERROR", message: "Failed to fetch experiments" } })
  }
})

// GET /api/admin/experiments/:id
router.get("/:id", async (req, res) => {
  try {
    const experiment = await prisma.experiment.findUnique({
      where: { id: req.params.id }
    })
    if (!experiment) {
      return res.status(404).json({ error: { code: "NOT_FOUND", message: "Experiment not found" } })
    }
    res.json(experiment)
  } catch (error) {
    res.status(500).json({ error: { code: "SERVER_ERROR", message: "Failed to fetch experiment" } })
  }
})

// POST /api/admin/experiments
router.post("/", async (req, res) => {
  try {
    const data = ExperimentSchema.parse(req.body)
    
    // Check slug uniqueness
    const existing = await prisma.experiment.findUnique({ where: { slug: data.slug } })
    if (existing) {
      return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "An experiment with this slug already exists" } })
    }

    const experiment = await prisma.experiment.create({ data })

    await prisma.auditLog.create({
      data: {
        entity: "Experiment",
        entityId: experiment.id,
        action: "create",
        user: (req as any).user.id,
        changes: JSON.stringify(data)
      }
    })

    res.status(201).json(experiment)
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: { code: "VALIDATION_ERROR", message: (error as any).errors[0].message } })
    } else {
      res.status(500).json({ error: { code: "SERVER_ERROR", message: "Failed to create experiment" } })
    }
  }
})

// PUT /api/admin/experiments/:id
router.put("/:id", async (req, res) => {
  try {
    const data = ExperimentSchema.parse(req.body)
    
    // Check slug uniqueness
    if (data.slug) {
      const existing = await prisma.experiment.findFirst({
        where: { slug: data.slug, id: { not: req.params.id } }
      })
      if (existing) {
        return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Slug must be unique" } })
      }
    }

    const experiment = await prisma.experiment.update({
      where: { id: req.params.id },
      data: {
        ...data,
        version: { increment: 1 }
      }
    })

    await prisma.auditLog.create({
      data: {
        entity: "Experiment",
        entityId: experiment.id,
        action: "update",
        user: (req as any).user.id,
        changes: JSON.stringify(data)
      }
    })

    res.json(experiment)
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: { code: "VALIDATION_ERROR", message: (error as any).errors[0].message } })
    } else if (error.code === 'P2025') {
      res.status(404).json({ error: { code: "NOT_FOUND", message: "Experiment not found" } })
    } else {
      res.status(500).json({ error: { code: "SERVER_ERROR", message: "Failed to update experiment" } })
    }
  }
})

// PATCH /api/admin/experiments/:id/publish
router.patch("/:id/publish", async (req, res) => {
  try {
    const data = PublishSchema.parse(req.body)
    const updateData: any = { 
      publishStatus: data.publishStatus,
      version: { increment: 1 }
    }
    
    if (data.publishStatus === "published") {
      updateData.publishDate = new Date()
    }

    const experiment = await prisma.experiment.update({
      where: { id: req.params.id },
      data: updateData
    })

    await prisma.auditLog.create({
      data: {
        entity: "Experiment",
        entityId: experiment.id,
        action: data.publishStatus === "published" ? "publish" : data.publishStatus === "archived" ? "archive" : "unpublish",
        user: (req as any).user.id,
        changes: JSON.stringify(updateData)
      }
    })

    res.json(experiment)
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: { code: "VALIDATION_ERROR", message: (error as any).errors[0].message } })
    } else if (error.code === 'P2025') {
      res.status(404).json({ error: { code: "NOT_FOUND", message: "Experiment not found" } })
    } else {
      res.status(500).json({ error: { code: "SERVER_ERROR", message: "Failed to update publish status" } })
    }
  }
})

// DELETE /api/admin/experiments/:id
router.delete("/:id", async (req, res) => {
  try {
    const experiment = await prisma.experiment.delete({
      where: { id: req.params.id }
    })

    await prisma.auditLog.create({
      data: {
        entity: "Experiment",
        entityId: experiment.id,
        action: "delete",
        user: (req as any).user.id,
        changes: JSON.stringify({ id: experiment.id, title: experiment.title })
      }
    })

    res.json({ success: true })
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: { code: "NOT_FOUND", message: "Experiment not found" } })
    } else {
      res.status(500).json({ error: { code: "SERVER_ERROR", message: "Failed to delete experiment" } })
    }
  }
})

export default router
