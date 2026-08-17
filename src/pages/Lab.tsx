import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Beaker, Star, ArrowRight } from "lucide-react"

export function Lab() {
  const [experiments, setExperiments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:3001" : "")

  useEffect(() => {
    fetchExperiments()
  }, [])

  const fetchExperiments = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/public/experiments`)
      if (res.ok) setExperiments(await res.json())
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-20">
      <div className="mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-neutral-50 mb-4 flex items-center gap-4">
          <Beaker className="w-10 h-10 text-indigo-500" /> The Lab
        </h1>
        <p className="text-xl text-neutral-400 max-w-2xl">
          A collection of experiments, prototypes, WebGL playgrounds, and developer tools.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {experiments.map(exp => (
          <Link 
            key={exp.id} 
            to={`/lab/${exp.slug}`}
            className="group bg-neutral-900 border border-neutral-800 hover:border-indigo-500/50 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col"
          >
            <div className="aspect-video bg-neutral-800 relative overflow-hidden">
              {exp.coverMediaId ? (
                <img 
                  src={`${apiUrl}/api/public/media/${exp.coverMediaId}`} 
                  alt={exp.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-700">
                  <Beaker className="w-12 h-12" />
                </div>
              )}
              {exp.featured && (
                <div className="absolute top-4 right-4 bg-yellow-500/90 text-neutral-950 px-2 py-1 rounded text-xs font-bold flex items-center gap-1 backdrop-blur-sm">
                  <Star className="w-3 h-3 fill-current" /> Featured
                </div>
              )}
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
              <div className="text-xs font-medium text-indigo-400 mb-2">{exp.category}</div>
              <h2 className="text-xl font-bold text-neutral-200 mb-2 group-hover:text-indigo-400 transition-colors">
                {exp.title}
              </h2>
              <p className="text-sm text-neutral-400 mb-6 flex-1 line-clamp-2">
                {exp.description}
              </p>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-neutral-800">
                <div className="flex flex-wrap gap-2">
                  {exp.techStack?.slice(0, 3).map((tech: string) => (
                    <span key={tech} className="text-xs text-neutral-500">
                      {tech}
                    </span>
                  ))}
                  {exp.techStack?.length > 3 && (
                    <span className="text-xs text-neutral-600">+{exp.techStack.length - 3}</span>
                  )}
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-indigo-400 transition-colors group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {experiments.length === 0 && (
        <div className="text-center py-20 bg-neutral-900/50 rounded-xl border border-neutral-800 border-dashed">
          <Beaker className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-neutral-300">No experiments yet</h3>
          <p className="text-neutral-500 mt-2">Check back later for new prototypes and tools.</p>
        </div>
      )}
    </div>
  )
}
