import { Router } from "express"
import { prisma } from "../../config/db.js"

export const adminCronRouter = Router()

adminCronRouter.get("/tick", async (req, res) => {
  // Simple check for cron secret (set in Vercel env vars)
  const cronSecret = process.env.CRON_SECRET
  const authHeader = req.headers.authorization
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  try {
    const now = new Date()

    // 1. Scheduled Publishing (Articles)
    const scheduledArticles = await prisma.article.updateMany({
      where: {
        publishStatus: "draft",
        publishDate: { lte: now }
      },
      data: {
        publishStatus: "published",
        updatedAt: now
      }
    })

    // 2. Scheduled Publishing (Projects)
    const scheduledProjects = await prisma.project.updateMany({
      where: {
        publishStatus: "draft",
        publishDate: { lte: now }
      },
      data: {
        publishStatus: "published",
        updatedAt: now
      }
    })

    // 3. Auto-publish quiet period
    // Fetch settings to check if enabled
    const settings = await prisma.siteSettings.findFirst()
    let autoPublishedArticles = 0
    let autoPublishedProjects = 0

    if (settings && settings.autoPublishEnabled) {
      const delayMs = settings.autoPublishDelay * 60 * 1000
      const thresholdTime = new Date(now.getTime() - delayMs)

      const articlesToAutoPublish = await prisma.article.updateMany({
        where: {
          publishStatus: "draft",
          updatedAt: { lte: thresholdTime },
          publishDate: null // Don't override explicitly scheduled ones
        },
        data: {
          publishStatus: "published"
        }
      })
      autoPublishedArticles = articlesToAutoPublish.count

      const projectsToAutoPublish = await prisma.project.updateMany({
        where: {
          publishStatus: "draft",
          updatedAt: { lte: thresholdTime },
          publishDate: null
        },
        data: {
          publishStatus: "published"
        }
      })
      autoPublishedProjects = projectsToAutoPublish.count
    }

    res.json({ 
      status: "success", 
      scheduledPublished: {
        articles: scheduledArticles.count,
        projects: scheduledProjects.count
      },
      autoPublished: {
        articles: autoPublishedArticles,
        projects: autoPublishedProjects
      }
    })
  } catch (error) {
    console.error("Cron Tick Error:", error)
    res.status(500).json({ error: "Failed to execute cron tick" })
  }
})
