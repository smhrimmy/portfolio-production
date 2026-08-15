import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { ProjectCard } from "../../components/portfolio/ProjectCard"
import type { Project } from "../../types/project"
import { fadeInUp } from "../../design-system/motion"

export function WorkSection({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null

  return (
    <section id="work" className="py-32 relative bg-background">
      <div className="container max-w-screen-2xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Selected Work</h2>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl font-sans">
              A curated selection of products focusing on architecture and user experience.
            </p>
          </motion.div>
          <Button variant="ghost" asChild className="hidden md:inline-flex shrink-0">
            <Link to="/projects">View All Projects</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {projects.map((project, idx) => (
            <ProjectCard key={project.id} project={project} index={idx} />
          ))}
        </div>
        
        <div className="mt-12 md:hidden">
          <Button variant="outline" className="w-full" asChild>
            <Link to="/projects">View All Projects</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
