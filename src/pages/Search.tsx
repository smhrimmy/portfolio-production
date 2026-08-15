import { useState, useEffect, useMemo } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import { motion, AnimatePresence } from "framer-motion"
import { buildSearchIndex, performSearch } from "../lib/search"
import type { SearchDocument } from "../types/search"
import { fadeInUp, staggerContainer } from "../design-system/motion"
import { FilterBar } from "../components/portfolio/FilterBar"
import { Button } from "../components/ui/button"
import { Search as SearchIcon, Folder, FileText, Briefcase, Code2, Award } from "lucide-react"

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get("q") || ""
  const category = searchParams.get("category") || "All"

  const [index, setIndex] = useState<SearchDocument[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    buildSearchIndex().then((idx) => {
      setIndex(idx)
      setIsLoading(false)
    })
  }, [])

  const results = useMemo(() => {
    if (!query) return []
    let res = performSearch(query, index)
    if (category !== "All") {
      res = res.filter(r => r.type.toLowerCase() === category.toLowerCase())
    }
    return res
  }, [query, index, category])

  const categories = ["All", "Project", "Article", "Experience", "Skill", "Certification"]

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (val) {
      setSearchParams({ q: val, category })
    } else {
      setSearchParams(category === "All" ? {} : { category })
    }
  }

  const handleCategoryChange = (newCat: string) => {
    if (query) {
      setSearchParams({ q: query, category: newCat })
    } else {
      setSearchParams(newCat === "All" ? {} : { category: newCat })
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "Project": return <Folder className="w-5 h-5" />
      case "Article": return <FileText className="w-5 h-5" />
      case "Experience": return <Briefcase className="w-5 h-5" />
      case "Skill": return <Code2 className="w-5 h-5" />
      case "Certification": return <Award className="w-5 h-5" />
      default: return <FileText className="w-5 h-5" />
    }
  }

  return (
    <>
      <Helmet>
        <title>{query ? `Search: ${query}` : "Search"} | Portfolio OS</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="pt-24 pb-32">
        <section className="container max-w-screen-xl py-12">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 
              variants={fadeInUp} 
              className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-8"
            >
              Search
            </motion.h1>

            <motion.div variants={fadeInUp} className="relative max-w-2xl mb-12">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={handleSearch}
                placeholder="Search projects, articles, skills..."
                className="w-full h-14 pl-12 pr-4 rounded-xl bg-surface border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-lg"
                autoFocus
              />
            </motion.div>

            {query && (
              <motion.div variants={fadeInUp} className="mb-12">
                <FilterBar
                  categories={categories}
                  activeCategory={category}
                  onSelect={handleCategoryChange}
                />
              </motion.div>
            )}

            {isLoading ? (
              <div className="py-24 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              </div>
            ) : (
              <motion.div variants={fadeInUp}>
                {!query ? (
                  <div className="py-24 text-center border border-dashed border-border rounded-2xl bg-surface/50">
                    <p className="text-xl text-muted-foreground mb-4">Enter a search term to begin.</p>
                    <div className="flex flex-wrap justify-center gap-4">
                      {["React", "Design", "Architecture", "Cloud"].map(term => (
                        <Button key={term} variant="outline" onClick={() => setSearchParams({ q: term })}>
                          Search "{term}"
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-sm font-mono tracking-wider uppercase text-muted-foreground mb-6">
                      {results.length} result{results.length !== 1 && "s"} found
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <AnimatePresence mode="popLayout">
                        {results.length > 0 ? (
                          results.map((result) => (
                            <motion.div
                              key={result.id}
                              layout
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.2 }}
                              className="p-6 rounded-2xl bg-surface border border-border/50 flex flex-col h-full hover:border-primary/30 transition-colors group"
                            >
                              <div className="flex items-center gap-3 mb-4 text-muted-foreground group-hover:text-primary transition-colors">
                                {getIcon(result.type)}
                                <span className="text-xs font-mono uppercase tracking-wider">{result.type}</span>
                              </div>
                              <h3 className="text-xl font-display font-semibold mb-2 line-clamp-2">
                                <Link to={result.url} className="after:absolute after:inset-0">
                                  {result.title}
                                </Link>
                              </h3>
                              {result.description && (
                                <p className="text-muted-foreground line-clamp-3 mb-6">
                                  {result.description}
                                </p>
                              )}
                              <div className="mt-auto pt-4 border-t border-border/50 flex flex-wrap gap-2">
                                {result.technologies && result.technologies.slice(0, 3).map(tech => (
                                  <span key={tech} className="text-xs px-2 py-1 bg-muted rounded-md text-foreground/80">
                                    {tech}
                                  </span>
                                ))}
                                {result.tags && result.tags.slice(0, 3).map(tag => (
                                  <span key={tag} className="text-xs px-2 py-1 bg-muted rounded-md text-foreground/80">
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            </motion.div>
                          ))
                        ) : (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="col-span-full py-24 text-center border border-dashed border-border rounded-2xl bg-surface/50"
                          >
                            <p className="text-xl text-muted-foreground mb-2">No results for "{query}"</p>
                            <p className="text-muted-foreground mb-8">Try adjusting your search or filters.</p>
                            <Button onClick={() => setSearchParams({})}>Clear Search</Button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

          </motion.div>
        </section>
      </div>
    </>
  )
}
