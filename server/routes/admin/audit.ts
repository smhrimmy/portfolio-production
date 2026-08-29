import { Router } from "express"
import { prisma } from "../../config/db.js"

export const adminAuditRouter = Router()

// GET /api/admin/audit/:entity/:entityId
adminAuditRouter.get("/:entity/:entityId", async (req, res) => {
  try {
    const logs = await prisma.auditLog.findMany({
      where: {
        entity: req.params.entity,
        entityId: req.params.entityId
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    res.json(logs)
  } catch (error) {
    console.error("Failed to fetch audit logs:", error)
    res.status(500).json({ error: "Failed to fetch audit logs" })
  }
})

// Log a change (internal helper)
export async function logAudit(
  entity: string,
  entityId: string,
  action: string,
  user: string,
  changes: any
) {
  try {
    await prisma.auditLog.create({
      data: {
        entity,
        entityId,
        action,
        user,
        changes: JSON.stringify(changes)
      }
    })
  } catch (err) {
    console.error("Failed to write audit log:", err)
  }
}
