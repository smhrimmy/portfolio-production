import { Outlet } from "react-router-dom"
import { Navigation } from "../components/navigation/Navigation"
import { CommandPalette } from "../components/navigation/CommandPalette"

import { AiAssistant } from "../features/ai/components/AiAssistant"

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col relative font-sans antialiased">
      <Navigation />
      <main className="flex-1">
        <Outlet />
      </main>
      <CommandPalette />
      <AiAssistant />
    </div>
  )
}
