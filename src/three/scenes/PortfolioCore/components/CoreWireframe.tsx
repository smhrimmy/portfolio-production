import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { getSceneColors } from "../../../../design-system/colors"
import { useResolvedColorMode } from "../../../hooks/useResolvedColorMode"

export function CoreWireframe() {
  const isDark = useResolvedColorMode()
  const colors = getSceneColors(isDark)

  const mesh = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (!mesh.current) return
    mesh.current.rotation.y -= delta * 0.05
    mesh.current.rotation.x += delta * 0.025
  })

  return (
    <mesh ref={mesh} scale={1.06}>
      <icosahedronGeometry args={[1.35, 2]} />
      <meshBasicMaterial
        color={colors.wireframe}
        wireframe
        transparent
        opacity={isDark ? 0.28 : 0.2}
      />
    </mesh>
  )
}
