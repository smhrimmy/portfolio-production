// @ts-nocheck
import { Check, Palette, LayoutTemplate } from "lucide-react"
import { useThemeStore } from "../../../store/themeStore"
import type { PortfolioTheme } from "../../../store/themeStore"
import React, { useState } from "react"
import { toast } from "react-hot-toast"

const THEMES: { id: PortfolioTheme; name: string; description: string; colors: string[] }[] = [
  { id: "premium-editorial", name: "Premium Editorial", description: "Clean, typographic focus.", colors: ["bg-neutral-50", "bg-neutral-900"] },
  { id: "classic", name: "Classic", description: "Standard portfolio design.", colors: ["bg-blue-600", "bg-white"] },
  { id: "minimal", name: "Minimal", description: "Extreme whitespace, zero distractions.", colors: ["bg-neutral-100", "bg-black"] },
  { id: "bento", name: "Bento Box", description: "Grid-based modular layout.", colors: ["bg-emerald-500", "bg-neutral-900"] },
  { id: "cyberpunk", name: "Cyberpunk", description: "Neon, high-contrast aesthetics.", colors: ["bg-fuchsia-500", "bg-black"] },
  { id: "glass-os", name: "Glass OS", description: "Frosted glassmorphism interface.", colors: ["bg-white/10", "bg-black"] },
  { id: "terminal-ide", name: "Terminal IDE", description: "Code editor aesthetics.", colors: ["bg-green-500", "bg-neutral-950"] },
  { id: "editorial", name: "PDL Editorial", description: "Magazine-style, large serif, grid typography.", colors: ["bg-orange-50", "bg-neutral-900"] },
  { id: "brutalist", name: "PDL Brutalist", description: "Raw borders, bold typography, high contrast.", colors: ["bg-white", "bg-black border-2 border-black"] },
  { id: "luxury", name: "PDL Luxury", description: "Dark, serif, gold accent, generous spacing.", colors: ["bg-amber-500", "bg-neutral-950"] },
  { id: "timeline", name: "PDL Timeline", description: "Scroll-driven chronological layout.", colors: ["bg-neutral-100", "bg-neutral-800"] },
  { id: "3d-spatial", name: "PDL 3D Spatial", description: "WebGL interactive starfield background.", colors: ["bg-neutral-950", "bg-indigo-500"] },
]

export default function ThemeStudio() {
  const { 
    portfolioTheme, setPortfolioTheme, 
    primaryColor, bgColor, fontFamily, borderRadius, setCustomizations,
    saveThemeToDB 
  } = useThemeStore()

  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await saveThemeToDB()
    setSaving(false)
    toast.success("Theme config saved to database!")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-50 flex items-center gap-2">
            <Palette className="w-6 h-6 text-indigo-400" /> Theme Studio
          </h1>
          <p className="text-neutral-400 mt-1">Live design system configuration for Portfolio OS.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          <Check className="w-4 h-4" /> {saving ? "Saving..." : "Save to DB"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-neutral-200 mb-4 flex items-center gap-2">
              <LayoutTemplate className="w-5 h-5" /> Base Theme Presets
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {THEMES.map((theme) => {
                const isActive = portfolioTheme === theme.id
                return (
                  <button
                    key={theme.id}
                    onClick={() => {
                      setPortfolioTheme(theme.id);
                      setCustomizations({ primaryColor: null, bgColor: null, fontFamily: null, borderRadius: null });
                    }}
                    className={`relative p-4 rounded-xl border text-left transition-all ${
                      isActive 
                        ? "border-indigo-500 bg-indigo-500/10" 
                        : "border-neutral-800 bg-neutral-950 hover:border-neutral-700"
                    }`}
                  >
                    {isActive && (
                      <div className="absolute top-4 right-4 text-indigo-400">
                        <Check className="w-5 h-5" />
                      </div>
                    )}
                    <div className="flex gap-2 mb-3">
                      {theme.colors.map((color, i) => (
                        <div key={i} className={`w-6 h-6 rounded-full border border-neutral-700 ${color}`} />
                      ))}
                    </div>
                    <h3 className={`font-medium ${isActive ? "text-indigo-300" : "text-neutral-200"}`}>{theme.name}</h3>
                    <p className="text-sm text-neutral-500 mt-1">{theme.description}</p>
                  </button>
                )
              })}
            </div>
          </div>
          
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-neutral-200 mb-4">Advanced Customization</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Primary Color (CSS Variable)</label>
                <input 
                  type="text" 
                  value={primaryColor || ""} 
                  onChange={(e) => setCustomizations({ primaryColor: e.target.value })}
                  placeholder="e.g. #3b82f6 or oklch(0.5 0.2 250)"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-neutral-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Background Color</label>
                <input 
                  type="text" 
                  value={bgColor || ""} 
                  onChange={(e) => setCustomizations({ bgColor: e.target.value })}
                  placeholder="e.g. #09090b"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-neutral-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Font Family</label>
                <input 
                  type="text" 
                  value={fontFamily || ""} 
                  onChange={(e) => setCustomizations({ fontFamily: e.target.value })}
                  placeholder="e.g. 'Inter', sans-serif"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-neutral-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Global Border Radius</label>
                <input 
                  type="text" 
                  value={borderRadius || ""} 
                  onChange={(e) => setCustomizations({ borderRadius: e.target.value })}
                  placeholder="e.g. 0.5rem"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-neutral-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-neutral-200 mb-4">Live Preview Status</h2>
            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-neutral-800 bg-neutral-950">
                <span className="text-sm text-neutral-500 block mb-1">Active Theme</span>
                <span className="font-mono text-indigo-400">{portfolioTheme}</span>
              </div>
              <p className="text-xs text-neutral-500">
                Ensure you click "Save to DB" to deploy your theme configuration to the public site.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
