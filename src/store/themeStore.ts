import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'system' | 'light' | 'dark'
export type PortfolioTheme = 'premium-editorial' | 'classic' | 'minimal' | 'bento' | 'cyberpunk' | 'glass-os' | 'terminal-ide'

interface ThemeState {
  colorMode: Theme
  portfolioTheme: PortfolioTheme
  setColorMode: (mode: Theme) => void
  setPortfolioTheme: (theme: PortfolioTheme) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      colorMode: 'dark',
      portfolioTheme: 'premium-editorial',
      setColorMode: (colorMode) => set({ colorMode }),
      setPortfolioTheme: (portfolioTheme) => set({ portfolioTheme }),
    }),
    {
      name: 'portfolio-os-theme-storage',
    }
  )
)
