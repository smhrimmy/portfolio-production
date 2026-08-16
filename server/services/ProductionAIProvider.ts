import type { IndexedDocument } from "./PortfolioIndexer.js"

export interface AIChunk {
  text?: string
  sources?: string[]
}

function buildDeterministicAnswer(query: string, context: IndexedDocument[]): string {
  const q = query.toLowerCase()

  if (q.includes("who are you") || q.includes("about you")) {
    const profile = context.find(c => c.type === "profile")
    if (profile) return `I am ${profile.title}. ${profile.content}`
  }

  if (q.includes("contact") || q.includes("hire") || q.includes("email") || q.includes("github") || q.includes("linkedin")) {
    const profile = context.find(c => c.type === "profile")
    if (profile) return `You can reach me via email, GitHub, or LinkedIn. ${profile.content}`
  }

  if (q.includes("technologies") || q.includes("stack") || q.includes("experience with") || q.includes("skills")) {
    const skills = context.filter(c => c.type === "skill")
    if (skills.length > 0) {
      return "My core technologies include: " + skills.map(s => s.title).join(", ") + "."
    }
  }

  if (q.includes("work") || q.includes("experience") || q.includes("where have you worked")) {
    const exp = context.filter(c => c.type === "experience")
    if (exp.length > 0) {
      return "I have worked at: " + exp.map(e => e.title).join(", ") + "."
    }
  }

  if (q.includes("projects") || q.includes("what have you built")) {
    const projects = context.filter(c => c.type === "project")
    if (projects.length > 0) {
      return "Some of my notable projects include: " + projects.map(p => p.title).join(", ") + "."
    }
  }

  // Fallback to summarizing exactly what was found, or returning the hard failure message
  if (context.length === 0) {
    return "I don't have verified portfolio information for that question."
  }

  // If there's context but no specific heuristic matched, just return the exact context contents
  return "Based on my portfolio data: " + context.map(c => c.content).join(" ")
}

export class ProductionAIProvider {
  isLiveMode(): boolean {
    return false // Force deterministic local mode
  }

  async *stream(query: string, context: IndexedDocument[], options?: { signal?: AbortSignal }): AsyncIterable<AIChunk> {
    const sourceIds = context.map((doc) => doc.id)
    yield { sources: sourceIds }

    if (options?.signal?.aborted) return

    // Simulate slight typing delay for UX
    const answer = buildDeterministicAnswer(query, context)
    const words = answer.split(" ")
    
    for (const word of words) {
      if (options?.signal?.aborted) return
      yield { text: word + " " }
      await new Promise(r => setTimeout(r, 20)) // 20ms per word
    }
  }
}
