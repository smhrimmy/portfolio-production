// @ts-nocheck
import { getProjects } from "../../src/data/projects.js"
import { getExperience } from "../../src/data/experience.js"
import { getSkills } from "../../src/data/skills.js"
import { getProfile } from "../../src/data/profile.js"
// assuming articles and certs exist or we skip them if they don't

import { prisma } from "../config/db.js"

async function main() {
  console.log("Starting database seed...")

  // Seed Profile
  const profile = await getProfile()
  await prisma.profile.create({
    data: {
      name: profile.name,
      role: profile.headline || "",
      tagline: profile.subheadline || "",
      about: profile.bio || "",
      location: profile.location,
      email: profile.email,
      github: profile.socialLinks?.find(l => l.platform === 'GitHub')?.url || "",
      linkedin: profile.socialLinks?.find(l => l.platform === 'LinkedIn')?.url || "",
      twitter: profile.socialLinks?.find(l => l.platform === 'Twitter')?.url || "",
    }
  })
  console.log("Profile seeded.")

  // Seed Skills
  const skills = await getSkills()
  for (const skill of skills) {
    await prisma.skill.create({
      data: {
        name: skill.name,
        category: skill.category,
        proficiency: skill.proficiency,
        icon: skill.icon,
      }
    })
  }
  console.log(`Seeded ${skills.length} skills.`)

  // Seed Experience
  const experiences = await getExperience()
  for (const exp of experiences) {
    await prisma.experience.create({
      data: {
        company: exp.company,
        role: exp.role,
        location: exp.location,
        type: exp.type || "Full-time",
        startDate: exp.startDate,
        endDate: exp.endDate,
        description: exp.description || "",
        achievements: JSON.stringify(exp.achievements || []),
        techStack: JSON.stringify(exp.technologies || []),
      }
    })
  }
  console.log(`Seeded ${experiences.length} experiences.`)

  // Seed Projects
  const projects = await getProjects()
  for (const proj of projects) {
    await prisma.project.create({
      data: {
        slug: proj.slug,
        title: proj.title,
        description: proj.shortDescription || "",
        status: proj.status || "completed",
        category: proj.category || "Uncategorized",
        techStack: JSON.stringify(proj.techStack || []),
        challenges: JSON.stringify(proj.challenges || []),
        solutions: JSON.stringify(proj.solutions || []),
        goals: JSON.stringify(proj.goals || []),
        results: JSON.stringify(proj.results || []),
        imageUrl: proj.imageUrl,
        githubUrl: proj.githubUrl,
        liveUrl: proj.liveUrl,
        featured: proj.featured || false,
      }
    })
  }
  console.log(`Seeded ${projects.length} projects.`)

  console.log("Database seeding completed successfully.")
}

main()
  .catch((e) => {
    console.error("Seed failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
