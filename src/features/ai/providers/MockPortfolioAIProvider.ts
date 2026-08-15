import type { PortfolioAIProvider, AIResponse } from "../types"
import type { SearchDocument } from "../../../types/search"

export class MockPortfolioAIProvider implements PortfolioAIProvider {
  async answer(query: string, context: SearchDocument[], onChunk?: (chunk: string) => void, options?: { signal?: AbortSignal }): Promise<AIResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600))
    if (options?.signal?.aborted) throw new DOMException("Aborted", "AbortError")
    
    let answer = ""
    const sources: string[] = []
    const q = query.toLowerCase()
    
    if (context.length === 0) {
      answer = "I don't have verified portfolio information about that."
    } else if (q.includes("react")) {
      answer = "You have several projects using React. The portfolio features heavily utilize React and modern frontend stacks."
      sources.push(...context.map(c => c.id).slice(0, 3))
    } else if (q.includes("experience") || q.includes("work")) {
      answer = "Here is a summary of professional experience, focusing on modern web development and technical leadership roles."
      sources.push(...context.map(c => c.id).slice(0, 2))
    } else {
      answer = `Based on the verified portfolio content, here are the most relevant details I found regarding "${query}".\n\nThe portfolio includes various projects, articles, and skills that match your request.`
      sources.push(...context.map(c => c.id).slice(0, 3))
    }

    // Simulate streaming
    if (onChunk) {
      const words = answer.split(" ")
      for (let i = 0; i < words.length; i++) {
        if (options?.signal?.aborted) throw new DOMException("Aborted", "AbortError")
        onChunk(words[i] + " ")
        await new Promise(resolve => setTimeout(resolve, 50))
      }
    }

    return {
      answer,
      sources
    }
  }
}
