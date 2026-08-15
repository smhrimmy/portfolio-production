export function ThreeLoading() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10 pointer-events-none">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin opacity-50" />
        <span className="text-xs font-mono tracking-widest text-muted-foreground uppercase">
          Initializing WebGL...
        </span>
      </div>
    </div>
  )
}
