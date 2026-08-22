import { Link } from "react-router-dom"
import { Search } from "lucide-react"
import { useSearchStore } from "../../hooks/useSearch"

export function Navigation() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/90 backdrop-blur-md">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <Link to="/" className="flex flex-col gap-0.5 group">
          <span className="font-display font-bold tracking-tight text-sm md:text-base group-hover:text-brand-cyan transition-colors duration-200">
            PORTFOLIO OS
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-foreground-secondary hidden sm:block">
            Editorial UI × Neural Core
          </span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-xs font-mono uppercase tracking-wider">
          <Link to="/projects" className="transition-colors hover:text-brand-cyan text-foreground-secondary">Work</Link>
          <Link to="/experience" className="transition-colors hover:text-brand-cyan text-foreground-secondary">Experience</Link>
          <Link to="/writing" className="transition-colors hover:text-brand-cyan text-foreground-secondary">Writing</Link>
          <Link to="/about" className="transition-colors hover:text-brand-cyan text-foreground-secondary">About</Link>
        </nav>
        <div className="flex items-center space-x-3 md:space-x-4">
          <button
            onClick={() => useSearchStore.getState().open()}
            className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider transition-colors hover:text-brand-cyan text-foreground-secondary"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline-block">Search</span>
            <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-border bg-surface px-1.5 font-mono text-[10px] font-medium text-foreground-secondary">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>
          <Link to="/resume" className="text-xs font-mono uppercase tracking-wider transition-colors hover:text-brand-cyan text-foreground-secondary hidden md:block">Resume</Link>
          <Link to="/contact" className="text-xs font-mono uppercase tracking-wider transition-colors hover:text-brand-cyan text-foreground-secondary hidden md:block">Contact</Link>
        </div>
      </div>
    </header>
  )
}
