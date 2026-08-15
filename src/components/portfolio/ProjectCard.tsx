import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { fadeInUp } from "../../design-system/motion"
import { Card, CardContent, CardHeader } from "../ui/card"
import { Badge } from "../ui/badge"
import { ArrowUpRight } from "lucide-react"
import type { Project } from "../../types/project"

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div variants={fadeInUp} custom={index}>
      <Link to={`/projects/${project.slug}`}>
        <Card className="h-full overflow-hidden flex flex-col group hover:border-foreground/30 transition-colors duration-300 bg-surface">
          <CardHeader className="p-0 border-b border-border/40 overflow-hidden relative aspect-video bg-muted/30">
            {project.thumbnail ? (
              <img 
                src={project.thumbnail} 
                alt={project.title} 
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="font-mono text-muted-foreground/50 text-xl font-bold">{String(project.order).padStart(2, '0')}</span>
              </div>
            )}
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge variant="secondary" className="bg-background/80 backdrop-blur-md">
                {project.category}
              </Badge>
              {project.status === "in-progress" && (
                <Badge variant="outline" className="bg-background/80 backdrop-blur-md border-warning/50 text-warning-foreground">
                  In Progress
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-6 flex-1 flex flex-col">
            <h3 className="text-2xl font-display font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
              {project.title}
              <ArrowUpRight className="w-5 h-5 opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300 text-muted-foreground" />
            </h3>
            <p className="text-muted-foreground mb-6 flex-1 line-clamp-3">
              {project.shortDescription}
            </p>
            <div className="flex flex-wrap gap-2 mt-auto">
              {project.technologies.slice(0, 4).map(tech => (
                <span key={tech} className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded-md">
                  {tech}
                </span>
              ))}
              {project.technologies.length > 4 && (
                <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded-md">
                  +{project.technologies.length - 4}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}
