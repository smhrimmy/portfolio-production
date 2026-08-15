import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { staggerContainer, fadeInUp } from "../design-system/motion"
import { ArticleCard } from "../components/portfolio/ArticleCard"
import { FilterBar } from "../components/portfolio/FilterBar"
import { getArticles, getArticleCategories, getFeaturedArticle } from "../data/articles"
import type { Article } from "../types/article"
import { Helmet } from "react-helmet-async"
import { Link } from "react-router-dom"
import { ArrowUpRight } from "lucide-react"

export default function Writing() {
  const [articles, setArticles] = useState<Article[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState("All")
  const [featured, setFeatured] = useState<Article | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [artData, catData, featData] = await Promise.all([
          getArticles(),
          getArticleCategories(),
          getFeaturedArticle()
        ])
        setArticles(artData)
        setCategories(catData)
        setFeatured(featData)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const filteredArticles = activeCategory === "All" 
    ? articles.filter(a => a.id !== featured?.id) // exclude featured from grid if "All"
    : articles.filter(a => a.category === activeCategory)

  return (
    <div className="min-h-screen pt-32 pb-24">
      <Helmet>
        <title>Writing | Portfolio OS</title>
      </Helmet>
      
      <main className="container mx-auto px-6 lg:px-8">
        <motion.div initial="initial" animate="animate" variants={staggerContainer} className="max-w-4xl">
          <motion.div variants={fadeInUp} className="mb-4">
            <span className="text-sm font-mono text-primary font-semibold tracking-wider uppercase">Technical Publication</span>
          </motion.div>
          
          <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            How I think and communicate.
          </motion.h1>
          
          <motion.p variants={fadeInUp} className="text-xl text-muted-foreground mb-16 max-w-2xl">
            Essays on frontend architecture, design systems, and building scalable interfaces.
          </motion.p>
        </motion.div>

        {!isLoading && featured && activeCategory === "All" && (
          <motion.div initial="initial" animate="animate" variants={staggerContainer} className="mb-24">
            <Link to={`/writing/${featured.slug}`} className="group block">
              <div className="grid md:grid-cols-2 gap-8 items-center bg-surface border border-border/50 rounded-3xl p-8 hover:border-foreground/30 transition-colors">
                <div className="order-2 md:order-1">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground font-mono mb-4">
                    <span className="text-primary">{featured.category}</span>
                    <span>•</span>
                    <span>{featured.readingTime}</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-display font-semibold mb-4 group-hover:text-primary transition-colors flex items-center gap-2">
                    {featured.title}
                    <ArrowUpRight className="w-6 h-6 opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300" />
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    {featured.excerpt}
                  </p>
                  <span className="inline-flex items-center text-sm font-medium hover:underline">
                    Read Article
                  </span>
                </div>
                {featured.coverImage ? (
                  <div className="order-1 md:order-2 aspect-video bg-muted rounded-xl overflow-hidden">
                    <img src={featured.coverImage} alt={featured.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                ) : (
                  <div className="order-1 md:order-2 aspect-video bg-muted/50 rounded-xl flex items-center justify-center">
                    <span className="font-display text-4xl text-muted-foreground/30 font-bold">Featured</span>
                  </div>
                )}
              </div>
            </Link>
          </motion.div>
        )}

        {!isLoading && categories.length > 0 && (
          <FilterBar 
            categories={categories} 
            activeCategory={activeCategory} 
            onSelect={setActiveCategory} 
          />
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[1, 2].map(i => (
              <div key={i} className="h-64 bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        ) : filteredArticles.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            {filteredArticles.map((article, idx) => (
              <ArticleCard key={article.id} article={article} index={idx} />
            ))}
          </motion.div>
        ) : (
          <div className="py-24 text-center">
            <h3 className="text-2xl font-semibold mb-2">No articles found.</h3>
            <p className="text-muted-foreground">Check back later for more thoughts on {activeCategory}.</p>
          </div>
        )}
      </main>
    </div>
  )
}
