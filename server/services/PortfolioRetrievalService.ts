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

export class PortfolioRetrievalService {
  private indexer: PortfolioIndexer

  constructor(indexer: PortfolioIndexer) {
    this.indexer = indexer
  }

  async retrieve(query: string): Promise<RetrievedContext> {
    const queryEmbedding = await this.indexer.embedText(query)
    const docs = this.indexer.getDocuments()
    
    // Hybrid ranking: Exact match bonus + Semantic similarity
    const normalizedQuery = query.toLowerCase()

    const ranked = docs.map((doc: IndexedDocument) => {
      let score = cosineSimilarity(queryEmbedding, doc.embedding)
      
      // Keyword bonus
      if (doc.title.toLowerCase().includes(normalizedQuery)) score += 0.2
      if (doc.content.toLowerCase().includes(normalizedQuery)) score += 0.1
      
      // Metadata bonus (e.g. technologies)
      if (doc.metadata?.technologies?.some((t: string) => t.toLowerCase() === normalizedQuery)) {
        score += 0.3
      }

      return { doc, score }
    })

    // Sort by descending score and take top 3
    ranked.sort((a: { score: number }, b: { score: number }) => b.score - a.score)
    const topDocs = ranked.slice(0, 3).filter((r: { score: number }) => r.score > 0.4).map((r: { doc: IndexedDocument }) => r.doc)

    return { documents: topDocs }
  }
}
