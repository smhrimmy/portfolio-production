
import { getSceneComponent } from "./SceneRegistry"
import { PortfolioCore } from "../../scenes/PortfolioCore/PortfolioCore"

interface SceneAdapterProps {
  sceneType?: string
  config?: any
}

export function SceneAdapter({ sceneType, config }: SceneAdapterProps) {
  // If a specific scene is requested and exists in registry, mount it
  const SceneComponent = getSceneComponent(sceneType)
  
  if (SceneComponent) {
    return <SceneComponent {...config} />
  }

  // Fallback to PortfolioCore
  return <PortfolioCore />
}
