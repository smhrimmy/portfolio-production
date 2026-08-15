import { useEffect, useState } from "react"
import { useThemeStore } from "../../store/themeStore"

function resolveIsDark(colorMode: "system" | "light" | "dark"): boolean {
  if (colorMode === "dark") return true
  if (colorMode === "light") return false
  return (
    document.documentElement.classList.contains("dark") ||
    window.matchMedia("(prefers-color-scheme: dark)").matches
  )
}

export function useResolvedColorMode(): boolean {
  const { colorMode } = useThemeStore()
  const [isDark, setIsDark] = useState(() => resolveIsDark(colorMode))

  useEffect(() => {
    setIsDark(resolveIsDark(colorMode))

    if (colorMode !== "system") return

    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const onChange = () => setIsDark(resolveIsDark("system"))
    media.addEventListener("change", onChange)

    const observer = new MutationObserver(onChange)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => {
      media.removeEventListener("change", onChange)
      observer.disconnect()
    }
  }, [colorMode])

  return isDark
}
