import { motion } from "framer-motion"
import { ExternalLink, Code2 } from "lucide-react"
import { Button } from "../../ui/button"
import type { Project } from "../../../types/project"
import { fadeInUp, staggerContainer } from "../../../design-system/motion"
import { ThreeCanvas } from "../../../three/components/ThreeCanvas"
import { SceneAdapter } from "../../../three/core/adapters/SceneAdapter"

export function CaseStudyHero({ project }: { project: Project }) {
  // If we have a 3D config, we render the scene in the background
  const has3D = project.threeConfig?.enabled
  
  return (
    <div className="relative min-h-[85vh] flex items-center pt-32 pb-16 overflow-hidden">
      {has3D && (
        <div className="absolute inset-0 z-0 opacity-60">
          <ThreeCanvas sceneId={`project-${project.id}`} interactive={true}>
            <SceneAdapter sceneType={project.threeConfig?.sceneType} />
          </ThreeCanvas>
        </div>
      )}
      
      <div className="container relative z-10 mx-auto px-6 lg:px-8">
        <motion.div 
          className="max-w-4xl"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="mb-6 flex flex-wrap gap-3">
            <span className="text-sm font-mono font-medium tracking-wider text-primary uppercase bg-primary/10 px-3 py-1.5 rounded-full">
              {project.category}
            </span>
            {project.status && (
              <span className="text-sm font-mono font-medium tracking-wider text-muted-foreground uppercase bg-muted px-3 py-1.5 rounded-full">
                {project.status}
              </span>
            )}
          </motion.div>
          
          <motion.h1 
            variants={fadeInUp} 
            className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6 leading-tight"
          >
            {project.title}
          </motion.h1>
          
          <motion.p 
            variants={fadeInUp}
            className="text-2xl md:text-3xl text-foreground/90 font-display font-medium mb-12 max-w-3xl leading-snug"
          >
            {project.shortDescription}
          </motion.p>
          
          <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
            {project.liveUrl && (
              <Button asChild size="lg" className="h-12 px-6">
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  Live Demo <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
            )}
            {project.githubUrl && (
              <Button asChild size="lg" variant="outline" className="h-12 px-6">
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  Source Code <Code2 className="w-4 h-4 ml-2" />
                </a>
              </Button>
            )}
            {project.documentationUrl && (
              <Button asChild size="lg" variant="ghost" className="h-12 px-6">
                <a href={project.documentationUrl} target="_blank" rel="noopener noreferrer">
                  Documentation
                </a>
              </Button>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
