import { PortfolioCore } from "../../scenes/PortfolioCore/PortfolioCore"
import { ArchitectureScene } from "../../scenes/ArchitectureScene/ArchitectureScene"
import { TechnologyGraphScene } from "../../scenes/TechnologyGraph/TechnologyGraphScene"

export const SCENE_REGISTRY: Record<string, React.FC<any>> = {
  core: PortfolioCore,
  architecture: ArchitectureScene,
  technology: TechnologyGraphScene,
}

export function getSceneComponent(type?: string): React.FC<any> | null {
  if (!type) return null
  return SCENE_REGISTRY[type] || null
}
