import { describe, it, expect, beforeAll } from "vitest"
import { PortfolioIndexer } from "../../server/services/PortfolioIndexer.js"
import { PortfolioRetrievalService } from "../../server/services/PortfolioRetrievalService.js"

describe("AI Grounding & Retrieval Test Suite", () => {
  let indexer: PortfolioIndexer
  let retrievalService: PortfolioRetrievalService

  beforeAll(async () => {
    indexer = new PortfolioIndexer()
    // For tests, we'll build a memory index instead of loading from disk
    const mockContent = [
      {
        id: "proj_1",
        type: "Project",
        title: "Portfolio OS",
        content: "A React and Three.js powered portfolio application with an AI assistant.",
        url: "/projects/portfolio-os",
        published: true,
        metadata: { technologies: ["React", "Three.js", "TypeScript"] }
      },
      {
        id: "exp_1",
        type: "Experience",
        title: "Senior Frontend Engineer",
        content: "Led the development of scalable React applications, utilizing modern web standards and leading teams.",
        url: "/experience",
        published: true,
        metadata: { technologies: ["React", "Node", "AWS"] }
      },
      {
        id: "proj_draft",
        type: "Project",
        title: "Secret Draft Project",
        content: "This project is not finished and should not be indexed.",
        url: "/projects/draft",
        published: false,
        metadata: { technologies: ["Vue"] }
      },
      {
        id: "noise_1",
        type: "Article",
        title: "Apples and Oranges",
        content: "This has nothing to do with web development, just overlapping words like React to a situation.",
        url: "/writing/apples",
        published: true,
        metadata: {}
      }
    ]
    await indexer.buildAndSaveIndex(mockContent)
    retrievalService = new PortfolioRetrievalService(indexer)
  }, 60000)

  it("should retrieve React projects successfully", async () => {
    const result = await retrievalService.retrieve("Which projects use React?")
    expect(result.documents.length).toBeGreaterThan(0)
    // Check if proj_1 is in the results
    const hasProj1 = result.documents.some(d => d.id === "proj_1")
    expect(hasProj1).toBe(true)
  })

  it("should not retrieve unpublished or draft content", async () => {
    const result = await retrievalService.retrieve("Secret Draft")
    const hasDraft = result.documents.some(d => d.id === "proj_draft")
    expect(hasDraft).toBe(false)
  })

  it("should return empty results for impossible queries (Empty Search)", async () => {
    const result = await retrievalService.retrieve("xyzabc123 impossible query")
    expect(result.documents.length).toBe(0)
  })

  it("should rank exact title matches highest", async () => {
    const result = await retrievalService.retrieve("Portfolio OS")
    expect(result.documents[0].id).toBe("proj_1")
  })

  it("should defend against semantic noise", async () => {
    // "React to a situation" vs actual React technologies
    const result = await retrievalService.retrieve("React development")
    // proj_1 and exp_1 should rank higher than noise_1
    const idxProj1 = result.documents.findIndex(d => d.id === "proj_1")
    const idxNoise = result.documents.findIndex(d => d.id === "noise_1")
    if (idxNoise !== -1 && idxProj1 !== -1) {
      expect(idxProj1).toBeLessThan(idxNoise)
    }
  })
})
