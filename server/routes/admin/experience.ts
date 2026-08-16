import { Router } from "express"

import { prisma } from "../../config/db.js"
export const adminExperienceRouter = Router()

// GET all experiences
adminExperienceRouter.get("/", async (_req, res) => {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: [
        { isCurrent: "desc" },
        { order: "asc" },
        { startDate: "desc" }
      ]
    })
    res.json(experiences)
  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } })
  }
})

// GET single experience
adminExperienceRouter.get("/:id", async (req, res) => {
  try {
    const experience = await prisma.experience.findUnique({
      where: { id: req.params.id }
    })
    if (!experience) return res.status(404).json({ error: { message: "Experience not found" } })
    res.json(experience)
  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } })
  }
})

// CREATE experience
adminExperienceRouter.post("/", async (req, res) => {
  try {
    const data = req.body
    if (data.publishStatus === "published") {
      data.publishDate = new Date()
    }

    const experience = await prisma.experience.create({ data })

    // Log the creation
    await prisma.auditLog.create({
      data: {
        entity: "Experience",
        entityId: experience.id,
        action: "create",
        user: (req as any).user?.id || "admin",
        changes: JSON.stringify(data)
      }
    })

    res.status(201).json(experience)
  } catch (error: any) {
    res.status(400).json({ error: { message: error.message } })
  }
})

// UPDATE experience
adminExperienceRouter.put("/:id", async (req, res) => {
  try {
    const data = req.body
    
    // Auto-set publishDate if transitioning to published
    if (data.publishStatus === "published") {
      const existing = await prisma.experience.findUnique({ where: { id: req.params.id } })
      if (existing?.publishStatus !== "published") {
        data.publishDate = new Date()
      }
    }
    
    // Increment version
    data.version = { increment: 1 }

    const experience = await prisma.experience.update({
      where: { id: req.params.id },
      data
    })

    // Log the update
    await prisma.auditLog.create({
      data: {
        entity: "Experience",
        entityId: experience.id,
        action: data.publishStatus === "published" ? "publish" : "update",
        user: (req as any).user?.id || "admin",
        changes: JSON.stringify(data)
      }
    })

    res.json(experience)
  } catch (error: any) {
    res.status(400).json({ error: { message: error.message } })
  }
})

// DELETE experience
adminExperienceRouter.delete("/:id", async (req, res) => {
  try {
    await prisma.experience.delete({
      where: { id: req.params.id }
    })
    
    // Log the deletion
    await prisma.auditLog.create({
      data: {
        entity: "Experience",
        entityId: req.params.id,
        action: "delete",
        user: (req as any).user?.id || "admin",
        changes: "{}"
      }
    })
    res.status(204).send()
  } catch (error: any) {
    res.status(400).json({ error: { message: error.message } })
  }
})
