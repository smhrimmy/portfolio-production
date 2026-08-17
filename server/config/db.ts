import { PrismaClient } from "@prisma/client"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import dotenv from "dotenv"

dotenv.config()

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
  pool?: Pool
}

function connectionOptions(rawUrl: string): { connectionString: string; ssl?: { rejectUnauthorized: boolean } } {
  const url = new URL(rawUrl)
  const sslMode = url.searchParams.get("sslmode")
  const needsSsl = Boolean(
    sslMode === "require" ||
    sslMode === "verify-full" ||
    url.hostname.includes("supabase")
  )
  url.searchParams.delete("sslmode")
  url.searchParams.delete("uselibpqcompat")
  return {
    connectionString: url.toString(),
    ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
  }
}

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set")
  }

  const options = connectionOptions(connectionString)
  const pool =
    globalForPrisma.pool ??
    new Pool({
      connectionString: options.connectionString,
      max: process.env.VERCEL ? 1 : 5,
      ssl: options.ssl,
    })

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.pool = pool
  }

  return new PrismaClient({ adapter: new PrismaPg(pool) })
}

export function getPrisma(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient()
  }
  return globalForPrisma.prisma
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = getPrisma() as unknown as Record<PropertyKey, unknown>
    const value = Reflect.get(client, prop, receiver)
    return typeof value === "function" ? value.bind(client) : value
  },
})
