import { z } from "zod"

export const experienceSchema = z.object({
  id: z.string(),
  company: z.string(),
  role: z.string(),
  location: z.string().optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  employmentType: z.enum(["full-time", "part-time", "contract", "freelance"]),
  summary: z.string(),
  responsibilities: z.array(z.string()).optional(),
  contributions: z.array(z.string()).optional(),
  technologies: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
  category: z.string().optional(),
  companyLogo: z.string().optional(),
  order: z.number().default(0),
})

export type Experience = z.infer<typeof experienceSchema>
