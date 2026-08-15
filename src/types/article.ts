import { z } from "zod"

export const articleSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  excerpt: z.string(),
  content: z.string(), // HTML or Markdown content
  coverImage: z.string().optional(),
  category: z.string(),
  tags: z.array(z.string()).optional(),
  author: z.string(),
  publishedAt: z.string(),
  updatedAt: z.string().optional(),
  readingTime: z.string(),
  featured: z.boolean().default(false),
  status: z.enum(["draft", "published", "archived"]),
  
  // Metadata
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  canonicalUrl: z.string().url().optional(),
  order: z.number().default(0),
})

export type Article = z.infer<typeof articleSchema>
