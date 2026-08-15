import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { X, Sparkles, Send, Loader2, ArrowRight, FileText } from "lucide-react"
import { useAiStore } from "../../../store/aiStore"
import { ProductionPortfolioAIProvider } from "../providers/ProductionPortfolioAIProvider"

// In a real setup, this would be an environment variable (e.g. import.meta.env.VITE_USE_PRODUCTION_AI)
// We'll default to Mock unless we can hit the server, or we can just instantiate Production directly.
// Given Phase 15 requirements, we are moving to Production backend.
const aiProvider = new ProductionPortfolioAIProvider() // falls back to localhost:3001

export function AiAssistant() {
  const { isOpen, setIsOpen, query, setQuery, response, setResponse, appendResponse, isThinking, setIsThinking, sources, setSources } = useAiStore()
  const navigate = useNavigate()
  
  // Ref for auto-scrolling
  const responseRef = useRef<HTMLDivElement>(null)
  
  // Abort controller for cancelling requests
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (responseRef.current) {
      responseRef.current.scrollTop = responseRef.current.scrollHeight
    }
  }, [response])

  const handleClose = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    setIsOpen(false)
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!query.trim() || isThinking) return

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    abortControllerRef.current = new AbortController()

    setIsThinking(true)
    setResponse("")
    setSources([])

    try {
      // For Production AI Provider, context is retrieved server-side.
      const aiResponse = await aiProvider.answer(query, [], (chunk: string) => {
        appendResponse(chunk)
      }, { signal: abortControllerRef.current.signal })
      setSources(aiResponse.sources)
    } catch (error: any) {
      console.error(error)
      if (error.name === "AbortError") {
        return // Silently ignore user aborts
      }
      if (error.message === "RATE_LIMITED") {
        setResponse("You are sending too many requests. Please wait a minute and try again.")
      } else if (error.message === "AI_TIMEOUT") {
        setResponse("The AI is taking too long to respond. [RETRY_TRIGGER]")
      } else {
        setResponse("Portfolio AI is temporarily unavailable. You can still search the portfolio normally. [RETRY_TRIGGER]")
      }
    } finally {
      setIsThinking(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-background/80 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="ai-title">
      <div className="relative w-full max-w-lg bg-card border shadow-2xl rounded-xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/50">
          <div className="flex items-center gap-2 text-primary">
            <Sparkles className="w-5 h-5" />
            <h2 id="ai-title" className="font-semibold text-sm tracking-tight">PORTFOLIO AI</h2>
          </div>
          <button onClick={handleClose} className="p-1 hover:bg-muted rounded-md transition-colors" aria-label="Close AI">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Response Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-sm" ref={responseRef} aria-live="polite">
          {!response && !isThinking && (
            <div className="text-center space-y-4 py-8">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <p className="text-muted-foreground">Ask me about the work, projects, experience, or technologies.</p>
              <div className="flex flex-col gap-2 mt-6 text-left">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Suggested</p>
                {["Which projects use React?", "Show my strongest engineering projects", "Tell me about my experience"].map((suggestion) => (
                  <button 
                    key={suggestion}
                    onClick={() => { setQuery(suggestion); handleSubmit() }}
                    className="text-left px-3 py-2 text-xs rounded-md bg-muted hover:bg-primary/10 hover:text-primary transition-colors flex items-center justify-between group"
                  >
                    <span>{suggestion}</span>
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {response && (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="whitespace-pre-wrap leading-relaxed">{response.replace(" [RETRY_TRIGGER]", "")}</p>
              {response.includes("[RETRY_TRIGGER]") && (
                <button onClick={() => handleSubmit()} className="mt-4 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-md text-xs font-semibold transition-colors">
                  Retry Connection
                </button>
              )}
              {isThinking && <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1 align-middle" />}
            </div>
          )}

          {!isThinking && sources.length > 0 && (
            <div className="pt-4 mt-4 border-t space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sources</p>
              <div className="grid gap-2">
                {sources.map(sourceId => (
                  <button 
                    key={sourceId}
                    onClick={() => {
                      handleClose()
                      // Mock source navigation - normally would lookup full URL
                      navigate(sourceId.startsWith('proj') ? '/projects' : '/experience') 
                    }}
                    className="flex items-center justify-between p-3 rounded-md border bg-muted/30 hover:bg-muted hover:border-primary/50 transition-all text-left group"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-8 h-8 rounded bg-background flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <span className="text-xs font-medium truncate">{sourceId}</span>
                    </div>
                    <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:text-primary shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-muted/30 border-t">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a question..."
              className="w-full bg-background border rounded-full pl-4 pr-12 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all disabled:opacity-50"
              disabled={isThinking}
              autoFocus
            />
            <button
              type="submit"
              disabled={!query.trim() || isThinking}
              className="absolute right-1.5 p-1.5 bg-primary text-primary-foreground rounded-full disabled:opacity-50 hover:bg-primary/90 transition-colors"
            >
              {isThinking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
          <div className="text-center mt-2">
             <span className="text-[10px] text-muted-foreground">AI can make mistakes. Verify important information.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
