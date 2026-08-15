import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { useThemeStore } from "../../../../store/themeStore"

export function OrbitRing({
  radius,
  rotation,
  speed,
}: {
  radius: number
  rotation: [number, number, number]
  speed: number
}) {
  const { colorMode } = useThemeStore()
  const isDark = colorMode === "dark"
  const ringColor = isDark ? "#ffffff" : "#000000"
  
  const ref = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.z += delta * speed
  })

  return (
    <mesh ref={ref} rotation={rotation}>
      <torusGeometry args={[radius, 0.008, 8, 96]} />
      <meshBasicMaterial color={ringColor} transparent opacity={0.25} />
    </mesh>
  )
}
