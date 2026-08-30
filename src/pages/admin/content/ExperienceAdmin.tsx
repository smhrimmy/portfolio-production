import { useState, useEffect } from "react"
import { Plus, Edit2, Trash2, Calendar, MapPin, Building2, EyeOff, Globe } from "lucide-react"
import { useAuthStore } from "../../../stores/authStore"

export default function ExperienceAdmin() {
  const [experiences, setExperiences] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { token } = useAuthStore()

  useEffect(() => {
    fetchExperiences()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchExperiences = async () => {
    try {
      const apiUrl = (import.meta.env.DEV ? (import.meta.env.VITE_API_URL || "http://localhost:3001") : "")
      const res = await fetch(`${apiUrl}/api/admin/experience`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        setExperiences(await res.json())
      }
    } catch (err: any) {
      console.error("Failed to fetch experiences", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience?")) return
    try {
      const apiUrl = (import.meta.env.DEV ? (import.meta.env.VITE_API_URL || "http://localhost:3001") : "")
      await fetch(`${apiUrl}/api/admin/experience/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchExperiences()
    } catch (err: any) {
      console.error(err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-50 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-indigo-400" /> Experience
          </h1>
          <p className="text-neutral-400 mt-1">Manage your work history and roles.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" />
          New Experience
        </button>
      </div>

      <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-400">
            <thead className="bg-neutral-900 border-b border-neutral-800 text-neutral-300">
              <tr>
                <th className="px-6 py-4 font-medium">Role & Company</th>
                <th className="px-6 py-4 font-medium">Timeline</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-neutral-500">Loading experiences...</td>
                </tr>
              ) : experiences.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-neutral-500">No experiences found. Add a role to get started.</td>
                </tr>
              ) : (
                experiences.map((exp) => (
                  <tr key={exp.id} className="border-b border-neutral-800/50 hover:bg-neutral-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-neutral-200">{exp.role}</div>
                      <div className="text-xs text-neutral-500 flex items-center gap-2 mt-1">
                        <Building2 className="w-3 h-3" /> {exp.company}
                        <span className="mx-1">•</span>
                        <MapPin className="w-3 h-3" /> {exp.location}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-neutral-300">
                        <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                        {exp.startDate} – {exp.isCurrent ? "Present" : exp.endDate}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {exp.publishStatus === "published" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-emerald-500/10 text-emerald-400">
                          <Globe className="w-3 h-3" /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-amber-500/10 text-amber-400">
                          <EyeOff className="w-3 h-3" /> Draft
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button className="text-neutral-500 hover:text-indigo-400 transition-colors" title="Edit">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(exp.id)} className="text-neutral-500 hover:text-red-400 transition-colors" title="Delete">
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
      </div>
    </div>
  )
}
