import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Plus, Edit2, Trash2, Globe, Star } from "lucide-react"
import { useAuthStore } from "../../../stores/authStore"

export default function ExperimentsAdmin() {
  const [experiments, setExperiments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { token } = useAuthStore()
  const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:3001" : "")

  useEffect(() => {
    fetchExperiments()
  }, [])

  const fetchExperiments = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/admin/experiments`, {
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (res.ok) setExperiments(await res.json())
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experiment?")) return
    try {
      await fetch(`${apiUrl}/api/admin/experiments/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      })
      setExperiments(experiments.filter(e => e.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-50">Lab Experiments</h1>
          <p className="mt-1 text-neutral-400">Manage prototypes, WebGL, and developer tools.</p>
        </div>
        <Link 
          to="/admin/content/lab/new" 
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> New Experiment
        </Link>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-neutral-400">
          <thead className="text-xs uppercase bg-neutral-950/50 text-neutral-500 border-b border-neutral-800">
            <tr>
              <th className="px-6 py-4 font-medium">Experiment</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Featured</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {experiments.map(exp => (
              <tr key={exp.id} className="hover:bg-neutral-800/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-neutral-200">{exp.title}</div>
                  <div className="text-xs text-neutral-500 mt-0.5">/lab/{exp.slug}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-neutral-800 text-neutral-300 border border-neutral-700">
                    {exp.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                    exp.publishStatus === 'published' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                    exp.publishStatus === 'archived' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                    'bg-neutral-800 text-neutral-400 border-neutral-700'
                  }`}>
                    {exp.publishStatus}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {exp.featured ? <Star className="w-4 h-4 text-yellow-500 fill-current" /> : <Star className="w-4 h-4 text-neutral-600" />}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {exp.publishStatus === 'published' && (
                      <a href={`/lab/${exp.slug}`} target="_blank" rel="noreferrer" className="p-1.5 text-neutral-400 hover:text-indigo-400 transition-colors">
                        <Globe className="w-4 h-4" />
                      </a>
                    )}
                    <Link to={`/admin/content/lab/${exp.id}`} className="p-1.5 text-neutral-400 hover:text-indigo-400 transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button onClick={() => handleDelete(exp.id)} className="p-1.5 text-neutral-400 hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {experiments.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                  No experiments found. Create one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
