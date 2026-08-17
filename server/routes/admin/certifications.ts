import { Router } from "express"

import { prisma } from "../../config/db.js"
export const adminCertificationsRouter = Router()

// GET all
adminCertificationsRouter.get("/", async (_req, res) => {
  try {
    const certs = await prisma.certification.findMany({
      orderBy: [
        { order: "asc" },
        { issueDate: "desc" }
      ]
    })
    res.json(certs)
  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } })
  }
})

// GET single
adminCertificationsRouter.get("/:id", async (req, res) => {
  try {
    const cert = await prisma.certification.findUnique({
      where: { id: req.params.id }
    })
    if (!cert) return res.status(404).json({ error: { message: "Certification not found" } })
    res.json(cert)
  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } })
  }
})

// CREATE
adminCertificationsRouter.post("/", async (req, res) => {
  try {
    const data = req.body

    if (data.publishStatus === "published") {
      data.publishDate = new Date()
    }

    const cert = await prisma.certification.create({ data })

    await prisma.auditLog.create({
      data: {
        entity: "Certification",
        entityId: cert.id,
        action: "create",
        user: (req as any).user?.id || "admin",
        changes: JSON.stringify(data)
      }
    })

    res.status(201).json(cert)
  } catch (error: any) {
    res.status(400).json({ error: { message: error.message } })
  }
})

// UPDATE
adminCertificationsRouter.put("/:id", async (req, res) => {
  try {
    const data = req.body
    
    if (data.publishStatus === "published") {
      const existing = await prisma.certification.findUnique({ where: { id: req.params.id } })
      if (existing?.publishStatus !== "published") {
        data.publishDate = new Date()
      }
    }
    
    data.version = { increment: 1 }

    const cert = await prisma.certification.update({
      where: { id: req.params.id },
      data
    })

    await prisma.auditLog.create({
      data: {
        entity: "Certification",
        entityId: cert.id,
        action: data.publishStatus === "published" ? "publish" : "update",
        user: (req as any).user?.id || "admin",
        changes: JSON.stringify(data)
      }
    })

    res.json(cert)
  } catch (error: any) {
    res.status(400).json({ error: { message: error.message } })
  }
})

// DELETE
adminCertificationsRouter.delete("/:id", async (req, res) => {
  try {
    await prisma.certification.delete({
      where: { id: req.params.id }
    })
    
    await prisma.auditLog.create({
      data: {
        entity: "Certification",
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
