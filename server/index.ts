import express from "express"
import crypto from "crypto"
import cors from "cors"
import dotenv from "dotenv"
import { z } from "zod"
import { PortfolioIndexer } from "./services/PortfolioIndexer.js"
import { PortfolioRetrievalService } from "./services/PortfolioRetrievalService.js"
import { ProductionAIProvider } from "./services/ProductionAIProvider.js"
import { authRouter } from "./routes/auth.js"
import { requireAdmin } from "./middleware/auth.js"
import { adminProjectsRouter } from "./routes/admin/projects.js"
import { adminProfileRouter } from "./routes/admin/profile.js"
import { adminAiRouter } from "./routes/admin/ai.js"
import { adminMediaRouter } from "./routes/admin/media.js"
import { adminExperienceRouter } from "./routes/admin/experience.js"
import { adminArticlesRouter } from "./routes/admin/articles.js"
import { adminSkillsRouter } from "./routes/admin/skills.js"
import { adminCertificationsRouter } from "./routes/admin/certifications.js"
import adminNavigationRouter from "./routes/admin/navigation.js"
import adminSettingsRouter from "./routes/admin/settings.js"
import adminSeoRouter from "./routes/admin/seo.js"
import adminGithubRouter from "./routes/admin/github.js"
import adminExperimentsRouter from "./routes/admin/experiments.js"
import adminAnalyticsRouter from "./routes/admin/analytics.js"
import { publicArticlesRouter } from "./routes/public/articles.js"
import { publicSkillsRouter } from "./routes/public/skills.js"
import { publicCertificationsRouter } from "./routes/public/certifications.js"
import publicNavigationRouter from "./routes/public/navigation.js"
import publicSettingsRouter from "./routes/public/settings.js"
import publicSeoRouter from "./routes/public/seo.js"
import publicGithubRouter from "./routes/public/github.js"
import publicExperimentsRouter from "./routes/public/experiments.js"
import publicAnalyticsRouter from "./routes/public/analytics.js"
import { publicProfileRouter } from "./routes/public/profile.js"
import { publicProjectsRouter } from "./routes/public/projects.js"
import { publicExperienceRouter } from "./routes/public/experience.js"
import { publicMediaRouter } from "./routes/public/media.js"
import { adminThemeRouter } from "./routes/admin/theme.js"
import { publicThemeRouter } from "./routes/public/theme.js"
import { prisma } from "./config/db.js"

dotenv.config()

const app = express()
app.use(cors({
  origin: function (_origin, callback) {
    callback(null, true)
  },
  credentials: true
}))
app.use(express.json())

const port = Number(process.env.PORT ?? 3001)
const host = "0.0.0.0"

const rateLimitMap = new Map<string, { count: number, resetTime: number }>()

function rateLimiter(req: express.Request, res: express.Response, next: express.NextFunction) {
  const ip = req.ip || req.connection.remoteAddress || "unknown"
  const now = Date.now()
  const windowMs = 60 * 1000
  const maxRequests = 10

  let record = rateLimitMap.get(ip)

  if (!record || now > record.resetTime) {
    record = { count: 1, resetTime: now + windowMs }
    rateLimitMap.set(ip, record)
  } else {
    record.count++
  }

  if (record.count > maxRequests) {
    return res.status(429).json({
      error: {
        code: "RATE_LIMITED",
        message: "Too many requests. Please try again later."
      }
    })
  }

  next()
}

const AskRequestSchema = z.object({
  query: z.string().min(1).max(500),
  context: z.object({
    pageType: z.string().optional(),
    slug: z.string().optional(),
  }).optional()
})

const indexer = new PortfolioIndexer()
const retrievalService = new PortfolioRetrievalService(indexer)
const aiProvider = new ProductionAIProvider()
let indexReady: Promise<void> | null = null

function ensureIndexLoaded() {
  if (!indexReady) {
    indexReady = indexer.loadIndex().catch((err: Error) => {
      indexReady = null
      console.error("Failed to load search index:", err.message)
    })
  }
  return indexReady
}

ensureIndexLoaded()

app.use("/api/auth", authRouter)

app.use("/sitemap.xml", (req, res, next) => { req.url = "/sitemap.xml"; publicSeoRouter(req, res, next) })
app.use("/robots.txt", (req, res, next) => { req.url = "/robots.txt"; publicSeoRouter(req, res, next) })

app.use("/api/public/profile", publicProfileRouter)
app.use("/api/public/projects", publicProjectsRouter)
app.use("/api/public/experience", publicExperienceRouter)
app.use("/api/public/media", publicMediaRouter)
app.use("/api/public/articles", publicArticlesRouter)
app.use("/api/public/skills", publicSkillsRouter)
app.use("/api/public/certifications", publicCertificationsRouter)
app.use("/api/public/navigation", publicNavigationRouter)
app.use("/api/public/settings", publicSettingsRouter)
app.use("/api/public/seo", publicSeoRouter)
app.use("/api/public/github", publicGithubRouter)
app.use("/api/public/experiments", publicExperimentsRouter)
app.use("/api/public/analytics", publicAnalyticsRouter)
app.use("/api/public/theme", publicThemeRouter)

