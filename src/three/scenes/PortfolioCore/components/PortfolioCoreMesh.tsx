import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { getSceneColors } from "../../../../design-system/colors"
import { useResolvedColorMode } from "../../../hooks/useResolvedColorMode"

export function PortfolioCoreMesh() {
  const isDark = useResolvedColorMode()
  const colors = getSceneColors(isDark)

  const outer = useRef<THREE.Mesh>(null)
  const inner = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    if (outer.current) {
      outer.current.rotation.x += delta * 0.06
      outer.current.rotation.y += delta * 0.1
      const breathe = 1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.015
      outer.current.scale.setScalar(breathe)
    }
    if (inner.current) {
      inner.current.rotation.x -= delta * 0.04
      inner.current.rotation.y -= delta * 0.07
    }
  })

  return (
    <group>
      <mesh ref={outer}>
        <icosahedronGeometry args={[1.35, 2]} />
        <meshStandardMaterial
          color={colors.meshInner}
          emissive={colors.emissive}
          emissiveIntensity={colors.emissiveIntensity}
          metalness={0.85}
          roughness={0.2}
        />
      </mesh>
      <mesh ref={inner} scale={0.72}>
        <icosahedronGeometry args={[1.35, 1]} />
        <meshStandardMaterial
          color={colors.mesh}
          emissive={colors.emissive}
          emissiveIntensity={colors.emissiveIntensity * 0.5}
          metalness={0.9}
          roughness={0.35}
          transparent
          opacity={0.92}
        />
      </mesh>
    </group>
  )
}
