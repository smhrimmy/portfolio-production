import { Router } from "express"
import { prisma } from "../../config/db.js"

export const publicProfileRouter = Router()

// GET /api/profile
publicProfileRouter.get("/", async (_req, res) => {
  try {
    const profile = await prisma.profile.findFirst({
      where: { publishStatus: "published" }
    })
    
    if (!profile) {
      return res.status(404).json({ error: { message: "Profile not found" } })
    }
    
    res.json(profile)
  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } })
  }
})
