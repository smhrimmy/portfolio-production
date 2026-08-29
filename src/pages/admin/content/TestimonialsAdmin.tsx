import { useState, useEffect } from "react"
import { Plus, Edit2, Trash2, X, Save } from "lucide-react"
import { useAuthStore } from "../../../stores/authStore"
import { StatusBadge } from "../../../components/admin/ui/StatusBadge"
import { toast } from "react-hot-toast"

export default function TestimonialsAdmin() {
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { token } = useAuthStore()

  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  
  const [draft, setDraft] = useState({
    author: "",
    role: "",
    company: "",
    content: "",
    publishStatus: "draft",
    publishDate: null as string | null
  })

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:3001" : "")
      const res = await fetch(`${apiUrl}/api/admin/testimonials`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        setTestimonials(await res.json())
      }
    } catch (err) {
      console.error("Failed to fetch", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return
    try {
      const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:3001" : "")
      await fetch(`${apiUrl}/api/admin/testimonials/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchTestimonials()
    } catch (err) {
      console.error(err)
    }
  }

  const handleOpenEditor = (item?: any) => {
    if (item) {
      setEditingItem(item)
      setDraft({
        author: item.author,
        role: item.role,
        company: item.company || "",
        content: item.content,
        publishStatus: item.publishStatus,
        publishDate: item.publishDate
      })
    } else {
      setEditingItem(null)
      setDraft({
        author: "",
        role: "",
        company: "",
        content: "",
        publishStatus: "draft",
        publishDate: null
      })
    }
    setIsEditorOpen(true)
  }

  const handleSave = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:3001" : "")
      const method = editingItem ? "PUT" : "POST"
      const url = editingItem 
        ? `${apiUrl}/api/admin/testimonials/${editingItem.id}` 
        : `${apiUrl}/api/admin/testimonials`

      const res = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(draft)
      })

      if (res.ok) {
        toast.success("Testimonial saved!")
        setIsEditorOpen(false)
        fetchTestimonials()
      } else {
        const error = await res.json()
        toast.error(`Error: ${error.error?.message || "Failed to save"}`)
      }
    } catch (err) {
      toast.error("Network error")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-50">Testimonials</h1>
          <p className="text-neutral-400 mt-1">Manage client and peer endorsements.</p>
        </div>
        <button 
          onClick={() => handleOpenEditor()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Testimonial
        </button>
      </div>

      <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-neutral-400">
          <thead className="bg-neutral-900 border-b border-neutral-800 text-neutral-300">
            <tr>
              <th className="px-6 py-4 font-medium">Author</th>
              <th className="px-6 py-4 font-medium">Content</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-neutral-500">Loading...</td>
              </tr>
            ) : testimonials.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-neutral-500">No testimonials yet.</td>
              </tr>
            ) : (
              testimonials.map((item) => (
                <tr key={item.id} className="border-b border-neutral-800/50 hover:bg-neutral-800/20">
                  <td className="px-6 py-4">
                    <div className="font-medium text-neutral-200">{item.author}</div>
                    <div className="text-xs text-neutral-500">{item.role}{item.company ? ` @ ${item.company}` : ''}</div>
                  </td>
                  <td className="px-6 py-4 max-w-xs truncate">{item.content}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={item.publishStatus} publishDate={item.publishDate} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => handleOpenEditor(item)} className="text-neutral-500 hover:text-indigo-400">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="text-neutral-500 hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isEditorOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-neutral-100">
                {editingItem ? "Edit Testimonial" : "New Testimonial"}
              </h2>
              <button onClick={() => setIsEditorOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Author</label>
                <input 
                  type="text" 
                  value={draft.author} 
                  onChange={e => setDraft({...draft, author: e.target.value})}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-neutral-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Role</label>
                <input 
                  type="text" 
                  value={draft.role} 
                  onChange={e => setDraft({...draft, role: e.target.value})}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-neutral-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1">Company</label>
              <input 
                type="text" 
                value={draft.company} 
                onChange={e => setDraft({...draft, company: e.target.value})}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-neutral-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1">Content</label>
              <textarea 
                value={draft.content} 
                onChange={e => setDraft({...draft, content: e.target.value})}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-neutral-200 h-32 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Status</label>
                <select 
                  value={draft.publishStatus} 
                  onChange={e => setDraft({...draft, publishStatus: e.target.value})}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-neutral-200"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Publish Date</label>
                <input 
                  type="datetime-local" 
                  value={draft.publishDate ? new Date(draft.publishDate).toISOString().slice(0, 16) : ""} 
                  onChange={e => setDraft({...draft, publishDate: e.target.value ? new Date(e.target.value).toISOString() : null})}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-neutral-200"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button 
                onClick={handleSave}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
