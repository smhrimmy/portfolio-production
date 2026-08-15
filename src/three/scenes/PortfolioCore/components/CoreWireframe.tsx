import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { useThemeStore } from "../../../../store/themeStore"

export function CoreWireframe() {
  const { portfolioTheme } = useThemeStore()
  const accentColor = portfolioTheme === "cyberpunk" ? "#ff00ff" : "#4f46e5"
  
  const mesh = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (!mesh.current) return
    mesh.current.rotation.y -= delta * 0.08
    mesh.current.rotation.x += delta * 0.04
  })

  return (
    <mesh ref={mesh} scale={1.04}>
      <icosahedronGeometry args={[1.35, 2]} />
      <meshBasicMaterial
        color={accentColor}
        wireframe
        transparent
        opacity={0.16}
      />
    </mesh>
  )
}
