import React, { useEffect } from "react"
import { useThemeStore } from "../../store/themeStore"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { colorMode, portfolioTheme } = useThemeStore()

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
      "theme-terminal-ide"
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
  }, [colorMode, portfolioTheme])

  return <>{children}</>
}
