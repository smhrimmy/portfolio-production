import { z } from "zod"

export const certificationSchema = z.object({
  id: z.string(),
  name: z.string(),
  issuer: z.string(),
  issueDate: z.string(), // ISO string (YYYY-MM-DD)
  expiryDate: z.string().optional(), // ISO string
  credentialId: z.string().optional(),
  credentialUrl: z.string().url().optional(),
  certificateImage: z.string().optional(),
  description: z.string().optional(),
  skills: z.array(z.string()).default([]), // Array of skill names or IDs
  category: z.string().optional(),
  featured: z.boolean().default(false),
  order: z.number().default(0),
  status: z.enum(["active", "expired", "in-progress"]).default("active"),
})

export type Certification = z.infer<typeof certificationSchema>
