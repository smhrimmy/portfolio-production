import { Router } from "express"
import { prisma } from "../../config/db.js"

export const publicNewsletterRouter = Router()

// POST subscribe
publicNewsletterRouter.post("/subscribe", async (req, res) => {
  try {
    const { email } = req.body
    
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: { message: "Invalid email address" } })
    }

    const existing = await prisma.subscriber.findUnique({
      where: { email }
    })

    if (existing) {
      if (!existing.isActive) {
        await prisma.subscriber.update({
          where: { email },
          data: { isActive: true }
        })
        return res.json({ message: "Resubscribed successfully!" })
      }
      return res.status(400).json({ error: { message: "Already subscribed" } })
    }

    await prisma.subscriber.create({
      data: { email }
    })

    res.status(201).json({ message: "Subscribed successfully!" })
  } catch (error: any) {
    res.status(500).json({ error: { message: "Internal server error" } })
  }
})
