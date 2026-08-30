import type { PortfolioAIProvider, AIResponse } from "../types"
import type { SearchDocument } from "../../../types/search"

export class ProductionPortfolioAIProvider implements PortfolioAIProvider {
  private apiEndpoint: string

  constructor(apiEndpoint?: string) {
    this.apiEndpoint = apiEndpoint || (import.meta.env.DEV ? (import.meta.env.VITE_API_URL || "http://localhost:3001/api/ai/ask") : "/api/ai/ask")
  }

  async answer(query: string, _context: SearchDocument[], onChunk?: (chunk: string) => void, options?: { signal?: AbortSignal }): Promise<AIResponse> {
    
    let attempt = 0
    const maxRetries = 2
    
    while (attempt <= maxRetries) {
      try {
        const timeoutSignal = AbortSignal.timeout(15000)
        const signals = options?.signal ? [options.signal, timeoutSignal] : [timeoutSignal]
        const fetchSignal = (AbortSignal as any).any ? (AbortSignal as any).any(signals) : options?.signal || timeoutSignal
        
        const response = await fetch(this.apiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
          signal: fetchSignal
        })

        if (!response.ok) {
          if (response.status === 429) {
            throw new Error("RATE_LIMITED")
          }
          if (response.status >= 500 && attempt < maxRetries) {
            attempt++
            await new Promise(res => setTimeout(res, 1000 * attempt)) // exponential backoff
            continue
          }
          throw new Error("AI_UNAVAILABLE")
        }

        if (!response.body) {
          throw new Error("No response body")
        }

        const reader = response.body.getReader()
        const decoder = new TextDecoder("utf-8")
        
        let finalAnswer = ""
        let finalSources: string[] = []

        while (true) {
          const { value, done } = await reader.read()
          if (done) break

          const chunkStr = decoder.decode(value, { stream: true })
          const lines = chunkStr.split('\n')
          
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const dataStr = line.slice(6).trim()
              if (dataStr === "[DONE]") break
              if (!dataStr) continue
              
              try {
                const data = JSON.parse(dataStr)
                if (data.sources) {
                  finalSources = data.sources
                }
                if (data.chunk) {
                  finalAnswer += data.chunk
                  if (onChunk) onChunk(data.chunk)
                }
              } catch {
                console.error("Failed to parse SSE chunk", dataStr)
              }
            }
          }
        }

        return {
          answer: finalAnswer,
          sources: finalSources
        }
      } catch (error: any) {
        if (error.name === "AbortError" || error.name === "TimeoutError") {
          if (options?.signal?.aborted) {
            throw error // Client actively cancelled
          }
          if (attempt < maxRetries) {
            attempt++
            continue
          }
          throw new Error("AI_TIMEOUT")
        }
        throw error
      }
    }
    
    throw new Error("AI_UNAVAILABLE")
  }
}
