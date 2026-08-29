import { useState, useEffect } from "react"
import { Users, Trash2, Mail } from "lucide-react"
import { useAuthStore } from "../../../stores/authStore"

export default function SubscribersAdmin() {
  const [subscribers, setSubscribers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { token } = useAuthStore()

  useEffect(() => {
    fetchSubscribers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchSubscribers = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:3001" : "")
      const res = await fetch(`${apiUrl}/api/admin/subscribers`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        setSubscribers(await res.json())
      }
    } catch (err: any) {
      console.error("Failed to fetch", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this subscriber?")) return
    try {
      const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:3001" : "")
      await fetch(`${apiUrl}/api/admin/subscribers/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchSubscribers()
    } catch (err: any) {
      console.error(err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-50 flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-400" /> Subscribers
          </h1>
          <p className="text-neutral-400 mt-1">Manage your newsletter audience.</p>
        </div>
      </div>

      <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-neutral-400">
          <thead className="bg-neutral-900 border-b border-neutral-800 text-neutral-300">
            <tr>
              <th className="px-6 py-4 font-medium">Email</th>
              <th className="px-6 py-4 font-medium">Subscribed At</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-neutral-500">Loading...</td>
              </tr>
            ) : subscribers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-neutral-500">No subscribers yet.</td>
              </tr>
            ) : (
              subscribers.map((item) => (
                <tr key={item.id} className="border-b border-neutral-800/50 hover:bg-neutral-800/20">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 font-medium text-neutral-200">
                      <Mail className="w-4 h-4 text-neutral-500" />
                      {item.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(item.subscribedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    {item.isActive ? (
                      <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-md text-xs">Active</span>
                    ) : (
                      <span className="px-2 py-1 bg-red-500/10 text-red-400 rounded-md text-xs">Unsubscribed</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(item.id)} className="text-neutral-500 hover:text-red-400">
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
