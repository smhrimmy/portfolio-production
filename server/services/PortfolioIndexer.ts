import { pipeline } from "@xenova/transformers"
import fs from "fs"
import path from "path"
import { z } from "zod"

export const INDEX_VERSION = "1.0.0"

export interface IndexedDocument {
  id: string
  type: string
  title: string
  content: string
  url: string
  published: boolean
  embedding: number[]
  metadata: Record<string, any>
}

// Zod schema for validation on load
const DocumentSchema = z.object({
  id: z.string(),
  type: z.string(),
  title: z.string(),
  content: z.string(),
  url: z.string(),
  published: z.boolean(),
  embedding: z.array(z.number()),
  metadata: z.record(z.string(), z.any())
})

const IndexSnapshotSchema = z.object({
  version: z.string(),
  timestamp: z.number(),
  documents: z.array(DocumentSchema)
})

export class PortfolioIndexer {
  private documents: IndexedDocument[] = []
  private embedder: any = null
  private indexPath: string

  constructor(indexPath: string = path.join(process.cwd(), "server", "data", "search-index.json")) {
    this.indexPath = indexPath
  }

  async initEmbedder() {
    if (!this.embedder) {
      this.embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
    }
  }

  async embedText(text: string): Promise<number[]> {
    await this.initEmbedder()
    const result = await this.embedder(text, { pooling: 'mean', normalize: true })
    return Array.from(result.data)
  }

  // Used by the build script
  async buildAndSaveIndex(mockContent: Omit<IndexedDocument, 'embedding'>[]) {
    console.log("Building Portfolio Vector Index...")
    await this.initEmbedder()

    this.documents = []
    
    // Check duplicates
    const ids = new Set<string>()

    for (const doc of mockContent) {
      if (!doc.published) continue
      
      if (ids.has(doc.id)) {
        throw new Error(`Duplicate document ID found during indexing: ${doc.id}`)
      }
      ids.add(doc.id)

      const embedding = await this.embedText(`${doc.title} ${doc.content}`)
      this.documents.push({
        ...doc,
        embedding
      })
    }

    const snapshot = {
      version: INDEX_VERSION,
      timestamp: Date.now(),
      documents: this.documents
    }

    const dir = path.dirname(this.indexPath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    fs.writeFileSync(this.indexPath, JSON.stringify(snapshot, null, 2))
    console.log(`Index built and saved to ${this.indexPath} with ${this.documents.length} documents.`)
  }

  // Used by the server on startup
  async loadIndex() {
    console.log(`Loading index from ${this.indexPath}...`)
    if (!fs.existsSync(this.indexPath)) {
      throw new Error(`Index file not found at ${this.indexPath}. Please run 'npm run index' to generate it.`)
    }

    const raw = fs.readFileSync(this.indexPath, 'utf-8')
    let parsed
    try {
      parsed = JSON.parse(raw)
    } catch {
      throw new Error("Failed to parse index JSON. File may be corrupted.")
    }

    const validation = IndexSnapshotSchema.safeParse(parsed)
    if (!validation.success) {
      throw new Error(`Index validation failed: ${validation.error.message}`)
    }

    if (validation.data.version !== INDEX_VERSION) {
      throw new Error(`Incompatible index version. Expected ${INDEX_VERSION}, got ${validation.data.version}. Please rebuild the index.`)
    }

    this.documents = validation.data.documents
    console.log(`Successfully loaded ${this.documents.length} documents into memory.`)
  }

  getDocuments() {
    return this.documents
  }
}
