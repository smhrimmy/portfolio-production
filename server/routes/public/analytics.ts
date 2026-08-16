import { Router } from "express"
import { z } from "zod"
import { prisma } from "../../config/db.js"
import { rateLimit } from "express-rate-limit"

const router = Router()

// Rate limit: 50 requests per 15 minutes per IP
const analyticsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { error: { code: "TOO_MANY_REQUESTS", message: "Too many analytics events sent from this IP" } }
})

const EventSchema = z.object({
  eventType: z.string().min(1).max(100),
  path: z.string().min(1).max(500),
  referrer: z.string().nullable().optional(),
  device: z.string().nullable().optional(),
  browser: z.string().nullable().optional(),
  entityType: z.string().nullable().optional(),
  entityId: z.string().nullable().optional(),
})

// POST /api/public/analytics
router.post("/", analyticsLimiter, async (req, res) => {
  try {
    const data = EventSchema.parse(req.body)
    
    await prisma.analyticsEvent.create({
      data: {
        eventType: data.eventType,
        path: data.path,
        referrer: data.referrer,
        device: data.device,
        browser: data.browser,
        entityType: data.entityType,
        entityId: data.entityId,
      }
    })

    res.status(201).json({ success: true })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Invalid event data" } })
    } else {
      console.error("[Analytics API Error]:", error)
      res.status(500).json({ error: { code: "SERVER_ERROR", message: "Failed to record event" } })
    }
  }
})

export default router
