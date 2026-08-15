import { useMemo } from "react"
import { Points, PointMaterial } from "@react-three/drei"
import { getSceneColors } from "../../../../design-system/colors"
import { useResolvedColorMode } from "../../../hooks/useResolvedColorMode"
import { useThreeStore } from "../../../store/useThreeStore"
import { prefersReducedMotion } from "../../../core/DeviceCapability"

export function ParticleField() {
  const isDark = useResolvedColorMode()
  const colors = getSceneColors(isDark)
  const { getEffectiveTier } = useThreeStore()
  const tier = getEffectiveTier()
  const isReducedMotion = prefersReducedMotion()

  const particleCount = tier === "HIGH" ? 1200 : tier === "BALANCED" ? 600 : tier === "LOW" ? 200 : 0

  const positions = useMemo(() => {
    const p = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      const radius = 2 + Math.random() * 6
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      p[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      p[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      p[i * 3 + 2] = radius * Math.cos(phi)
    }
    return p
  }, [particleCount])

  if (particleCount === 0 || isReducedMotion) return null

  return (
    <Points positions={positions} stride={3}>
      <PointMaterial
        transparent
        color={colors.particle}
        size={0.02}
        sizeAttenuation
        depthWrite={false}
        opacity={isDark ? 0.35 : 0.2}
      />
    </Points>
  )
}
