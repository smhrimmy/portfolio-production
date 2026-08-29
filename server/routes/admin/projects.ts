import { Router } from "express"

import { prisma } from "../../config/db.js"
export const adminProjectsRouter = Router()

// GET all projects
adminProjectsRouter.get("/", async (_req, res) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      include: { skills: true }
    })
    res.json(projects)
  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } })
  }
})

// GET single project
adminProjectsRouter.get("/:id", async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: { skills: true }
    })
    if (!project) return res.status(404).json({ error: { message: "Project not found" } })
    res.json(project)
  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } })
  }
})

// CREATE project
adminProjectsRouter.post("/", async (req, res) => {
  try {
    const data = req.body
    if (data.publishStatus === "published" && !data.publishDate) {
      data.publishDate = new Date()
    } else if (data.publishDate) {
      data.publishDate = new Date(data.publishDate)
    }
    
    let skillsConnect = undefined;
    if (data.skills && Array.isArray(data.skills)) {
      skillsConnect = { connect: data.skills.map((id: string) => ({ id })) }
      delete data.skills
    }

    const project = await prisma.project.create({ 
      data: {
        ...data,
        ...(skillsConnect ? { skills: skillsConnect } : {})
      }
    })

    // Log the creation
    await prisma.auditLog.create({
      data: {
        entity: "Project",
        entityId: project.id,
        action: "create",
        user: (req as any).user?.id || "admin",
        changes: JSON.stringify(data)
      }
    })

    res.status(201).json(project)
  } catch (error: any) {
    res.status(400).json({ error: { message: error.message } })
  }
})

// UPDATE project
adminProjectsRouter.put("/:id", async (req, res) => {
  try {
    const data = req.body
    
    // Auto-set publishDate if transitioning to published
    if (data.publishStatus === "published") {
      const existing = await prisma.project.findUnique({ where: { id: req.params.id } })
      if (existing?.publishStatus !== "published" && !data.publishDate) {
        data.publishDate = new Date()
      } else if (data.publishDate) {
        data.publishDate = new Date(data.publishDate)
      }
    } else if (data.publishDate) {
      data.publishDate = new Date(data.publishDate)
    }
    
    // Increment version
    data.version = { increment: 1 }

    let skillsUpdate = undefined;
    if (data.skills && Array.isArray(data.skills)) {
      skillsUpdate = { set: data.skills.map((id: string) => ({ id })) }
      delete data.skills
    }

    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: {
        ...data,
        ...(skillsUpdate ? { skills: skillsUpdate } : {})
      }
    })

    // Log the update
    await prisma.auditLog.create({
      data: {
        entity: "Project",
        entityId: project.id,
        action: data.publishStatus === "published" ? "publish" : "update",
        user: (req as any).user?.id || "admin",
        changes: JSON.stringify(data)
      }
    })

    res.json(project)
  } catch (error: any) {
    res.status(400).json({ error: { message: error.message } })
  }
})

// DELETE project
adminProjectsRouter.delete("/:id", async (req, res) => {
  try {
    await prisma.project.delete({
      where: { id: req.params.id }
    })
    
    // Log the deletion
    await prisma.auditLog.create({
      data: {
        entity: "Project",
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
