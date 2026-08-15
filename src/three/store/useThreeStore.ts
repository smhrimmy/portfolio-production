import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { PerformanceTier, SceneState } from "../types/three"
import { detectDeviceCapability, isWebGLAvailable } from "../core/DeviceCapability"

interface ThreeStore {
  // Global Settings
  enabled: boolean
  performanceTier: PerformanceTier
  
  // Runtime State
  hasWebGL: boolean
  activeScene: string | null
  sceneState: SceneState
  
  // Actions
  setEnabled: (enabled: boolean) => void
  setPerformanceTier: (tier: PerformanceTier) => void
  setActiveScene: (id: string | null) => void
  setSceneState: (state: SceneState) => void
  
  // Computed helpers
  getEffectiveTier: () => PerformanceTier
}

export const useThreeStore = create<ThreeStore>()(
  persist(
    (set, get) => ({
      enabled: true,
      performanceTier: "AUTO",
      hasWebGL: isWebGLAvailable(),
      activeScene: null,
      sceneState: "idle",

      setEnabled: (enabled) => set({ enabled }),
      setPerformanceTier: (performanceTier) => set({ performanceTier }),
      setActiveScene: (activeScene) => set({ activeScene }),
      setSceneState: (sceneState) => set({ sceneState }),
      
      getEffectiveTier: () => {
        const { performanceTier, enabled, hasWebGL } = get()
        if (!enabled || !hasWebGL) return "OFF"
        
        if (performanceTier === "AUTO") {
          const cap = detectDeviceCapability()
          if (cap === "HIGH") return "HIGH"
          if (cap === "MEDIUM") return "BALANCED"
          return "LOW"
        }
        
        return performanceTier
      }
    }),
    {
      name: "portfolio-os-three-storage",
      partialize: (state) => ({ 
        enabled: state.enabled,
        performanceTier: state.performanceTier 
      }),
    }
  )
)
