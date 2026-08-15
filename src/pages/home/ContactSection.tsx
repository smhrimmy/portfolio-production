import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { fadeInUp, staggerContainer } from "../../design-system/motion"

export function ContactSection() {
  return (
    <section id="contact" className="py-40 text-center border-t border-border/50 bg-background relative overflow-hidden">
      {/* Subtle abstract background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
        <div className="w-[800px] h-[800px] border-[1px] border-primary rounded-full animate-[spin_120s_linear_infinite]" />
      </div>

      <div className="container max-w-screen-md mx-auto px-4 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.h2 
            variants={fadeInUp}
            className="text-5xl md:text-7xl font-display font-bold mb-6"
          >
            Ready to collaborate?
          </motion.h2>
          
          <motion.p 
            variants={fadeInUp}
            className="text-xl md:text-2xl text-muted-foreground mb-12 font-sans"
          >
            Let's discuss how my experience and technical foundation can bring value to your next project.
          </motion.p>
          
          <motion.div 
            variants={fadeInUp}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Button asChild size="lg" className="h-14 px-10 text-lg">
              <Link to="/contact">Get in Touch</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-14 px-10 text-lg">
              <Link to="/resume">View Resume</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
