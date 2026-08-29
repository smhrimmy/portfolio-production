import { Router } from "express"
import { prisma } from "../../config/db.js"
import { z } from "zod"

export const adminSitesRouter = Router()

const SiteSchema = z.object({
  name: z.string().min(1),
  domain: z.string().min(1),
  isActive: z.boolean().default(true),
})

// Get all sites
adminSitesRouter.get("/", async (_req, res) => {
  try {
    const sites = await prisma.site.findMany({
      orderBy: { createdAt: "asc" }
    })
    res.json(sites)
  } catch (error) {
    console.error("Failed to fetch sites:", error)
    res.status(500).json({ error: "Failed to fetch sites" })
  }
})

// Create site
adminSitesRouter.post("/", async (req, res) => {
  try {
    const data = SiteSchema.parse(req.body)
    const site = await prisma.site.create({ data })
    res.status(201).json(site)
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: "Domain must be unique" })
    }
    console.error("Failed to create site:", error)
    res.status(500).json({ error: "Failed to create site" })
  }
})

// Update site
adminSitesRouter.put("/:id", async (req, res) => {
  try {
    const data = SiteSchema.parse(req.body)
    const site = await prisma.site.update({
      where: { id: req.params.id },
      data
    })
    res.json(site)
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: "Domain must be unique" })
    }
    console.error("Failed to update site:", error)
    res.status(500).json({ error: "Failed to update site" })
  }
})

// Delete site
adminSitesRouter.delete("/:id", async (req, res) => {
  try {
    await prisma.site.delete({
      where: { id: req.params.id }
    })
    res.status(204).send()
  } catch (error) {
    console.error("Failed to delete site:", error)
    res.status(500).json({ error: "Failed to delete site" })
  }
})
