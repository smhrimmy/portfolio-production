import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { useThemeStore } from "../../../../store/themeStore"

export function PortfolioCoreMesh() {
  const { portfolioTheme, colorMode } = useThemeStore()
  const isDark = colorMode === "dark"
  const accentColor = portfolioTheme === "cyberpunk" ? "#ff00ff" : "#4f46e5"

  const mesh = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    if (!mesh.current) return

    mesh.current.rotation.x += delta * 0.12
    mesh.current.rotation.y += delta * 0.2

    const targetScale = 1 + Math.sin(state.clock.elapsedTime * 1.2) * 0.025
    mesh.current.scale.setScalar(targetScale)
  })

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1.35, 2]} />
      <meshStandardMaterial
        color={isDark ? "#111111" : "#ffffff"}
        emissive={accentColor}
        emissiveIntensity={0.15}
        metalness={0.7}
        roughness={0.25}
        wireframe={false}
      />
    </mesh>
  )
}
