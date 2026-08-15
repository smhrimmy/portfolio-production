import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { staggerContainer, fadeInUp } from "../design-system/motion"
import { getExperience } from "../data/experience"
import type { Experience as ExperienceType } from "../types/experience"
import { Helmet } from "react-helmet-async"
import { Badge } from "../components/ui/badge"

export default function Experience() {
  const [experience, setExperience] = useState<ExperienceType[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getExperience()
        setExperience(data)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="min-h-screen pt-32 pb-24">
      <Helmet>
        <title>Experience | Portfolio OS</title>
      </Helmet>
      
      <main className="container mx-auto px-6 lg:px-8">
        <motion.div initial="initial" animate="animate" variants={staggerContainer} className="max-w-4xl mx-auto">
          <motion.div variants={fadeInUp} className="mb-4">
            <span className="text-sm font-mono text-primary font-semibold tracking-wider uppercase">Career Journey</span>
          </motion.div>
          
          <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-16">
            Where I worked and what I learned.
          </motion.h1>

          {isLoading ? (
            <div className="space-y-8">
              {[1, 2].map(i => (
                <div key={i} className="h-48 bg-muted animate-pulse rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="relative border-l border-border/50 ml-4 md:ml-0 md:border-none md:space-y-12">
              {experience.map((exp) => {
                return (
                  <motion.div key={exp.id} variants={fadeInUp} className="relative pl-8 md:pl-0 md:grid md:grid-cols-[1fr_3fr] md:gap-8 mb-12 md:mb-0">
                    {/* Timeline dot for mobile */}
                    <div className="absolute left-[-5px] top-2 w-2.5 h-2.5 rounded-full bg-primary md:hidden ring-4 ring-background" />
                    
                    <div className="mb-2 md:mb-0 text-sm font-mono text-muted-foreground flex flex-col pt-1">
                      <span>{exp.startDate} — {exp.current ? "Present" : exp.endDate}</span>
                      <span className="mt-1 opacity-70">{exp.location}</span>
                    </div>
                    
                    <div className="bg-surface border border-border/50 rounded-xl p-6 md:p-8 hover:border-foreground/20 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-2xl font-display font-semibold flex items-center gap-3">
                            {exp.company}
                            {exp.current && <Badge variant="default">Current</Badge>}
                          </h3>
                          <p className="text-lg text-muted-foreground">{exp.role}</p>
                        </div>
                        <Badge variant="outline" className="w-fit">{exp.employmentType}</Badge>
                      </div>
                      
                      <p className="text-foreground leading-relaxed mb-6">{exp.summary}</p>
                      
                      {exp.responsibilities && exp.responsibilities.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-sm font-mono font-semibold mb-3 text-foreground">Key Contributions</h4>
                          <ul className="list-disc list-outside ml-4 space-y-2 text-muted-foreground">
                            {exp.responsibilities.map((resp, i) => (
                              <li key={i} className="pl-2">{resp}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {exp.technologies && exp.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-4 border-t border-border/40 mt-6">
                          {exp.technologies.map(tech => (
                            <span key={tech} className="px-2 py-1 text-xs font-mono rounded bg-muted text-muted-foreground">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  )
}
