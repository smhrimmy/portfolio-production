import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { fadeInUp } from "../../design-system/motion"
import { Card, CardContent } from "../ui/card"
import type { Article } from "../../types/article"

export function ArticleCard({ article, index }: { article: Article; index: number }) {
  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })

  return (
    <motion.div variants={fadeInUp} custom={index}>
      <Link to={`/writing/${article.slug}`}>
        <Card className="h-full bg-transparent border-0 shadow-none group hover:bg-surface/50 p-4 -m-4 transition-colors duration-300">
          <CardContent className="p-0 flex flex-col h-full">
            <div className="flex items-center gap-4 text-sm text-muted-foreground font-mono mb-3">
              <span className="text-primary">{article.category}</span>
              <span>•</span>
              <time dateTime={article.publishedAt}>{formattedDate}</time>
              <span>•</span>
              <span>{article.readingTime}</span>
            </div>
            
            <h3 className="text-xl md:text-2xl font-display font-semibold mb-3 group-hover:text-primary transition-colors">
              {article.title}
            </h3>
            
            <p className="text-muted-foreground leading-relaxed flex-1">
              {article.excerpt}
            </p>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}
