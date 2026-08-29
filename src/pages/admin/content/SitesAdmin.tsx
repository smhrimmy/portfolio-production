import { useState } from "react"
import { useSiteStore } from "../../../stores/siteStore"
import { Plus, Globe, Check, Trash2 } from "lucide-react"

export default function SitesAdmin() {
  const { sites, createSite, deleteSite, activeSiteId, setActiveSite } = useSiteStore()
  const [isCreating, setIsCreating] = useState(false)
  const [newSite, setNewSite] = useState({ name: "", domain: "", isActive: true })

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSite.name || !newSite.domain) return
    
    await createSite(newSite)
    setIsCreating(false)
    setNewSite({ name: "", domain: "", isActive: true })
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-50">Sites</h1>
          <p className="text-neutral-400 mt-2">Manage multiple portfolio sites from one dashboard.</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Site
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Create New Site</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1">Site Name</label>
              <input
                type="text"
                required
                value={newSite.name}
                onChange={e => setNewSite(s => ({ ...s, name: e.target.value }))}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 focus:outline-none focus:border-indigo-500"
                placeholder="e.g. Developer Blog"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1">Domain</label>
              <input
                type="text"
                required
                value={newSite.domain}
                onChange={e => setNewSite(s => ({ ...s, domain: e.target.value }))}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 focus:outline-none focus:border-indigo-500"
                placeholder="e.g. blog.johndoe.com"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-4">
        {sites.length === 0 ? (
          <div className="p-12 text-center border border-neutral-800 border-dashed rounded-xl text-neutral-500">
            No sites configured. Create one to get started.
          </div>
        ) : (
          sites.map(site => (
            <div key={site.id} className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
              activeSiteId === site.id ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-neutral-900 border-neutral-800'
            }`}>
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  activeSiteId === site.id ? 'bg-indigo-500/20 text-indigo-400' : 'bg-neutral-800 text-neutral-400'
                }`}>
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-neutral-100">{site.name}</h3>
                    {activeSiteId === site.id && (
                      <span className="text-[10px] font-medium uppercase tracking-wider bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-400">{site.domain}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {activeSiteId !== site.id && (
                  <button
                    onClick={() => setActiveSite(site.id)}
                    className="p-2 text-neutral-400 hover:text-indigo-400 hover:bg-neutral-800 rounded-lg transition-colors"
                    title="Set as Active Site"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this site?")) {
                      deleteSite(site.id)
                    }
                  }}
                  className="p-2 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
