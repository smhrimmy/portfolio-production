import { Outlet, Link, useLocation, Navigate } from "react-router-dom"
import { motion } from "framer-motion"
import { LayoutDashboard, Users, FolderKanban, Briefcase, Award, PenTool, LayoutTemplate, MessageSquare, Settings, LogOut, Bot, Image, Square, Globe, Search, Code, Beaker, BarChart } from "lucide-react"
import { useAuthStore } from "../stores/authStore"
import { AnalyticsTracker } from "../components/AnalyticsTracker"
import { IntelligencePanel } from "../components/admin/IntelligencePanel"
import { SiteSwitcher } from "../components/admin/SiteSwitcher"

const NAV_ITEMS = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { name: "Media Library", path: "/admin/media", icon: Image },
  { name: "Analytics", path: "/admin/analytics", icon: BarChart },
  { name: "Publishing", path: "/admin/content/publishing", icon: Globe },
  { name: "Profile", path: "/admin/content/profile", icon: Users },
  { name: "Navigation", path: "/admin/content/navigation", icon: FolderKanban },
  { name: "Projects", path: "/admin/content/projects", icon: FolderKanban },
  { name: "Experience", path: "/admin/content/experience", icon: Briefcase },
  { name: "Lab / Experiments", path: "/admin/content/lab", icon: Beaker },
  { name: "Skills", path: "/admin/content/skills", icon: Square },
  { name: "Certifications", path: "/admin/content/certifications", icon: Award },
  { name: "Articles", path: "/admin/content/articles", icon: PenTool },
  { name: "Theme Studio", path: "/admin/design/theme", icon: LayoutTemplate },
  { name: "SEO Studio", path: "/admin/seo", icon: Search },
  { name: "GitHub Integration", path: "/admin/github", icon: Code },
  { name: "AI Studio", path: "/admin/ai", icon: Bot },
  { name: "Contact", path: "/admin/contact", icon: MessageSquare },
  { name: "Settings", path: "/admin/settings", icon: Settings },
]

export function AdminLayout() {
  const location = useLocation()
  const { isAuthenticated, logout } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  return (
    <div className="flex h-screen bg-neutral-950 text-neutral-50 overflow-hidden">
      <AnalyticsTracker />
      {/* Sidebar */}
      <aside className="w-64 border-r border-neutral-800 bg-neutral-900/50 flex flex-col h-full">
        <div className="p-6 border-b border-neutral-800 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-sm">
              OS
            </div>
            <span className="font-semibold tracking-wide uppercase text-sm text-neutral-300">Portfolio OS</span>
          </div>
          <SiteSwitcher />
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== "/admin" && location.pathname.startsWith(item.path))
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors relative ${
                  isActive ? "bg-indigo-500/10 text-indigo-400" : "text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="admin-nav-indicator"
                    className="absolute left-0 top-1 bottom-1 w-1 bg-indigo-500 rounded-r-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-neutral-800">
          <button 
            onClick={() => logout()}
            className="flex w-full items-center gap-3 px-3 py-2 rounded-md text-neutral-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-neutral-950">
        <header className="h-16 border-b border-neutral-800/50 flex items-center px-8 shrink-0 bg-neutral-950/80 backdrop-blur-sm z-10">
          <div className="flex items-center text-sm text-neutral-400">
            {/* Simple breadcrumbs placeholder */}
            Admin <span className="mx-2">/</span> <span className="text-neutral-200 capitalize">{location.pathname.split("/").pop() || "Dashboard"}</span>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-8">
          <Outlet />
        </div>
      </main>
      
      <IntelligencePanel />
    </div>
  )
}
