import { Outlet } from "react-router-dom"
import { Navigation } from "../components/navigation/Navigation"
import { CommandPalette } from "../components/navigation/CommandPalette"

import { AiAssistant } from "../features/ai/components/AiAssistant"
import { AnalyticsTracker } from "../components/AnalyticsTracker"

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col relative font-sans antialiased">
      <AnalyticsTracker />
      <Navigation />
      <main className="flex-1">
        <Outlet />
      </main>
      <CommandPalette />
      <AiAssistant />
    </div>
  )
}
