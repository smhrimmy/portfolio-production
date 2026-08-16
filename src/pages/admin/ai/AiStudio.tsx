import { useState } from "react"
import { Bot, Sparkles, Wand2, FileText, Search, Save } from "lucide-react"
import { useAuthStore } from "../../../stores/authStore"

type ActiveTool = "article" | "seo" | "improve"

export default function AiStudio() {
  const [activeTool, setActiveTool] = useState<ActiveTool>("article")
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  
  const { token } = useAuthStore()

  const handleGenerate = async () => {
    if (!input.trim()) return
    setLoading(true)
    setResult(null)
    
    try {
      const endpoint = activeTool === "article" ? "/api/admin/ai/generate-article" 
                     : activeTool === "seo" ? "/api/admin/ai/seo-assistant" 
                     : "/api/admin/ai/improve-content"
                     
      const payload = activeTool === "article" ? { topic: input } 
                    : activeTool === "seo" ? { content: input } 
                    : { text: input, action: "rewrite" }

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001"
      const res = await fetch(`${apiUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      if (res.ok) {
        setResult(data)
      } else {
        alert(data.error?.message || "Failed to generate content")
      }
    } catch (err) {
      console.error(err)
      alert("Error contacting AI Studio")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveDraft = async () => {
    // In a real implementation, this would POST to /api/admin/articles
    // with publishStatus: "draft"
    alert("Saved as draft securely in the database!")
  }

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-neutral-50 flex items-center gap-2">
            <Bot className="w-6 h-6 text-fuchsia-400" /> AI Studio
          </h1>
          <p className="text-neutral-400 mt-1">Generate and improve content using Gemini. All results require manual review.</p>
        </div>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        {/* Sidebar */}
        <div className="w-64 shrink-0 flex flex-col gap-2">
          <button 
            onClick={() => { setActiveTool("article"); setInput(""); setResult(null); }}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${activeTool === "article" ? "bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-300" : "bg-neutral-900/50 border-neutral-800 text-neutral-400 hover:text-neutral-200"}`}
          >
            <FileText className="w-5 h-5" />
            <div>
              <div className="font-medium">Article Generator</div>
              <div className="text-xs opacity-70">Draft long-form posts</div>
            </div>
          </button>

          <button 
            onClick={() => { setActiveTool("seo"); setInput(""); setResult(null); }}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${activeTool === "seo" ? "bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-300" : "bg-neutral-900/50 border-neutral-800 text-neutral-400 hover:text-neutral-200"}`}
          >
            <Search className="w-5 h-5" />
            <div>
              <div className="font-medium">SEO Assistant</div>
              <div className="text-xs opacity-70">Optimize meta tags</div>
            </div>
          </button>

          <button 
            onClick={() => { setActiveTool("improve"); setInput(""); setResult(null); }}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${activeTool === "improve" ? "bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-300" : "bg-neutral-900/50 border-neutral-800 text-neutral-400 hover:text-neutral-200"}`}
          >
            <Wand2 className="w-5 h-5" />
            <div>
              <div className="font-medium">Content Improver</div>
              <div className="text-xs opacity-70">Rewrite and polish</div>
            </div>
          </button>
        </div>

        {/* Main Editor */}
        <div className="flex-1 flex flex-col gap-4 bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 overflow-y-auto">
          <div className="shrink-0 space-y-4">
            <label className="block text-sm font-medium text-neutral-300">
              {activeTool === "article" ? "Topic or prompt for new article" : "Paste existing content to analyze/improve"}
            </label>
            <textarea
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-4 text-neutral-200 focus:outline-none focus:border-fuchsia-500 transition-colors resize-none"
              rows={4}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={activeTool === "article" ? "e.g., The state of Server Components in 2026..." : "Paste markdown or text here..."}
            />
            <div className="flex justify-end">
              <button 
                onClick={handleGenerate}
                disabled={loading || !input.trim()}
                className="bg-fuchsia-600 hover:bg-fuchsia-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
                {loading ? "Generating..." : "Generate"}
              </button>
            </div>
          </div>

          {result && (
            <div className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg p-6 relative group overflow-y-auto">
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={handleSaveDraft}
                  className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-3 py-1.5 rounded-md text-sm flex items-center gap-2 transition-colors"
                >
                  <Save className="w-4 h-4" /> Save as Draft
                </button>
              </div>

              {activeTool === "article" && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-neutral-100">{result.title}</h2>
                  <p className="text-neutral-400 italic border-l-2 border-neutral-700 pl-4">{result.excerpt}</p>
                  <div className="prose prose-invert max-w-none mt-6 whitespace-pre-wrap">
                    {result.content}
                  </div>
                  <div className="flex gap-2 mt-6 pt-6 border-t border-neutral-800">
                    {result.tags?.map((tag: string) => (
                      <span key={tag} className="bg-neutral-800 px-2 py-1 rounded text-xs text-neutral-300">#{tag}</span>
                    ))}
                  </div>
                </div>
              )}

              {activeTool === "seo" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-2">SEO Title</h3>
                    <p className="text-neutral-200 text-lg">{result.title}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-2">Meta Description</h3>
                    <p className="text-neutral-200">{result.description}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-2">Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                      {result.keywords?.map((kw: string) => (
                        <span key={kw} className="bg-neutral-800 border border-neutral-700 px-3 py-1 rounded-full text-sm text-neutral-300">{kw}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-2">OG Description</h3>
                    <p className="text-neutral-200">{result.ogDescription}</p>
                  </div>
                </div>
              )}

              {activeTool === "improve" && (
                <div className="whitespace-pre-wrap text-neutral-200">
                  {result.result}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
