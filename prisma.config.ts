import { defineConfig } from '@prisma/config'
import dotenv from 'dotenv'
dotenv.config()
export default defineConfig({
  schema: "server/prisma/schema.prisma",
  datasource: {
    url: process.env.POSTGRES_PRISMA_URL || process.env.DIRECT_URL || process.env.DATABASE_URL,
    directUrl: process.env.POSTGRES_URL_NON_POOLING || process.env.DIRECT_URL || process.env.DATABASE_URL,
  },
})
