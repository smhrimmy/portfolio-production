import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Helmet } from "react-helmet-async"
import { getCertifications, getCertificationCategories } from "../data/certifications"
import type { Certification } from "../types/certification"
import { fadeInUp, staggerContainer } from "../design-system/motion"
import { FilterBar } from "../components/portfolio/FilterBar"
import { Button } from "../components/ui/button"
import { ExternalLink, Award } from "lucide-react"

export default function Certifications() {
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState("All")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    Promise.all([getCertifications(), getCertificationCategories()]).then(([certs, cats]) => {
      setCertifications(certs)
      setCategories(cats)
      setIsLoading(false)
    })
  }, [])

  const filteredCerts = useMemo(() => {
    if (activeCategory === "All") return certifications
    return certifications.filter(c => c.category === activeCategory)
  }, [certifications, activeCategory])

  if (isLoading) {
    return (
      <div className="container py-24 min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Certifications | Portfolio OS</title>
      </Helmet>
      
      <div className="pt-24 pb-32">
        <section className="container max-w-screen-xl py-12 md:py-24">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <span className="text-sm font-mono font-medium tracking-wider text-primary uppercase">
                Credentials
              </span>
            </motion.div>
            
            <motion.h1 
              variants={fadeInUp} 
              className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-8"
            >
              Formal Knowledge.
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-muted-foreground mb-12 max-w-2xl leading-relaxed"
            >
              Validating expertise and architectural knowledge through industry-recognized certifications and ongoing formal education.
            </motion.p>
          </motion.div>
        </section>

        <div className="container max-w-screen-xl">
          {categories.length > 0 && (
            <div className="mb-12">
              <FilterBar 
                categories={categories}
                activeCategory={activeCategory}
                onSelect={setActiveCategory}
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredCerts.length > 0 ? (
                filteredCerts.map((cert) => (
                  <motion.div
                    key={cert.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="p-8 rounded-2xl bg-surface border border-border/50 hover:border-primary/30 transition-colors flex flex-col"
                  >
                    <div className="flex items-start justify-between mb-6 gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          <Award className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-display font-semibold mb-1 leading-tight">{cert.name}</h3>
                          <p className="text-muted-foreground">{cert.issuer}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm font-mono text-muted-foreground mb-8">
                      <span>Issued: {cert.issueDate.substring(0, 4)}</span>
                      {cert.expiryDate && <span>Expires: {cert.expiryDate.substring(0, 4)}</span>}
                      {cert.credentialId && <span>ID: {cert.credentialId}</span>}
                    </div>

                    {cert.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-8">
                        {cert.skills.map(skill => (
                          <span key={skill} className="text-xs px-3 py-1 bg-muted rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-auto">
                      {cert.credentialUrl && (
                        <Button variant="outline" className="w-full sm:w-auto" asChild>
                          <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer">
                            View Credential <ExternalLink className="w-4 h-4 ml-2" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full py-24 text-center border border-dashed border-border rounded-2xl"
                >
                  <p className="text-xl text-muted-foreground">No certifications found in this category.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  )
}
