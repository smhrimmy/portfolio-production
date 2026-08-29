import { create } from "zustand"
import { persist } from "zustand/middleware"
import MiniSearch from "minisearch"
import type { Insight } from "../lib/intelligence/insights"

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: number
  actions?: { label: string; onClick: string }[]
}

interface IntelligenceState {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  messages: Message[]
  addMessage: (message: Omit<Message, "id" | "timestamp">) => void
  clearMessages: () => void
  
  // Search index state
  isIndexed: boolean
  setIsIndexed: (status: boolean) => void
  
  // Insights
  insights: Insight[]
  setInsights: (insights: Insight[]) => void
  
  
  // Stats for the query engine
  stats: {
    projectCount: number
    articleCount: number
    skillCount: number
    themeName: string
    lastUpdated: number | null
  }
  setStats: (stats: Partial<IntelligenceState["stats"]>) => void
}

export const useIntelligenceStore = create<IntelligenceState>()(
  persist(
    (set) => ({
      isOpen: false,
      setIsOpen: (isOpen) => set({ isOpen }),
      messages: [],
      addMessage: (msg) => set((state) => ({
        messages: [
          ...state.messages, 
          { 
            ...msg, 
            id: Math.random().toString(36).substring(2, 9),
            timestamp: Date.now()
          }
        ]
      })),
      clearMessages: () => set({ messages: [] }),
      
      isIndexed: false,
      setIsIndexed: (isIndexed) => set({ isIndexed }),
      
      insights: [],
      setInsights: (insights) => set({ insights }),
      
      stats: {
        projectCount: 0,
        articleCount: 0,
        skillCount: 0,
        themeName: "minimal",
        lastUpdated: null
      },
      setStats: (newStats) => set((state) => ({
        stats: { ...state.stats, ...newStats }
      }))
    }),
    {
      name: "pdl-intelligence-store",
      partialize: (state) => ({ messages: state.messages })
    }
  )
)

// Global singleton instance for MiniSearch to avoid recreating it in React renders
export const searchIndex = new MiniSearch({
  fields: ['title', 'content', 'category', 'tags', 'type'],
  storeFields: ['title', 'slug', 'category', 'type', 'excerpt']
})
