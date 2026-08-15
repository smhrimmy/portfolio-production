import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useSearchStore } from "../../hooks/useSearch"
import { buildSearchIndex, performSearch } from "../../lib/search"
import type { SearchDocument, SearchResult } from "../../types/search"
import { useThemeStore } from "../../store/themeStore"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command"
import { useAiStore } from "../../store/aiStore"
import { 
  Folder, 
  FileText, 
  Briefcase, 
  Code2, 
  Award, 
  Home, 
  User, 
  Mail, 
  FileDown, 
  Sun, 
  Moon, 
  Monitor,
  Sparkles
} from "lucide-react"

export function CommandPalette() {
  const { isOpen, toggle, close } = useSearchStore()
  const navigate = useNavigate()
  const { setColorMode } = useThemeStore()
  const [query, setQuery] = useState("")
  const [index, setIndex] = useState<SearchDocument[]>([])
  const [results, setResults] = useState<SearchResult[]>([])

  // Fetch index once when palette opens
  useEffect(() => {
    if (isOpen && index.length === 0) {
      buildSearchIndex().then(setIndex)
    }
  }, [isOpen, index.length])

  // Execute search when query changes
  useEffect(() => {
    setResults(performSearch(query, index))
  }, [query, index])

  // Global hotkey
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        toggle()
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [toggle])

  const runCommand = useCallback((command: () => unknown) => {
    close()
    setQuery("")
    command()
  }, [close])

  // Helper to get icons for categories
  const getIcon = (type: string) => {
    switch (type) {
      case "Project": return <Folder className="mr-2 h-4 w-4" />
      case "Article": return <FileText className="mr-2 h-4 w-4" />
      case "Experience": return <Briefcase className="mr-2 h-4 w-4" />
      case "Skill": return <Code2 className="mr-2 h-4 w-4" />
      case "Certification": return <Award className="mr-2 h-4 w-4" />
      default: return <FileText className="mr-2 h-4 w-4" />
    }
  }

  return (
    <CommandDialog open={isOpen} onOpenChange={close}>
      <CommandInput 
        placeholder="Search portfolio or type a command..." 
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        {/* COMMAND MODE (No query) */}
        {!query && (
          <>
            <CommandGroup heading="Intelligence">
              <CommandItem onSelect={() => runCommand(() => useAiStore.getState().setIsOpen(true))}>
                <Sparkles className="mr-2 h-4 w-4" />
                <span>Ask Portfolio AI</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Navigation">
              <CommandItem onSelect={() => runCommand(() => navigate("/"))}>
                <Home className="mr-2 h-4 w-4" />
                <span>Home</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => navigate("/projects"))}>
                <Folder className="mr-2 h-4 w-4" />
                <span>Projects</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => navigate("/experience"))}>
                <Briefcase className="mr-2 h-4 w-4" />
                <span>Experience</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => navigate("/writing"))}>
                <FileText className="mr-2 h-4 w-4" />
                <span>Writing</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="About & Contact">
              <CommandItem onSelect={() => runCommand(() => navigate("/about"))}>
                <User className="mr-2 h-4 w-4" />
                <span>About Me</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => navigate("/skills"))}>
                <Code2 className="mr-2 h-4 w-4" />
                <span>Skills</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => navigate("/certifications"))}>
                <Award className="mr-2 h-4 w-4" />
                <span>Certifications</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => navigate("/resume"))}>
                <FileDown className="mr-2 h-4 w-4" />
                <span>Resume</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => navigate("/contact"))}>
                <Mail className="mr-2 h-4 w-4" />
                <span>Contact Me</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Theme">
              <CommandItem onSelect={() => runCommand(() => setColorMode("light"))}>
                <Sun className="mr-2 h-4 w-4" />
                <span>Switch to Light Theme</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => setColorMode("dark"))}>
                <Moon className="mr-2 h-4 w-4" />
                <span>Switch to Dark Theme</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => setColorMode("system"))}>
                <Monitor className="mr-2 h-4 w-4" />
                <span>Use System Theme</span>
              </CommandItem>
            </CommandGroup>
          </>
        )}

        {/* SEARCH MODE (With query) */}
        {query && results.length > 0 && (
          <CommandGroup heading="Search Results">
            {results.map((result) => (
              <CommandItem
                key={result.id}
                value={result.id + result.title}
                onSelect={() => runCommand(() => navigate(result.url))}
              >
                {getIcon(result.type)}
                <div className="flex flex-col">
                  <span>{result.title}</span>
                  {result.description && (
                    <span className="text-xs text-muted-foreground truncate max-w-[300px] sm:max-w-[400px]">
                      {result.description}
                    </span>
                  )}
                </div>
                <span className="ml-auto text-xs text-muted-foreground uppercase tracking-wider hidden sm:inline-block">
                  {result.type}
                </span>
              </CommandItem>
            ))}
            <CommandSeparator />
            <CommandItem
              onSelect={() => runCommand(() => navigate(`/search?q=${encodeURIComponent(query)}`))}
              className="text-primary font-medium"
            >
              See all results for "{query}"...
            </CommandItem>
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  )
}
