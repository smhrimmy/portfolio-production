import { Router } from "express"
import { prisma } from "../../config/db.js"
import { parseJson } from "../../lib/json.js"

export const publicProjectsRouter = Router()

function mapProject(project: {
  id: string
  slug: string
  title: string
  description: string
  status: string
  category: string
  techStack: string
  challenges: string
  solutions: string
  goals: string
  results: string
  imageUrl: string | null
  githubUrl: string | null
  liveUrl: string | null
  featured: boolean
  skills: { name: string }[]
}) {
  const techStack = parseJson<unknown>(project.techStack, [])
  const challenges = parseJson<unknown>(project.challenges, [])
  const goals = parseJson<unknown>(project.goals, [])
  const results = parseJson<unknown>(project.results, [])
  const skillNames = project.skills.map((skill) => skill.name)

  const technologies = Array.isArray(techStack) && techStack.some((group) => group && typeof group === "object" && "items" in group)
    ? (techStack as { items?: { name?: string }[] }[]).flatMap((group) => (group.items ?? []).map((item) => item.name).filter(Boolean) as string[])
    : Array.isArray(techStack)
      ? techStack.filter((item): item is string => typeof item === "string")
      : skillNames

  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    shortDescription: project.description,
    category: project.category,
    technologies: technologies.length > 0 ? technologies : skillNames,
    techStack: Array.isArray(techStack) ? techStack : [],
    featured: project.featured,
    status: project.status,
    heroImage: project.imageUrl ?? undefined,
    thumbnail: project.imageUrl ?? undefined,
    githubUrl: project.githubUrl ?? undefined,
    liveUrl: project.liveUrl ?? undefined,
    goals: Array.isArray(goals) ? goals : [],
    challenges: Array.isArray(challenges) ? challenges : [],
    results: Array.isArray(results) ? results : [],
    order: 0,
  }
}

publicProjectsRouter.get("/", async (_req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: { publishStatus: "published" },
      orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
      include: { skills: true },
    })
    res.json(projects.map(mapProject))
  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } })
  }
})

publicProjectsRouter.get("/:slug", async (req, res) => {
  try {
    const project = await prisma.project.findFirst({
      where: { slug: req.params.slug, publishStatus: "published" },
      include: { skills: true },
    })
    if (!project) {
      return res.status(404).json({ error: { message: "Project not found" } })
    }
    res.json(mapProject(project))
  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } })
  }
})
