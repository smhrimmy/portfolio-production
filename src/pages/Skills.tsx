import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Helmet } from "react-helmet-async"
import { getSkills, getSkillCategories } from "../data/skills"
import type { Skill, SkillCategory } from "../types/skill"
import { fadeInUp, staggerContainer } from "../design-system/motion"
import { Badge } from "../components/ui/badge"

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [categories, setCategories] = useState<SkillCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    Promise.all([getSkills(), getSkillCategories()]).then(([s, c]) => {
      setSkills(s)
      setCategories(c)
      setIsLoading(false)
    })
  }, [])

  if (isLoading) {
    return (
      <div className="container py-24 min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  const featuredSkills = skills.filter(s => s.featured)

  return (
    <>
      <Helmet>
        <title>Skills | Portfolio OS</title>
      </Helmet>
      
      <div className="pt-24 pb-32">
        
        {/* Hero Section */}
        <section className="container max-w-screen-xl py-12 md:py-24">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <span className="text-sm font-mono font-medium tracking-wider text-primary uppercase">
                Skills & Technologies
              </span>
            </motion.div>
            
            <motion.h1 
              variants={fadeInUp} 
              className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-8"
            >
              What I Build With.
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-muted-foreground mb-12 max-w-2xl leading-relaxed"
            >
              A comprehensive overview of the tools, frameworks, and architectural patterns I use to construct reliable digital products.
            </motion.p>
          </motion.div>
        </section>

        <div className="container max-w-screen-xl space-y-32">
          
          {/* Featured Capabilities (Cards) */}
          <section>
            <h2 className="text-3xl font-display font-bold mb-10">Core Capabilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredSkills.map((skill) => {
                const category = categories.find(c => c.id === skill.categoryId)
                return (
                  <div key={skill.id} className="p-8 rounded-2xl bg-surface border border-border/50 flex flex-col h-full hover:border-primary/30 transition-colors">
                    <div className="mb-6">
                      <span className="text-xs font-mono tracking-wider text-muted-foreground uppercase mb-2 block">
                        {category?.name || "Skill"}
                      </span>
                      <h3 className="text-2xl font-display font-semibold">{skill.name}</h3>
                    </div>
                    {skill.level && (
                      <div className="mb-6">
                        <Badge variant="secondary">{skill.level}</Badge>
                      </div>
                    )}
                    <div className="mt-auto">
                      <div className="flex flex-wrap gap-2">
                        {skill.technologies.map(tech => (
                          <span key={tech} className="text-sm px-3 py-1 bg-muted rounded-full">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Technology Matrix (List view) */}
          <section>
            <h2 className="text-3xl font-display font-bold mb-10">Technology Matrix</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
              {categories.map(category => {
                const categorySkills = skills.filter(s => s.categoryId === category.id)
                if (categorySkills.length === 0) return null
                
                return (
                  <div key={category.id}>
                    <h3 className="text-xl font-display font-semibold mb-6 pb-4 border-b border-border/50 text-foreground/90">
                      {category.name}
                    </h3>
                    <ul className="space-y-4">
                      {categorySkills.map(skill => (
                        <li key={skill.id} className="flex flex-wrap items-baseline gap-2">
                          <span className="font-medium text-lg">{skill.name}</span>
                          {skill.technologies.length > 0 && (
                            <span className="text-muted-foreground">
                              · {skill.technologies.join(" · ")}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </section>
          
        </div>
      </div>
    </>
  )
}
