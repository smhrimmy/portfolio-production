import { Link } from "react-router-dom"

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <h1 className="text-8xl font-display font-bold tracking-tighter mb-4 text-primary">404</h1>
      <h2 className="text-2xl font-sans font-medium mb-6">System Not Found</h2>
      <p className="text-muted-foreground mb-8 max-w-[400px]">
        The requested module could not be located within Portfolio OS. 
        It may have been moved, deleted, or never existed.
      </p>
      <Link 
        to="/" 
        className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Return to Core
      </Link>
    </div>
  )
}
