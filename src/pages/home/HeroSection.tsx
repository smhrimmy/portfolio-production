import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { profileData } from "../../data/profile"
import { fadeInUp, staggerContainer } from "../../design-system/motion"

export function HeroSection() {
  return (
    <div className="container py-12 max-w-screen-2xl min-h-[90vh] flex items-center relative">
      <motion.section 
        className="py-24 max-w-3xl relative z-10"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={fadeInUp} className="mb-6">
          <span className="text-sm font-mono font-medium tracking-wider text-primary uppercase bg-primary/10 px-3 py-1.5 rounded-full">
            {profileData.roles.join(" • ")}
          </span>
        </motion.div>
        
        <motion.h1 
          variants={fadeInUp} 
          className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight mb-6 leading-[1.05]"
        >
          {profileData.name}.
        </motion.h1>
        
        <motion.p 
          variants={fadeInUp}
          className="text-2xl md:text-3xl text-foreground/90 font-display font-medium max-w-[600px] mb-6 leading-tight"
        >
          {profileData.headline}
        </motion.p>
        
        <motion.p 
          variants={fadeInUp}
          className="text-lg md:text-xl text-muted-foreground max-w-[500px] mb-12 font-sans leading-relaxed"
        >
          {profileData.bio}
        </motion.p>
        
        <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-4">
          <Button asChild size="lg" className="h-14 px-8 text-base">
            <a href="#work">View Work</a>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-14 px-8 text-base">
            <Link to="/about">About Me</Link>
          </Button>
        </motion.div>
      </motion.section>
    </div>
  )
}
