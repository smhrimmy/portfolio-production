import { z } from "zod"

export const resumeSchema = z.object({
  id: z.string(),
  title: z.string(),
  fileUrl: z.string().url(),
  version: z.string().optional(),
  updatedAt: z.string(), // ISO string
  featured: z.boolean().default(false),
})

export type Resume = z.infer<typeof resumeSchema>
