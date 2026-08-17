import { Router } from "express"
import { prisma } from "../../config/db.js"
import { requireAdmin } from "../../middleware/auth.js"

const router = Router()

router.use(requireAdmin)

// GET /api/admin/navigation
router.get("/", async (_req, res) => {
  try {
    const items = await prisma.navigationItem.findMany({
      orderBy: [
        { location: 'asc' },
        { order: 'asc' }
      ]
    })
    res.json(items)
  } catch (error) {
    console.error("Failed to fetch navigation items:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// GET /api/admin/navigation/:id
router.get("/:id", async (req, res) => {
  try {
    const item = await prisma.navigationItem.findUnique({
      where: { id: req.params.id }
    })
    if (!item) {
      return res.status(404).json({ error: "Navigation item not found" })
    }
    res.json(item)
  } catch (error) {
    res.status(500).json({ error: "Internal server error" })
  }
})

// POST /api/admin/navigation
router.post("/", async (req, res) => {
  try {
    const item = await prisma.navigationItem.create({
      data: {
        ...req.body,
        publishStatus: "draft"
      }
    })

    await prisma.auditLog.create({
      data: {
        action: "create",
        entity: "NavigationItem",
        entityId: item.id,
        user: (req as any).user?.id || "admin",
        changes: JSON.stringify(item)
      }
    })

    res.status(201).json(item)
  } catch (error) {
    res.status(500).json({ error: "Internal server error" })
  }
})

// PUT /api/admin/navigation/:id
router.put("/:id", async (req, res) => {
  try {
    const item = await prisma.navigationItem.update({
      where: { id: req.params.id },
      data: {
        ...req.body,
        publishStatus: "draft",
        version: { increment: 1 }
      }
    })

    await prisma.auditLog.create({
      data: {
        action: "update",
        entity: "NavigationItem",
        entityId: item.id,
        user: (req as any).user?.id || "admin",
        changes: JSON.stringify(req.body)
      }
    })

    res.json(item)
  } catch (error) {
    res.status(500).json({ error: "Internal server error" })
  }
})

// DELETE /api/admin/navigation/:id
router.delete("/:id", async (req, res) => {
  try {
    await prisma.navigationItem.delete({
      where: { id: req.params.id }
    })

    await prisma.auditLog.create({
      data: {
        action: "delete",
        entity: "NavigationItem",
        entityId: req.params.id,
        user: (req as any).user?.id || "admin",
        changes: "{}"
      }
    })

    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: "Internal server error" })
  }
})

// POST /api/admin/navigation/:id/publish
router.post("/:id/publish", async (req, res) => {
  try {
    const item = await prisma.navigationItem.update({
      where: { id: req.params.id },
      data: {
        publishStatus: "published",
        publishDate: new Date()
      }
    })

    await prisma.auditLog.create({
      data: {
        action: "publish",
        entity: "NavigationItem",
        entityId: item.id,
        user: (req as any).user?.id || "admin",
        changes: JSON.stringify({ publishStatus: "published" })
      }
    })

    res.json(item)
  } catch (error) {
    res.status(500).json({ error: "Internal server error" })
  }
})

// POST /api/admin/navigation/reorder
router.post("/reorder", async (req, res) => {
  try {
    const { items } = req.body // Array of { id, order }
    
    // Process sequentially or using transaction
    for (const item of items) {
      await prisma.navigationItem.update({
        where: { id: item.id },
        data: { order: item.order }
      })
    }

    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: "Internal server error" })
  }
})

export default router
