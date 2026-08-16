import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft, ExternalLink, Code as GithubIcon, Calendar } from "lucide-react"
import Markdown from "react-markdown"
import { SeoHead } from "../components/seo/SeoHead"

export function LabExperiment() {
  const { slug } = useParams()
  const [experiment, setExperiment] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001"

  useEffect(() => {
    fetchExperiment()
  }, [slug])

  const fetchExperiment = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/public/experiments/${slug}`)
      if (res.ok) setExperiment(await res.json())
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (!experiment) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold text-neutral-50 mb-4">Experiment Not Found</h1>
        <p className="text-neutral-400 mb-8">The experiment you're looking for doesn't exist or has been removed.</p>
        <Link to="/lab" className="text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Lab
        </Link>
      </div>
    )
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-12 md:py-20">
      <SeoHead
        title={experiment.seoConfig?.title || `${experiment.title} | Lab`}
        description={experiment.seoConfig?.description || experiment.description}
        canonicalUrl={`/lab/${experiment.slug}`}
        image={experiment.seoConfig?.ogImageId ? `${apiUrl}/api/public/media/${experiment.seoConfig.ogImageId}` : undefined}
      />

      <div className="mb-8">
        <Link to="/lab" className="text-neutral-500 hover:text-neutral-300 inline-flex items-center gap-2 text-sm font-medium transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Lab
        </Link>

        <div className="flex items-center gap-3 mb-4">
          <span className="text-sm font-medium text-indigo-400">{experiment.category}</span>
          <span className="text-neutral-600">•</span>
          <span className="text-sm text-neutral-500 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(experiment.publishDate).toLocaleDateString()}
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-neutral-50 mb-6 leading-tight">
          {experiment.title}
        </h1>
        
        <p className="text-xl text-neutral-400 leading-relaxed mb-8">
          {experiment.description}
        </p>

        <div className="flex flex-wrap gap-4">
          {experiment.demoUrl && (
            <a 
              href={experiment.demoUrl} 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
            >
              <ExternalLink className="w-4 h-4" /> View Live Demo
            </a>
          )}
          {experiment.githubUrl && (
            <a 
              href={experiment.githubUrl} 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-5 py-2.5 rounded-lg font-medium transition-colors"
            >
              <GithubIcon className="w-4 h-4" /> Source Code
            </a>
          )}
        </div>
      </div>

      {experiment.coverMediaId && (
        <div className="mb-12 rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 aspect-video">
          <img 
            src={`${apiUrl}/api/public/media/${experiment.coverMediaId}`} 
            alt={experiment.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-3 prose prose-invert prose-indigo max-w-none">
          <Markdown>{experiment.content}</Markdown>
        </div>

        <div className="md:col-span-1 space-y-8 border-t md:border-t-0 md:border-l border-neutral-800 pt-8 md:pt-0 md:pl-8">
          <div>
            <h3 className="text-sm font-semibold text-neutral-200 uppercase tracking-wider mb-4">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {experiment.techStack?.map((tech: string) => (
                <span key={tech} className="bg-neutral-900 border border-neutral-800 text-neutral-300 px-2.5 py-1 rounded text-sm">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
