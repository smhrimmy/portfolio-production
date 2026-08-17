import type { Experience } from "../types/experience.js"

const LOCAL_EXPERIENCE: Experience[] = [
  {
    id: "exp-1",
    company: "Acme Corp",
    role: "Senior Frontend Engineer",
    location: "San Francisco, CA",
    startDate: "2024-01-01",
    current: true,
    employmentType: "full-time",
    summary: "Leading the frontend architecture for the core platform, focusing on performance, accessibility, and developer experience.",
    responsibilities: [
      "Architected the migration from legacy monolithic React app to a modular Next.js architecture.",
      "Established the internal design system used by 4 product teams.",
      "Mentored junior engineers and led weekly technical deep-dives."
    ],
    technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    order: 1,
  },
  {
    id: "exp-2",
    company: "TechNova Solutions",
    role: "UI/UX Designer & Developer",
    location: "Remote",
    startDate: "2021-06-01",
    endDate: "2023-12-31",
    current: false,
    employmentType: "full-time",
    summary: "Bridged the gap between design and engineering, delivering high-fidelity prototypes and production-ready components.",
    contributions: [
      "Designed and developed the award-winning client dashboard.",
      "Reduced CSS bundle size by 60% through systematic tokenization."
    ],
    technologies: ["Figma", "Vue.js", "SCSS"],
    order: 2,
  }
]

export const LOCAL_EXPERIENCE_DATA = LOCAL_EXPERIENCE

export async function getExperience(): Promise<Experience[]> {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/public/experience`)
    if (res.ok) {
      const data = await res.json() as Experience[]
      if (Array.isArray(data) && data.length > 0) {
        return [...data].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      }
    }
  } catch {
    // fall through to local data
  }
  return [...LOCAL_EXPERIENCE].sort((a, b) => a.order - b.order)
}
