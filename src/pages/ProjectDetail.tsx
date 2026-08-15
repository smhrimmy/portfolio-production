import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { getProjectBySlug, getProjects } from "../data/projects"
import type { Project } from "../types/project"
import { Helmet } from "react-helmet-async"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { CaseStudyRenderer } from "../components/portfolio/case-study/CaseStudyRenderer"

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [project, setProject] = useState<Project | null>(null)
  const [prevProject, setPrevProject] = useState<Project | null>(null)
  const [nextProject, setNextProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    const load = async () => {
      try {
        const [data, allProjects] = await Promise.all([
          getProjectBySlug(slug),
          getProjects()
        ])
        setProject(data)
        
        if (data && allProjects.length > 0) {
          const currentIndex = allProjects.findIndex(p => p.id === data.id)
          if (currentIndex > 0) {
            setPrevProject(allProjects[currentIndex - 1])
          } else {
            setPrevProject(null)
          }
          
          if (currentIndex !== -1 && currentIndex < allProjects.length - 1) {
            setNextProject(allProjects[currentIndex + 1])
          } else {
            setNextProject(null)
          }
        }
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [slug])

  if (isLoading) {
    return <div className="min-h-screen pt-32 pb-24 flex items-center justify-center">Loading...</div>
  }

  if (!project) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
        <Link to="/projects" className="px-6 py-3 bg-primary text-primary-foreground rounded-md">
          Return to Projects
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{project.seoTitle || `${project.title} | Portfolio OS`}</title>
        <meta name="description" content={project.seoDescription || project.shortDescription} />
      </Helmet>
      
      {/* Sticky Top Navigation specifically for the case study */}
      <div className="sticky top-16 z-40 w-full border-b border-border/30 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-6 lg:px-8 py-4 flex items-center">
          <Link to="/projects" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            All Projects
          </Link>
          <div className="ml-auto hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#overview" className="hover:text-foreground transition-colors">Overview</a>
            {project.techStack && project.techStack.length > 0 && (
              <a href="#tech-stack" className="hover:text-foreground transition-colors">Tech Stack</a>
            )}
            {project.architecture && (
              <a href="#architecture" className="hover:text-foreground transition-colors">Architecture</a>
            )}
            {project.results && project.results.length > 0 && (
              <a href="#results" className="hover:text-foreground transition-colors">Results</a>
            )}
          </div>
        </div>
      </div>

      <main>
        <CaseStudyRenderer project={project} />
      </main>

      {/* Next/Prev Navigation */}
      <section className="py-24 border-t border-border/50 bg-surface/30">
        <div className="container mx-auto px-6 lg:px-8 max-w-4xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex-1 w-full text-left">
              {prevProject ? (
                <Link to={`/projects/${prevProject.slug}`} className="group block">
                  <span className="text-sm font-mono text-muted-foreground uppercase tracking-widest mb-2 block">Previous Project</span>
                  <div className="flex items-center text-2xl font-display font-medium text-foreground/80 group-hover:text-primary transition-colors">
                    <ArrowLeft className="w-6 h-6 mr-3 transform group-hover:-translate-x-2 transition-transform" />
                    {prevProject.title}
                  </div>
                </Link>
              ) : (
                <Link to="/projects" className="group block">
                  <span className="text-sm font-mono text-muted-foreground uppercase tracking-widest mb-2 block">Back to</span>
                  <div className="flex items-center text-2xl font-display font-medium text-foreground/80 group-hover:text-primary transition-colors">
                    <ArrowLeft className="w-6 h-6 mr-3 transform group-hover:-translate-x-2 transition-transform" />
                    All Projects
                  </div>
                </Link>
              )}
            </div>
            
            <div className="hidden md:block w-px h-16 bg-border/50" />
            
            <div className="flex-1 w-full text-right flex flex-col items-end">
              {nextProject ? (
                <Link to={`/projects/${nextProject.slug}`} className="group block text-right">
                  <span className="text-sm font-mono text-muted-foreground uppercase tracking-widest mb-2 block">Next Project</span>
                  <div className="flex items-center justify-end text-2xl font-display font-medium text-foreground/80 group-hover:text-primary transition-colors">
                    {nextProject.title}
                    <ArrowRight className="w-6 h-6 ml-3 transform group-hover:translate-x-2 transition-transform" />
                  </div>
                </Link>
              ) : (
                <Link to="/projects" className="group block text-right">
                  <span className="text-sm font-mono text-muted-foreground uppercase tracking-widest mb-2 block">Back to</span>
                  <div className="flex items-center justify-end text-2xl font-display font-medium text-foreground/80 group-hover:text-primary transition-colors">
                    All Projects
                    <ArrowRight className="w-6 h-6 ml-3 transform group-hover:translate-x-2 transition-transform" />
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
