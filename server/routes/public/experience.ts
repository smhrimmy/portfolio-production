import { Router } from "express"
import { prisma } from "../../config/db.js"
import { parseJson } from "../../lib/json.js"

export const publicExperienceRouter = Router()

function mapEmploymentType(type: string): "full-time" | "part-time" | "contract" | "freelance" {
  const normalized = type.toLowerCase().replace(/\s+/g, "-")
  if (normalized === "part-time" || normalized === "contract" || normalized === "freelance") {
    return normalized
  }
  return "full-time"
}

publicExperienceRouter.get("/", async (_req, res) => {
  try {
    const experiences = await prisma.experience.findMany({
      where: { publishStatus: "published" },
      orderBy: [{ order: "asc" }, { startDate: "desc" }],
    })

    res.json(experiences.map((experience) => ({
      id: experience.id,
      company: experience.company,
      role: experience.role,
      location: experience.location,
      startDate: experience.startDate,
      endDate: experience.endDate ?? undefined,
      current: experience.isCurrent,
      employmentType: mapEmploymentType(experience.type),
      summary: experience.description,
      responsibilities: parseJson<string[]>(experience.achievements, []),
      technologies: parseJson<string[]>(experience.techStack, []),
      order: experience.order,
    })))
  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } })
  }
})
