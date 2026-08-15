import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { Line } from "@react-three/drei"
import * as THREE from "three"
import { useThemeStore } from "../../../store/themeStore"
import { useThreeStore } from "../../store/useThreeStore"
import { prefersReducedMotion } from "../../core/DeviceCapability"
import { ArchitectureNode } from "./ArchitectureNode"
import { usePointerRotation } from "../../hooks/usePointerRotation"

interface ArchNode {
  id: string
  label: string
  type: string
  position: [number, number, number]
}

interface ArchConnection {
  source: string
  target: string
}

interface ArchitectureSceneProps {
  nodes?: ArchNode[]
  connections?: ArchConnection[]
}

// Fallback mock data if none provided
const DEFAULT_NODES: ArchNode[] = [
  { id: "client", label: "Frontend", type: "client", position: [-2, 1, 0] },
  { id: "api", label: "API Gateway", type: "api", position: [0, 0, 0] },
  { id: "db", label: "Database", type: "database", position: [2, -1, 0] }
]
const DEFAULT_CONNECTIONS: ArchConnection[] = [
  { source: "client", target: "api" },
  { source: "api", target: "db" }
]

export function ArchitectureScene({ nodes = DEFAULT_NODES, connections = DEFAULT_CONNECTIONS }: ArchitectureSceneProps) {
  const { colorMode } = useThemeStore()
  const { getEffectiveTier } = useThreeStore()
  const tier = getEffectiveTier()
  const isReducedMotion = prefersReducedMotion()
  
  const isDark = colorMode === "dark"
  const lineColor = isDark ? "#ffffff" : "#000000"

  const groupRef = useRef<THREE.Group>(null)
  
  usePointerRotation(groupRef, isReducedMotion ? 0 : 0.1)
  
  // Constant slow orbit
  useFrame((state) => {
    if (isReducedMotion || !groupRef.current) return
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
  })

  // Build line segments between nodes
  const lineSegments = useMemo(() => {
    const segments: [number, number, number][][] = []
    connections.forEach(conn => {
      const srcNode = nodes.find(n => n.id === conn.source)
      const tgtNode = nodes.find(n => n.id === conn.target)
      if (srcNode && tgtNode) {
        segments.push([srcNode.position, tgtNode.position])
      }
    })
    return segments
  }, [nodes, connections])

  return (
    <group ref={groupRef}>
      <ambientLight intensity={isDark ? 0.4 : 1} />
      <directionalLight position={[5, 10, 5]} intensity={1} />
      
      {nodes.map(node => (
        <ArchitectureNode 
          key={node.id}
          id={node.id}
          label={node.label}
          type={node.type}
          position={node.position}
        />
      ))}
      
      {tier !== "LOW" && lineSegments.map((segment, idx) => (
        <Line 
          key={idx}
          points={segment}
          color={lineColor}
          opacity={0.3}
          transparent
          lineWidth={1}
          dashed={!isReducedMotion}
          dashScale={10}
          dashSize={2}
          dashOffset={0} // We can animate this if we want flowing data
        />
      ))}
    </group>
  )
}
