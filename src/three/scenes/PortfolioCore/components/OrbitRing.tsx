import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { getSceneColors } from "../../../../design-system/colors"
import { useResolvedColorMode } from "../../../hooks/useResolvedColorMode"

export function OrbitRing({
  radius,
  rotation,
  speed,
  tone = "cyan",
}: {
  radius: number
  rotation: [number, number, number]
  speed: number
  tone?: "cyan" | "violet"
}) {
  const isDark = useResolvedColorMode()
  const colors = getSceneColors(isDark)
  const ringColor = tone === "violet" ? colors.ringSecondary : colors.ringPrimary

  const ref = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.z += delta * speed
  })

  return (
    <mesh ref={ref} rotation={rotation}>
      <torusGeometry args={[radius, 0.006, 8, 128]} />
      <meshBasicMaterial color={ringColor} transparent opacity={isDark ? 0.35 : 0.25} />
    </mesh>
  )
}
