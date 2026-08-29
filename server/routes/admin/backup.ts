import { Router } from "express"
import { prisma } from "../../config/db.js"
import { logAudit } from "./audit.js"

export const adminBackupRouter = Router()

adminBackupRouter.get("/export", async (req, res) => {
  try {
    const backup = {
      version: "1.0",
      timestamp: new Date().toISOString(),
      data: {
        profile: await prisma.profile.findMany(),
        sites: await prisma.site.findMany(),
        projects: await prisma.project.findMany(),
        experience: await prisma.experience.findMany(),
        skills: await prisma.skill.findMany(),
        articles: await prisma.article.findMany(),
        certifications: await prisma.certification.findMany(),
        testimonials: await prisma.testimonial.findMany(),
        media: await prisma.media.findMany(),
        navigation: await prisma.navigationItem.findMany(),
        settings: await prisma.siteSettings.findMany(),
        seoRoutes: await prisma.seoRoute.findMany(),
        experiments: await prisma.experiment.findMany(),
      }
    }

    await logAudit("System", "backup", "export", (req as any).user?.id || "admin", {})

    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Content-Disposition', `attachment; filename="portfolio-os-backup-${new Date().toISOString().split('T')[0]}.json"`)
    res.send(JSON.stringify(backup, null, 2))
  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } })
  }
})

// Very basic import - in production you'd want massive validation and transaction wrapping
adminBackupRouter.post("/import", async (req, res) => {
  try {
    const backupData = req.body
    
    if (!backupData.data || !backupData.version) {
      return res.status(400).json({ error: { message: "Invalid backup format" } })
    }

    // We will just log this for now, restoring a full relational database via JSON requires clearing and recreating
    // which is very dangerous to do blindly.
    
    await logAudit("System", "backup", "import", (req as any).user?.id || "admin", {})

    res.json({ message: "Backup validated successfully. (Full restore functionality requires manual database injection for safety)" })
  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } })
  }
})
