import type { Skill, SkillCategory } from "../types/skill"

export const skillCategories: SkillCategory[] = [
  { id: "sc_1", name: "Frontend", order: 1 },
  { id: "sc_2", name: "Backend", order: 2 },
  { id: "sc_3", name: "Architecture", order: 3 },
  { id: "sc_4", name: "Design", order: 4 },
  { id: "sc_5", name: "Tools & Infrastructure", order: 5 },
]

export const skillsData: Skill[] = [
  {
    id: "sk_1",
    name: "React",
    categoryId: "sc_1",
    level: "Advanced",
    yearsOfExperience: 5,
    technologies: ["Next.js", "Vite", "Zustand", "Framer Motion"],
    featured: true,
    order: 1
  },
  {
    id: "sk_2",
    name: "TypeScript",
    categoryId: "sc_1",
    level: "Advanced",
    yearsOfExperience: 5,
    technologies: ["Zod", "Type-level programming"],
    featured: true,
    order: 2
  },
  {
    id: "sk_3",
    name: "Tailwind CSS",
    categoryId: "sc_1",
    level: "Advanced",
    technologies: ["Design Systems", "shadcn/ui", "CSS Variables"],
    featured: true,
    order: 3
  },
  {
    id: "sk_4",
    name: "Node.js",
    categoryId: "sc_2",
    level: "Intermediate",
    technologies: ["Express", "NestJS", "Fastify"],
    featured: true,
    order: 1
  },
  {
    id: "sk_5",
    name: "PostgreSQL",
    categoryId: "sc_2",
    level: "Intermediate",
    technologies: ["Prisma", "Drizzle", "SQL"],
    featured: false,
    order: 2
  },
  {
    id: "sk_6",
    name: "System Design",
    categoryId: "sc_3",
    level: "Intermediate",
    technologies: ["Microservices", "Serverless", "Event-Driven Architecture"],
    featured: true,
    order: 1
  },
  {
    id: "sk_7",
    name: "UI/UX Design",
    categoryId: "sc_4",
    level: "Intermediate",
    technologies: ["Figma", "Design Tokens", "Wireframing"],
    featured: true,
    order: 1
  },
  {
    id: "sk_8",
    name: "Docker",
    categoryId: "sc_5",
    level: "Intermediate",
    technologies: ["Containers", "Compose"],
    featured: false,
    order: 1
  }
]

export async function getSkills(): Promise<Skill[]> {
  await new Promise(resolve => setTimeout(resolve, 300))
  return [...skillsData].sort((a, b) => a.order - b.order)
}

export async function getSkillCategories(): Promise<SkillCategory[]> {
  await new Promise(resolve => setTimeout(resolve, 300))
  return [...skillCategories].sort((a, b) => a.order - b.order)
}

export async function getFeaturedSkills(): Promise<Skill[]> {
  await new Promise(resolve => setTimeout(resolve, 300))
  return skillsData.filter(s => s.featured).sort((a, b) => a.order - b.order)
}
