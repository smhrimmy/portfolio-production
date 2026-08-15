import { motion } from "framer-motion"
import { fadeInUp } from "../../design-system/motion"
import { profileData } from "../../data/profile"

export function IdentitySection() {
  return (
    <section id="identity" className="py-32 bg-surface/50 border-y border-border/30">
      <div className="container max-w-screen-xl mx-auto px-4 md:px-8">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="max-w-4xl"
        >
          <h2 className="text-3xl md:text-5xl font-display font-medium leading-[1.3] text-foreground/90 mb-12">
            "Building digital products where <span className="text-primary italic">engineering</span> meets <span className="text-primary italic">experience</span>."
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-lg text-muted-foreground font-sans">
            <div>
              <strong className="block text-foreground mb-2 font-display">Focus</strong>
              <p>Scalable web architecture, interactive 3D, and design systems.</p>
            </div>
            <div>
              <strong className="block text-foreground mb-2 font-display">Location</strong>
              <p>{profileData.location}</p>
            </div>
            <div>
              <strong className="block text-foreground mb-2 font-display">Status</strong>
              <p>Available for freelance and full-time opportunities.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