const adminRouter = express.Router()
adminRouter.use(requireAdmin)

adminRouter.get("/health", (req, res) => {
  res.json({ status: "admin-ok", user: (req as any).user })
})

adminRouter.use("/profile", adminProfileRouter)
adminRouter.use("/projects", adminProjectsRouter)
adminRouter.use("/ai", adminAiRouter)
adminRouter.use("/media", adminMediaRouter)
adminRouter.use("/experience", adminExperienceRouter)
adminRouter.use("/articles", adminArticlesRouter)
adminRouter.use("/skills", adminSkillsRouter)
adminRouter.use("/certifications", adminCertificationsRouter)
adminRouter.use("/navigation", adminNavigationRouter)
adminRouter.use("/settings", adminSettingsRouter)
adminRouter.use("/seo", adminSeoRouter)
adminRouter.use("/github", adminGithubRouter)
adminRouter.use("/experiments", adminExperimentsRouter)
adminRouter.use("/analytics", adminAnalyticsRouter)
adminRouter.use("/theme", adminThemeRouter)

app.use("/api/admin", adminRouter)

async function healthHandler(_req: express.Request, res: express.Response) {
  let database: "ok" | "error" | "unconfigured" = "unconfigured"
  if (process.env.DATABASE_URL) {
    try {
      await prisma.$queryRaw`SELECT 1`
      database = "ok"
    } catch (error) {
      console.error("Database health check failed:", error)
      database = "error"
    }
  }

  const status = database === "error" ? 503 : 200
  res.status(status).json({
    status: database === "error" ? "degraded" : "ok",
    runtime: process.env.VERCEL ? "vercel" : "local",
    database,
    ai: aiProvider.isLiveMode() ? "live" : "offline",
  })
}

app.get("/health", healthHandler)
app.get("/api/health", healthHandler)

app.post("/api/ai/ask", rateLimiter, async (req, res) => {
  const requestId = crypto.randomUUID()
  console.log(`[${requestId}] AI Request Started`)

  try {
    await ensureIndexLoaded()
    const parseResult = AskRequestSchema.safeParse(req.body)
    if (!parseResult.success) {
      console.warn(`[${requestId}] Invalid request schema`)
      return res.status(400).json({ error: { code: "INVALID_REQUEST", message: parseResult.error.message } })
    }

    const { query } = parseResult.data
    const retrievedContext = await retrievalService.retrieve(query)
    console.log(`[${requestId}] Retrieved ${retrievedContext.documents.length} context documents (mode: ${aiProvider.isLiveMode() ? "live" : "offline"})`)

    if (retrievedContext.documents.length === 0) {
      console.log(`[${requestId}] Empty search result fallback`)
      res.setHeader("Content-Type", "text/event-stream")
      res.setHeader("Cache-Control", "no-cache")
      res.setHeader("Connection", "keep-alive")
      res.write(`data: ${JSON.stringify({ chunk: "I don't have verified portfolio information that answers that question." })}\n\n`)
      res.write(`data: [DONE]\n\n`)
      return res.end()
    }

    res.setHeader("Content-Type", "text/event-stream")
    res.setHeader("Cache-Control", "no-cache")
    res.setHeader("Connection", "keep-alive")

    const abortController = new AbortController()
    req.on("close", () => {
      console.log(`[${requestId}] Client disconnected. Aborting AI generation.`)
      abortController.abort()
    })

    const responseStream = aiProvider.stream(query, retrievedContext.documents, { signal: abortController.signal })

    for await (const chunk of responseStream) {
      if (chunk.sources) {
        res.write(`data: ${JSON.stringify({ sources: chunk.sources })}\n\n`)
      }
      if (chunk.text) {
        res.write(`data: ${JSON.stringify({ chunk: chunk.text })}\n\n`)
      }
    }

    console.log(`[${requestId}] AI Response Complete`)
    res.write(`data: [DONE]\n\n`)
    res.end()
  } catch (error: any) {
    if (error.name === "AbortError") {
      console.log(`[${requestId}] Stream aborted`)
      return
    }
    console.error(`[${requestId}] AI Route Error:`, error)
    if (!res.headersSent) {
      res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred." } })
    }
  }
})

const isVercel = process.env.VERCEL === "1"
if (!isVercel && (process.env.NODE_ENV !== "production" || process.env.RUN_LOCAL === "true")) {
  app.listen(port, host, () => {
    console.log(`Portfolio API listening on ${host}:${port}`)
  })
}

export default app
