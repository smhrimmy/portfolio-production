import { Router } from "express"
import { GoogleGenAI } from "@google/genai"
import { z } from "zod"

export const adminAiRouter = Router()

let gemini: GoogleGenAI | null = null

function getClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured")
  }
  if (!gemini) {
    gemini = new GoogleGenAI({ apiKey })
  }
  return gemini
}

// Basic rate limiting for AI studio endpoints
const aiRateLimitMap = new Map<string, { count: number, resetTime: number }>()

function aiRateLimiter(req: any, res: any, next: any) {
  const ip = req.ip || "unknown"
  const now = Date.now()
  const windowMs = 60 * 1000 * 5 // 5 minutes
  const maxRequests = 20 // 20 generations per 5 minutes per IP

  let record = aiRateLimitMap.get(ip)
  if (!record || now > record.resetTime) {
    record = { count: 1, resetTime: now + windowMs }
    aiRateLimitMap.set(ip, record)
  } else {
    record.count++
  }

  if (record.count > maxRequests) {
    return res.status(429).json({ error: { message: "AI rate limit exceeded. Please wait." } })
  }
  next()
}

adminAiRouter.use(aiRateLimiter)

const ArticleGenSchema = z.object({
  topic: z.string().min(3).max(200)
})

adminAiRouter.post("/generate-article", async (req, res) => {
  try {
    const { topic } = ArticleGenSchema.parse(req.body)
    const ai = getClient()

    const prompt = `You are an expert technical writer. Write an article draft on the topic: "${topic}".
Output valid JSON only with the following structure:
{
  "title": "String",
  "slug": "String (URL friendly)",
  "excerpt": "String (1-2 sentences)",
  "content": "String (Markdown formatted content with headers and code blocks if applicable)",
  "tags": ["String", "String"]
}`

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    })

    const resultText = response.text || "{}"
    res.json(JSON.parse(resultText))
  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } })
  }
})

const SeoSchema = z.object({
  content: z.string().min(10).max(10000)
})

adminAiRouter.post("/seo-assistant", async (req, res) => {
  try {
    const { content } = SeoSchema.parse(req.body)
    const ai = getClient()

    const prompt = `You are an SEO expert. Analyze the following content and suggest SEO metadata.
Output valid JSON only with the following structure:
{
  "title": "String (Optimal SEO title)",
  "description": "String (Optimal meta description)",
  "keywords": ["String"],
  "ogDescription": "String (Open graph description)"
}

Content:
${content.substring(0, 5000)}`

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    })

    const resultText = response.text || "{}"
    res.json(JSON.parse(resultText))
  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } })
  }
})

const ImproveSchema = z.object({
  text: z.string().min(1).max(5000),
  action: z.enum(["rewrite", "expand", "simplify", "proofread"])
})

adminAiRouter.post("/improve-content", async (req, res) => {
  try {
    const { text, action } = ImproveSchema.parse(req.body)
    const ai = getClient()

    const prompt = `You are a professional editor. Please ${action} the following text. 
Return only the improved text, without quotes or additional commentary.

Text:
${text}`

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    })

    res.json({ result: response.text })
  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } })
  }
})
