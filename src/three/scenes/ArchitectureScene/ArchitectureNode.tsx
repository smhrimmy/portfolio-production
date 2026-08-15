import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { Html } from "@react-three/drei"
import * as THREE from "three"
import { useThemeStore } from "../../../store/themeStore"

interface ArchitectureNodeProps {
  id: string
  label: string
  type: string
  position: [number, number, number]
}

export function ArchitectureNode({ label, type, position }: ArchitectureNodeProps) {
  const group = useRef<THREE.Group>(null)
  const mesh = useRef<THREE.Mesh>(null)
  
  const [hovered, setHovered] = useState(false)
  const { colorMode, portfolioTheme } = useThemeStore()
  
  const isDark = colorMode === "dark"
  const primaryColor = isDark ? "#ffffff" : "#000000"
  const accentColor = portfolioTheme === "cyberpunk" ? "#ff00ff" : "#4f46e5"

  useFrame((_, delta) => {
    if (!mesh.current || !group.current) return
    const targetScale = hovered ? 1.2 : 1
    mesh.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 1 - Math.exp(-8 * delta))
  })

  // Subtle geometry differences based on type
  const isDatabase = type.toLowerCase().includes("database")
  const isApi = type.toLowerCase().includes("api")

  return (
    <group 
      ref={group} 
      position={position}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
      onPointerOut={() => setHovered(false)}
    >
      <mesh ref={mesh}>
        {isDatabase ? (
          <cylinderGeometry args={[0.3, 0.3, 0.6, 16]} />
        ) : isApi ? (
          <boxGeometry args={[0.5, 0.5, 0.5]} />
        ) : (
          <sphereGeometry args={[0.3, 16, 16]} />
        )}
        <meshStandardMaterial 
          color={hovered ? accentColor : primaryColor} 
          wireframe={!hovered}
          emissive={hovered ? accentColor : "#000000"}
          emissiveIntensity={0.2}
        />
      </mesh>
      
      <Html position={[0, -0.6, 0]} center style={{ pointerEvents: 'none' }}>
        <div className={`px-2 py-1 rounded bg-background/80 backdrop-blur-sm border ${hovered ? 'border-primary' : 'border-border/50'} text-xs font-mono whitespace-nowrap text-foreground shadow-sm transition-colors`}>
          {label}
        </div>
      </Html>
    </group>
  )
}
