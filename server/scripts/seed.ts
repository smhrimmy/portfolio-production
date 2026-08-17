import { prisma } from "../config/db.js"
import { profileData } from "../../src/data/profile.js"
import { LOCAL_PROJECTS_DATA } from "../../src/data/projects.js"
import { LOCAL_EXPERIENCE_DATA } from "../../src/data/experience.js"

const SEED_SKILLS = [
  { name: "React", category: "Frontend", proficiency: 95 },
  { name: "TypeScript", category: "Frontend", proficiency: 92 },
  { name: "Node.js", category: "Backend", proficiency: 88 },
  { name: "PostgreSQL", category: "Backend", proficiency: 80 },
  { name: "Prisma", category: "Backend", proficiency: 78 },
  { name: "Tailwind CSS", category: "Frontend", proficiency: 90 },
  { name: "Three.js", category: "Graphics", proficiency: 70 },
]

async function main() {
  console.log("Starting database seed...")

  const existingProfile = await prisma.profile.findFirst()
  const profilePayload = {
    name: profileData.name,
    role: profileData.headline,
    tagline: profileData.subheadline ?? "",
    about: profileData.bio,
    location: profileData.location ?? "",
    email: profileData.email,
    github: profileData.socialLinks.find((link) => link.platform === "GitHub")?.url ?? "",
    linkedin: profileData.socialLinks.find((link) => link.platform === "LinkedIn")?.url ?? "",
    twitter: profileData.socialLinks.find((link) => link.platform === "Twitter")?.url ?? "",
    publishStatus: "published",
    publishDate: new Date(),
  }

  if (existingProfile) {
    await prisma.profile.update({ where: { id: existingProfile.id }, data: profilePayload })
  } else {
    await prisma.profile.create({ data: profilePayload })
  }
  console.log("Profile seeded.")

  for (const skill of SEED_SKILLS) {
    await prisma.skill.upsert({
      where: { name: skill.name },
      update: { ...skill, publishStatus: "published", publishDate: new Date() },
      create: { ...skill, publishStatus: "published", publishDate: new Date() },
    })
  }
  console.log(`Seeded ${SEED_SKILLS.length} skills.`)

  for (const exp of LOCAL_EXPERIENCE_DATA) {
    const payload = {
      company: exp.company,
      role: exp.role,
      location: exp.location ?? "",
      type: exp.employmentType ?? "full-time",
      startDate: exp.startDate,
      endDate: exp.endDate ?? null,
      isCurrent: exp.current,
      description: exp.summary,
      achievements: JSON.stringify(exp.responsibilities ?? exp.contributions ?? []),
      techStack: JSON.stringify(exp.technologies ?? []),
      order: exp.order ?? 0,
      publishStatus: "published",
      publishDate: new Date(),
    }
    const existing = await prisma.experience.findFirst({
      where: { company: exp.company, role: exp.role },
    })
    if (existing) {
      await prisma.experience.update({ where: { id: existing.id }, data: payload })
    } else {
      await prisma.experience.create({ data: payload })
    }
  }
  console.log(`Seeded ${LOCAL_EXPERIENCE_DATA.length} experiences.`)

  for (const proj of LOCAL_PROJECTS_DATA) {
    const payload = {
      slug: proj.slug,
      title: proj.title,
      description: proj.shortDescription,
      status: proj.status,
      category: proj.category,
      techStack: JSON.stringify(proj.techStack ?? proj.technologies ?? []),
      challenges: JSON.stringify(proj.challenges ?? []),
      solutions: JSON.stringify([]),
      goals: JSON.stringify(proj.goals ?? []),
      results: JSON.stringify(proj.results ?? []),
      imageUrl: proj.heroImage ?? proj.thumbnail ?? null,
      githubUrl: proj.githubUrl ?? null,
      liveUrl: proj.liveUrl ?? null,
      featured: proj.featured,
      publishStatus: "published",
      publishDate: new Date(),
    }
    await prisma.project.upsert({
      where: { slug: proj.slug },
      update: payload,
      create: payload,
    })
  }
  console.log(`Seeded ${LOCAL_PROJECTS_DATA.length} projects.`)

  const navItems = [
    { label: "Projects", path: "/projects", location: "header", order: 1 },
    { label: "Experience", path: "/experience", location: "header", order: 2 },
    { label: "Writing", path: "/writing", location: "header", order: 3 },
    { label: "About", path: "/about", location: "header", order: 4 },
    { label: "Contact", path: "/contact", location: "header", order: 5 },
  ]
  for (const item of navItems) {
    const existing = await prisma.navigationItem.findFirst({
      where: { path: item.path, location: item.location },
    })
    const payload = { ...item, isExternal: false, isActive: true, publishStatus: "published", publishDate: new Date() }
    if (existing) {
      await prisma.navigationItem.update({ where: { id: existing.id }, data: payload })
    } else {
      await prisma.navigationItem.create({ data: payload })
    }
  }

  const existingSettings = await prisma.siteSettings.findFirst()
  const settingsPayload = {
    titleTemplate: "%s | Portfolio OS",
    description: profileData.subheadline ?? "A sophisticated personal operating system.",
    resumeCtaText: "Download Resume",
    resumeCtaLink: profileData.resumeUrl ?? null,
    contactEmail: profileData.email,
    availability: "available",
    seoDefaults: "{}",
    features: "{}",
    publishStatus: "published",
    publishDate: new Date(),
  }
  if (existingSettings) {
    await prisma.siteSettings.update({ where: { id: existingSettings.id }, data: settingsPayload })
  } else {
    await prisma.siteSettings.create({ data: settingsPayload })
  }

  const existingTheme = await prisma.themeConfig.findFirst()
  if (!existingTheme) {
    await prisma.themeConfig.create({ data: { preset: "premium-editorial" } })
  }

  console.log("Database seeding completed successfully.")
}

main()
  .catch((error) => {
    console.error("Seed failed:", error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
