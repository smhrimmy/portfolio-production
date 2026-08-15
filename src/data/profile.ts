import type { Profile } from "../types/profile"

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
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300))
  return profileData
}
