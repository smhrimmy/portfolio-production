import type { Article } from "../types/article"

const LOCAL_ARTICLES: Article[] = [
  {
    id: "art-1",
    slug: "building-portfolio-os",
    title: "Building Portfolio OS: Architecture & Design",
    excerpt: "A deep dive into the engineering decisions behind a modern, modular portfolio system.",
    content: "<p>When building Portfolio OS, the primary goal was to create a system that acts as a true product rather than a static document. This meant thinking in terms of content models, design tokens, and scalable architecture from day one.</p><h2>The Content Layer</h2><p>By decoupling content from presentation using Zod schemas, we ensure the UI can easily integrate with a headless CMS in the future.</p>",
    category: "Engineering",
    tags: ["React", "Architecture", "Design Systems"],
    author: "John Doe",
    publishedAt: "2026-08-10",
    readingTime: "5 min read",
    featured: true,
    status: "published",
    order: 1,
  },
  {
    id: "art-2",
    slug: "accessible-motion-design",
    title: "Accessible Motion Design on the Web",
    excerpt: "How to use Framer Motion responsibly without compromising accessibility or user preference.",
    content: "<p>Motion should guide attention, not distract. This article explores how to respect <code>prefers-reduced-motion</code> while maintaining a premium feel.</p>",
    category: "Design",
    tags: ["Accessibility", "Framer Motion", "UX"],
    author: "John Doe",
    publishedAt: "2026-07-22",
    readingTime: "4 min read",
    featured: false,
    status: "published",
    order: 2,
  }
]

export async function getArticles(): Promise<Article[]> {
  return LOCAL_ARTICLES.filter(a => a.status === "published").sort((a, b) => a.order - b.order)
}

export async function getFeaturedArticle(): Promise<Article | null> {
  const articles = await getArticles()
  const featured = articles.find(a => a.featured)
  return featured || articles[0] || null
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const articles = await getArticles()
  return articles.find(a => a.slug === slug) || null
}

export async function getArticleCategories(): Promise<string[]> {
  const articles = await getArticles()
  const categories = new Set(articles.map(a => a.category))
  return Array.from(categories)
}
