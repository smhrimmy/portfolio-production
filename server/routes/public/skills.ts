import { Router } from "express"

import { prisma } from "../../config/db.js"
export const publicSkillsRouter = Router()

publicSkillsRouter.get("/", async (_req, res) => {
  try {
    const skills = await prisma.skill.findMany({
      where: { publishStatus: "published" },
      orderBy: [
        { category: "asc" },
        { order: "asc" },
        { proficiency: "desc" }
      ]
    })
    res.json(skills)
  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } })
  }
})
