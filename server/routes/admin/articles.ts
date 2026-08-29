import { Router } from "express"

import { prisma } from "../../config/db.js"
export const adminArticlesRouter = Router()

// GET all articles
adminArticlesRouter.get("/", async (_req, res) => {
  try {
    const articles = await prisma.article.findMany({
      orderBy: [
        { publishDate: "desc" },
        { createdAt: "desc" }
      ]
    })
    res.json(articles)
  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } })
  }
})

// GET single article
adminArticlesRouter.get("/:id", async (req, res) => {
  try {
    const article = await prisma.article.findUnique({
      where: { id: req.params.id }
    })
    if (!article) return res.status(404).json({ error: { message: "Article not found" } })
    res.json(article)
  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } })
  }
})

// CREATE article
adminArticlesRouter.post("/", async (req, res) => {
  try {
    const data = req.body

    // Check slug uniqueness
    const existing = await prisma.article.findUnique({ where: { slug: data.slug } })
    if (existing) {
      return res.status(400).json({ error: { message: "An article with this slug already exists" } })
    }

    if (data.publishStatus === "published" && !data.publishDate) {
      data.publishDate = new Date()
    } else if (data.publishDate) {
      data.publishDate = new Date(data.publishDate)
    }

    const article = await prisma.article.create({ data })

    // Log the creation
    await prisma.auditLog.create({
      data: {
        entity: "Article",
        entityId: article.id,
        action: "create",
        user: (req as any).user?.id || "admin",
        changes: JSON.stringify(data)
      }
    })

    res.status(201).json(article)
  } catch (error: any) {
    res.status(400).json({ error: { message: error.message } })
  }
})

// UPDATE article
adminArticlesRouter.put("/:id", async (req, res) => {
  try {
    const data = req.body
    
    // Check slug uniqueness if slug is being updated
    if (data.slug) {
      const existing = await prisma.article.findFirst({
        where: { slug: data.slug, NOT: { id: req.params.id } }
      })
      if (existing) {
        return res.status(400).json({ error: { message: "An article with this slug already exists" } })
      }
    }
    
    // Auto-set publishDate if transitioning to published
    if (data.publishStatus === "published") {
      const existing = await prisma.article.findUnique({ where: { id: req.params.id } })
      if (existing?.publishStatus !== "published" && !data.publishDate) {
        data.publishDate = new Date()
      } else if (data.publishDate) {
        data.publishDate = new Date(data.publishDate)
      }
    } else if (data.publishDate) {
      data.publishDate = new Date(data.publishDate)
    }
    
    // Increment version
    data.version = { increment: 1 }

    const article = await prisma.article.update({
      where: { id: req.params.id },
      data
    })

    // Log the update
    await prisma.auditLog.create({
      data: {
        entity: "Article",
        entityId: article.id,
        action: data.publishStatus === "published" ? "publish" : "update",
        user: (req as any).user?.id || "admin",
        changes: JSON.stringify(data)
      }
    })

    res.json(article)
  } catch (error: any) {
    res.status(400).json({ error: { message: error.message } })
  }
})

// DELETE article
adminArticlesRouter.delete("/:id", async (req, res) => {
  try {
    await prisma.article.delete({
      where: { id: req.params.id }
    })
    
    // Log the deletion
    await prisma.auditLog.create({
      data: {
        entity: "Article",
        entityId: req.params.id,
        action: "delete",
        user: (req as any).user?.id || "admin",
        changes: "{}"
      }
    })
    res.status(204).send()
  } catch (error: any) {
    res.status(400).json({ error: { message: error.message } })
  }
})
