import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { ArticleCard } from "../../components/portfolio/ArticleCard"
import type { Article } from "../../types/article"
import { fadeInUp } from "../../design-system/motion"

export function WritingSection({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null

  return (
    <section id="writing" className="py-32 bg-surface/30">
      <div className="container max-w-screen-xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Latest Writing</h2>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl font-sans">
              Thoughts on engineering, design, and architecture.
            </p>
          </motion.div>
          <Button variant="ghost" asChild className="hidden md:inline-flex shrink-0">
            <Link to="/writing">Read All Articles</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          {articles.map((article, idx) => (
            <ArticleCard key={article.id} article={article} index={idx} />
          ))}
        </div>
        
        <div className="mt-16 md:hidden">
          <Button variant="outline" className="w-full" asChild>
            <Link to="/writing">Read All Articles</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
