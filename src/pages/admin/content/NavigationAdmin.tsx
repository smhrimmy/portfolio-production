import { useState, useEffect } from "react"
import { Plus, Edit2, Trash2, GripVertical, CheckCircle, AlertCircle, Globe } from "lucide-react"
import { useAuthStore } from "../../../stores/authStore"

export default function NavigationAdmin() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState({ type: "", text: "" })
  const { token } = useAuthStore()
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001"

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/admin/navigation`, {
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setItems(data)
      }
    } catch (err) {
      setMessage({ type: "error", text: "Network error loading navigation" })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this navigation item?")) return
    try {
      const res = await fetch(`${apiUrl}/api/admin/navigation/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (res.ok) {
        setItems(items.filter(i => i.id !== id))
        setMessage({ type: "success", text: "Item deleted successfully" })
      }
    } catch (err) {
      setMessage({ type: "error", text: "Failed to delete item" })
    }
  }

  const handlePublish = async (id: string) => {
    try {
      const res = await fetch(`${apiUrl}/api/admin/navigation/${id}/publish`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (res.ok) {
        const updated = await res.json()
        setItems(items.map(i => i.id === id ? updated : i))
        setMessage({ type: "success", text: "Item published successfully" })
      }
    } catch (err) {
      setMessage({ type: "error", text: "Failed to publish item" })
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
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-50">Navigation</h1>
          <p className="text-neutral-400 mt-1">Manage header, footer, and mobile menus.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" />
          New Item
        </button>
      </div>

      {message.text && (
        <div className={`p-4 rounded-lg border ${
          message.type === 'success' 
            ? 'bg-green-500/10 border-green-500/20 text-green-400' 
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          <div className="flex">
            {message.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
            <p className="text-sm font-medium">{message.text}</p>
          </div>
        </div>
      )}

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-neutral-400">
          <thead className="text-xs uppercase bg-neutral-950/50 text-neutral-400 border-b border-neutral-800">
            <tr>
              <th className="px-6 py-4 font-medium w-10"></th>
              <th className="px-6 py-4 font-medium">Label</th>
              <th className="px-6 py-4 font-medium">Path</th>
              <th className="px-6 py-4 font-medium">Location</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-neutral-500">
                  No navigation items found. Click "New Item" to create one.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-neutral-800/50 transition-colors group">
                  <td className="px-6 py-4 text-neutral-600 cursor-grab active:cursor-grabbing">
                    <GripVertical className="w-4 h-4" />
                  </td>
                  <td className="px-6 py-4 font-medium text-neutral-200">
                    <div className="flex items-center gap-2">
                      {item.label}
                      {item.isExternal && <Globe className="w-3 h-3 text-neutral-500" />}
                    </div>
                  </td>
                  <td className="px-6 py-4">{item.path}</td>
                  <td className="px-6 py-4 capitalize">{item.location}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                        item.publishStatus === 'published' 
                          ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                          : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                      }`}>
                        {item.publishStatus === 'published' ? 'Published' : 'Draft'}
                      </span>
                      {!item.isActive && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border bg-neutral-800 text-neutral-400 border-neutral-700">
                          Disabled
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {item.publishStatus === 'draft' && (
                      <button 
                        onClick={() => handlePublish(item.id)}
                        className="text-indigo-400 hover:text-indigo-300 font-medium"
                      >
                        Publish
                      </button>
                    )}
                    <button className="text-neutral-400 hover:text-neutral-200 p-1 rounded-md hover:bg-neutral-700 transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
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
