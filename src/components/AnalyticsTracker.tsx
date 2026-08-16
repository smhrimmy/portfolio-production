import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { trackEvent } from "../utils/analytics"

export function AnalyticsTracker() {
  const location = useLocation()

  useEffect(() => {
    trackEvent({
      eventType: "page_view",
      path: location.pathname
    })
  }, [location.pathname])

  return null
}
