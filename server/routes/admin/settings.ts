import { Router } from "express"
import { prisma } from "../../config/db.js"
import { requireAdmin } from "../../middleware/auth.js"

const router = Router()

router.use(requireAdmin)

// GET /api/admin/settings
router.get("/", async (_req, res) => {
  try {
    let settings = await prisma.siteSettings.findFirst()
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          titleTemplate: "%s | Portfolio OS",
          description: "A sophisticated personal operating system.",
          resumeCtaText: "Download Resume",
          contactEmail: "",
          availability: "available",
          seoDefaults: "{}",
          features: "{}",
          publishStatus: "draft"
        }
      })
    }
    res.json(settings)
  } catch (error) {
    console.error("Failed to fetch settings:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// PUT /api/admin/settings
router.put("/", async (req, res) => {
  try {
    let settings = await prisma.siteSettings.findFirst()
    if (!settings) {
      return res.status(404).json({ error: "Settings not found" })
    }

    const updatedSettings = await prisma.siteSettings.update({
      where: { id: settings.id },
      data: {
        ...req.body,
        publishStatus: "draft",
        version: { increment: 1 }
      }
    })

    await prisma.auditLog.create({
      data: {
        action: "update",
        entity: "SiteSettings",
        entityId: updatedSettings.id,
        user: (req as any).user?.id || "admin",
        changes: JSON.stringify(req.body)
      }
    })

    res.json(updatedSettings)
  } catch (error) {
    console.error("Failed to update settings:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// POST /api/admin/settings/publish
router.post("/publish", async (req, res) => {
  try {
    const settings = await prisma.siteSettings.findFirst()
    if (!settings) {
      return res.status(404).json({ error: "Settings not found" })
    }

    const publishedSettings = await prisma.siteSettings.update({
      where: { id: settings.id },
      data: {
        publishStatus: "published",
        publishDate: new Date()
      }
    })

    await prisma.auditLog.create({
      data: {
        action: "publish",
        entity: "SiteSettings",
        entityId: publishedSettings.id,
        user: (req as any).user?.id || "admin",
        changes: JSON.stringify({ publishStatus: "published" })
      }
    })

    res.json(publishedSettings)
  } catch (error) {
    console.error("Failed to publish settings:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

export default router
