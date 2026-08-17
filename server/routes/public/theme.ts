import express from "express"
import { prisma } from "../../config/db.js"

const publicThemeRouter = express.Router()

publicThemeRouter.get("/", async (_req, res) => {
  try {
    const theme = await prisma.themeConfig.findFirst()
    if (theme) {
      res.json(theme)
    } else {
      // Return default
      res.json({
        preset: "premium-editorial",
        primaryColor: null,
        bgColor: null,
        fontFamily: null,
        borderRadius: null,
      })
    }
  } catch (error) {
    console.error("Failed to fetch public theme config:", error)
    res.status(500).json({ error: { message: "Internal server error" } })
  }
})

export { publicThemeRouter }
