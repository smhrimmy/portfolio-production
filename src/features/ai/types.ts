import type { SearchDocument } from "../../types/search"

export interface AIResponse {
  answer: string
  sources: string[] // Array of document IDs used to generate the answer
}

export interface PortfolioAIProvider {
  answer(query: string, context: SearchDocument[], onChunk?: (chunk: string) => void, options?: { signal?: AbortSignal }): Promise<AIResponse>
}

export interface EmbeddingProvider {
  embed(text: string): Promise<number[]>
}
