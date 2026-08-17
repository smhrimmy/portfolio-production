import { useState, useEffect } from "react"
import { Plus, Edit2, Trash2, EyeOff, Globe, TerminalSquare } from "lucide-react"
import { useAuthStore } from "../../../stores/authStore"

export default function SkillsAdmin() {
  const [skills, setSkills] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { token } = useAuthStore()

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || ""
      const res = await fetch(`${apiUrl}/api/admin/skills`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        setSkills(await res.json())
      }
    } catch (err) {
      console.error("Failed to fetch skills", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return
    try {
      const apiUrl = import.meta.env.VITE_API_URL || ""
      await fetch(`${apiUrl}/api/admin/skills/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchSkills()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-50 flex items-center gap-2">
            <TerminalSquare className="w-6 h-6 text-indigo-400" /> Skills & Technology
          </h1>
          <p className="text-neutral-400 mt-1">Manage your technical proficiencies and toolkit.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" />
          New Skill
        </button>
      </div>

      <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-400">
            <thead className="bg-neutral-900 border-b border-neutral-800 text-neutral-300">
              <tr>
                <th className="px-6 py-4 font-medium">Name & Icon</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Proficiency</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">Loading skills...</td>
                </tr>
              ) : skills.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">No skills found. Add your first technology!</td>
                </tr>
              ) : (
                skills.map((skill) => (
                  <tr key={skill.id} className="border-b border-neutral-800/50 hover:bg-neutral-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-neutral-200 flex items-center gap-2">
                        {skill.icon ? (
                          <span className="text-indigo-400">{skill.icon}</span>
                        ) : skill.logoMediaId ? (
                          <span className="w-5 h-5 bg-neutral-800 rounded flex items-center justify-center text-[10px]">IMG</span>
                        ) : (
                          <span className="w-5 h-5 bg-neutral-800 rounded flex items-center justify-center text-[10px]">--</span>
                        )}
                        {skill.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-neutral-800 text-neutral-300 px-2.5 py-1 rounded-md text-xs">
                        {skill.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-neutral-800 rounded-full overflow-hidden max-w-[100px]">
                          <div 
                            className="h-full bg-indigo-500 rounded-full" 
                            style={{ width: `${skill.proficiency}%` }}
                          />
                        </div>
                        <span className="text-xs text-neutral-500 font-mono">{skill.proficiency}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {skill.publishStatus === "published" ? (
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
                        <button onClick={() => handleDelete(skill.id)} className="text-neutral-500 hover:text-red-400 transition-colors" title="Delete">
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
