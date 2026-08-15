import { Box } from "lucide-react"

export function ThreeFallback({ reason = "not-supported" }: { reason?: string }) {
  return (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-surface/50 border border-dashed border-border/50 rounded-3xl p-8 relative overflow-hidden">
      {/* Abstract static visual fallback */}
      <div className="absolute inset-0 opacity-10 flex items-center justify-center">
        <div className="w-[300px] h-[300px] rounded-full border border-primary/20 animate-[spin_60s_linear_infinite]" />
        <div className="absolute w-[400px] h-[400px] rounded-full border border-primary/10 animate-[spin_90s_linear_infinite_reverse]" />
      </div>
      
      <div className="relative z-10 flex flex-col items-center text-center max-w-sm">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-6 text-muted-foreground border border-border">
          <Box className="w-8 h-8 opacity-50" />
        </div>
        
        {reason === "disabled" ? (
          <>
            <h3 className="text-xl font-display font-medium mb-2">3D Visuals Disabled</h3>
            <p className="text-sm text-muted-foreground">
              You have turned off 3D effects in your settings to conserve power.
            </p>
          </>
        ) : (
          <>
            <h3 className="text-xl font-display font-medium mb-2">Portfolio Visuals</h3>
            <p className="text-sm text-muted-foreground">
              A lightweight static view is currently displayed for optimal performance.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
