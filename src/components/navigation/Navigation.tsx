import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Search } from "lucide-react"
import { useSearchStore } from "../../hooks/useSearch"
import { getNavigationItems, type NavigationItem } from "../../data/navigation"
import { getSiteSettings, type SiteSettings } from "../../data/settings"

export function Navigation() {
  const [navItems, setNavItems] = useState<NavigationItem[]>([])
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const location = useLocation()

  useEffect(() => {
    getNavigationItems("header").then(setNavItems)
    getSiteSettings().then(setSettings)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-display font-bold">PORTFOLIO OS</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path) && item.path !== "/"
              || (location.pathname === "/" && item.path === "/")
            
            if (item.isExternal) {
              return (
                <a 
                  key={item.id} 
                  href={item.path} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`transition-colors hover:text-foreground/80 ${isActive ? 'text-foreground' : 'text-foreground/60 uppercase'}`}
                >
                  {item.label}
                </a>
              )
            }
            return (
              <Link 
                key={item.id} 
                to={item.path} 
                className={`transition-colors hover:text-foreground/80 ${isActive ? 'text-foreground' : 'text-foreground/60 uppercase'}`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => useSearchStore.getState().open()}
            className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60 mr-4"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline-block">Search</span>
            <kbd className="hidden sm:inline-flex items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>
          {settings && (
            <>
              {settings.resumeCtaLink ? (
                <a href={settings.resumeCtaLink} target="_blank" rel="noopener noreferrer" className="text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60 hidden md:block uppercase">{settings.resumeCtaText}</a>
              ) : (
                <Link to="/resume" className="text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60 hidden md:block uppercase">{settings.resumeCtaText}</Link>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  )
}
