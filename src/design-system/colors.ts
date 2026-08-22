/** Portfolio OS — Obsidian + Electric Cyan + Soft Violet */
export const brandColors = {
  base: "#07090D",
  surface: "#0D1117",
  elevated: "#131922",
  text: "#F4F7FA",
  textSecondary: "#98A2B3",
  border: "#202936",
  cyan: "#35D6FF",
  violet: "#8B7CFF",
  success: "#55E6A5",
  warning: "#FFCC66",
} as const

export function getSceneColors(isDark: boolean) {
  if (!isDark) {
    return {
      mesh: "#f4f7fa",
      meshInner: "#e8ecf2",
      wireframe: "#0891b2",
      emissive: "#0891b2",
      emissiveIntensity: 0.12,
      ringPrimary: "#0891b2",
      ringSecondary: "#7c3aed",
      particle: "#0891b2",
      nodeIdle: "#64748b",
      nodeHover: "#0891b2",
      lightKey: "#ffffff",
      lightFill: "#7c3aed",
      ambientIntensity: 0.65,
    }
  }

  return {
    mesh: brandColors.base,
    meshInner: brandColors.elevated,
    wireframe: brandColors.cyan,
    emissive: brandColors.cyan,
    emissiveIntensity: 0.22,
    ringPrimary: brandColors.cyan,
    ringSecondary: brandColors.violet,
    particle: brandColors.cyan,
    nodeIdle: brandColors.textSecondary,
    nodeHover: brandColors.cyan,
    lightKey: brandColors.text,
    lightFill: brandColors.violet,
    ambientIntensity: 0.28,
  }
}
