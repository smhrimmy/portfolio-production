import { z } from "zod"

export const projectSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  shortDescription: z.string(),
  description: z.string().optional(),
  category: z.string(),
  
  // Flat tech array used for filtering and simple cards
  technologies: z.array(z.string()),
  
  // Categorized tech stack used for the full case study
  techStack: z.array(z.object({
    category: z.string(),
    items: z.array(z.object({
      name: z.string(),
      reason: z.string().optional()
    }))
  })).optional(),

  featured: z.boolean().default(false),
  status: z.enum(["completed", "in-progress", "archived", "production"]),
  
  // Media
  heroImage: z.string().optional(),
  thumbnail: z.string().optional(),
  gallery: z.array(z.object({
    url: z.string(),
    caption: z.string().optional(),
    alt: z.string()
  })).optional(),
  
  // Case Study Meta
  role: z.string().optional(),
  duration: z.string().optional(),
  team: z.array(z.string()).optional(),
  
  // Core Narrative
  problem: z.string().optional(),
  goals: z.array(z.string()).optional(),
  constraints: z.array(z.string()).optional(),
  
  // Architecture & Design
  architecture: z.string().optional(),
  architectureDiagram: z.string().optional(), // SVG/Image url
  designDecisions: z.array(z.object({
    title: z.string(),
    description: z.string()
  })).optional(),

  // Implementation & Code
  implementationDetails: z.array(z.object({
    title: z.string(),
    description: z.string(),
    codeSnippet: z.object({
      language: z.string(),
      code: z.string(),
      explanation: z.string().optional()
    }).optional()
  })).optional(),
  
  // Outcomes
  challenges: z.array(z.object({
    challenge: z.string(),
    solution: z.string(),
    result: z.string().optional()
  })).optional(),
  results: z.array(z.string()).optional(),
  lessons: z.array(z.string()).optional(),
  
  // 3D Integration config
  threeConfig: z.object({
    sceneType: z.string().optional(),
    enabled: z.boolean().default(false)
  }).optional(),
  
  // Links
  githubUrl: z.string().url().optional(),
  liveUrl: z.string().url().optional(),
  documentationUrl: z.string().url().optional(),
  
  // Metadata
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  order: z.number().default(0),
})

export type Project = z.infer<typeof projectSchema>
