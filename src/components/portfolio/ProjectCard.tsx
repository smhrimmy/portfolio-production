import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { fadeInUp } from "../../design-system/motion"
import { Card, CardContent, CardHeader } from "../ui/card"
import { Badge } from "../ui/badge"
import { cn } from "@/lib/utils"
import type { Project } from "../../types/project"

type ProjectCardVariant = "default" | "featured" | "compact"

export function ProjectCard({
  project,
  index,
  variant = "default",
  className,
}: {
  project: Project
  index: number
  variant?: ProjectCardVariant
  className?: string
}) {
  const isFeatured = variant === "featured"
  const isCompact = variant === "compact"

  return (
    <motion.div variants={fadeInUp} custom={index} className={className}>
      <Link to={`/projects/${project.slug}`} className="block h-full">
        <Card
          className={cn(
            "h-full overflow-hidden flex flex-col group bg-surface border-border/80 transition-all duration-250",
            "hover:border-brand-cyan/35 hover:shadow-glow-cyan",
            isFeatured && "md:flex-row md:min-h-[280px]",
          )}
        >
          <CardHeader
            className={cn(
              "p-0 border-b border-border/50 overflow-hidden relative bg-background-secondary",
              isFeatured ? "md:w-[48%] md:border-b-0 md:border-r aspect-[16/10] md:aspect-auto" : "aspect-video",
              isCompact && "aspect-[4/3]",
            )}
          >
            {project.thumbnail ? (
              <img
                src={project.thumbnail}
                alt={project.title}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-[1.03]"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-background-secondary to-surface-elevated">
                <span className="font-mono text-brand-cyan/40 text-3xl md:text-5xl font-bold">
                  {String(project.order).padStart(2, "0")}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge variant="secondary" className="bg-background/90 border border-border/60 font-mono text-[10px] uppercase tracking-wider">
                {project.category}
              </Badge>
              {project.status === "in-progress" && (
                <Badge variant="outline" className="bg-background/90 border-warning/40 text-warning font-mono text-[10px]">
                  In Progress
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent
            className={cn(
              "p-5 md:p-6 flex-1 flex flex-col",
              isFeatured && "md:justify-center md:py-8 md:px-8",
            )}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-cyan/70 mb-2">
              {String(project.order).padStart(2, "0")} — Selected Work
            </p>
            <h3
              className={cn(
                "font-display font-semibold mb-2 group-hover:text-brand-cyan transition-colors duration-200 flex items-center gap-2",
                isFeatured ? "text-2xl md:text-3xl" : isCompact ? "text-xl" : "text-2xl",
              )}
            >
              {project.title}
              <ArrowUpRight className="w-5 h-5 opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-200 text-brand-cyan shrink-0" />
            </h3>
            <p className={cn("text-foreground-secondary flex-1", isFeatured ? "text-base md:text-lg line-clamp-4" : "text-sm md:text-base line-clamp-3")}>
              {project.shortDescription}
            </p>
            <div className="flex flex-wrap gap-2 mt-5">
              {project.technologies.slice(0, isFeatured ? 6 : 4).map((tech) => (
                <span
                  key={tech}
                  className="text-[10px] md:text-xs font-mono text-foreground-secondary border border-border/80 bg-surface-elevated/50 px-2 py-1 rounded-md"
                >
                  {tech}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}
