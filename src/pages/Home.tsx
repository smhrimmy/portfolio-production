import { useState, useEffect } from "react"
import { getFeaturedProjects } from "../data/projects"
import { getExperience } from "../data/experience"
import { getArticles } from "../data/articles"
import { getFeaturedSkills } from "../data/skills"
import type { Project } from "../types/project"
import type { Experience } from "../types/experience"
import type { Article } from "../types/article"
import type { Skill } from "../types/skill"

import { ThreeCanvas } from "../three/components/ThreeCanvas"
import { PortfolioCore } from "../three/scenes/PortfolioCore/PortfolioCore"

// Sections
import { HeroSection } from "./home/HeroSection"
import { IdentitySection } from "./home/IdentitySection"
import { CapabilitySection } from "./home/CapabilitySection"
import { SystemStorySection } from "./home/SystemStorySection"
import { WorkSection } from "./home/WorkSection"
import { ExperienceSection } from "./home/ExperienceSection"
import { WritingSection } from "./home/WritingSection"
import { ContactSection } from "./home/ContactSection"

export function Home() {
  const [projects, setProjects] = useState<Project[]>([])
  const [experience, setExperience] = useState<Experience[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [proj, exp, art, sk] = await Promise.all([
          getFeaturedProjects(),
          getExperience(),
          getArticles(),
          getFeaturedSkills(),
        ])
        setProjects(proj.slice(0, 3))
        setExperience(exp.slice(0, 3)) 
        setArticles(art.slice(0, 2)) 
        setSkills(sk) 
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="relative w-full overflow-x-hidden">
      
      {/* 
        3D Core Visual. 
        Fixed positioned behind everything.
        It manages its own internal state via useFrame reading window scroll.
      */}
        <div className="fixed inset-0 z-0">
          <ThreeCanvas sceneId="home-core" interactive={true}>
            <PortfolioCore />
          </ThreeCanvas>
        </div>

      <div className="relative z-10">
        <HeroSection />
        
        {!isLoading && (
          <>
            <IdentitySection />
            <CapabilitySection skills={skills} />
            <SystemStorySection />
            <WorkSection projects={projects} />
            <ExperienceSection experience={experience} />
            <WritingSection articles={articles} />
            <ContactSection />
          </>
        )}
      </div>
    </div>
  )
}
