import { create } from 'zustand'
import { persist } from 'zustand/middleware'
export interface Site {
  id: string
  name: string
  domain: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface SiteState {
  sites: Site[]
  activeSiteId: string | null
  isLoading: boolean
  error: string | null
  fetchSites: () => Promise<void>
  setActiveSite: (id: string) => void
  createSite: (data: Partial<Site>) => Promise<Site>
  updateSite: (id: string, data: Partial<Site>) => Promise<Site>
  deleteSite: (id: string) => Promise<void>
}

const getHeaders = () => {
  const token = localStorage.getItem('admin_token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  }
}

const getApiUrl = () => (import.meta.env.DEV ? (import.meta.env.VITE_API_URL || "http://localhost:3001") : "")

export const useSiteStore = create<SiteState>()(
  persist(
    (set, get) => ({
      sites: [],
      activeSiteId: null,
      isLoading: false,
      error: null,

      fetchSites: async () => {
        set({ isLoading: true, error: null })
        try {
          const res = await fetch(`${getApiUrl()}/api/admin/sites`, { headers: getHeaders() })
          if (!res.ok) throw new Error('Failed to fetch sites')
          const sites = await res.json()
          
          const currentActive = get().activeSiteId
          
          set({ 
            sites,
            // If no active site or active site was deleted, default to first available
            activeSiteId: currentActive && sites.find((s: Site) => s.id === currentActive) 
              ? currentActive 
              : (sites[0]?.id || null),
            isLoading: false 
          })
        } catch (error: any) {
          set({ error: error.message || 'Failed to fetch sites', isLoading: false })
        }
      },

      setActiveSite: (id) => set({ activeSiteId: id }),

      createSite: async (data) => {
        const res = await fetch(`${getApiUrl()}/api/admin/sites`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(data)
        })
        if (!res.ok) throw new Error('Failed to create site')
        const site = await res.json()
        
        const sites = [...get().sites, site]
        set({ 
          sites,
          activeSiteId: get().activeSiteId || site.id
        })
        return site
      },

      updateSite: async (id, data) => {
        const res = await fetch(`${getApiUrl()}/api/admin/sites/${id}`, {
          method: 'PUT',
          headers: getHeaders(),
          body: JSON.stringify(data)
        })
        if (!res.ok) throw new Error('Failed to update site')
        const updated = await res.json()
        
        set(state => ({
          sites: state.sites.map(s => s.id === id ? updated : s)
        }))
        return updated
      },

      deleteSite: async (id) => {
        const res = await fetch(`${getApiUrl()}/api/admin/sites/${id}`, {
          method: 'DELETE',
          headers: getHeaders()
        })
        if (!res.ok) throw new Error('Failed to delete site')
        
        const sites = get().sites.filter(s => s.id !== id)
        const currentActive = get().activeSiteId
        
        set({
          sites,
          activeSiteId: currentActive === id ? (sites[0]?.id || null) : currentActive
        })
      }
    }),
    {
      name: 'portfolio-site-store',
      partialize: (state) => ({ activeSiteId: state.activeSiteId }) // Only persist activeSiteId
    }
  )
)
