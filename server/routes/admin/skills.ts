import { Router } from "express"

import { prisma } from "../../config/db.js"
export const adminSkillsRouter = Router()

// GET all skills
adminSkillsRouter.get("/", async (_req, res) => {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: [
        { category: "asc" },
        { order: "asc" },
        { proficiency: "desc" }
      ]
    })
    res.json(skills)
  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } })
  }
})

// GET single skill
adminSkillsRouter.get("/:id", async (req, res) => {
  try {
    const skill = await prisma.skill.findUnique({
      where: { id: req.params.id }
    })
    if (!skill) return res.status(404).json({ error: { message: "Skill not found" } })
    res.json(skill)
  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } })
  }
})

// CREATE skill
adminSkillsRouter.post("/", async (req, res) => {
  try {
    const data = req.body

    // Check name uniqueness
    const existing = await prisma.skill.findUnique({ where: { name: data.name } })
    if (existing) {
      return res.status(400).json({ error: { message: "A skill with this name already exists" } })
    }

    if (data.publishStatus === "published") {
      data.publishDate = new Date()
    }

    const skill = await prisma.skill.create({ data })

    // Log the creation
    await prisma.auditLog.create({
      data: {
        entity: "Skill",
        entityId: skill.id,
        action: "create",
        user: (req as any).user?.id || "admin",
        changes: JSON.stringify(data)
      }
    })

    res.status(201).json(skill)
  } catch (error: any) {
    res.status(400).json({ error: { message: error.message } })
  }
})

// UPDATE skill
adminSkillsRouter.put("/:id", async (req, res) => {
  try {
    const data = req.body
    
    // Check name uniqueness if name is being updated
    if (data.name) {
      const existing = await prisma.skill.findFirst({
        where: { name: data.name, NOT: { id: req.params.id } }
      })
      if (existing) {
        return res.status(400).json({ error: { message: "A skill with this name already exists" } })
      }
    }
    
    // Auto-set publishDate if transitioning to published
    if (data.publishStatus === "published") {
      const existing = await prisma.skill.findUnique({ where: { id: req.params.id } })
      if (existing?.publishStatus !== "published") {
        data.publishDate = new Date()
      }
    }
    
    // Increment version
    data.version = { increment: 1 }

    const skill = await prisma.skill.update({
      where: { id: req.params.id },
      data
    })

    // Log the update
    await prisma.auditLog.create({
      data: {
        entity: "Skill",
        entityId: skill.id,
        action: data.publishStatus === "published" ? "publish" : "update",
        user: (req as any).user?.id || "admin",
        changes: JSON.stringify(data)
      }
    })

    res.json(skill)
  } catch (error: any) {
    res.status(400).json({ error: { message: error.message } })
  }
})

// DELETE skill
adminSkillsRouter.delete("/:id", async (req, res) => {
  try {
    await prisma.skill.delete({
      where: { id: req.params.id }
    })
    
    // Log the deletion
    await prisma.auditLog.create({
      data: {
        entity: "Skill",
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
