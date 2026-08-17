import { Router } from "express"
import { z } from "zod"
import { prisma } from "../../config/db.js"
import { requireAdmin } from "../../middleware/auth.js"

const router = Router()
router.use(requireAdmin)

const SeoRouteSchema = z.object({
  path: z.string().min(1),
  title: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  keywords: z.string().nullable().optional(),
  ogImageId: z.string().nullable().optional(),
  noIndex: z.boolean().default(false),
  canonicalUrl: z.string().nullable().optional(),
  structuredData: z.string().nullable().optional(),
  publishStatus: z.string().default("draft"),
})

const BulkSeoUpdateSchema = z.object({
  entityType: z.enum(["Project", "Article", "Experience", "Skill", "Certification", "Profile"]),
  entityId: z.string(),
  seoConfig: z.string() // stringified JSON
})

// GET /api/admin/seo/routes
router.get("/routes", async (_req, res) => {
  try {
    const routes = await prisma.seoRoute.findMany({
      orderBy: { path: "asc" }
    })
    res.json(routes)
  } catch (error) {
    res.status(500).json({ error: { code: "SERVER_ERROR", message: "Failed to fetch SEO routes" } })
  }
})

// POST /api/admin/seo/routes
router.post("/routes", async (req, res) => {
  try {
    const data = SeoRouteSchema.parse(req.body)
    
    // Check if path already exists
    const existing = await prisma.seoRoute.findUnique({ where: { path: data.path } })
    if (existing) {
      return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "SEO configuration for this path already exists" } })
    }

    const route = await prisma.seoRoute.create({ data })
    
    await prisma.auditLog.create({
      data: {
        entity: "SeoRoute",
        entityId: route.id,
        action: "create",
        user: (req as any).user.id,
        changes: JSON.stringify(data)
      }
    })
    
    res.status(201).json(route)
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: { code: "VALIDATION_ERROR", message: (error as any).errors[0].message } })
    } else {
      res.status(500).json({ error: { code: "SERVER_ERROR", message: "Failed to create SEO route" } })
    }
  }
})

// PUT /api/admin/seo/routes/:id
router.put("/routes/:id", async (req, res) => {
  try {
    const { id } = req.params
    const data = SeoRouteSchema.parse(req.body)
    
    const existing = await prisma.seoRoute.findUnique({ where: { id } })
    if (!existing) {
      return res.status(404).json({ error: { code: "NOT_FOUND", message: "SEO route not found" } })
    }

    // Check path uniqueness
    if (data.path !== existing.path) {
      const pathConflict = await prisma.seoRoute.findUnique({ where: { path: data.path } })
      if (pathConflict) {
        return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Path already exists" } })
      }
    }

    const route = await prisma.seoRoute.update({
      where: { id },
      data: {
        ...data,
        version: { increment: 1 }
      }
    })

    await prisma.auditLog.create({
      data: {
        entity: "SeoRoute",
        entityId: route.id,
        action: "update",
        user: (req as any).user.id,
        changes: JSON.stringify(data)
      }
    })
    
    res.json(route)
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: { code: "VALIDATION_ERROR", message: (error as any).errors[0].message } })
    } else {
      res.status(500).json({ error: { code: "SERVER_ERROR", message: "Failed to update SEO route" } })
    }
  }
})

// DELETE /api/admin/seo/routes/:id
router.delete("/routes/:id", async (req, res) => {
  try {
    const { id } = req.params
    await prisma.seoRoute.delete({ where: { id } })
    await prisma.auditLog.create({
      data: {
        entity: "SeoRoute",
        entityId: id,
        action: "delete",
        user: (req as any).user.id,
        changes: "{}"
      }
    })
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: { code: "SERVER_ERROR", message: "Failed to delete SEO route" } })
  }
})

// POST /api/admin/seo/routes/:id/publish
router.post("/routes/:id/publish", async (req, res) => {
  try {
    const { id } = req.params
    const route = await prisma.seoRoute.update({
      where: { id },
      data: {
        publishStatus: "published",
        publishDate: new Date()
      }
    })
    await prisma.auditLog.create({
      data: {
        entity: "SeoRoute",
        entityId: id,
        action: "publish",
        user: (req as any).user.id,
        changes: JSON.stringify({ publishStatus: "published" })
      }
    })
    res.json(route)
  } catch (error) {
    res.status(500).json({ error: { code: "SERVER_ERROR", message: "Failed to publish SEO route" } })
  }
})

// Bulk update endpoint for entity SEO (to use in the SEO Studio)
router.post("/bulk-entity", async (req, res) => {
  try {
    const { entityType, entityId, seoConfig } = BulkSeoUpdateSchema.parse(req.body)
    
    let updated;
    switch (entityType) {
      case "Project":
        updated = await prisma.project.update({ where: { id: entityId }, data: { seoConfig } })
        break
      case "Article":
        updated = await prisma.article.update({ where: { id: entityId }, data: { seoConfig } })
        break
      case "Experience":
        updated = await prisma.experience.update({ where: { id: entityId }, data: { seoConfig } })
        break
      case "Skill":
        updated = await prisma.skill.update({ where: { id: entityId }, data: { seoConfig } })
        break
      case "Certification":
        updated = await prisma.certification.update({ where: { id: entityId }, data: { seoConfig } })
        break
      case "Profile":
        updated = await prisma.profile.update({ where: { id: entityId }, data: { seoConfig } })
        break
      default:
        return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Invalid entity type" } })
    }

    await prisma.auditLog.create({
      data: {
        entity: entityType,
        entityId: entityId,
        action: "update_seo",
        user: (req as any).user.id,
        changes: JSON.stringify({ seoConfig })
      }
    })
    
    res.json(updated)
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: { code: "VALIDATION_ERROR", message: (error as any).errors[0].message } })
    } else {
      res.status(500).json({ error: { code: "SERVER_ERROR", message: "Failed to update entity SEO" } })
    }
  }
})

// GET /api/admin/seo/missing
// Identifies all entities missing seoConfig to show in the Studio warnings
router.get("/missing", async (_req, res) => {
  try {
    const missing: { type: string, id: string, title: string }[] = []
    
    const projects = await prisma.project.findMany({ where: { seoConfig: null } })
    projects.forEach((p: any) => missing.push({ type: "Project", id: p.id, title: p.title }))
    
    const articles = await prisma.article.findMany({ where: { seoConfig: null } })
    articles.forEach((a: any) => missing.push({ type: "Article", id: a.id, title: a.title }))

    const profiles = await prisma.profile.findMany({ where: { seoConfig: null } })
    profiles.forEach((p: any) => missing.push({ type: "Profile", id: p.id, title: p.name }))

    res.json(missing)
  } catch (error) {
    res.status(500).json({ error: { code: "SERVER_ERROR", message: "Failed to fetch missing SEO configs" } })
  }
})

export default router
