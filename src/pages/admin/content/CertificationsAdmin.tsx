import { useState, useEffect } from "react"
import { Plus, Edit2, Trash2, EyeOff, Globe, Award } from "lucide-react"
import { useAuthStore } from "../../../stores/authStore"

export default function CertificationsAdmin() {
  const [certifications, setCertifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { token } = useAuthStore()

  useEffect(() => {
    fetchCertifications()
  }, [])

  const fetchCertifications = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001"
      const res = await fetch(`${apiUrl}/api/admin/certifications`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        setCertifications(await res.json())
      }
    } catch (err) {
      console.error("Failed to fetch certifications", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certification?")) return
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001"
      await fetch(`${apiUrl}/api/admin/certifications/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchCertifications()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-50 flex items-center gap-2">
            <Award className="w-6 h-6 text-yellow-500" /> Certifications
          </h1>
          <p className="text-neutral-400 mt-1">Manage your professional credentials and achievements.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" />
          New Certification
        </button>
      </div>

      <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-400">
            <thead className="bg-neutral-900 border-b border-neutral-800 text-neutral-300">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Issuer</th>
                <th className="px-6 py-4 font-medium">Issue Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">Loading certifications...</td>
                </tr>
              ) : certifications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">No certifications found. Add your credentials!</td>
                </tr>
              ) : (
                certifications.map((cert) => (
                  <tr key={cert.id} className="border-b border-neutral-800/50 hover:bg-neutral-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-neutral-200">
                        {cert.name}
                      </div>
                      {cert.credentialId && (
                        <div className="text-xs text-neutral-500 mt-0.5">
                          ID: {cert.credentialId}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {cert.issuer}
                    </td>
                    <td className="px-6 py-4">
                      {cert.issueDate} {cert.expirationDate ? ` - ${cert.expirationDate}` : ""}
                    </td>
                    <td className="px-6 py-4">
                      {cert.publishStatus === "published" ? (
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
                        <button onClick={() => handleDelete(cert.id)} className="text-neutral-500 hover:text-red-400 transition-colors" title="Delete">
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
