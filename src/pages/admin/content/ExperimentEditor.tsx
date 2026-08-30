import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Save, Globe, Star } from "lucide-react"
import { useAuthStore } from "../../../stores/authStore"

export default function ExperimentEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useAuthStore()
  const isNew = id === "new"
  const apiUrl = (import.meta.env.DEV ? (import.meta.env.VITE_API_URL || "http://localhost:3001") : "")

  const [exp, setExp] = useState<any>({
    title: "", slug: "", description: "", content: "", category: "WebGL",
    coverMediaId: "", gallery: "[]", techStack: "[]", githubUrl: "", demoUrl: "",
    featured: false, order: 0, publishStatus: "draft", seoConfig: "{}"
  })
  
  const [techInput, setTechInput] = useState("")
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!isNew) fetchExperiment()
  }, [id])

  const fetchExperiment = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/admin/experiments/${id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (res.ok) setExp(await res.json())
      else setError("Failed to load experiment")
    } catch (err: any) {
      setError("Network error")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (publishStatus?: string) => {
    setSaving(true)
    setError("")
    
    const payload = { ...exp }
    if (publishStatus) payload.publishStatus = publishStatus

    try {
      const res = await fetch(`${apiUrl}/api/admin/experiments${isNew ? '' : `/${id}`}`, {
        method: isNew ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })
      
      if (res.ok) {
        const saved = await res.json()
        if (isNew) navigate(`/admin/content/lab/${saved.id}`, { replace: true })
        else setExp(saved)
      } else {
        const err = await res.json()
        setError(err.error?.message || "Failed to save")
      }
    } catch (err: any) {
      setError("Network error while saving")
    } finally {
      setSaving(false)
    }
  }

  const handleAddTech = () => {
    if (!techInput.trim()) return
    const current = JSON.parse(exp.techStack || "[]")
    if (!current.includes(techInput.trim())) {
      setExp({ ...exp, techStack: JSON.stringify([...current, techInput.trim()]) })
    }
    setTechInput("")
  }

  const handleRemoveTech = (tech: string) => {
    const current = JSON.parse(exp.techStack || "[]")
    setExp({ ...exp, techStack: JSON.stringify(current.filter((t: string) => t !== tech)) })
  }

  if (loading) return <div className="p-8 text-center text-neutral-400">Loading...</div>

  const techStackList = JSON.parse(exp.techStack || "[]")

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/admin/content/lab")} className="p-2 bg-neutral-900 hover:bg-neutral-800 rounded-lg text-neutral-400 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-neutral-50">{isNew ? "New Experiment" : "Edit Experiment"}</h1>
            <p className="text-sm text-neutral-400">{exp.publishStatus === 'published' ? 'Published' : 'Draft'}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {error && <span className="text-sm text-red-400">{error}</span>}
          <button 
            onClick={() => handleSave()} 
            disabled={saving}
            className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> Save Draft
          </button>
          
          <button 
            onClick={() => handleSave('published')}
            disabled={saving}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            <Globe className="w-4 h-4" /> Publish
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Title</label>
              <input
                type="text"
                value={exp.title}
                onChange={e => setExp({...exp, title: e.target.value})}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-neutral-200 focus:outline-none focus:border-indigo-500"
                placeholder="e.g. WebGL Fluid Simulation"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Slug</label>
              <input
                type="text"
                value={exp.slug}
                onChange={e => setExp({...exp, slug: e.target.value})}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-neutral-200 focus:outline-none focus:border-indigo-500"
                placeholder="Leave blank to auto-generate"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Description (Short)</label>
              <textarea
                value={exp.description}
                onChange={e => setExp({...exp, description: e.target.value})}
                rows={3}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-neutral-200 focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Content (Markdown)</label>
              <textarea
                value={exp.content}
                onChange={e => setExp({...exp, content: e.target.value})}
                rows={12}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-neutral-200 font-mono text-sm focus:outline-none focus:border-indigo-500 resize-y"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Category</label>
              <input
                type="text"
                value={exp.category}
                onChange={e => setExp({...exp, category: e.target.value})}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-neutral-200 focus:outline-none focus:border-indigo-500"
                placeholder="e.g. WebGL, AI, Automation"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="featured"
                checked={exp.featured}
                onChange={e => setExp({...exp, featured: e.target.checked})}
                className="w-4 h-4 rounded border-neutral-800 bg-neutral-950 text-indigo-500 focus:ring-indigo-500"
              />
              <label htmlFor="featured" className="text-sm font-medium text-neutral-300 flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" /> Featured Experiment
              </label>
            </div>

            <hr className="border-neutral-800" />

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Cover Media ID (Google Drive)</label>
              <input
                type="text"
                value={exp.coverMediaId || ""}
                onChange={e => setExp({...exp, coverMediaId: e.target.value})}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-neutral-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Live Demo URL</label>
              <input
                type="text"
                value={exp.demoUrl || ""}
                onChange={e => setExp({...exp, demoUrl: e.target.value})}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-neutral-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Source Code URL</label>
              <input
                type="text"
                value={exp.githubUrl || ""}
                onChange={e => setExp({...exp, githubUrl: e.target.value})}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-neutral-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
            
            <hr className="border-neutral-800" />

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Tech Stack</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={techInput}
                  onChange={e => setTechInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                  className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-sm text-neutral-200 focus:outline-none focus:border-indigo-500"
                  placeholder="Add technology"
                />
                <button type="button" onClick={handleAddTech} className="bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 rounded-lg text-sm text-neutral-200">Add</button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {techStackList.map((t: string) => (
                  <span key={t} className="inline-flex items-center gap-1 bg-neutral-800 text-neutral-300 px-2 py-1 rounded text-xs">
                    {t}
                    <button type="button" onClick={() => handleRemoveTech(t)} className="hover:text-red-400">&times;</button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
