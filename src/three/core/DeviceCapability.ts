import type { CapabilityLevel } from "../types/three"

export function detectDeviceCapability(): CapabilityLevel {
  if (typeof window === "undefined") return "MEDIUM"

  let score = 0
  
  // Hardware Concurrency
  if (navigator.hardwareConcurrency) {
    if (navigator.hardwareConcurrency >= 8) score += 2
    else if (navigator.hardwareConcurrency >= 4) score += 1
  }

  // Device Memory
  if ((navigator as any).deviceMemory) {
    if ((navigator as any).deviceMemory >= 8) score += 2
    else if ((navigator as any).deviceMemory >= 4) score += 1
  }

  // Mobile detection
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  if (isMobile) score -= 1

  if (score >= 3) return "HIGH"
  if (score >= 1) return "MEDIUM"
  return "LOW"
}

export function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas")
    return !!(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")))
  } catch {
    return false
  }
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}
