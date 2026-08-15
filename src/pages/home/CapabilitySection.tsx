import { motion } from "framer-motion"
import { fadeInUp } from "../../design-system/motion"
import { Button } from "../../components/ui/button"
import { Link } from "react-router-dom"
import type { Skill } from "../../types/skill"

export function CapabilitySection({ skills }: { skills: Skill[] }) {
  if (skills.length === 0) return null

  // Semantic grouping
  const frontend = skills.filter(s => s.categoryId === "frontend")
  const backend = skills.filter(s => s.categoryId === "backend")
  const tools = skills.filter(s => s.categoryId !== "frontend" && s.categoryId !== "backend")

  const renderGroup = (title: string, group: Skill[]) => (
    <div className="space-y-4">
      <h3 className="text-sm font-mono font-medium tracking-wider text-muted-foreground uppercase">{title}</h3>
      <div className="flex flex-wrap gap-3">
        {group.map(skill => (
          <div key={skill.id} className="px-4 py-2 rounded-xl border border-border/50 bg-surface/50 text-foreground hover:border-primary/40 hover:bg-surface transition-colors cursor-default">
            {skill.name}
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <section id="capabilities" className="py-24">
      <div className="container max-w-screen-xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Core Capabilities</h2>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl font-sans">
              The technical foundation used to architect and build digital products.
            </p>
          </motion.div>
          <Button variant="ghost" asChild className="hidden md:inline-flex shrink-0">
            <Link to="/skills">View Technical Profile</Link>
          </Button>
        </div>
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInUp}
          className="grid grid-cols-1 lg:grid-cols-3 gap-12"
        >
          {frontend.length > 0 && renderGroup("Frontend & UX", frontend)}
          {backend.length > 0 && renderGroup("Backend & Systems", backend)}
          {tools.length > 0 && renderGroup("Infrastructure & Tools", tools)}
        </motion.div>
        
        <div className="mt-12 md:hidden">
          <Button variant="outline" className="w-full" asChild>
            <Link to="/skills">View Technical Profile</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
