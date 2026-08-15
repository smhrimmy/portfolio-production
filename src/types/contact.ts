import { z } from "zod"
import { socialLinkSchema } from "./profile"

export const contactConfigSchema = z.object({
  email: z.string().email(),
  socialLinks: z.array(socialLinkSchema).default([]),
  availability: z.string().optional(),
  responseMessage: z.string().optional(),
  location: z.string().optional(),
})

export type ContactConfig = z.infer<typeof contactConfigSchema>

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  subject: z.string().min(2, "Subject must be at least 2 characters.").max(100, "Subject is too long."),
  message: z.string().min(10, "Message must be at least 10 characters.").max(1000, "Message is too long."),
  company: z.string().optional(),
  projectType: z.string().optional(),
})

export type ContactFormValues = z.infer<typeof contactFormSchema>
