import { Component } from "react"
import type { ErrorInfo, ReactNode } from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mb-6" />
          <h1 className="text-3xl font-bold text-neutral-100 mb-4">System Error</h1>
          <p className="text-neutral-400 max-w-md mx-auto mb-8">
            A critical error occurred while rendering this interface. The system has gracefully halted to prevent further issues.
          </p>
          <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg w-full max-w-2xl overflow-x-auto text-left mb-8">
            <pre className="text-red-400 text-sm font-mono whitespace-pre-wrap">
              {this.state.error?.toString()}
            </pre>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-neutral-100 hover:bg-white text-neutral-950 px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Reboot System
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
