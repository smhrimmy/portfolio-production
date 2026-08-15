import { useRef } from "react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { prefersReducedMotion } from "../../three/core/DeviceCapability"

export function SystemStorySection() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Track scroll within this specific container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  // Smooth out the scroll value so animations don't stutter
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  const isReducedMotion = prefersReducedMotion()

  // --- Story States ---
  // 0.0 - 0.25: Idea
  // 0.25 - 0.50: Architecture
  // 0.50 - 0.75: Implementation
  // 0.75 - 1.0: Experience

  // Opacity maps for each text block
  const op1 = useTransform(smoothProgress, [0, 0.15, 0.25], [1, 1, 0])
  const op2 = useTransform(smoothProgress, [0.2, 0.35, 0.45, 0.55], [0, 1, 1, 0])
  const op3 = useTransform(smoothProgress, [0.45, 0.6, 0.7, 0.8], [0, 1, 1, 0])
  const op4 = useTransform(smoothProgress, [0.75, 0.85, 1], [0, 1, 1])

  // Simple translations for a subtle cinematic effect
  const y1 = useTransform(smoothProgress, [0, 0.25], [0, -20])
  const y2 = useTransform(smoothProgress, [0.2, 0.35], [20, 0])
  const y3 = useTransform(smoothProgress, [0.45, 0.6], [20, 0])
  const y4 = useTransform(smoothProgress, [0.75, 0.85], [20, 0])

  // Fallback for reduced motion: just stack the text normally
  if (isReducedMotion) {
    return (
      <section className="py-24 border-y border-border/30 bg-surface/20">
        <div className="container max-w-screen-md mx-auto space-y-16">
          <div>
            <h3 className="text-primary font-mono text-sm mb-2 tracking-widest">01 — IDEA</h3>
            <p className="text-3xl font-display">Every product starts with a problem.</p>
          </div>
          <div>
            <h3 className="text-primary font-mono text-sm mb-2 tracking-widest">02 — SYSTEM</h3>
            <p className="text-3xl font-display">Architecture turns the problem into a system.</p>
          </div>
          <div>
            <h3 className="text-primary font-mono text-sm mb-2 tracking-widest">03 — IMPLEMENTATION</h3>
            <p className="text-3xl font-display">Code turns the system into something usable.</p>
          </div>
          <div>
            <h3 className="text-primary font-mono text-sm mb-2 tracking-widest">04 — EXPERIENCE</h3>
            <p className="text-3xl font-display">The final product is what the user actually experiences.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section 
      ref={containerRef} 
      className="h-[400vh] relative" // 4 screen heights to allow scrolling
      id="system-story"
    >
      <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden">
        <div className="container max-w-screen-xl mx-auto px-4 md:px-8 relative z-10 w-full">
          
          <div className="max-w-xl pointer-events-none">
            {/* STATE 1 */}
            <motion.div style={{ opacity: op1, y: y1 }} className="absolute top-1/2 -translate-y-1/2">
              <h3 className="text-primary font-mono text-sm mb-4 tracking-widest">01 — IDEA</h3>
              <p className="text-4xl md:text-5xl font-display font-medium leading-tight text-foreground">
                Every product starts with a problem.
              </p>
            </motion.div>

            {/* STATE 2 */}
            <motion.div style={{ opacity: op2, y: y2 }} className="absolute top-1/2 -translate-y-1/2">
              <h3 className="text-primary font-mono text-sm mb-4 tracking-widest">02 — SYSTEM</h3>
              <p className="text-4xl md:text-5xl font-display font-medium leading-tight text-foreground">
                Architecture turns the problem into a scalable system.
              </p>
            </motion.div>

            {/* STATE 3 */}
            <motion.div style={{ opacity: op3, y: y3 }} className="absolute top-1/2 -translate-y-1/2">
              <h3 className="text-primary font-mono text-sm mb-4 tracking-widest">03 — IMPLEMENTATION</h3>
              <p className="text-4xl md:text-5xl font-display font-medium leading-tight text-foreground">
                Code turns the system into something real and usable.
              </p>
            </motion.div>

            {/* STATE 4 */}
            <motion.div style={{ opacity: op4, y: y4 }} className="absolute top-1/2 -translate-y-1/2">
              <h3 className="text-primary font-mono text-sm mb-4 tracking-widest">04 — EXPERIENCE</h3>
              <p className="text-4xl md:text-5xl font-display font-medium leading-tight text-foreground">
                The final product is what the user actually experiences.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
