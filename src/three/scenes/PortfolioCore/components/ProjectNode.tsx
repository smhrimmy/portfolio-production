import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { useCursor } from "@react-three/drei"
import { useNavigate } from "react-router-dom"
import * as THREE from "three"
import { useThemeStore } from "../../../../store/themeStore"

interface ProjectNodeProps {
  id: string
  title: string
  slug: string
  category?: string
  position: [number, number, number]
  phaseOffset: number
}

export function ProjectNode({ slug, position, phaseOffset }: ProjectNodeProps) {
  const navigate = useNavigate()
  const group = useRef<THREE.Group>(null)
  const mesh = useRef<THREE.Mesh>(null)
  
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)
  
  const { portfolioTheme, colorMode } = useThemeStore()
  const isDark = colorMode === "dark"
  const primaryColor = isDark ? "#ffffff" : "#000000"
  const accentColor = portfolioTheme === "cyberpunk" ? "#ff00ff" : "#4f46e5"

  const baseY = position[1]

  useFrame((state, delta) => {
    if (!group.current || !mesh.current) return

    // Subtle floating
    group.current.position.y = baseY + Math.sin(state.clock.elapsedTime * 1.2 + phaseOffset) * 0.04

    // Hover scale interpolation
    const targetScale = hovered ? 1.4 : 1
    mesh.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 1 - Math.exp(-8 * delta))
  })

  return (
    <group 
      ref={group} 
      position={position}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => { e.stopPropagation(); navigate(`/projects/${slug}`) }}
    >
      <mesh ref={mesh}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color={hovered ? accentColor : primaryColor} />
      </mesh>
    </group>
  )
}
