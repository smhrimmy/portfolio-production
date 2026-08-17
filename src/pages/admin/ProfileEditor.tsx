import { useState, useEffect } from "react"
import { Save, CheckCircle, AlertCircle, Globe } from "lucide-react"
import { useAuthStore } from "../../stores/authStore"

export function ProfileEditor() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const { token } = useAuthStore()
  const apiUrl = import.meta.env.VITE_API_URL || ""

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/admin/profile`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      if (res.ok) {
        const data = await res.json()
        setProfile(data)
      } else {
        setMessage({ type: "error", text: "Failed to load profile" })
      }
    } catch (err) {
      setMessage({ type: "error", text: "Network error loading profile" })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveDraft = async () => {
    setSaving(true)
    setMessage({ type: "", text: "" })
    try {
      const res = await fetch(`${apiUrl}/api/admin/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(profile)
      })
      if (res.ok) {
        const data = await res.json()
        setProfile(data)
        setMessage({ type: "success", text: "Draft saved successfully" })
      } else {
        setMessage({ type: "error", text: "Failed to save draft" })
      }
    } catch (err) {
      setMessage({ type: "error", text: "Network error saving profile" })
    } finally {
      setSaving(false)
    }
  }

  const handlePublish = async () => {
    setPublishing(true)
    setMessage({ type: "", text: "" })
    try {
      const res = await fetch(`${apiUrl}/api/admin/profile/publish`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      if (res.ok) {
        const data = await res.json()
        setProfile(data)
        setMessage({ type: "success", text: "Profile published successfully" })
      } else {
        setMessage({ type: "error", text: "Failed to publish profile" })
      }
    } catch (err) {
      setMessage({ type: "error", text: "Network error publishing profile" })
    } finally {
      setPublishing(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile((prev: any) => ({ ...prev, [name]: value }))
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
          <h1 className="text-2xl font-bold text-neutral-50">Profile & Social Links</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Manage your personal information and online presence.
          </p>
        </div>
        <div className="flex space-x-3">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
            profile?.publishStatus === 'published' 
              ? 'bg-green-500/10 text-green-400 border-green-500/20' 
              : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
          }`}>
            {profile?.publishStatus === 'published' ? 'Published' : 'Draft'}
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
              <label htmlFor="name" className="block text-sm font-medium text-neutral-300">Full Name</label>
              <div className="mt-1">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={profile?.name || ""}
                  onChange={handleChange}
                  className="bg-neutral-950 border border-neutral-800 text-neutral-200 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="role" className="block text-sm font-medium text-neutral-300">Professional Role / Title</label>
              <div className="mt-1">
                <input
                  type="text"
                  name="role"
                  id="role"
                  value={profile?.role || ""}
                  onChange={handleChange}
                  className="bg-neutral-950 border border-neutral-800 text-neutral-200 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="tagline" className="block text-sm font-medium text-neutral-300">Tagline</label>
              <div className="mt-1">
                <input
                  type="text"
                  name="tagline"
                  id="tagline"
                  value={profile?.tagline || ""}
                  onChange={handleChange}
                  className="bg-neutral-950 border border-neutral-800 text-neutral-200 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="about" className="block text-sm font-medium text-neutral-300">About (Bio)</label>
              <div className="mt-1">
                <textarea
                  id="about"
                  name="about"
                  rows={4}
                  value={profile?.about || ""}
                  onChange={handleChange}
                  className="bg-neutral-950 border border-neutral-800 text-neutral-200 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                />
              </div>
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="location" className="block text-sm font-medium text-neutral-300">Location</label>
              <div className="mt-1">
                <input
                  type="text"
                  name="location"
                  id="location"
                  value={profile?.location || ""}
                  onChange={handleChange}
                  className="bg-neutral-950 border border-neutral-800 text-neutral-200 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                />
              </div>
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="email" className="block text-sm font-medium text-neutral-300">Contact Email</label>
              <div className="mt-1">
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={profile?.email || ""}
                  onChange={handleChange}
                  className="bg-neutral-950 border border-neutral-800 text-neutral-200 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-neutral-800">
            <h3 className="text-lg font-medium leading-6 text-neutral-50 mb-4">Social Links</h3>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="github" className="block text-sm font-medium text-neutral-300">GitHub URL</label>
                <div className="mt-1">
                  <input
                    type="url"
                    name="github"
                    id="github"
                    value={profile?.github || ""}
                    onChange={handleChange}
                    className="bg-neutral-950 border border-neutral-800 text-neutral-200 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="linkedin" className="block text-sm font-medium text-neutral-300">LinkedIn URL</label>
                <div className="mt-1">
                  <input
                    type="url"
                    name="linkedin"
                    id="linkedin"
                    value={profile?.linkedin || ""}
                    onChange={handleChange}
                    className="bg-neutral-950 border border-neutral-800 text-neutral-200 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="twitter" className="block text-sm font-medium text-neutral-300">Twitter / X URL</label>
                <div className="mt-1">
                  <input
                    type="url"
                    name="twitter"
                    id="twitter"
                    value={profile?.twitter || ""}
                    onChange={handleChange}
                    className="bg-neutral-950 border border-neutral-800 text-neutral-200 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  />
                </div>
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
            {saving ? (
              <span className="flex items-center">
                <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-b-2 border-neutral-300"></div>
                Saving...
              </span>
            ) : (
              <span className="flex items-center">
                <Save className="mr-2 h-4 w-4" />
                Save as Draft
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={handlePublish}
            disabled={saving || publishing}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
          >
            {publishing ? (
              <span className="flex items-center">
                <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-b-2 border-white"></div>
                Publishing...
              </span>
            ) : (
              <span className="flex items-center">
                <Globe className="mr-2 h-4 w-4" />
                Publish Changes
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
