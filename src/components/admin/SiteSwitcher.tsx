import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, Globe } from "lucide-react"
import { useSiteStore } from "../../stores/siteStore"
import { Link } from "react-router-dom"

export function SiteSwitcher() {
  const { sites, activeSiteId, setActiveSite, fetchSites, isLoading } = useSiteStore()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    fetchSites()
  }, [fetchSites])

  const activeSite = sites.find(s => s.id === activeSiteId)

  if (isLoading) {
    return (
      <div className="w-full h-10 animate-pulse bg-neutral-800 rounded-lg flex items-center px-3">
        <div className="w-4 h-4 bg-neutral-700 rounded-full mr-2"></div>
        <div className="h-2 bg-neutral-700 rounded w-24"></div>
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 transition-colors rounded-lg text-sm"
      >
        <div className="flex items-center gap-2 truncate">
          <Globe className="w-4 h-4 text-indigo-400 shrink-0" />
          <span className="font-medium text-neutral-200 truncate">
            {activeSite ? activeSite.name : "Select Site"}
          </span>
        </div>
        <ChevronsUpDown className="w-4 h-4 text-neutral-500 shrink-0" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-2 bg-neutral-900 border border-neutral-700 rounded-lg shadow-xl z-50 py-1 overflow-hidden">
            <div className="px-3 py-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider bg-neutral-900/50">
              Your Sites
            </div>
            {sites.map(site => (
              <button
                key={site.id}
                onClick={() => {
                  setActiveSite(site.id)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-neutral-800 transition-colors ${
                  activeSiteId === site.id ? 'text-indigo-400' : 'text-neutral-300'
                }`}
              >
                <span className="truncate">{site.name}</span>
                {activeSiteId === site.id && <Check className="w-4 h-4" />}
              </button>
            ))}
            
            <div className="border-t border-neutral-800 mt-1">
              <Link
                to="/admin/sites"
                onClick={() => setIsOpen(false)}
                className="flex items-center px-3 py-2 text-sm text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
              >
                Manage Sites
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
