import { Router } from "express"

import { prisma } from "../../config/db.js"
export const publicCertificationsRouter = Router()

publicCertificationsRouter.get("/", async (_req, res) => {
  try {
    const certs = await prisma.certification.findMany({
      where: { publishStatus: "published" },
      orderBy: [
        { order: "asc" },
        { issueDate: "desc" }
      ]
    })
    res.json(certs)
  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } })
  }
})
