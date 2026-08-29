import React, { useEffect, Suspense } from "react"
import { useThemeStore } from "../../store/themeStore"

const SpatialScene = React.lazy(() => import("../../components/3d/SpatialScene"))

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { colorMode, portfolioTheme, primaryColor, bgColor, fontFamily, borderRadius } = useThemeStore()

  useEffect(() => {
    const root = window.document.documentElement
    
    // Remove all existing theme classes
    root.classList.remove(
      "light", 
      "dark", 
      "theme-premium-editorial",
      "theme-classic",
      "theme-minimal",
      "theme-bento",
      "theme-cyberpunk",
      "theme-glass-os",
      "theme-terminal-ide",
      "theme-editorial",
      "theme-brutalist",
      "theme-luxury",
      "theme-timeline",
      "theme-3d-spatial"
    )

    // Apply color mode
    if (colorMode === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      root.classList.add(systemTheme)
    } else {
      root.classList.add(colorMode)
    }

    // Apply portfolio theme
    root.classList.add(`theme-${portfolioTheme}`)

    // Inject advanced customizations
    if (primaryColor) root.style.setProperty('--color-primary', primaryColor)
    else root.style.removeProperty('--color-primary')
    
    if (bgColor) root.style.setProperty('--color-bg', bgColor)
    else root.style.removeProperty('--color-bg')
    
    if (fontFamily) root.style.setProperty('--font-primary', fontFamily)
    else root.style.removeProperty('--font-primary')
    
    if (borderRadius) root.style.setProperty('--radius', borderRadius)
    else root.style.removeProperty('--radius')

  }, [colorMode, portfolioTheme, primaryColor, bgColor, fontFamily, borderRadius])

  return (
    <>
      {portfolioTheme === '3d-spatial' && (
        <Suspense fallback={null}>
          <SpatialScene />
        </Suspense>
      )}
      {children}
    </>
  )
}
