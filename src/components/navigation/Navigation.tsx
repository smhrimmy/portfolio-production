import { Link } from "react-router-dom"
import { Search } from "lucide-react"
import { useSearchStore } from "../../hooks/useSearch"

export function Navigation() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-display font-bold">PORTFOLIO OS</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link to="/projects" className="transition-colors hover:text-foreground/80 text-foreground/60">WORK</Link>
          <Link to="/experience" className="transition-colors hover:text-foreground/80 text-foreground/60">EXPERIENCE</Link>
          <Link to="/writing" className="transition-colors hover:text-foreground/80 text-foreground/60">WRITING</Link>
          <Link to="/about" className="transition-colors hover:text-foreground/80 text-foreground/60">ABOUT</Link>
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
          <Link to="/resume" className="text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60 hidden md:block">RESUME</Link>
          <Link to="/contact" className="text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60 hidden md:block">CONTACT</Link>
        </div>
      </div>
    </header>
  )
}
