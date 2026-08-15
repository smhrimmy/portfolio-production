import type { ContactConfig } from "../types/contact"
import { profileData } from "./profile"

export const contactConfigData: ContactConfig = {
  email: profileData.email,
  socialLinks: profileData.socialLinks,
  availability: profileData.availability,
  responseMessage: "I aim to respond to all inquiries within 24-48 hours.",
  location: profileData.location
}

export async function getContactConfig(): Promise<ContactConfig> {
  await new Promise(resolve => setTimeout(resolve, 300))
  return contactConfigData
}
