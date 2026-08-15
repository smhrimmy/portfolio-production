import type { Project } from "../types/project"

const LOCAL_PROJECTS: Project[] = [
  {
    id: "proj-1",
    slug: "portfolio-os",
    title: "Portfolio OS",
    shortDescription: "A sophisticated personal operating system and digital showcase.",
    category: "Full Stack",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Framer Motion", "Three.js"],
    techStack: [
      {
        category: "Frontend",
        items: [
          { name: "React", reason: "Component-based UI architecture." },
          { name: "TypeScript", reason: "End-to-end type safety and self-documenting code." },
        ]
      },
      {
        category: "Graphics & Motion",
        items: [
          { name: "Three.js & R3F", reason: "Web-native 3D storytelling." },
          { name: "Framer Motion", reason: "Declarative, physics-based UI transitions." }
        ]
      }
    ],
    featured: true,
    status: "production",
    role: "Lead Architect & Developer",
    duration: "2026",
    problem: "Traditional developer portfolios often act merely as static CVs. The challenge was to build a portfolio that actively demonstrates technical capability—operating as a 'system' rather than a document—while remaining highly performant, accessible, and cinematic.",
    goals: [
      "Prove architectural maturity through a modular, CMS-ready codebase.",
      "Achieve 60fps cinematic scroll transitions without scroll-jacking.",
      "Provide a robust WebGL/3D experience that degrades gracefully."
    ],
    constraints: [
      "Must score 100/100 on Lighthouse Performance despite using 3D.",
      "All visual choreography must respect 'prefers-reduced-motion'.",
      "No unnecessary external library bloat."
    ],
    architecture: "The Portfolio OS is built as a single-page application heavily relying on React Context and Zustand for state. A dedicated 3D scene manager mounts independently behind the DOM, utilizing 'useFrame' and DOM querying to synchronize canvas elements with semantic HTML content.",
    challenges: [
      {
        challenge: "Synchronizing React DOM with WebGL cleanly.",
        solution: "Decoupled 3D state from React render cycle by reading DOM coordinates and scroll progress directly inside the WebGL requestAnimationFrame loop.",
        result: "Eliminated React re-renders during scroll, maintaining a perfect 60fps."
      }
    ],
    results: [
      "0 hydration errors or console warnings in production.",
      "Lighthouse metrics consistently maxed out across all 4 categories.",
      "Fully functional fallback for systems without WebGL capabilities."
    ],
    lessons: [
      "Decoupling UI state from animation state is critical for performant WebGL.",
      "Always design data models early; migrating from flat data to structured data later is expensive."
    ],
    threeConfig: {
      enabled: true,
      sceneType: "PortfolioCore"
    },
    githubUrl: "https://github.com/example/portfolio-os",
    order: 1,
  },
  {
    id: "proj-2",
    slug: "design-system-core",
    title: "Design System Core",
    shortDescription: "An accessible, framework-agnostic component library.",
    category: "Design Systems",
    technologies: ["Figma", "React", "Radix UI", "Tailwind CSS"],
    techStack: [
      {
        category: "UI Foundation",
        items: [
          { name: "React", reason: "Core component rendering." },
          { name: "Radix UI", reason: "Headless, unstyled accessible primitives." },
          { name: "Tailwind CSS", reason: "Utility-first token system mapping." }
        ]
      }
    ],
    featured: true,
    status: "completed",
    role: "Design Engineer",
    duration: "2025",
    problem: "The engineering team was suffering from inconsistent UI patterns across multiple product suites, leading to severe design debt and massive accessibility compliance gaps.",
    goals: [
      "Standardize 40+ UI components.",
      "Achieve WCAG AA compliance out of the box."
    ],
    results: [
      "Reduced time-to-market for new features by 40%.",
      "Achieved 100% WCAG AA compliance across core flows."
    ],
    order: 2,
  },
  {
    id: "proj-3",
    slug: "fintech-dashboard",
    title: "FinTech Analytics Dashboard",
    shortDescription: "High-performance data visualization for financial metrics.",
    category: "Frontend",
    technologies: ["Vue.js", "D3.js", "TypeScript", "Node.js"],
    featured: false,
    status: "completed",
    problem: "Financial analysts were using static reports. We needed an interactive, real-time analytics dashboard capable of rendering 100,000+ data points smoothly.",
    order: 3,
  }
]

export async function getProjects(): Promise<Project[]> {
  return LOCAL_PROJECTS.sort((a, b) => a.order - b.order)
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const featured = LOCAL_PROJECTS.filter((p) => p.featured)
  if (featured.length === 0) {
    return LOCAL_PROJECTS.slice(0, 3)
  }
  return featured.sort((a, b) => a.order - b.order)
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  return LOCAL_PROJECTS.find((p) => p.slug === slug) || null
}

export async function getProjectsByCategory(category: string): Promise<Project[]> {
  if (category === "All") return getProjects()
  return LOCAL_PROJECTS.filter((p) => p.category === category).sort((a, b) => a.order - b.order)
}

export async function getProjectCategories(): Promise<string[]> {
  const categories = new Set(LOCAL_PROJECTS.map((p) => p.category))
  return Array.from(categories)
}
