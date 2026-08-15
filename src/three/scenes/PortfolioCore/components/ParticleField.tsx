import { useMemo } from "react"
import { Points, PointMaterial } from "@react-three/drei"
import { useThemeStore } from "../../../../store/themeStore"
import { useThreeStore } from "../../../store/useThreeStore"
import { prefersReducedMotion } from "../../../core/DeviceCapability"

export function ParticleField() {
  const { colorMode } = useThemeStore()
  const { getEffectiveTier } = useThreeStore()
  const tier = getEffectiveTier()
  const isReducedMotion = prefersReducedMotion()

  const isDark = colorMode === "dark"
  const particleColor = isDark ? "#ffffff" : "#000000"

  const particleCount = tier === "HIGH" ? 1800 : tier === "BALANCED" ? 900 : tier === "LOW" ? 300 : 0

  const positions = useMemo(() => {
    const p = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      p[i * 3] = (Math.random() - 0.5) * 15
      p[i * 3 + 1] = (Math.random() - 0.5) * 15
      p[i * 3 + 2] = (Math.random() - 0.5) * 15
    }
    return p
  }, [particleCount])

  if (particleCount === 0 || isReducedMotion) return null

  return (
    <Points positions={positions} stride={3}>
      <PointMaterial 
        transparent 
        color={particleColor} 
        size={0.025} 
        sizeAttenuation={true} 
        depthWrite={false}
        opacity={isDark ? 0.25 : 0.15}
      />
    </Points>
  )
}
