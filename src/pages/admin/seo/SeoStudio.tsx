import { useState, useEffect } from "react"
import { AlertTriangle, Plus, Edit2, Trash2 } from "lucide-react"
import { useAuthStore } from "../../../stores/authStore"

export default function SeoStudio() {
  const [routes, setRoutes] = useState<any[]>([])
  const [missing, setMissing] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState({ type: "", text: "" })
  const { token } = useAuthStore()
  const apiUrl = import.meta.env.VITE_API_URL || ""

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [routesRes, missingRes] = await Promise.all([
        fetch(`${apiUrl}/api/admin/seo/routes`, { headers: { "Authorization": `Bearer ${token}` } }),
        fetch(`${apiUrl}/api/admin/seo/missing`, { headers: { "Authorization": `Bearer ${token}` } })
      ])

      if (routesRes.ok) setRoutes(await routesRes.json())
      if (missingRes.ok) setMissing(await missingRes.json())
    } catch (err) {
      setMessage({ type: "error", text: "Failed to load SEO data" })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this SEO route?")) return
    try {
      const res = await fetch(`${apiUrl}/api/admin/seo/routes/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (res.ok) {
        setRoutes(routes.filter(r => r.id !== id))
        setMessage({ type: "success", text: "Route deleted successfully" })
      }
    } catch (err) {
      setMessage({ type: "error", text: "Failed to delete route" })
    }
  }

  const handlePublish = async (id: string) => {
    try {
      const res = await fetch(`${apiUrl}/api/admin/seo/routes/${id}/publish`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (res.ok) {
        const updated = await res.json()
        setRoutes(routes.map(r => r.id === id ? updated : r))
        setMessage({ type: "success", text: "Route published successfully" })
      }
    } catch (err) {
      setMessage({ type: "error", text: "Failed to publish route" })
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
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-50">SEO Studio</h1>
        <p className="mt-1 text-neutral-400">Manage static routes, sitemap configuration, and structured data.</p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-lg border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      {missing.length > 0 && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex items-start gap-4">
          <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-yellow-500">Missing SEO Configurations</h3>
            <p className="text-sm text-yellow-500/80 mt-1">
              There are {missing.length} content items missing custom SEO configurations. They will fall back to site defaults.
            </p>
            <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
              {missing.slice(0, 5).map(m => (
                <span key={`${m.type}-${m.id}`} className="px-2 py-1 bg-yellow-500/20 text-yellow-600 rounded-md text-xs font-medium whitespace-nowrap">
                  {m.type}: {m.title}
                </span>
              ))}
              {missing.length > 5 && (
                <span className="px-2 py-1 bg-yellow-500/10 text-yellow-600/70 rounded-md text-xs font-medium">
                  +{missing.length - 5} more
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-950/50">
          <h2 className="text-lg font-semibold text-neutral-200">Static SEO Routes</h2>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
            <Plus className="w-4 h-4" />
            New Route
          </button>
        </div>
        
        <table className="w-full text-left text-sm text-neutral-400">
          <thead className="text-xs uppercase bg-neutral-950/50 text-neutral-500 border-b border-neutral-800">
            <tr>
              <th className="px-6 py-4 font-medium">Path</th>
              <th className="px-6 py-4 font-medium">Title Override</th>
              <th className="px-6 py-4 font-medium">Indexing</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {routes.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">
                  No static SEO routes configured. Add one for pages like "/" or "/contact".
                </td>
              </tr>
            ) : (
              routes.map(route => (
                <tr key={route.id} className="hover:bg-neutral-800/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-neutral-300">{route.path}</td>
                  <td className="px-6 py-4">
                    {route.title ? <span className="text-neutral-200">{route.title}</span> : <span className="text-neutral-500 italic">Default</span>}
                  </td>
                  <td className="px-6 py-4">
                    {route.noIndex ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                        No-Index
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                        Indexed
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                      route.publishStatus === 'published' 
                        ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                        : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                    }`}>
                      {route.publishStatus === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {route.publishStatus === 'draft' && (
                      <button 
                        onClick={() => handlePublish(route.id)}
                        className="text-indigo-400 hover:text-indigo-300 font-medium"
                      >
                        Publish
                      </button>
                    )}
                    <button className="text-neutral-400 hover:text-neutral-200 p-1 rounded-md hover:bg-neutral-700 transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(route.id)}
                      className="text-neutral-400 hover:text-red-400 p-1 rounded-md hover:bg-neutral-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
