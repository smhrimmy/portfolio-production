import { motion } from "framer-motion"
import { fadeInUp } from "../../../design-system/motion"
import type { Project } from "../../../types/project"

export function CaseStudyOverview({ project }: { project: Project }) {
  const hasMeta = project.role || project.duration || project.team || project.technologies.length > 0
  
  return (
    <section id="overview" className="py-24 border-y border-border/30 bg-surface/30">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          
          {/* Metadata Sidebar */}
          {hasMeta && (
            <motion.div 
              className="lg:col-span-4 space-y-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeInUp}
            >
              {project.role && (
                <div>
                  <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-widest mb-2">Role</h3>
                  <p className="text-foreground font-medium">{project.role}</p>
                </div>
              )}
              {project.duration && (
                <div>
                  <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-widest mb-2">Timeline</h3>
                  <p className="text-foreground font-medium">{project.duration}</p>
                </div>
              )}
              {project.team && project.team.length > 0 && (
                <div>
                  <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-widest mb-2">Team</h3>
                  <ul className="text-foreground font-medium">
                    {project.team.map(t => <li key={t}>{t}</li>)}
                  </ul>
                </div>
              )}
              {project.technologies && project.technologies.length > 0 && (
                <div>
                  <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-widest mb-2">Core Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 6).map(tech => (
                      <span key={tech} className="px-2 py-1 bg-muted rounded text-sm text-foreground">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Narrative Overview */}
          <motion.div 
            className={`lg:col-span-${hasMeta ? '8' : '12'} prose prose-lg dark:prose-invert max-w-none`}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
          >
            {project.description && (
              <div className="mb-12">
                <p className="text-xl md:text-2xl leading-relaxed text-foreground/90 font-display">
                  {project.description}
                </p>
              </div>
            )}
            
            {project.problem && (
              <div id="problem" className="mb-12">
                <h2>The Problem</h2>
                <p>{project.problem}</p>
              </div>
            )}
            
            {project.goals && project.goals.length > 0 && (
              <div id="goals" className="mb-12">
                <h2>Project Goals</h2>
                <ul className="space-y-2">
                  {project.goals.map((goal, idx) => (
                    <li key={idx}>
                      <strong className="text-primary mr-2 font-mono">{String(idx + 1).padStart(2, '0')}</strong> 
                      {goal}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {project.constraints && project.constraints.length > 0 && (
              <div id="constraints">
                <h2>Constraints & Considerations</h2>
                <ul>
                  {project.constraints.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  )
}
