import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { motion } from "framer-motion"
import { staggerContainer, fadeInUp } from "../design-system/motion"
import { ProjectCard } from "../components/portfolio/ProjectCard"
import { FilterBar } from "../components/portfolio/FilterBar"
import { getProjects, getProjectCategories } from "../data/projects"
import type { Project } from "../types/project"
import { Helmet } from "react-helmet-async"

export default function Projects() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [projects, setProjects] = useState<Project[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const activeCategory = searchParams.get("category") || "All"

  useEffect(() => {
    const loadData = async () => {
      try {
        const [projData, catData] = await Promise.all([
          getProjects(),
          getProjectCategories()
        ])
        setProjects(projData)
        setCategories(catData)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const setActiveCategory = (category: string) => {
    if (category === "All") {
      searchParams.delete("category")
    } else {
      searchParams.set("category", category)
    }
    setSearchParams(searchParams)
  }

  const filteredProjects = activeCategory === "All" 
    ? projects 
    : projects.filter(p => p.category === activeCategory)

  return (
    <div className="min-h-screen pt-32 pb-24">
      <Helmet>
        <title>Projects | Portfolio OS</title>
      </Helmet>
      
      <main className="container mx-auto px-6 lg:px-8">
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="max-w-4xl"
        >
          <motion.div variants={fadeInUp} className="mb-4">
            <span className="text-sm font-mono text-primary font-semibold tracking-wider uppercase">Selected Work</span>
          </motion.div>
          
          <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            Projects built to solve real problems.
          </motion.h1>
          
          <motion.p variants={fadeInUp} className="text-xl text-muted-foreground mb-16 max-w-2xl">
            A showcase of engineering and design architecture. Focusing on robust systems, scalable interfaces, and high-performance applications.
          </motion.p>
        </motion.div>

        {!isLoading && categories.length > 0 && (
          <FilterBar 
            categories={categories} 
            activeCategory={activeCategory} 
            onSelect={setActiveCategory} 
          />
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-96 bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        ) : filteredProjects.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            {filteredProjects.map((project, idx) => (
              <ProjectCard key={project.id} project={project} index={idx} />
            ))}
          </motion.div>
        ) : (
          <div className="py-24 text-center">
            <h3 className="text-2xl font-semibold mb-2">No projects found.</h3>
            <p className="text-muted-foreground">No projects match this category.</p>
          </div>
        )}
      </main>
    </div>
  )
}
