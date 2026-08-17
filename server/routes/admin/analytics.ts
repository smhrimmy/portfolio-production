import { Router } from "express"
import { prisma } from "../../config/db.js"
import { requireAdmin } from "../../middleware/auth.js"

const router = Router()
router.use(requireAdmin)

// GET /api/admin/analytics/summary
router.get("/summary", async (_req, res) => {
  try {
    const now = new Date()
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30))

    const totalViews = await prisma.analyticsEvent.count({
      where: { eventType: "page_view" }
    })

    const recentViews = await prisma.analyticsEvent.count({
      where: { eventType: "page_view", createdAt: { gte: thirtyDaysAgo } }
    })

    // Group by path to find top pages
    const topPages = await prisma.analyticsEvent.groupBy({
      by: ['path'],
      where: { eventType: "page_view" },
      _count: { path: true },
      orderBy: { _count: { path: 'desc' } },
      take: 10
    })

    // Group by referrer
    const topReferrers = await prisma.analyticsEvent.groupBy({
      by: ['referrer'],
      where: { eventType: "page_view", referrer: { not: null, notIn: [''] } },
      _count: { referrer: true },
      orderBy: { _count: { referrer: 'desc' } },
      take: 10
    })

    res.json({
      totalViews,
      recentViews,
      topPages: topPages.map((p: any) => ({ path: p.path, views: p._count.path })),
      topReferrers: topReferrers.map((r: any) => ({ referrer: r.referrer, count: r._count.referrer }))
    })
  } catch (error) {
    res.status(500).json({ error: { code: "SERVER_ERROR", message: "Failed to fetch summary" } })
  }
})

// GET /api/admin/analytics/timeseries
router.get("/timeseries", async (req, res) => {
  try {
    const days = parseInt(req.query.days as string) || 30
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Using raw query for sqlite date grouping to get robust time-series
    const timeseries = await prisma.$queryRaw`
      SELECT 
        date(createdAt) as date, 
        COUNT(*) as count
      FROM AnalyticsEvent
      WHERE eventType = 'page_view' AND createdAt >= ${startDate}
      GROUP BY date(createdAt)
      ORDER BY date(createdAt) ASC
    `
    
    // Format BigInt from count
    const formatted = (timeseries as any[]).map(t => ({
      date: t.date,
      views: Number(t.count)
    }))

    res.json(formatted)
  } catch (error) {
    console.error("Timeseries error:", error)
    res.status(500).json({ error: { code: "SERVER_ERROR", message: "Failed to fetch timeseries" } })
  }
})

// GET /api/admin/analytics/events
router.get("/events", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50
    const offset = parseInt(req.query.offset as string) || 0

    const events = await prisma.analyticsEvent.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    })

    res.json(events)
  } catch (error) {
    res.status(500).json({ error: { code: "SERVER_ERROR", message: "Failed to fetch events" } })
  }
})

export default router
