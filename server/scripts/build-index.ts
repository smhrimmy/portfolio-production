import { PortfolioIndexer } from "../services/PortfolioIndexer.js"

async function main() {
  const indexer = new PortfolioIndexer()
  
  // Simulated CMS content fetch.
  // In reality, this would dynamically import the compiled TS files from src/data
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
    }
  ]

  try {
    await indexer.buildAndSaveIndex(mockContent)
    console.log("✅ Build index complete.")
    process.exit(0)
  } catch (error) {
    console.error("❌ Failed to build index:", error)
    process.exit(1)
  }
}

main()
