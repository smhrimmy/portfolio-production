import { useRef, useEffect, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { Float } from "@react-three/drei"
import * as THREE from "three"
import { getSceneColors } from "../../../design-system/colors"
import { useThreeStore } from "../../store/useThreeStore"
import { prefersReducedMotion } from "../../core/DeviceCapability"
import { usePointerRotation } from "../../hooks/usePointerRotation"
import { useResolvedColorMode } from "../../hooks/useResolvedColorMode"
import { getProjects } from "../../../data/projects"
import type { Project } from "../../../types/project"

import { PortfolioCoreMesh } from "./components/PortfolioCoreMesh"
import { CoreWireframe } from "./components/CoreWireframe"
import { OrbitRing } from "./components/OrbitRing"
import { ParticleField } from "./components/ParticleField"
import { ProjectNode } from "./components/ProjectNode"

const NODE_POSITIONS: [number, number, number][] = [
  [2, 1, -1],
  [-2, -1, 1],
  [1, -2, 1.5],
  [-1, 1.5, -2],
  [2.5, 0, 1],
]

export function PortfolioCore() {
  const isDark = useResolvedColorMode()
  const colors = getSceneColors(isDark)
  const { getEffectiveTier } = useThreeStore()
  const tier = getEffectiveTier()
  const isReducedMotion = prefersReducedMotion()

  const groupRef = useRef<THREE.Group>(null)
  const interactiveGroupRef = useRef<THREE.Group>(null)
  const nodesGroupRef = useRef<THREE.Group>(null)

  const [projects, setProjects] = useState<Project[]>([])
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    getProjects().then((data) => {
      setProjects(data.filter((p) => p.featured).slice(0, 5))
    })
  }, [])

  usePointerRotation(interactiveGroupRef, isReducedMotion ? 0 : 0.08)

  useFrame((state) => {
    if (tier === "LOW") return

    if (!isReducedMotion && groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.035
    }

    let storyProgress = 0
    let workProgress = 0

    const storyEl = document.getElementById("system-story")
    if (storyEl) {
      const rect = storyEl.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const height = rect.height - windowHeight
      if (height > 0) {
        storyProgress = Math.min(Math.max(-rect.top / height, 0), 1)
      }
    }

    const workEl = document.getElementById("work")
    if (workEl) {
      const rect = workEl.getBoundingClientRect()
      const start = window.innerHeight * 0.85
      workProgress = THREE.MathUtils.clamp((start - rect.top) / (window.innerHeight * 0.75), 0, 1)
    }

    if (nodesGroupRef.current) {
      const nodeScaleTarget = isReducedMotion
        ? 1
        : THREE.MathUtils.lerp(0.001, 1, Math.min(Math.max((storyProgress - 0.2) * 3, 0), 1))
      nodesGroupRef.current.scale.lerp(
        new THREE.Vector3(nodeScaleTarget, nodeScaleTarget, nodeScaleTarget),
        0.1,
      )
    }

    if (groupRef.current && !isReducedMotion) {
      const scrollY = window.scrollY
      const docHeight = Math.max(document.body.scrollHeight - window.innerHeight, 1)
      const scrollProgress = scrollY / docHeight

      const targetX = THREE.MathUtils.lerp(2.8, 0.2, scrollProgress)
      const targetScale = THREE.MathUtils.lerp(1, 0.55, workProgress)
      const targetY = THREE.MathUtils.lerp(0, -0.6, workProgress)

      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.05)
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.05)

      const hoverBoost = hovered ? 1.04 : 1
      const s = targetScale * hoverBoost
      groupRef.current.scale.lerp(new THREE.Vector3(s, s, s), 0.06)
    }
  })

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.position.x = 2.8
    }
  }, [])

  return (
    <group ref={groupRef}>
      <ambientLight intensity={colors.ambientIntensity} />
      <directionalLight position={[4, 4, 4]} intensity={0.9} color={colors.lightKey} />
      <directionalLight position={[-3, -2, -4]} intensity={0.55} color={colors.lightFill} />
      <pointLight position={[0, 0, 2]} intensity={0.4} color={colors.emissive} distance={8} />

      <group
        ref={interactiveGroupRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <Float
          speed={isReducedMotion ? 0 : 0.6}
          rotationIntensity={isReducedMotion ? 0 : 0.08}
          floatIntensity={isReducedMotion ? 0 : 0.15}
        >
          <PortfolioCoreMesh />
          <CoreWireframe />
        </Float>

        {!isReducedMotion && tier !== "LOW" && (
          <>
            <OrbitRing radius={1.75} rotation={[Math.PI / 2, 0, 0]} speed={0.08} tone="cyan" />
            <OrbitRing radius={2.05} rotation={[0.4, 0.7, 0.2]} speed={-0.05} tone="violet" />
            <OrbitRing radius={2.35} rotation={[0.8, 0.2, 0.5]} speed={0.03} tone="cyan" />
          </>
        )}

        {tier !== "LOW" && (
          <group ref={nodesGroupRef}>
            {projects.map((project, idx) => (
              <ProjectNode
                key={project.id}
                id={project.id}
                title={project.title}
                slug={project.slug}
                category={project.category}
                position={NODE_POSITIONS[idx] || [0, 0, 0]}
                phaseOffset={idx * (Math.PI / 2)}
              />
            ))}
          </group>
        )}

        <ParticleField />
      </group>
    </group>
  )
}
