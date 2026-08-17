import { Router } from "express"
import jwt from "jsonwebtoken"
import { z } from "zod"
// Note: we'll use bcrypt later when DB is ready, for now simple env check.

export const authRouter = Router()

const JWT_SECRET = process.env.JWT_SECRET || "development-secret-key-change-in-production"
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123"

const LoginSchema = z.object({
  password: z.string(),
})

authRouter.post("/login", (req, res) => {
  try {
    const { password } = LoginSchema.parse(req.body)
    
    if (password === ADMIN_PASSWORD) {
      const token = jwt.sign({ id: "admin", role: "admin" }, JWT_SECRET, { expiresIn: "24h" })
      return res.json({ token, user: { id: "admin", role: "admin" } })
    }

    return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Invalid credentials" } })
  } catch (error) {
    return res.status(400).json({ error: { code: "BAD_REQUEST", message: "Invalid payload" } })
  }
})

authRouter.get("/me", (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: { code: "UNAUTHORIZED" } })
  }

  const token = authHeader.split(" ")[1]
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    return res.json({ user: payload })
  } catch (err) {
    return res.status(401).json({ error: { code: "UNAUTHORIZED" } })
  }
})
