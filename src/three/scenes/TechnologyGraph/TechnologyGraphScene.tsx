import { useRef, useMemo, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { Line, Html } from "@react-three/drei"
import * as THREE from "three"
import { useThemeStore } from "../../../store/themeStore"
import { useThreeStore } from "../../store/useThreeStore"
import { prefersReducedMotion } from "../../core/DeviceCapability"
import { usePointerRotation } from "../../hooks/usePointerRotation"

interface TechNode {
  id: string
  label: string
  category: "technology" | "project" | "article"
  position: [number, number, number]
}

interface TechLink {
  source: string
  target: string
}

// Generate a random stable spherical layout for demonstration
function generateMockGraph(): { nodes: TechNode[], links: TechLink[] } {
  const nodes: TechNode[] = [
    { id: "react", label: "React", category: "technology", position: [0, 0, 0] },
    { id: "ts", label: "TypeScript", category: "technology", position: [1.5, 1.5, 0] },
    { id: "three", label: "Three.js", category: "technology", position: [-1.5, -1, 1] },
    { id: "p1", label: "Portfolio OS", category: "project", position: [0.5, -2, -1] },
    { id: "p2", label: "Data Vis", category: "project", position: [-2, 1.5, -0.5] },
    { id: "a1", label: "React Patterns", category: "article", position: [2, -1, 1.5] },
  ]
  const links: TechLink[] = [
    { source: "react", target: "ts" },
    { source: "react", target: "three" },
    { source: "react", target: "p1" },
    { source: "ts", target: "p1" },
    { source: "three", target: "p1" },
    { source: "react", target: "p2" },
    { source: "react", target: "a1" },
  ]
  return { nodes, links }
}

export function TechnologyGraphScene() {
  const { colorMode, portfolioTheme } = useThemeStore()
  const { getEffectiveTier } = useThreeStore()
  const tier = getEffectiveTier()
  const isReducedMotion = prefersReducedMotion()
  
  const isDark = colorMode === "dark"
  const primaryColor = isDark ? "#ffffff" : "#000000"
  const accentColor = portfolioTheme === "cyberpunk" ? "#ff00ff" : "#4f46e5"

  const groupRef = useRef<THREE.Group>(null)
  
  // Parallax
  usePointerRotation(groupRef, isReducedMotion ? 0 : 0.05)
  
  // Slow spin
  useFrame((state) => {
    if (isReducedMotion || !groupRef.current) return
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.05
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.1
  })

  const { nodes, links } = useMemo(() => generateMockGraph(), [])

  const lineSegments = useMemo(() => {
    const segments: [number, number, number][][] = []
    links.forEach(conn => {
      const srcNode = nodes.find(n => n.id === conn.source)
      const tgtNode = nodes.find(n => n.id === conn.target)
      if (srcNode && tgtNode) {
        segments.push([srcNode.position, tgtNode.position])
      }
    })
    return segments
  }, [nodes, links])

  return (
    <group ref={groupRef}>
      <ambientLight intensity={isDark ? 0.4 : 1} />
      <directionalLight position={[5, 5, 5]} intensity={1} color={primaryColor} />
      <directionalLight position={[-5, -5, -5]} intensity={0.5} color={accentColor} />

      {nodes.map(node => (
        <GraphNode 
          key={node.id} 
          node={node} 
          primaryColor={primaryColor} 
          accentColor={accentColor} 
        />
      ))}

      {tier !== "LOW" && lineSegments.map((segment, idx) => (
        <Line 
          key={idx}
          points={segment}
          color={primaryColor}
          opacity={0.15}
          transparent
          lineWidth={1}
        />
      ))}
    </group>
  )
}

function GraphNode({ node, primaryColor, accentColor }: { node: TechNode, primaryColor: string, accentColor: string }) {
  const mesh = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  
  useFrame((_, delta) => {
    if (!mesh.current) return
    const targetScale = hovered ? 1.3 : 1
    mesh.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 1 - Math.exp(-8 * delta))
  })

  const isTech = node.category === "technology"

  return (
    <group 
      position={node.position}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
      onPointerOut={() => setHovered(false)}
    >
      <mesh ref={mesh}>
        <sphereGeometry args={[isTech ? 0.25 : 0.15, 16, 16]} />
        <meshStandardMaterial 
          color={hovered ? accentColor : primaryColor} 
          wireframe={!hovered && !isTech}
        />
      </mesh>
      
      <Html position={[0, -0.4, 0]} center style={{ pointerEvents: 'none' }}>
        <div className={`px-2 py-1 rounded-md bg-background/80 backdrop-blur-sm border ${hovered ? 'border-primary' : 'border-border/50'} text-xs font-mono whitespace-nowrap text-foreground shadow-sm transition-colors`}>
          {node.label}
        </div>
      </Html>
    </group>
  )
}
