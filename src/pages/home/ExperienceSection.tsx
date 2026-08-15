import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Button } from "../../components/ui/button"
import type { Experience } from "../../types/experience"
import { fadeInUp } from "../../design-system/motion"

export function ExperienceSection({ experience }: { experience: Experience[] }) {
  if (experience.length === 0) return null

  return (
    <section id="experience" className="py-24 border-t border-border/30">
      <div className="container max-w-screen-xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Experience</h2>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl font-sans">
              Where I've worked and the impact I've made.
            </p>
          </motion.div>
          <Button variant="ghost" asChild className="hidden md:inline-flex shrink-0">
            <Link to="/experience">Full Career Journey</Link>
          </Button>
        </div>
        
        <div className="relative border-l border-border/50 ml-4 md:ml-6 space-y-12 pb-8">
          {experience.map((exp, idx) => (
            <motion.div 
              key={exp.id} 
              className="relative pl-8 md:pl-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: idx * 0.1 } }
              }}
            >
              {/* Timeline dot */}
              <div className="absolute left-0 top-2 -translate-x-1/2 w-3 h-3 rounded-full bg-surface border-2 border-primary" />
              
              <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 mb-2">
                <h3 className="text-2xl font-display font-semibold text-foreground">{exp.company}</h3>
                <span className="font-mono text-sm text-primary bg-primary/10 px-3 py-1 rounded-full w-fit">
                  {exp.startDate.substring(0, 4)} — {exp.current ? "Present" : exp.endDate?.substring(0, 4)}
                </span>
              </div>
              <p className="text-lg text-muted-foreground mb-4">{exp.role}</p>
              
              {exp.summary && (
                <p className="text-foreground/80 font-sans max-w-3xl leading-relaxed">
                  {exp.summary}
                </p>
              )}
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 md:hidden">
          <Button variant="outline" className="w-full" asChild>
            <Link to="/experience">Full Career Journey</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
