import { useRef, useEffect, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { Float } from "@react-three/drei"
import * as THREE from "three"
import { useThemeStore } from "../../../store/themeStore"
import { useThreeStore } from "../../store/useThreeStore"
import { prefersReducedMotion } from "../../core/DeviceCapability"
import { usePointerRotation } from "../../hooks/usePointerRotation"
import { getProjects } from "../../../data/projects"
import type { Project } from "../../../types/project"

import { PortfolioCoreMesh } from "./components/PortfolioCoreMesh"
import { CoreWireframe } from "./components/CoreWireframe"
import { OrbitRing } from "./components/OrbitRing"
import { ParticleField } from "./components/ParticleField"
import { ProjectNode } from "./components/ProjectNode"

// Fixed positions for the first few featured projects
const NODE_POSITIONS: [number, number, number][] = [
  [2, 1, -1],
  [-2, -1, 1],
  [1, -2, 1.5],
  [-1, 1.5, -2],
  [2.5, 0, 1]
]

export function PortfolioCore() {
  const { colorMode, portfolioTheme } = useThemeStore()
  const { getEffectiveTier } = useThreeStore()
  const tier = getEffectiveTier()
  const isReducedMotion = prefersReducedMotion()
  
  const isDark = colorMode === "dark"
  const primaryColor = isDark ? "#ffffff" : "#000000"
  const accentColor = portfolioTheme === "cyberpunk" ? "#ff00ff" : "#4f46e5"

  const groupRef = useRef<THREE.Group>(null)
  const interactiveGroupRef = useRef<THREE.Group>(null)
  const nodesGroupRef = useRef<THREE.Group>(null)
  
  const [projects, setProjects] = useState<Project[]>([])

  // Load projects to bind to nodes
  useEffect(() => {
    getProjects().then(data => {
      // Just take up to 5 featured projects for the core nodes
      setProjects(data.filter(p => p.featured).slice(0, 5))
    })
  }, [])

  // 1. Pointer Parallax
  usePointerRotation(interactiveGroupRef, isReducedMotion ? 0 : 0.1)

  // 2. Storytelling Scroll Choreography
  useFrame((state) => {
    if (tier === "LOW") return
    
    // Constant slow base rotation
    if (!isReducedMotion && groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.05
    }

    // Scroll interpolation
    let scrollProgress = 0
    let storyProgress = 0

    const storyEl = document.getElementById("system-story")
    if (storyEl) {
      const rect = storyEl.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const start = rect.top
      const height = rect.height - windowHeight
      if (height > 0) {
         storyProgress = Math.min(Math.max(-start / height, 0), 1)
      }
    }

    const docHeight = document.body.scrollHeight - window.innerHeight
    if (docHeight > 0) {
      scrollProgress = window.scrollY / docHeight
    }

    // Transition nodes in
    if (nodesGroupRef.current) {
      const nodeScaleTarget = isReducedMotion ? 1 : THREE.MathUtils.lerp(0.001, 1, Math.min(Math.max((storyProgress - 0.2) * 3, 0), 1))
      // Lerp scale
      nodesGroupRef.current.scale.lerp(new THREE.Vector3(nodeScaleTarget, nodeScaleTarget, nodeScaleTarget), 0.1)
    }

    // Shift scene on X axis depending on scroll (homepage hero vs contact)
    if (groupRef.current && !isReducedMotion) {
      const targetX = THREE.MathUtils.lerp(3, 0, scrollProgress)
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.05)
    }
  })

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.position.x = 3
    }
  }, [])

  return (
    <group ref={groupRef}>
      {/* Lighting */}
      <ambientLight intensity={isDark ? 0.3 : 0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1} color={primaryColor} />
      <directionalLight position={[-5, -5, -5]} intensity={0.5} color={accentColor} />

      {/* Interactive elements that respond to pointer */}
      <group ref={interactiveGroupRef}>
        <Float 
          speed={isReducedMotion ? 0 : 1} 
          rotationIntensity={isReducedMotion ? 0 : 0.15} 
          floatIntensity={isReducedMotion ? 0 : 0.25}
        >
          <PortfolioCoreMesh />
          <CoreWireframe />
        </Float>

        {!isReducedMotion && tier !== "LOW" && (
          <>
            <OrbitRing radius={1.8} rotation={[Math.PI / 2, 0, 0]} speed={0.12} />
            <OrbitRing radius={2.1} rotation={[0.5, 0.8, 0]} speed={-0.08} />
          </>
        )}

        {/* Project Nodes */}
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
