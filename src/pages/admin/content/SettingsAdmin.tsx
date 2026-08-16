import { useState, useEffect } from "react"
import { Save, CheckCircle, AlertCircle, Globe } from "lucide-react"
import { useAuthStore } from "../../../stores/authStore"

export default function SettingsAdmin() {
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const { token } = useAuthStore()
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001"

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/admin/settings`, {
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setSettings(data)
      } else {
        setMessage({ type: "error", text: "Failed to load settings" })
      }
    } catch (err) {
      setMessage({ type: "error", text: "Network error loading settings" })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveDraft = async () => {
    setSaving(true)
    setMessage({ type: "", text: "" })
    try {
      const res = await fetch(`${apiUrl}/api/admin/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      })
      if (res.ok) {
        const data = await res.json()
        setSettings(data)
        setMessage({ type: "success", text: "Settings drafted successfully" })
      } else {
        setMessage({ type: "error", text: "Failed to save draft" })
      }
    } catch (err) {
      setMessage({ type: "error", text: "Network error saving settings" })
    } finally {
      setSaving(false)
    }
  }

  const handlePublish = async () => {
    setPublishing(true)
    setMessage({ type: "", text: "" })
    try {
      const res = await fetch(`${apiUrl}/api/admin/settings/publish`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setSettings(data)
        setMessage({ type: "success", text: "Settings published successfully" })
      } else {
        setMessage({ type: "error", text: "Failed to publish settings" })
      }
    } catch (err) {
      setMessage({ type: "error", text: "Network error publishing settings" })
    } finally {
      setPublishing(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setSettings((prev: any) => ({ ...prev, [name]: value }))
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-50">Site Settings</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Manage global configuration, SEO defaults, and site behavior.
          </p>
        </div>
        <div className="flex space-x-3">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
            settings?.publishStatus === 'published' 
              ? 'bg-green-500/10 text-green-400 border-green-500/20' 
              : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
          }`}>
            {settings?.publishStatus === 'published' ? 'Published' : 'Draft'}
          </span>
        </div>
      </div>

      {message.text && (
        <div className={`p-4 rounded-lg border ${
          message.type === 'success' 
            ? 'bg-green-500/10 border-green-500/20 text-green-400' 
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          <div className="flex">
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 mr-2" />
            )}
            <p className="text-sm font-medium">{message.text}</p>
          </div>
        </div>
      )}

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="titleTemplate" className="block text-sm font-medium text-neutral-300">Title Template</label>
              <div className="mt-1">
                <input
                  type="text"
                  name="titleTemplate"
                  id="titleTemplate"
                  value={settings?.titleTemplate || ""}
                  onChange={handleChange}
                  className="bg-neutral-950 border border-neutral-800 text-neutral-200 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  placeholder="%s | Portfolio OS"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-neutral-300">Global Description (SEO)</label>
              <div className="mt-1">
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={settings?.description || ""}
                  onChange={handleChange}
                  className="bg-neutral-950 border border-neutral-800 text-neutral-200 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                />
              </div>
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="resumeCtaText" className="block text-sm font-medium text-neutral-300">Resume CTA Text</label>
              <div className="mt-1">
                <input
                  type="text"
                  name="resumeCtaText"
                  id="resumeCtaText"
                  value={settings?.resumeCtaText || ""}
                  onChange={handleChange}
                  className="bg-neutral-950 border border-neutral-800 text-neutral-200 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                />
              </div>
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="resumeCtaLink" className="block text-sm font-medium text-neutral-300">Resume CTA Override Link (optional)</label>
              <div className="mt-1">
                <input
                  type="text"
                  name="resumeCtaLink"
                  id="resumeCtaLink"
                  value={settings?.resumeCtaLink || ""}
                  onChange={handleChange}
                  className="bg-neutral-950 border border-neutral-800 text-neutral-200 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                />
              </div>
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="contactEmail" className="block text-sm font-medium text-neutral-300">Contact Form Email</label>
              <div className="mt-1">
                <input
                  type="email"
                  name="contactEmail"
                  id="contactEmail"
                  value={settings?.contactEmail || ""}
                  onChange={handleChange}
                  className="bg-neutral-950 border border-neutral-800 text-neutral-200 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                />
              </div>
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="availability" className="block text-sm font-medium text-neutral-300">Availability Status</label>
              <div className="mt-1">
                <select
                  id="availability"
                  name="availability"
                  value={settings?.availability || "available"}
                  onChange={handleChange}
                  className="bg-neutral-950 border border-neutral-800 text-neutral-200 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                >
                  <option value="available">Available for new opportunities</option>
                  <option value="busy">Currently busy but open to chats</option>
                  <option value="unavailable">Not available</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 bg-neutral-900 border-t border-neutral-800 flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={saving || publishing}
            className="inline-flex justify-center py-2 px-4 border border-neutral-700 shadow-sm text-sm font-medium rounded-lg text-neutral-300 bg-neutral-800 hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving..." : <><Save className="mr-2 h-4 w-4" /> Save as Draft</>}
          </button>
          <button
            type="button"
            onClick={handlePublish}
            disabled={saving || publishing}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
          >
            {publishing ? "Publishing..." : <><Globe className="mr-2 h-4 w-4" /> Publish Changes</>}
          </button>
        </div>
      </div>
    </div>
  )
}
