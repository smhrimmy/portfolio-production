import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import * as THREE from 'three'

function RotatingStars() {
  const ref = useRef<THREE.Group>(null)
  
  useFrame((_state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10
      ref.current.rotation.y -= delta / 15
    }
  })

  return (
    <group ref={ref}>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
    </group>
  )
}

function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 1] }}
      dpr={[1, Math.min(2, window.devicePixelRatio)]} // Cap pixel ratio
      gl={{ antialias: false, alpha: false }} // Performance optimizations
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        background: '#050505',
        pointerEvents: 'none'
      }}
    >
      <fog attach="fog" args={['#050505', 10, 50]} />
      <RotatingStars />
    </Canvas>
  )
}

export default Scene;
