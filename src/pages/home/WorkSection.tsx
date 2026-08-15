import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { ProjectCard } from "../../components/portfolio/ProjectCard"
import type { Project } from "../../types/project"
import { fadeInUp } from "../../design-system/motion"

export function WorkSection({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null

  const [featured, ...rest] = projects
  const secondary = rest.slice(0, 2)
  const remaining = rest.slice(2)

  return (
    <section id="work" className="py-24 md:py-32 relative bg-background-secondary/40 border-t border-border/50">
      <div className="container max-w-screen-2xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand-cyan mb-3">Portfolio OS / Work</p>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-3">Selected Work</h2>
            <p className="text-foreground-secondary text-base md:text-lg max-w-2xl font-sans">
              Proof of capability — architecture, craft, and shipped product thinking.
            </p>
          </motion.div>
          <Button variant="ghost" asChild className="hidden md:inline-flex shrink-0 font-mono text-xs uppercase tracking-wider hover:text-brand-cyan">
            <Link to="/projects">View All Projects</Link>
          </Button>
        </div>

        <div className="space-y-8 md:space-y-10">
          {featured && (
            <ProjectCard project={featured} index={0} variant="featured" />
          )}

          {secondary.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
              {secondary.map((project, idx) => (
                <ProjectCard key={project.id} project={project} index={idx + 1} variant="compact" />
              ))}
            </div>
          )}

          {remaining.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {remaining.map((project, idx) => (
                <ProjectCard key={project.id} project={project} index={idx + 3} />
              ))}
            </div>
          )}
        </div>

        <div className="mt-12 md:hidden">
          <Button variant="outline" className="w-full border-border hover:border-brand-cyan/40" asChild>
            <Link to="/projects">View All Projects</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
