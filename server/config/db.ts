import dotenv from "dotenv"
dotenv.config()

import { PrismaClient } from "@prisma/client"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"

const rawConnectionString = process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL || process.env.DIRECT_URL || ""
// Strip sslmode from query params so it doesn't override rejectUnauthorized: false in pg
const connectionString = rawConnectionString.replace(/([?&])sslmode=[^&]*(&|$)/g, '$1').replace(/[?&]$/, '')

const pool = new Pool({ 
  connectionString,
  ssl: { rejectUnauthorized: false }
})
const adapter = new PrismaPg(pool)

export const prisma = new PrismaClient({ adapter })
