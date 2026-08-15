import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export function usePointerRotation(
  ref: React.RefObject<THREE.Group | THREE.Mesh | null>,
  strength = 0.1
) {
  const target = useRef(new THREE.Vector2())

  useFrame((state, delta) => {
    if (!ref.current) return

    target.current.set(
      state.pointer.y * strength,
      state.pointer.x * strength
    )

    ref.current.rotation.x = THREE.MathUtils.lerp(
      ref.current.rotation.x,
      target.current.x,
      1 - Math.exp(-5 * delta)
    )

    ref.current.rotation.y = THREE.MathUtils.lerp(
      ref.current.rotation.y,
      target.current.y,
      1 - Math.exp(-5 * delta)
    )
  })
}
