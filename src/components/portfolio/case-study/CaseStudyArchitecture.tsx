import { motion } from "framer-motion"
import { fadeInUp } from "../../../design-system/motion"

export function CaseStudyArchitecture({ architecture, architectureDiagram }: { architecture: string; architectureDiagram?: string }) {
  return (
    <section id="architecture" className="py-24 bg-surface/30">
      <div className="container mx-auto px-6 lg:px-8 max-w-screen-xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInUp}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-8">Architecture & System Design</h2>
          
          {architectureDiagram && (
            <div className="mb-12 aspect-video bg-muted rounded-2xl overflow-hidden border border-border/50 p-4">
              {/* If it's an SVG or image URL, render it. Later we can add interactive DOM elements here. */}
              <img src={architectureDiagram} alt="Architecture diagram" className="w-full h-full object-contain" />
            </div>
          )}
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-foreground/90 leading-relaxed font-sans">{architecture}</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
