import fs from "fs"
import path from "path"
import { INDEX_VERSION } from "../services/PortfolioIndexer.js"

function checkIndex() {
  const indexPath = path.join(process.cwd(), "server", "data", "search-index.json")
  console.log(`Checking index at ${indexPath}...`)

  if (!fs.existsSync(indexPath)) {
    console.error("❌ Index file not found.")
    process.exit(1)
  }

  const raw = fs.readFileSync(indexPath, 'utf-8')
  const parsed = JSON.parse(raw)

  console.log("--- Index Diagnostic Report ---")
  console.log(`Version: ${parsed.version} (Expected: ${INDEX_VERSION})`)
  
  if (parsed.version !== INDEX_VERSION) {
    console.warn("⚠️ WARNING: Index version mismatch!")
  }

  console.log(`Timestamp: ${new Date(parsed.timestamp).toISOString()}`)
  console.log(`Total Documents: ${parsed.documents.length}`)
  
  const types = new Map<string, number>()
  parsed.documents.forEach((doc: any) => {
    types.set(doc.type, (types.get(doc.type) || 0) + 1)
  })

  console.log("\nBreakdown by Type:")
  for (const [type, count] of types.entries()) {
    console.log(`- ${type}: ${count}`)
  }

  // Check for duplicates
  const ids = new Set<string>()
  let hasDuplicates = false
  parsed.documents.forEach((doc: any) => {
    if (ids.has(doc.id)) {
      console.error(`❌ Duplicate ID found: ${doc.id}`)
      hasDuplicates = true
    }
    ids.add(doc.id)
  })

  if (!hasDuplicates) {
    console.log("\n✅ No duplicate IDs found.")
  }

  process.exit(hasDuplicates ? 1 : 0)
}

checkIndex()
