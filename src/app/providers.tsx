import React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { ThemeProvider } from "../features/themes/ThemeProvider"

import { useThemeStore } from "../store/themeStore"

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  const { fetchThemeFromDB } = useThemeStore()
  
  React.useEffect(() => {
    fetchThemeFromDB()
  }, [fetchThemeFromDB])

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  )
}
