import { create } from "zustand"

interface AIState {
  isOpen: boolean
  query: string
  response: string
  isThinking: boolean
  sources: string[]
  setIsOpen: (isOpen: boolean) => void
  setQuery: (query: string) => void
  setResponse: (response: string) => void
  appendResponse: (chunk: string) => void
  setIsThinking: (isThinking: boolean) => void
  setSources: (sources: string[]) => void
  reset: () => void
}

export const useAiStore = create<AIState>((set) => ({
  isOpen: false,
  query: "",
  response: "",
  isThinking: false,
  sources: [],
  setIsOpen: (isOpen) => set({ isOpen }),
  setQuery: (query) => set({ query }),
  setResponse: (response) => set({ response }),
  appendResponse: (chunk) => set((state) => ({ response: state.response + chunk })),
  setIsThinking: (isThinking) => set({ isThinking }),
  setSources: (sources) => set({ sources }),
  reset: () => set({ query: "", response: "", isThinking: false, sources: [] })
}))
