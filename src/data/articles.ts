import type { Article } from "../types/article"

const API_URL = import.meta.env.VITE_API_URL || ""

export async function getArticles(): Promise<Article[]> {
  try {
    const res = await fetch(`${API_URL}/api/public/articles`)
    if (!res.ok) return []
    return await res.json()
  } catch (err) {
    console.error("Failed to fetch articles", err)
    return []
  }
}

export async function getFeaturedArticle(): Promise<Article | null> {
  const articles = await getArticles()
  const featured = articles.find(a => a.featured)
  return featured || articles[0] || null
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const res = await fetch(`${API_URL}/api/public/articles/${slug}`)
    if (!res.ok) return null
    return await res.json()
  } catch (err) {
    console.error("Failed to fetch article by slug", err)
    return null
  }
}

export async function getArticleCategories(): Promise<string[]> {
  const articles = await getArticles()
  const categories = new Set(articles.map(a => a.category))
  return Array.from(categories)
}
