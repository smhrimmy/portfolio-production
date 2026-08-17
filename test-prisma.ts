import { PrismaClient } from "@prisma/client"
import { PrismaLibSql } from "@prisma/adapter-libsql"

try {
  const adapter = new PrismaLibSql({ url: "file:./dev.db" })
  const prisma = new PrismaClient({ adapter })

  await prisma.profile.findFirst()
  console.log("SUCCESS!")
} catch (error) {
  console.error("FAIL:", error)
}
