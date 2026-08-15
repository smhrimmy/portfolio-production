import { z } from "zod"

export const skillCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  icon: z.string().optional(),
  order: z.number().default(0),
})

export type SkillCategory = z.infer<typeof skillCategorySchema>

export const skillSchema = z.object({
  id: z.string(),
  name: z.string(),
  categoryId: z.string(),
  level: z.string().optional(), // e.g. "Advanced", "Intermediate" (Do NOT use percentages)
  yearsOfExperience: z.number().optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  technologies: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  order: z.number().default(0),
})

export type Skill = z.infer<typeof skillSchema>
