import { motion } from "framer-motion"
import { fadeInUp } from "../../../design-system/motion"
import type { Project } from "../../../types/project"

export function CaseStudyTechStack({ techStack }: { techStack: NonNullable<Project['techStack']> }) {
  if (techStack.length === 0) return null

  return (
    <section id="tech-stack" className="py-24">
      <div className="container mx-auto px-6 lg:px-8 max-w-screen-xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInUp}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Technology Stack</h2>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Selected tools and the engineering rationale behind them.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {techStack.map((group, idx) => (
            <motion.div 
              key={group.category}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: idx * 0.1 } }
              }}
              className="space-y-6"
            >
              <h3 className="text-sm font-mono text-primary uppercase tracking-widest border-b border-border/50 pb-2">
                {group.category}
              </h3>
              <ul className="space-y-4">
                {group.items.map(item => (
                  <li key={item.name} className="flex flex-col">
                    <span className="font-semibold text-foreground text-lg mb-1">{item.name}</span>
                    {item.reason && (
                      <span className="text-muted-foreground text-sm leading-relaxed">{item.reason}</span>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
