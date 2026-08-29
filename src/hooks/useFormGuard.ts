import { useEffect } from "react"
import { useBlocker } from "react-router-dom"

export function useFormGuard(isDirty: boolean) {
  // Prevent closing the browser tab or reloading the page
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault()
        e.returnValue = "" // Required for legacy browsers
      }
    }
    
    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [isDirty])

  // Prevent internal SPA navigation
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty && currentLocation.pathname !== nextLocation.pathname
  )

  useEffect(() => {
    if (blocker.state === "blocked") {
      const confirmLeave = window.confirm("You have unsaved changes. Are you sure you want to leave?")
      if (confirmLeave) {
        blocker.proceed()
      } else {
        blocker.reset()
      }
    }
  }, [blocker])
}
