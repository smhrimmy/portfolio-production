import { useState, useEffect } from "react"
import { Plus, Edit2, Trash2, } from "lucide-react"
import { useAuthStore } from "../../../stores/authStore"
import { StatusBadge } from "../../../components/admin/ui/StatusBadge"

interface Project {
  id: string
  title: string
  status: string
  category: string
  featured: boolean
  publishStatus: string
  publishDate: string | null
}

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const { token } = useAuthStore()

  useEffect(() => {
    fetchProjects()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchProjects = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:3001" : "")
      const res = await fetch(`${apiUrl}/api/admin/projects`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (res.ok) {
        const data = await res.json()
        setProjects(data)
      }
    } catch (_err) {
      console.error("Failed to fetch projects", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-50">Projects</h1>
          <p className="text-neutral-400 mt-1">Manage your portfolio projects.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-400">
            <thead className="bg-neutral-900 border-b border-neutral-800 text-neutral-300">
              <tr>
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Dev Status</th>
                <th className="px-6 py-4 font-medium">Publish Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">Loading projects...</td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">No projects found. Create one to get started.</td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr key={project.id} className="border-b border-neutral-800/50 hover:bg-neutral-800/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-neutral-200">
                      {project.title}
                      {project.featured && <span className="ml-2 text-xs bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full">Featured</span>}
                    </td>
                    <td className="px-6 py-4">{project.category}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-xs ${
                        project.status === "production" || project.status === "completed" 
                          ? "bg-green-500/10 text-green-400" 
                          : "bg-yellow-500/10 text-yellow-400"
                      }`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={project.publishStatus} publishDate={project.publishDate} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button className="text-neutral-500 hover:text-indigo-400 transition-colors" title="Edit">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="text-neutral-500 hover:text-red-400 transition-colors" title="Delete">
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
