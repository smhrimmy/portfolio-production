// @ts-nocheck
import type { SkillCategory } from "../types/skill.js"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001"

// We map unique categories on the fly
export async function getSkillCategories(): Promise<SkillCategory[]> {
  try {
    const skills = await getSkills()
    const uniqueCatNames = Array.from(new Set(skills.map(s => s.category)))
    return uniqueCatNames.map((name, i) => ({
      id: `sc_${i}`,
      name: name,
      order: i
    }))
  } catch (err) {
    return []
  }
}

export async function getSkills(): Promise<any[]> {
  try {
    const res = await fetch(`${API_URL}/api/public/skills`)
    if (!res.ok) return []
    return await res.json()
  } catch (err) {
    console.error("Failed to fetch skills", err)
    return []
  }
}

export async function getFeaturedSkills(): Promise<any[]> {
  try {
    const skills = await getSkills()
    // By default, just take top 4 highest proficiency skills if we don't have a featured flag
    return skills.sort((a, b) => b.proficiency - a.proficiency).slice(0, 4)
  } catch (err) {
    return []
  }
}
