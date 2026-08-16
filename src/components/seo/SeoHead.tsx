import { useEffect } from "react"
import { useLocation } from "react-router-dom"

interface SeoProps {
  title?: string
  description?: string
  image?: string
  noIndex?: boolean
  canonicalUrl?: string
  structuredData?: any
}

export function SeoHead({ title, description, image, noIndex, canonicalUrl, structuredData }: SeoProps) {
  const location = useLocation()
  
  useEffect(() => {
    // Basic title override
    if (title) {
      document.title = title
    }

    // Meta tags injection logic
    const setMetaTag = (name: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`
      let meta = document.querySelector(selector)
      if (!meta) {
        meta = document.createElement('meta')
        if (isProperty) {
          meta.setAttribute('property', name)
        } else {
          meta.setAttribute('name', name)
        }
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', content)
    }

    if (description) {
      setMetaTag('description', description)
      setMetaTag('og:description', description, true)
      setMetaTag('twitter:description', description)
    }

    if (title) {
      setMetaTag('og:title', title, true)
      setMetaTag('twitter:title', title)
    }

    if (image) {
      setMetaTag('og:image', image, true)
      setMetaTag('twitter:image', image)
    }

    if (noIndex) {
      setMetaTag('robots', 'noindex, nofollow')
    } else {
      setMetaTag('robots', 'index, follow')
    }

    if (canonicalUrl) {
      let link = document.querySelector('link[rel="canonical"]')
      if (!link) {
        link = document.createElement('link')
        link.setAttribute('rel', 'canonical')
        document.head.appendChild(link)
      }
      link.setAttribute('href', canonicalUrl)
    }

    // Structured data injection
    if (structuredData) {
      let script = document.querySelector('#seo-structured-data')
      if (!script) {
        script = document.createElement('script')
        script.id = 'seo-structured-data'
        script.setAttribute('type', 'application/ld+json')
        document.head.appendChild(script)
      }
      script.textContent = JSON.stringify(structuredData)
    }

    // Cleanup logic might be needed on unmount depending on app structure
  }, [title, description, image, noIndex, canonicalUrl, structuredData, location.pathname])

  return null
}
