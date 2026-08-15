import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

export function MediaLightbox({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  const [isOpen, setIsOpen] = useState(false)

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  // Prevent scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => { document.body.style.overflow = "unset" }
  }, [isOpen])

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="block w-full cursor-zoom-in rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label={`Enlarge image: ${alt}`}
      >
        <img src={src} alt={alt} className="w-full h-auto object-contain hover:scale-[1.02] transition-transform duration-500" />
        {caption && (
          <span className="block mt-2 text-sm text-muted-foreground text-center">{caption}</span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm p-4 md:p-12 cursor-zoom-out"
            onClick={() => setIsOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Image lightbox"
          >
            <button 
              className="absolute top-4 right-4 p-2 rounded-full bg-surface text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
              onClick={(e) => { e.stopPropagation(); setIsOpen(false) }}
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.img
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              src={src}
              alt={alt}
              className="max-w-full max-h-[90vh] object-contain rounded-md shadow-2xl"
              onClick={(e) => e.stopPropagation()} 
            />
            {caption && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-surface/80 backdrop-blur-md rounded-lg text-sm text-foreground text-center max-w-2xl"
              >
                {caption}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
