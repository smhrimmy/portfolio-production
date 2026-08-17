import { Router } from "express"
import { prisma } from "../../config/db.js"

const router = Router()

// GET /api/public/navigation
router.get("/", async (_req, res) => {
  try {
    const items = await prisma.navigationItem.findMany({
      where: {
        publishStatus: "published",
        isActive: true
      },
      orderBy: [
        { location: 'asc' },
        { order: 'asc' }
      ]
    })

    res.json(items)
  } catch (error) {
    console.error("Failed to fetch published navigation items:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

export default router
