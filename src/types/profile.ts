import { z } from "zod"

export const socialLinkSchema = z.object({
  id: z.string().optional(),
  platform: z.string(),
  url: z.string().url(),
  icon: z.string().optional(),
})

export type SocialLink = z.infer<typeof socialLinkSchema>

export const profileSchema = z.object({
  id: z.string(),
  name: z.string(),
  headline: z.string(),
  subheadline: z.string().optional(),
  bio: z.string(),
  shortBio: z.string().optional(),
  location: z.string().optional(),
  availability: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  avatar: z.string().optional(),
  resumeUrl: z.string().optional(),
  heroVisual: z.string().optional(),
  socialLinks: z.array(socialLinkSchema).default([]),
  roles: z.array(z.string()).default([]),
  currentFocus: z.array(z.string()).default([]),
  interests: z.array(z.string()).default([]),
  values: z.array(z.string()).default([]),
  updatedAt: z.string().optional(), // ISO string
})

export type Profile = z.infer<typeof profileSchema>
