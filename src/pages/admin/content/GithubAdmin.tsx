import { useState, useEffect } from "react"
import { Code, RefreshCw, Star, GitFork, Globe } from "lucide-react"
import { useAuthStore } from "../../../stores/authStore"

export default function GithubAdmin() {
  const [config, setConfig] = useState<any>({ username: "", accessToken: "", isActive: true })
  const [repos, setRepos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const { token } = useAuthStore()
  const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:3001" : "")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [configRes, reposRes] = await Promise.all([
        fetch(`${apiUrl}/api/admin/github/config`, { headers: { "Authorization": `Bearer ${token}` } }),
        fetch(`${apiUrl}/api/admin/github/repositories`, { headers: { "Authorization": `Bearer ${token}` } })
      ])

      if (configRes.ok) setConfig(await configRes.json())
      if (reposRes.ok) setRepos(await reposRes.json())
    } catch (err) {
      setMessage({ type: "error", text: "Failed to load GitHub data" })
    } finally {
      setLoading(false)
    }
  }

  const handleConfigSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`${apiUrl}/api/admin/github/config`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(config)
      })
      if (res.ok) {
        setConfig(await res.json())
        setMessage({ type: "success", text: "Configuration saved successfully" })
      } else {
        const error = await res.json()
        setMessage({ type: "error", text: error.error?.message || "Failed to save configuration" })
      }
    } catch (err) {
      setMessage({ type: "error", text: "Network error" })
    }
  }

  const handleSync = async () => {
    setSyncing(true)
    setMessage({ type: "info", text: "Syncing repositories from GitHub..." })
    try {
      const res = await fetch(`${apiUrl}/api/admin/github/sync`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (res.ok) {
        const result = await res.json()
        setMessage({ type: "success", text: `Successfully synced ${result.syncedCount} repositories` })
        // Refresh repos
        const reposRes = await fetch(`${apiUrl}/api/admin/github/repositories`, { headers: { "Authorization": `Bearer ${token}` } })
        if (reposRes.ok) setRepos(await reposRes.json())
      } else {
        const error = await res.json()
        setMessage({ type: "error", text: error.error?.message || "Failed to sync repositories" })
      }
    } catch (err) {
      setMessage({ type: "error", text: "Network error during sync" })
    } finally {
      setSyncing(false)
    }
  }

  const toggleFeatured = async (id: string, isFeatured: boolean) => {
    try {
      const res = await fetch(`${apiUrl}/api/admin/github/repositories/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ isFeatured: !isFeatured })
      })
      if (res.ok) {
        const updated = await res.json()
        setRepos(repos.map(r => r.id === id ? updated : r))
      }
    } catch (err) {
      setMessage({ type: "error", text: "Failed to update repository" })
    }
  }

  const toggleVisibility = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "published" ? "archived" : "published"
    try {
      const res = await fetch(`${apiUrl}/api/admin/github/repositories/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ publishStatus: newStatus })
      })
      if (res.ok) {
        const updated = await res.json()
        setRepos(repos.map(r => r.id === id ? updated : r))
      }
    } catch (err) {
      setMessage({ type: "error", text: "Failed to update repository visibility" })
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-neutral-50 flex items-center gap-3">
          <Code className="w-6 h-6" /> GitHub Integration
        </h1>
        <p className="mt-1 text-neutral-400">Manage your GitHub integration, caching, and featured repositories.</p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-lg border ${
          message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 
          message.type === 'info' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
          'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-neutral-200 mb-4">Configuration</h2>
            <form onSubmit={handleConfigSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">GitHub Username</label>
                <input
                  type="text"
                  value={config.username}
                  onChange={e => setConfig({...config, username: e.target.value})}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-neutral-200 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Access Token (Optional)</label>
                <input
                  type="password"
                  value={config.accessToken || ""}
                  onChange={e => setConfig({...config, accessToken: e.target.value})}
                  placeholder="ghp_xxxxxxxxxxxx"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-neutral-200 focus:outline-none focus:border-indigo-500"
                />
                <p className="mt-1 text-xs text-neutral-500">Only needed for higher rate limits or private repos.</p>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={config.isActive}
                  onChange={e => setConfig({...config, isActive: e.target.checked})}
                  className="w-4 h-4 rounded border-neutral-800 bg-neutral-950 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-neutral-900"
                />
                <label htmlFor="isActive" className="text-sm text-neutral-300">Enable GitHub Integration</label>
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Save Configuration
              </button>
            </form>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-neutral-200 mb-2">Manual Sync</h2>
            <p className="text-sm text-neutral-400 mb-4">
              Fetch the latest repository data from GitHub to update the local cache.
            </p>
            <button
              onClick={handleSync}
              disabled={syncing}
              className="w-full bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Syncing...' : 'Sync Now'}
            </button>
            {config.lastSynced && (
              <p className="mt-3 text-xs text-neutral-500 text-center">
                Last synced: {new Date(config.lastSynced).toLocaleString()}
              </p>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-950/50">
              <h2 className="text-lg font-semibold text-neutral-200">Cached Repositories</h2>
              <span className="text-sm font-medium px-2 py-1 bg-neutral-800 text-neutral-400 rounded-md">
                {repos.length} Total
              </span>
            </div>
            
            <table className="w-full text-left text-sm text-neutral-400">
              <thead className="text-xs uppercase bg-neutral-950/50 text-neutral-500 border-b border-neutral-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Repository</th>
                  <th className="px-6 py-4 font-medium">Stats</th>
                  <th className="px-6 py-4 font-medium text-center">Visibility</th>
                  <th className="px-6 py-4 font-medium text-center">Featured</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {repos.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-neutral-500">
                      No repositories cached. Click "Sync Now" to fetch data from GitHub.
                    </td>
                  </tr>
                ) : (
                  repos.map(repo => (
                    <tr key={repo.id} className="hover:bg-neutral-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-neutral-200 flex items-center gap-2">
                          <a href={repo.url} target="_blank" rel="noreferrer" className="hover:underline">{repo.name}</a>
                          {repo.language && <span className="text-[10px] uppercase bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-400">{repo.language}</span>}
                        </div>
                        {repo.description && <p className="text-xs text-neutral-500 mt-1 line-clamp-1">{repo.description}</p>}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1 text-xs text-neutral-300">
                            <Star className="w-3 h-3 text-yellow-500" /> {repo.stars}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-neutral-300">
                            <GitFork className="w-3 h-3 text-neutral-500" /> {repo.forks}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => toggleVisibility(repo.id, repo.publishStatus)}
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border transition-colors ${
                            repo.publishStatus === 'published' 
                              ? 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20' 
                              : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:bg-neutral-700'
                          }`}
                        >
                          {repo.publishStatus === 'published' ? (
                            <>
                              <Globe className="w-3 h-3 mr-1" /> Public
                            </>
                          ) : 'Hidden'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => toggleFeatured(repo.id, repo.isFeatured)}
                          className={`p-1.5 rounded-md transition-colors ${
                            repo.isFeatured 
                              ? 'bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30' 
                              : 'text-neutral-500 hover:bg-neutral-800'
                          }`}
                        >
                          <Star className={`w-4 h-4 ${repo.isFeatured ? 'fill-current' : ''}`} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
