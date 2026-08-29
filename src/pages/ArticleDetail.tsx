import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { motion, useScroll, useSpring } from "framer-motion"
import { fadeInUp, staggerContainer } from "../design-system/motion"
import { getArticleBySlug } from "../data/articles"
import type { Article } from "../types/article"
import { Helmet } from "react-helmet-async"
import { ArrowLeft } from "lucide-react"
import DOMPurify from "dompurify"

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [article, setArticle] = useState<Article | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  useEffect(() => {
    if (!slug) return
    const load = async () => {
      try {
        const data = await getArticleBySlug(slug)
        setArticle(data)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [slug])

  if (isLoading) {
    return <div className="min-h-screen pt-32 pb-24 flex items-center justify-center">Loading...</div>
  }

  if (!article) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
        <Link to="/writing" className="text-primary hover:underline">Return to Writing</Link>
      </div>
    )
  }

  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-50"
        style={{ scaleX }}
      />
      <div className="min-h-screen pt-32 pb-24">
        <Helmet>
          <title>{article.title} | Portfolio OS</title>
        </Helmet>
        
        <main className="container mx-auto px-6 lg:px-8">
          <motion.article 
            initial="initial" 
            animate="animate" 
            variants={staggerContainer} 
            className="max-w-[760px] mx-auto"
          >
            <motion.div variants={fadeInUp} className="mb-12">
              <Link to="/writing" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Writing
              </Link>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex items-center gap-4 text-sm font-mono text-muted-foreground mb-6">
              <span className="text-primary font-semibold">{article.category}</span>
              <span>•</span>
              <time dateTime={article.publishedAt}>{formattedDate}</time>
              <span>•</span>
              <span>{article.readingTime}</span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-8 leading-tight">
              {article.title}
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-xl text-muted-foreground mb-12 leading-relaxed">
              {article.excerpt}
            </motion.p>

            {article.coverImage && (
              <motion.div variants={fadeInUp} className="mb-16 aspect-[21/9] rounded-2xl overflow-hidden bg-muted">
                <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
              </motion.div>
            )}

            <motion.div 
              variants={fadeInUp} 
              className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-display prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }}
            />
            
            {article.tags && article.tags.length > 0 && (
              <motion.div variants={fadeInUp} className="mt-16 pt-8 border-t border-border flex flex-wrap gap-2">
                {article.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 text-sm font-mono rounded bg-muted text-muted-foreground">
                    #{tag}
                  </span>
                ))}
              </motion.div>
            )}
          </motion.article>
        </main>
      </div>
    </>
  )
}
