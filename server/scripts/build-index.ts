import { PortfolioIndexer } from "../services/PortfolioIndexer.js"
import type { IndexedDocument } from "../services/PortfolioIndexer.js"

import { prisma } from "../config/db.js"
async function main() {
  const indexer = new PortfolioIndexer()
  const documents: Omit<IndexedDocument, 'embedding'>[] = []

  // 1. Profile
  const profiles = await prisma.profile.findMany({ where: { publishStatus: "published" } })
  for (const profile of profiles) {
    documents.push({
      id: profile.id,
      type: "profile",
      title: `Profile: ${profile.name} - ${profile.role}`,
      content: `${profile.about} Tagline: ${profile.tagline}. Location: ${profile.location}`,
      url: "/about",
      published: true,
      metadata: { technologies: [] }
    })
  }

  // 2. Projects
  const projects = await prisma.project.findMany({ where: { publishStatus: "published" } })
  for (const proj of projects) {
    const fullContent = `${proj.description} Category: ${proj.category} Tech Stack: ${proj.techStack} Challenges: ${proj.challenges} Results: ${proj.results}`
    documents.push({
      id: proj.id,
      type: "project",
      title: `Project: ${proj.title} (${proj.category})`,
      content: fullContent,
      url: `/projects/${proj.slug}`,
      published: true,
      metadata: { technologies: [] }
    })
  }

  // 3. Experience
  const experiences = await prisma.experience.findMany({ where: { publishStatus: "published" } })
  for (const exp of experiences) {
    documents.push({
      id: exp.id,
      type: "experience",
      title: `Experience: ${exp.role} at ${exp.company}`,
      content: `${exp.description} Achievements: ${exp.achievements} Tech Stack: ${exp.techStack}`,
      url: `/experience`,
      published: true,
      metadata: { technologies: [] }
    })
  }

  // 4. Skills
  const skills = await prisma.skill.findMany({ where: { publishStatus: "published" } })
  for (const skill of skills) {
    documents.push({
      id: skill.id,
      type: "skill",
      title: `Skill: ${skill.name}`,
      content: `Category: ${skill.category}. Proficiency: ${skill.proficiency}`,
      url: `/skills`,
      published: true,
      metadata: { technologies: [] }
    })
  }

  // 5. Articles
  const articles = await prisma.article.findMany({ where: { publishStatus: "published" } })
  for (const article of articles) {
    documents.push({
      id: article.id,
      type: "article",
      title: `Article: ${article.title} (${article.category})`,
      content: `${article.excerpt} ${article.content} Tags: ${article.tags}`,
      url: `/writing/${article.slug}`,
      published: true,
      metadata: { technologies: [] }
    })
  }

  // 6. Certifications
  const certs = await prisma.certification.findMany({ where: { publishStatus: "published" } })
  for (const cert of certs) {
    documents.push({
      id: cert.id,
      type: "certification",
      title: `Certification: ${cert.name} by ${cert.issuer}`,
      content: `${cert.description || ''} Issued: ${cert.issueDate}. Credential: ${cert.credentialId || 'N/A'}. Skills: ${cert.skills}`,
      url: `/certifications`,
      published: true,
      metadata: { technologies: [] }
    })
  }

  // 7. Experiments
  const experiments = await prisma.experiment.findMany({ where: { publishStatus: "published" } })
  for (const exp of experiments) {
    documents.push({
      id: exp.id,
      type: "experiment",
      title: `Experiment: ${exp.title}`,
      content: `${exp.description} ${exp.content}`,
      url: `/lab/${exp.slug}`,
      published: true,
      metadata: { technologies: exp.techStack ? JSON.parse(exp.techStack) : [] }
    })
  }

  try {
    await indexer.buildAndSaveIndex(documents)
    console.log("✅ Build index complete.")
    process.exit(0)
  } catch (error) {
    console.error("❌ Failed to build index:", error)
    process.exit(1)
  }
}

main()
