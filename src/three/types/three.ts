export type CapabilityLevel = "HIGH" | "MEDIUM" | "LOW"
export type PerformanceTier = "AUTO" | "HIGH" | "BALANCED" | "LOW" | "OFF"

export interface ThreeSceneConfig {
  id: string
  enabled: boolean
  quality: PerformanceTier
  interactive: boolean
  autoRotate: boolean
  background: boolean
  fallback: boolean
  mobileFallback: boolean
  reducedMotion: boolean
  pauseWhenHidden: boolean
}

export type SceneState = "idle" | "loading" | "ready" | "active" | "paused" | "disposed" | "error"

export interface Asset {
  id: string
  type: "texture" | "gltf" | "audio"
  url: string
}
