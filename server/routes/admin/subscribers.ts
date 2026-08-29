import { Router } from "express"
import { prisma } from "../../config/db.js"

export const adminSubscribersRouter = Router()

// GET all subscribers
adminSubscribersRouter.get("/", async (_req, res) => {
  try {
    const items = await prisma.subscriber.findMany({
      orderBy: { subscribedAt: "desc" }
    })
    res.json(items)
  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } })
  }
})

// DELETE subscriber
adminSubscribersRouter.delete("/:id", async (req, res) => {
  try {
    await prisma.subscriber.delete({
      where: { id: req.params.id }
    })
    res.status(204).send()
  } catch (error: any) {
    res.status(400).json({ error: { message: error.message } })
  }
})
