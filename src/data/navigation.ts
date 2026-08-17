export interface NavigationItem {
  id: string
  label: string
  path: string
  isExternal: boolean
  isActive: boolean
  location: string
  order: number
}

const defaultNavItems: NavigationItem[] = [
  { id: "1", label: "Projects", path: "/projects", isExternal: false, isActive: true, location: "header", order: 1 },
  { id: "2", label: "Experience", path: "/experience", isExternal: false, isActive: true, location: "header", order: 2 },
  { id: "3", label: "Writing", path: "/writing", isExternal: false, isActive: true, location: "header", order: 3 },
  { id: "4", label: "About", path: "/about", isExternal: false, isActive: true, location: "header", order: 4 },
  { id: "5", label: "Contact", path: "/contact", isExternal: false, isActive: true, location: "header", order: 5 },
]

export async function getNavigationItems(location?: string): Promise<NavigationItem[]> {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || ""
    const res = await fetch(`${apiUrl}/api/public/navigation`)
    if (res.ok) {
      const items: NavigationItem[] = await res.json()
      if (location) {
        return items.filter(item => item.location === location)
      }
      return items
    }
  } catch (error) {
    console.warn("Failed to fetch navigation from API, falling back to defaults:", error)
  }
  
  if (location) {
    return defaultNavItems.filter(item => item.location === location)
  }
  return defaultNavItems
}
