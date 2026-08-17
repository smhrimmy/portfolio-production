import { Router } from "express"
import { prisma } from "../../config/db.js"

const router = Router()

// Get singleton settings
router.get("/", async (_req, res) => {
  try {
    const settings = await prisma.siteSettings.findFirst({
      where: {
        publishStatus: "published"
      }
    })

    if (!settings) {
      return res.status(404).json({ error: "Settings not found or not published" })
    }

    res.json(settings)
  } catch (error) {
    console.error("Failed to fetch published settings:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

export default router
