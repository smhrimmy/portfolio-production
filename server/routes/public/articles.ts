import { Router } from "express"

import { prisma } from "../../config/db.js"
export const publicArticlesRouter = Router()

publicArticlesRouter.get("/", async (_req, res) => {
  try {
    const articles = await prisma.article.findMany({
      where: { publishStatus: "published" },
      orderBy: { publishDate: "desc" }
    })
    res.json(articles)
  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } })
  }
})

publicArticlesRouter.get("/:slug", async (req, res) => {
  try {
    const article = await prisma.article.findFirst({
      where: { 
        slug: req.params.slug,
        publishStatus: "published"
      }
    })
    
    if (!article) {
      return res.status(404).json({ error: { message: "Article not found or not published yet" } })
    }
    
    res.json(article)
  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } })
  }
})
