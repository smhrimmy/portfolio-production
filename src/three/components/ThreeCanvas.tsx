import { Suspense, useEffect, useState, useRef } from "react"
import { Canvas } from "@react-three/fiber"
import { useThreeStore } from "../store/useThreeStore"
import { prefersReducedMotion } from "../core/DeviceCapability"
import { ThreeErrorBoundary } from "../core/ThreeErrorBoundary"
import { ThreeFallback } from "./ThreeFallback"
import { ThreeLoading } from "./ThreeLoading"

interface ThreeCanvasProps {
  children: React.ReactNode
  sceneId: string
  className?: string
  fallback?: React.ReactNode
  interactive?: boolean
  camera?: {
    position: [number, number, number]
    fov?: number
    near?: number
    far?: number
  }
}

export function ThreeCanvas({ 
  children, 
  sceneId, 
  className = "", 
  fallback, 
  interactive = false,
  camera = { position: [0, 0, 5], fov: 45, near: 0.1, far: 100 }
}: ThreeCanvasProps) {
  const { enabled, hasWebGL, getEffectiveTier, setActiveScene } = useThreeStore()
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const effectiveTier = getEffectiveTier()
  const isReducedMotion = prefersReducedMotion()

  useEffect(() => {
    setActiveScene(sceneId)
    return () => setActiveScene(null)
  }, [sceneId, setActiveScene])

  // Intersection Observer to pause rendering when offscreen
  useEffect(() => {
    if (!containerRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0 }
    )

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  // Page visibility observer
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(document.visibilityState === "visible")
    }
    
    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [])

  // Determine DPR based on tier
  const dpr: [number, number] = effectiveTier === "HIGH" ? [1, 2] : 
                                effectiveTier === "BALANCED" ? [1, 1.5] : [1, 1]

  if (!enabled) return fallback || <ThreeFallback reason="disabled" />
  if (!hasWebGL || effectiveTier === "OFF" || isReducedMotion) {
    return fallback || <ThreeFallback reason="not-supported" />
  }

  return (
    <div ref={containerRef} className={`relative w-full h-full ${className}`}>
      <ThreeErrorBoundary fallback={fallback}>
        <Suspense fallback={<ThreeLoading />}>
          {isVisible ? (
            <Canvas
              dpr={dpr}
              camera={camera}
              gl={{ 
                antialias: effectiveTier === "HIGH",
                powerPreference: "high-performance",
                alpha: true 
              }}
              className={`absolute inset-0 z-0 ${interactive ? "" : "pointer-events-none"}`}
            >
              {children}
            </Canvas>
          ) : (
            <div className="absolute inset-0 bg-background/5" /> // Paused state placeholder
          )}
        </Suspense>
      </ThreeErrorBoundary>
    </div>
  )
}
