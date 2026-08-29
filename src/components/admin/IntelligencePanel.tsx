import React, { useState, useEffect, useRef } from "react"
import { Search, X, Command, Brain, ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useIntelligenceStore } from "../../stores/intelligenceStore"
import { processQuery } from "../../lib/intelligence/queryEngine"
import { buildLocalIndex } from "../../lib/intelligence/indexer"
import { useAuthStore } from "../../stores/authStore"

export function IntelligencePanel() {
  const { isOpen, setIsOpen, messages, addMessage, isIndexed, insights } = useIntelligenceStore()
  const { token } = useAuthStore()
  const [input, setInput] = useState("")
  const [activeTab, setActiveTab] = useState<"chat" | "insights">("chat")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Listen for Cmd+J / Ctrl+J
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "j") {
        e.preventDefault()
        setIsOpen(!isOpen)
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, setIsOpen])

  // Build index on first open if not indexed
  useEffect(() => {
    if (isOpen && !isIndexed && token) {
      buildLocalIndex(token)
    }
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen, isIndexed, token])

  // Auto-scroll to bottom
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userQuery = input.trim()
    setInput("")
    
    // Add user message
    addMessage({ role: "user", content: userQuery })
    setLoading(true)

    // Simulate slight computation delay for UX (it's actually synchronous and instant)
    setTimeout(() => {
      const response = processQuery(userQuery)
      addMessage({
        role: "assistant",
        content: response.text,
        actions: response.actions
      })
      setLoading(false)
    }, 300)
  }

  const handleActionClick = (path: string) => {
    setIsOpen(false)
    navigate(path)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />
      
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-700 shadow-2xl rounded-xl overflow-hidden flex flex-col max-h-[70vh] shadow-indigo-500/10">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-800 bg-neutral-900/50">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-500/20 p-1.5 rounded-lg">
              <Brain className="w-5 h-5 text-indigo-400" />
            </div>
            <span className="font-semibold text-neutral-100">PDL Intelligence</span>
            {!isIndexed && <span className="text-xs text-neutral-500 ml-2 animate-pulse">Indexing...</span>}
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-neutral-500 hover:text-neutral-300 transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-neutral-800 bg-neutral-900/80 px-4 gap-4">
          <button
            onClick={() => setActiveTab("chat")}
            className={`py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "chat" 
                ? "border-indigo-500 text-indigo-400" 
                : "border-transparent text-neutral-500 hover:text-neutral-300"
            }`}
          >
            Chat
          </button>
          <button
            onClick={() => setActiveTab("insights")}
            className={`py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "insights" 
                ? "border-indigo-500 text-indigo-400" 
                : "border-transparent text-neutral-500 hover:text-neutral-300"
            }`}
          >
            Insights
            {insights.length > 0 && (
              <span className="bg-indigo-500/20 text-indigo-400 py-0.5 px-2 rounded-full text-[10px]">
                {insights.length}
              </span>
            )}
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar min-h-[300px]">
          {activeTab === "chat" ? (
            <div className="space-y-6">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-neutral-500 space-y-4 pt-8">
                  <Brain className="w-12 h-12 text-neutral-700" />
                  <div>
                    <p className="font-medium text-neutral-400">Ask anything about your portfolio.</p>
                    <p className="text-sm mt-1">Answers are generated from your live data, securely on your device.</p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 mt-4 max-w-md">
                    {["What's my latest blog post?", "How many projects feature React?", "What should I improve on my site?", "Which theme is active?"].map(q => (
                      <button 
                        key={q}
                        onClick={() => { setInput(q); inputRef.current?.focus() }}
                        className="text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-3 py-1.5 rounded-full transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-xl p-4 ${
                      msg.role === 'user' 
                        ? 'bg-indigo-600 text-white rounded-tr-sm' 
                        : 'bg-neutral-800 text-neutral-200 rounded-tl-sm border border-neutral-700'
                    }`}>
                      <div className="text-sm" dangerouslySetInnerHTML={{ 
                        __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      }} />
                      
                      {msg.actions && msg.actions.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2 pt-3 border-t border-neutral-700/50">
                          {msg.actions.map((action, i) => (
                            <button
                              key={i}
                              onClick={() => handleActionClick(action.onClick)}
                              className="flex items-center gap-1.5 text-xs font-medium bg-neutral-900 hover:bg-neutral-950 text-indigo-300 border border-neutral-700 hover:border-indigo-500/50 px-2.5 py-1.5 rounded transition-all"
                            >
                              {action.label} <ArrowRight className="w-3 h-3" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-neutral-800 border border-neutral-700 rounded-xl rounded-tl-sm p-4 flex gap-1 items-center">
                    <div className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          ) : (
            <div className="space-y-4">
              {insights.length === 0 ? (
                <div className="text-center text-neutral-500 py-12">
                  <p>Your portfolio is fully optimized! No issues found.</p>
                </div>
              ) : (
                insights.map(insight => (
                  <div key={insight.id} className="bg-neutral-800/50 border border-neutral-700/50 rounded-lg p-4 flex gap-4">
                    <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                      insight.severity === 'high' ? 'bg-red-500' :
                      insight.severity === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                          {insight.type}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-200">{insight.message}</p>
                      
                      {insight.actionUrl && (
                        <button
                          onClick={() => handleActionClick(insight.actionUrl!)}
                          className="mt-3 text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-indigo-300 border border-neutral-700 px-3 py-1.5 rounded inline-flex items-center gap-1.5 transition-colors"
                        >
                          {insight.actionLabel} <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-3 border-t border-neutral-800 bg-neutral-950">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <Search className="absolute left-3 w-5 h-5 text-neutral-500" />
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your content..."
              className="w-full bg-neutral-900 border border-neutral-700 text-neutral-100 placeholder:text-neutral-500 rounded-lg pl-10 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            />
            <div className="absolute right-3 flex items-center gap-1 text-neutral-500 pointer-events-none">
              <Command className="w-4 h-4" />
              <span className="text-xs font-medium">J</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
