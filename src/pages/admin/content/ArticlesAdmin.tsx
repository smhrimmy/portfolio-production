import { useState, useEffect } from "react"
import { Plus, Edit2, Trash2, Clock, PenTool, Sparkles, X, Save } from "lucide-react"
import { useAuthStore } from "../../../stores/authStore"
import { toast } from "react-hot-toast"
import { StatusBadge } from "../../../components/admin/ui/StatusBadge"
import { useUndo } from "../../../hooks/useUndo"
import { AuditTimeline } from "../../../components/admin/AuditTimeline"

export default function ArticlesAdmin() {
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { token } = useAuthStore()

  // Editor State
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editingArticle, setEditingArticle] = useState<any>(null)
  
  // AI State
  const [aiPrompt, setAiPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const { state: draft, set: setDraft, undo, redo } = useUndo({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    tags: "",
    category: "Blog",
    publishStatus: "draft",
    publishDate: null as string | null
  })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey) {
          redo()
        } else {
          undo()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo])

  useEffect(() => {
    fetchArticles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchArticles = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:3001" : "")
      const res = await fetch(`${apiUrl}/api/admin/articles`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        setArticles(await res.json())
      }
    } catch (_err) {
      console.error("Failed to fetch articles", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return
    try {
      const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:3001" : "")
      await fetch(`${apiUrl}/api/admin/articles/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchArticles()
    } catch (_err) {
      console.error(err)
    }
  }

  const handleOpenEditor = (article?: any) => {
    if (article) {
      setEditingArticle(article)
      setDraft({
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        tags: article.tags, // Assuming it's already a string or parseable
        category: article.category,
        publishStatus: article.publishStatus,
        publishDate: article.publishDate
      })
    } else {
      setEditingArticle(null)
      setDraft({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        tags: "",
        category: "Blog",
        publishStatus: "draft",
        publishDate: null
      })
    }
    setIsEditorOpen(true)
  }

  const handleSave = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:3001" : "")
      const method = editingArticle ? "PUT" : "POST"
      const url = editingArticle 
        ? `${apiUrl}/api/admin/articles/${editingArticle.id}` 
        : `${apiUrl}/api/admin/articles`

      const payload = {
        ...draft,
        readingTime: Math.max(1, Math.ceil(draft.content.split(" ").length / 200)),
        tags: Array.isArray(draft.tags) ? JSON.stringify(draft.tags) : draft.tags
      }

      const res = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        toast.success("Article saved successfully!")
        setIsEditorOpen(false)
        fetchArticles()
      } else {
        const error = await res.json()
        toast.error(`Error: ${error.error?.message || "Failed to save"}`)
      }
    } catch (_err) {
      console.error(err)
      toast.error("Network error while saving")
    }
  }

  const handleAiGenerate = async () => {
    if (!aiPrompt) return toast.error("Please enter a topic")
    setIsGenerating(true)
    try {
      const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:3001" : "")
      const res = await fetch(`${apiUrl}/api/admin/ai/generate-article`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ topic: aiPrompt })
      })
      
      const data = await res.json()
      if (res.ok) {
        setDraft({
          ...draft,
          title: data.title || draft.title,
          slug: data.slug || draft.slug,
          excerpt: data.excerpt || draft.excerpt,
          content: data.content || draft.content,
          tags: Array.isArray(data.tags) ? JSON.stringify(data.tags) : draft.tags
        })
        toast.success("AI Draft generated! Please review before saving.")
      } else {
        toast.error(`AI Error: ${data.error?.message}`)
      }
    } catch (_err) {
      console.error(err)
      toast.error("Failed to generate AI content")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleAiSeo = async () => {
    if (!draft.content) return toast.error("Content is empty")
    setIsGenerating(true)
    try {
      const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:3001" : "")
      const res = await fetch(`${apiUrl}/api/admin/ai/seo-assistant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content: draft.content })
      })
      
      const data = await res.json()
      if (res.ok) {
        setDraft({
          ...draft,
          title: data.title || draft.title,
          excerpt: data.description || draft.excerpt,
          tags: Array.isArray(data.keywords) ? JSON.stringify(data.keywords) : draft.tags
        })
        toast.success("SEO Metadata optimized!")
      } else {
        toast.error(`AI Error: ${data.error?.message}`)
      }
    } catch (_err) {
      console.error(err)
      toast.error("Failed to generate SEO metadata")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-50 flex items-center gap-2">
            <PenTool className="w-6 h-6 text-indigo-400" /> Articles
          </h1>
          <p className="text-neutral-400 mt-1">Manage your blog posts, guides, and writing.</p>
        </div>
        <button 
          onClick={() => handleOpenEditor()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Article
        </button>
      </div>

      <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-400">
            <thead className="bg-neutral-900 border-b border-neutral-800 text-neutral-300">
              <tr>
                <th className="px-6 py-4 font-medium">Title & Slug</th>
                <th className="px-6 py-4 font-medium">Category & Stats</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-neutral-500">Loading articles...</td>
                </tr>
              ) : articles.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-neutral-500">No articles found. Start writing!</td>
                </tr>
              ) : (
                articles.map((article) => (
                  <tr key={article.id} className="border-b border-neutral-800/50 hover:bg-neutral-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-neutral-200">
                        {article.title}
                        {article.featured && <span className="ml-2 text-xs bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full">Featured</span>}
                      </div>
                      <div className="text-xs text-neutral-500 mt-1">
                        /{article.slug}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-xs">
                        <span className="text-neutral-300">{article.category}</span>
                        <span className="text-neutral-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {article.readingTime} min read
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={article.publishStatus} publishDate={article.publishDate} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => handleOpenEditor(article)} className="text-neutral-500 hover:text-indigo-400 transition-colors" title="Edit">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(article.id)} className="text-neutral-500 hover:text-red-400 transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-6xl h-[90vh] flex flex-col md:flex-row overflow-hidden shadow-2xl">
            
            {/* Editor Area */}
            <div className="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar p-6 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-neutral-100">
                  {editingArticle ? "Edit Article" : "New Article"}
                </h2>
                <button onClick={() => setIsEditorOpen(false)} className="text-neutral-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Title</label>
                <input 
                  type="text" 
                  value={draft.title} 
                  onChange={e => setDraft({...draft, title: e.target.value})}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-neutral-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-1">Slug</label>
                  <input 
                    type="text" 
                    value={draft.slug} 
                    onChange={e => setDraft({...draft, slug: e.target.value})}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-neutral-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-1">Status</label>
                  <select 
                    value={draft.publishStatus} 
                    onChange={e => setDraft({...draft, publishStatus: e.target.value})}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-neutral-200"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-1">Publish Date (Optional)</label>
                  <input 
                    type="datetime-local" 
                    value={draft.publishDate ? new Date(draft.publishDate).toISOString().slice(0, 16) : ""} 
                    onChange={e => setDraft({...draft, publishDate: e.target.value ? new Date(e.target.value).toISOString() : null})}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-neutral-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Excerpt / Meta Description</label>
                <textarea 
                  value={draft.excerpt} 
                  onChange={e => setDraft({...draft, excerpt: e.target.value})}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-neutral-200 h-20 resize-none"
                />
              </div>

              <div className="flex-1 flex flex-col">
                <label className="block text-sm font-medium text-neutral-400 mb-1 flex items-center justify-between">
                  Content (Markdown)
                </label>
                <textarea 
                  value={draft.content} 
                  onChange={e => setDraft({...draft, content: e.target.value})}
                  className="flex-1 w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-neutral-200 font-mono text-sm resize-none custom-scrollbar min-h-[300px]"
                />
              </div>
            </div>

            {/* AI Assistant Sidebar */}
            <div className="w-full md:w-80 bg-neutral-950 border-l border-neutral-800 p-6 flex flex-col h-full overflow-y-auto">
              <h3 className="text-lg font-bold text-neutral-200 mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-fuchsia-400" /> AI Assistant
              </h3>

              <div className="space-y-6">
                {/* Generate Draft */}
                <div className="p-4 bg-neutral-900 rounded-lg border border-neutral-800">
                  <h4 className="text-sm font-semibold text-neutral-300 mb-2">Generate Draft</h4>
                  <p className="text-xs text-neutral-500 mb-3">Provide a topic and let AI write the first draft.</p>
                  <textarea 
                    placeholder="e.g. The benefits of React Server Components..."
                    value={aiPrompt}
                    onChange={e => setAiPrompt(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-md px-3 py-2 text-neutral-200 text-sm h-20 resize-none mb-3"
                  />
                  <button 
                    onClick={handleAiGenerate}
                    disabled={isGenerating}
                    className="w-full bg-fuchsia-600/20 hover:bg-fuchsia-600/30 text-fuchsia-400 border border-fuchsia-500/30 px-3 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {isGenerating ? "Generating..." : "Generate Post"}
                  </button>
                </div>

                {/* SEO Optimization */}
                <div className="p-4 bg-neutral-900 rounded-lg border border-neutral-800">
                  <h4 className="text-sm font-semibold text-neutral-300 mb-2">SEO Optimizer</h4>
                  <p className="text-xs text-neutral-500 mb-3">Analyzes your content to generate a strong title, meta description, and tags.</p>
                  <button 
                    onClick={handleAiSeo}
                    disabled={isGenerating || !draft.content}
                    className="w-full bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 px-3 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    Optimize Metadata
                  </button>
                </div>
              </div>

              <div className="mt-auto pt-6 space-y-4">
                {editingArticle && (
                  <AuditTimeline entity="Article" entityId={editingArticle.id} token={token} />
                )}
                <button 
                  onClick={handleSave}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <Save className="w-4 h-4" /> Save Article
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
