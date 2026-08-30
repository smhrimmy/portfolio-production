/// <reference types="vite/client" />
import type { Profile } from "../types/profile.js"

export const profileData: Profile = {
  id: "prof_1",
  name: "Prajwal DL",
  headline: "Software Engineer & Architect",
  subheadline: "Building interactive, scalable, and human-centered software systems.",
  bio: "I am a software engineer specializing in frontend architecture, design systems, and full-stack product development. I bridge the gap between rigorous engineering and compelling user experience.",
  shortBio: "Software Engineer specializing in frontend architecture, design systems, and full-stack product development.",
  location: "Remote",
  availability: "Available for new opportunities",
  email: "hello@prajwal.dev",
  phone: undefined, // omitted for privacy
  avatar: "/assets/avatar.webp", // Assuming an asset exists
  resumeUrl: "/Prajwal-DL-Resume.pdf",
  heroVisual: undefined,
  socialLinks: [
    { platform: "GitHub", url: "https://github.com/Prajwal-DL", icon: "github" },
    { platform: "LinkedIn", url: "https://linkedin.com/in/prajwal-dl", icon: "linkedin" },
    { platform: "Twitter", url: "https://twitter.com/prajwaldl", icon: "twitter" }
  ],
  roles: ["Engineer", "Architect", "Designer"],
  currentFocus: [
    "Frontend Architecture",
    "Design Systems",
    "AI Integration",
    "Full-Stack Development"
  ],
  interests: [
    "Web Performance",
    "UI/UX Design",
    "Generative AI",
    "System Architecture"
  ],
  values: [
    "Craftsmanship",
    "Accessibility",
    "Performance",
    "User-Centric Design"
  ],
  updatedAt: new Date().toISOString()
}

export async function getProfile(): Promise<Profile> {
  try {
    const apiUrl = (typeof import.meta !== "undefined" && import.meta.env?.DEV ? (import.meta.env.VITE_API_URL || "http://localhost:3001") : "")
    const res = await fetch(`${apiUrl}/api/public/profile`)
    if (res.ok) {
      const data = await res.json() as any
      
      // Map backend fields to frontend interface
      return {
        id: data.id,
        name: data.name,
        headline: data.role,
        subheadline: data.tagline,
        bio: data.about,
        shortBio: data.about.split('.')[0] + '.',
        location: data.location,
        availability: "Available for new opportunities",
        email: data.email,
        phone: undefined,
        avatar: data.avatarId ? `${apiUrl}/api/public/media/${data.avatarId}` : profileData.avatar,
        resumeUrl: profileData.resumeUrl,
        socialLinks: [
          ...(data.github ? [{ platform: "GitHub", url: data.github, icon: "github" }] : []),
          ...(data.linkedin ? [{ platform: "LinkedIn", url: data.linkedin, icon: "linkedin" }] : []),
          ...(data.twitter ? [{ platform: "Twitter", url: data.twitter, icon: "twitter" }] : [])
        ],
        roles: profileData.roles,
        currentFocus: profileData.currentFocus,
        interests: profileData.interests,
        values: profileData.values,
        updatedAt: data.updatedAt
      }
    }
  } catch (error) {
    console.warn("Failed to fetch profile from API, falling back to local data:", error)
  }
  return profileData
}
