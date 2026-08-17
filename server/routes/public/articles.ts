import { Router } from "express"
import { prisma } from "../../config/db.js"
import { parseJson } from "../../lib/json.js"

export const publicArticlesRouter = Router()

function mapArticle(article: {
  id: string
  slug: string
  title: string
  content: string
  excerpt: string
  coverMediaId: string | null
  category: string
  tags: string
  author: string
  readingTime: number
  featured: boolean
  publishStatus: string
  publishDate: Date | null
  updatedAt: Date
}) {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    content: article.content,
    coverImage: article.coverMediaId ?? undefined,
    category: article.category,
    tags: parseJson<string[]>(article.tags, []),
    author: article.author,
    publishedAt: (article.publishDate ?? article.updatedAt).toISOString(),
    updatedAt: article.updatedAt.toISOString(),
    readingTime: `${article.readingTime} min`,
    featured: article.featured,
    status: article.publishStatus,
  }
}

publicArticlesRouter.get("/", async (_req, res) => {
  try {
    const articles = await prisma.article.findMany({
      where: { publishStatus: "published" },
      orderBy: { publishDate: "desc" }
    })
    res.json(articles.map(mapArticle))
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

    res.json(mapArticle(article))
  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } })
  }
})
