import express from "express"
import { prisma } from "../../config/db.js"
import { z } from "zod"

const adminThemeRouter = express.Router()

const ThemeSchema = z.object({
  preset: z.string(),
  primaryColor: z.string().nullable().optional(),
  bgColor: z.string().nullable().optional(),
  fontFamily: z.string().nullable().optional(),
  borderRadius: z.string().nullable().optional(),
})

adminThemeRouter.get("/", async (_req, res) => {
  try {
    let theme = await prisma.themeConfig.findFirst()
    if (!theme) {
      theme = await prisma.themeConfig.create({
        data: {
          preset: "premium-editorial"
        }
      })
    }
    res.json(theme)
  } catch (error) {
    console.error("Failed to fetch theme config:", error)
    res.status(500).json({ error: { message: "Internal server error" } })
  }
})

adminThemeRouter.put("/", async (req, res) => {
  try {
    const parseResult = ThemeSchema.safeParse(req.body)
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error })
    }

    let theme = await prisma.themeConfig.findFirst()
    if (theme) {
      theme = await prisma.themeConfig.update({
        where: { id: theme.id },
        data: parseResult.data
      })
    } else {
      theme = await prisma.themeConfig.create({
        data: parseResult.data
      })
    }

    res.json(theme)
  } catch (error) {
    console.error("Failed to update theme config:", error)
    res.status(500).json({ error: { message: "Internal server error" } })
  }
})

export { adminThemeRouter }
