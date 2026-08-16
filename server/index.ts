import express from "express"
import crypto from "crypto"
import cors from "cors"
import dotenv from "dotenv"
import { z } from "zod"
import { PortfolioIndexer } from "./services/PortfolioIndexer.js"
import { PortfolioRetrievalService } from "./services/PortfolioRetrievalService.js"
import { ProductionAIProvider } from "./services/ProductionAIProvider.js"

dotenv.config()

const app = express()
app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",
}))
app.use(express.json())

const port = Number(process.env.PORT ?? 3001)
const host = "0.0.0.0"

// Simple in-memory rate limiting map: IP -> { count, resetTime }
const rateLimitMap = new Map<string, { count: number, resetTime: number }>()

function rateLimiter(req: express.Request, res: express.Response, next: express.NextFunction) {
  const ip = req.ip || req.connection.remoteAddress || "unknown"
  const now = Date.now()
  const windowMs = 60 * 1000 // 1 minute
  const maxRequests = 10 // 10 per minute per IP

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

// Request validation schema
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

// Initialize index on startup
indexer.loadIndex().catch((err: any) => {
  console.error("Failed to load index on startup:", err.message)
  process.exit(1) // Fail fast if index is missing/corrupted
})

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    ai: aiProvider.isLiveMode() ? "live" : "offline",
  })
})

app.post("/api/ai/ask", rateLimiter, async (req, res) => {
  const requestId = crypto.randomUUID()
  console.log(`[${requestId}] AI Request Started`)

  try {
    const parseResult = AskRequestSchema.safeParse(req.body)
    if (!parseResult.success) {
      console.warn(`[${requestId}] Invalid request schema`)
      return res.status(400).json({ error: { code: "INVALID_REQUEST", message: parseResult.error.message } })
    }

    const { query, context: _pageContext } = parseResult.data

    const retrievedContext = await retrievalService.retrieve(query)
    console.log(`[${requestId}] Retrieved ${retrievedContext.documents.length} context documents (mode: ${aiProvider.isLiveMode() ? "live" : "offline"})`)

    if (retrievedContext.documents.length === 0) {
      console.log(`[${requestId}] Empty search result fallback`)
      res.setHeader('Content-Type', 'text/event-stream')
      res.setHeader('Cache-Control', 'no-cache')
      res.setHeader('Connection', 'keep-alive')
      res.write(`data: ${JSON.stringify({ chunk: "I don't have verified portfolio information that answers that question." })}\n\n`)
      res.write(`data: [DONE]\n\n`)
      return res.end()
    }

    // Set up SSE for streaming
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

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

app.listen(port, host, () => {
  console.log(`Portfolio API listening on ${host}:${port}`)
})
