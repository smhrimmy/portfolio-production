import { Router } from "express"
import { prisma } from "../../config/db.js"
import { requireAdmin } from "../../middleware/auth.js"

const router = Router()

router.use(requireAdmin)

// GET /api/admin/profile
router.get("/", async (_req, res) => {
  try {
    let profile = await prisma.profile.findFirst()
    if (!profile) {
      // Create an empty draft if none exists
      profile = await prisma.profile.create({
        data: {
          name: "",
          role: "",
          tagline: "",
          about: "",
          location: "",
          email: "",
          publishStatus: "draft"
        }
      })
    }
    res.json(profile)
  } catch (error) {
    console.error("Failed to fetch profile:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// PUT /api/admin/profile
router.put("/", async (req, res) => {
  try {
    let profile = await prisma.profile.findFirst()
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" })
    }

    const updatedProfile = await prisma.profile.update({
      where: { id: profile.id },
      data: {
        ...req.body,
        publishStatus: "draft",
        version: { increment: 1 }
      }
    })

    await prisma.auditLog.create({
      data: {
        action: "update",
        entity: "Profile",
        entityId: updatedProfile.id,
        user: (req as any).user?.id || "admin",
        changes: JSON.stringify(req.body)
      }
    })

    res.json(updatedProfile)
  } catch (error) {
    console.error("Failed to update profile:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// POST /api/admin/profile/publish
router.post("/publish", async (req, res) => {
  try {
    const profile = await prisma.profile.findFirst()
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" })
    }

    const publishedProfile = await prisma.profile.update({
      where: { id: profile.id },
      data: {
        publishStatus: "published",
        publishDate: new Date()
      }
    })

    await prisma.auditLog.create({
      data: {
        action: "publish",
        entity: "Profile",
        entityId: publishedProfile.id,
        user: (req as any).user?.id || "admin",
        changes: JSON.stringify({ publishStatus: "published" })
      }
    })

    // Optionally rebuild index if profile is part of search index
    
    res.json(publishedProfile)
  } catch (error) {
    console.error("Failed to publish profile:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

export { router as adminProfileRouter }
