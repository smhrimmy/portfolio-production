import { useState, useEffect } from "react"
import { Settings, Save, Clock, ToggleLeft, ToggleRight } from "lucide-react"
import { useAuthStore } from "../../../stores/authStore"
import { toast } from "react-hot-toast"

export default function SettingsAdmin() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { token } = useAuthStore()

  const [settings, setSettings] = useState<any>({
    autoPublishEnabled: false,
    autoPublishDelay: 10,
    titleTemplate: "%s | Portfolio OS",
    description: "",
    contactEmail: ""
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const apiUrl = (import.meta.env.DEV ? (import.meta.env.VITE_API_URL || "http://localhost:3001") : "")
      const res = await fetch(`${apiUrl}/api/admin/settings`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        if (data && data.length > 0) {
          setSettings(data[0])
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const apiUrl = (import.meta.env.DEV ? (import.meta.env.VITE_API_URL || "http://localhost:3001") : "")
      const res = await fetch(`${apiUrl}/api/admin/settings`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(settings)
      })

      if (res.ok) {
        toast.success("Settings saved successfully!")
      } else {
        toast.error("Failed to save settings")
      }
    } catch (err) {
      console.error(err)
      toast.error("Network error")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-neutral-400">Loading settings...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-50 flex items-center gap-2">
            <Settings className="w-6 h-6 text-indigo-400" /> Settings & Automation
          </h1>
          <p className="text-neutral-400 mt-1">Configure global site preferences and background automations.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
        <h2 className="text-lg font-bold text-neutral-200 mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-400" /> Automation Layer
        </h2>
        
        <div className="space-y-6 max-w-2xl">
          <div className="flex items-start gap-4 p-4 bg-neutral-950 border border-neutral-800 rounded-lg">
            <button 
              onClick={() => setSettings({...settings, autoPublishEnabled: !settings.autoPublishEnabled})}
              className={`mt-1 ${settings.autoPublishEnabled ? 'text-emerald-400' : 'text-neutral-500'}`}
            >
              {settings.autoPublishEnabled ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
            </button>
            <div>
              <h3 className="font-semibold text-neutral-200">Auto-Publish Drafts</h3>
              <p className="text-sm text-neutral-400 mt-1">
                When enabled, the system will automatically publish drafts that have been inactive for the configured quiet period. 
                (Requires Vercel Cron to be active).
              </p>
              
              {settings.autoPublishEnabled && (
                <div className="mt-4 flex items-center gap-3">
                  <label className="text-sm text-neutral-300">Quiet Period (Minutes):</label>
                  <input 
                    type="number" 
                    value={settings.autoPublishDelay}
                    onChange={(e) => setSettings({...settings, autoPublishDelay: parseInt(e.target.value) || 10})}
                    className="bg-neutral-900 border border-neutral-700 rounded px-3 py-1 text-white w-24"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
