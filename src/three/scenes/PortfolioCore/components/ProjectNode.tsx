import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { useCursor } from "@react-three/drei"
import { useNavigate } from "react-router-dom"
import * as THREE from "three"
import { getSceneColors } from "../../../../design-system/colors"
import { useResolvedColorMode } from "../../../hooks/useResolvedColorMode"

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
  const glow = useRef<THREE.Mesh>(null)

  const [hovered, setHovered] = useState(false)
  useCursor(hovered)

  const isDark = useResolvedColorMode()
  const colors = getSceneColors(isDark)
  const baseY = position[1]

  useFrame((state, delta) => {
    if (!group.current || !mesh.current) return

    group.current.position.y = baseY + Math.sin(state.clock.elapsedTime * 0.9 + phaseOffset) * 0.035

    const targetScale = hovered ? 1.5 : 1
    mesh.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 1 - Math.exp(-10 * delta))

    if (glow.current) {
      const glowScale = hovered ? 2.2 : 1.4
      glow.current.scale.lerp(new THREE.Vector3(glowScale, glowScale, glowScale), 1 - Math.exp(-8 * delta))
      const mat = glow.current.material as THREE.MeshBasicMaterial
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, hovered ? 0.35 : 0.12, 0.1)
    }
  })

  return (
    <group
      ref={group}
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
      }}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation()
        navigate(`/projects/${slug}`)
      }}
    >
      <mesh ref={glow} scale={1.4}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshBasicMaterial color={colors.emissive} transparent opacity={0.12} depthWrite={false} />
      </mesh>
      <mesh ref={mesh}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color={hovered ? colors.nodeHover : colors.nodeIdle} />
      </mesh>
    </group>
  )
}
