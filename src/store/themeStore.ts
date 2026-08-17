import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'system' | 'light' | 'dark'
export type PortfolioTheme = 'premium-editorial' | 'classic' | 'minimal' | 'bento' | 'cyberpunk' | 'glass-os' | 'terminal-ide'

interface ThemeState {
  colorMode: Theme
  portfolioTheme: PortfolioTheme
  primaryColor: string | null
  bgColor: string | null
  fontFamily: string | null
  borderRadius: string | null
  setColorMode: (mode: Theme) => void
  setPortfolioTheme: (theme: PortfolioTheme) => void
  setCustomizations: (custom: Partial<ThemeState>) => void
  fetchThemeFromDB: () => Promise<void>
  saveThemeToDB: () => Promise<void>
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      colorMode: 'system',
      portfolioTheme: 'premium-editorial',
      primaryColor: null,
      bgColor: null,
      fontFamily: null,
      borderRadius: null,
      setColorMode: (colorMode) => set({ colorMode }),
      setPortfolioTheme: (portfolioTheme) => set({ portfolioTheme }),
      setCustomizations: (custom) => set(custom),
      fetchThemeFromDB: async () => {
        try {
          const apiUrl = import.meta.env.VITE_API_URL || "";
          const res = await fetch(`${apiUrl}/api/public/theme`);
          if (res.ok) {
            const data = await res.json();
            set({
              portfolioTheme: data.preset || 'premium-editorial',
              primaryColor: data.primaryColor,
              bgColor: data.bgColor,
              fontFamily: data.fontFamily,
              borderRadius: data.borderRadius,
            });
          }
        } catch (e) {
          console.error("Failed to load theme from DB", e);
        }
      },
      saveThemeToDB: async () => {
        try {
          const { portfolioTheme, primaryColor, bgColor, fontFamily, borderRadius } = get();
          const apiUrl = import.meta.env.VITE_API_URL || "";
          const token = localStorage.getItem('token');
          await fetch(`${apiUrl}/api/admin/theme`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              preset: portfolioTheme,
              primaryColor,
              bgColor,
              fontFamily,
              borderRadius
            })
          });
        } catch (e) {
          console.error("Failed to save theme to DB", e);
        }
      }
    }),
    {
      name: 'portfolio-os-theme-storage',
    }
  )
)
