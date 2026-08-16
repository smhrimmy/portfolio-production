import { PortfolioIndexer } from "./PortfolioIndexer.js"
import type { IndexedDocument } from "./PortfolioIndexer.js"

export interface RetrievedContext {
  documents: IndexedDocument[]
}

function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0
  let normA = 0
  let normB = 0
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i]
    normA += vecA[i] * vecA[i]
    normB += vecB[i] * vecB[i]
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

type QueryIntent = "EXPERIENCE" | "PROJECT" | "SKILL" | "PROFILE" | "UNKNOWN"

function classifyIntent(query: string): QueryIntent {
  const q = query.toLowerCase()
  if (q.includes("work") || q.includes("experience") || q.includes("role") || q.includes("job") || q.includes("company")) {
    return "EXPERIENCE"
  }
  if (q.includes("project") || q.includes("built") || q.includes("app") || q.includes("portfolio")) {
    return "PROJECT"
  }
  if (q.includes("skill") || q.includes("tech") || q.includes("know") || q.includes("stack")) {
    return "SKILL"
  }
  if (q.includes("who") || q.includes("about") || q.includes("contact") || q.includes("resume") || q.includes("education") || q.includes("certification")) {
    return "PROFILE"
  }
  return "UNKNOWN"
}

export class PortfolioRetrievalService {
  private indexer: PortfolioIndexer

  constructor(indexer: PortfolioIndexer) {
    this.indexer = indexer
  }

  async retrieve(query: string): Promise<RetrievedContext> {
    const queryEmbedding = await this.indexer.embedText(query)
    const docs = this.indexer.getDocuments()
    
    const normalizedQuery = query.toLowerCase()
    const intent = classifyIntent(query)
    
    // Hybrid ranking: Exact match bonus + Semantic similarity + Intent match
    const ranked = docs.map((doc: IndexedDocument) => {
      let score = cosineSimilarity(queryEmbedding, doc.embedding)
      
      // Keyword bonus
      if (doc.title.toLowerCase().includes(normalizedQuery)) score += 0.2
      if (doc.content.toLowerCase().includes(normalizedQuery)) score += 0.1
      
      // Metadata bonus (e.g. technologies)
      if (doc.metadata?.technologies?.some((t: string) => t.toLowerCase() === normalizedQuery)) {
        score += 0.3
      }

      // Intent bonus
      if (intent === "EXPERIENCE" && doc.type === "experience") score += 0.15
      if (intent === "PROJECT" && doc.type === "project") score += 0.15
      if (intent === "SKILL" && doc.type === "skill") score += 0.15
      if (intent === "PROFILE" && (doc.type === "profile" || doc.type === "resume" || doc.type === "contact" || doc.type === "certification" || doc.type === "education")) score += 0.15

      return { doc, score }
    })

    // Sort by descending score and take top 5 for LLM context (increased from 3 for deeper context)
    ranked.sort((a: { score: number }, b: { score: number }) => b.score - a.score)
    const topDocs = ranked.slice(0, 5).filter((r: { score: number }) => r.score > 0.35).map((r: { doc: IndexedDocument }) => r.doc)

    return { documents: topDocs }
  }
}
