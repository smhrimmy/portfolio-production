import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "development-secret-key-change-in-production"

export interface AuthRequest extends Request {
  user?: {
    id: string
    role: string
  }
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Authentication required" } })
  }

  const token = authHeader.split(" ")[1]
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any
    if (payload.role !== "admin") {
      return res.status(403).json({ error: { code: "FORBIDDEN", message: "Admin access required" } })
    }
    req.user = payload
    next()
  } catch (err) {
    return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Invalid or expired token" } })
  }
}
