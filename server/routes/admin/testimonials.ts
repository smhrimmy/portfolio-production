import { Router } from "express"
import { prisma } from "../../config/db.js"
import { logAudit } from "./audit.js"

export const adminTestimonialsRouter = Router()

// GET all testimonials
adminTestimonialsRouter.get("/", async (_req, res) => {
  try {
    const items = await prisma.testimonial.findMany({
      orderBy: { order: "asc" }
    })
    res.json(items)
  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } })
  }
})

// CREATE testimonial
adminTestimonialsRouter.post("/", async (req, res) => {
  try {
    const data = req.body
    
    if (data.publishStatus === "published" && !data.publishDate) {
      data.publishDate = new Date()
    } else if (data.publishDate) {
      data.publishDate = new Date(data.publishDate)
    }

    const item = await prisma.testimonial.create({ data })

    await logAudit(
      "Testimonial", 
      item.id, 
      "create", 
      (req as any).user?.id || "admin", 
      data
    )

    res.status(201).json(item)
  } catch (error: any) {
    res.status(400).json({ error: { message: error.message } })
  }
})

// UPDATE testimonial
adminTestimonialsRouter.put("/:id", async (req, res) => {
  try {
    const data = req.body

    if (data.publishStatus === "published") {
      const existing = await prisma.testimonial.findUnique({ where: { id: req.params.id } })
      if (existing?.publishStatus !== "published" && !data.publishDate) {
        data.publishDate = new Date()
      } else if (data.publishDate) {
        data.publishDate = new Date(data.publishDate)
      }
    } else if (data.publishDate) {
      data.publishDate = new Date(data.publishDate)
    }

    data.version = { increment: 1 }

    const item = await prisma.testimonial.update({
      where: { id: req.params.id },
      data
    })

    await logAudit(
      "Testimonial", 
      item.id, 
      data.publishStatus === "published" ? "publish" : "update", 
      (req as any).user?.id || "admin", 
      data
    )

    res.json(item)
  } catch (error: any) {
    res.status(400).json({ error: { message: error.message } })
  }
})

// DELETE testimonial
adminTestimonialsRouter.delete("/:id", async (req, res) => {
  try {
    await prisma.testimonial.delete({
      where: { id: req.params.id }
    })
    
    await logAudit(
      "Testimonial", 
      req.params.id, 
      "delete", 
      (req as any).user?.id || "admin", 
      {}
    )

    res.status(204).send()
  } catch (error: any) {
    res.status(400).json({ error: { message: error.message } })
  }
})
