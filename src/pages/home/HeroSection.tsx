import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { profileData } from "../../data/profile"
import { fadeInUp, staggerContainer } from "../../design-system/motion"

const systemMeta = [
  { label: "SYSTEM", value: "ONLINE" },
  { label: "WORK", value: "03" },
  { label: "LATEST", value: "2026" },
  { label: "STATUS", value: "AVAILABLE" },
]

export function HeroSection() {
  return (
    <div className="container py-8 md:py-12 max-w-screen-2xl min-h-[88vh] lg:min-h-[90vh] flex items-center relative">
      <div className="grid w-full lg:grid-cols-[minmax(0,45%)_minmax(0,55%)] gap-8 lg:gap-4 items-center">
        <motion.section
          className="py-16 lg:py-24 relative z-10 max-w-xl lg:max-w-none"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={fadeInUp}
            className="mb-5 flex flex-wrap gap-x-4 gap-y-2 font-mono text-[10px] md:text-xs uppercase tracking-widest text-foreground-secondary"
          >
            {systemMeta.map((item) => (
              <span key={item.label} className="flex items-center gap-1.5">
                <span className="text-brand-cyan/80">{item.label}</span>
                <span className="text-foreground-secondary/50">/</span>
                <span className="text-foreground/80">{item.value}</span>
              </span>
            ))}
          </motion.div>

          <motion.div variants={fadeInUp} className="mb-5">
            <span className="text-xs font-mono font-medium tracking-widest text-brand-cyan uppercase border border-brand-cyan/25 bg-brand-cyan/5 px-3 py-1.5 rounded-full">
              {profileData.roles.join(" • ")}
            </span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight mb-4 leading-[1.05]"
          >
            <span className="text-foreground">{profileData.name}.</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-xl md:text-2xl lg:text-3xl text-foreground font-display font-medium max-w-[28rem] mb-4 leading-tight"
          >
            {profileData.headline}
          </motion.p>

          <motion.p
            variants={fadeInUp}
            className="text-base md:text-lg text-foreground-secondary max-w-[32rem] mb-10 font-sans leading-relaxed"
          >
            {profileData.bio}
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-3 md:gap-4">
            <Button
              asChild
              size="lg"
              className="h-12 md:h-14 px-6 md:px-8 text-base shadow-glow-cyan hover:shadow-glow-cyan"
            >
              <a href="#work">Explore Work</a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 md:h-14 px-6 md:px-8 text-base border-border hover:border-brand-cyan/40 hover:text-brand-cyan"
            >
              <Link to="/resume">Resume</Link>
            </Button>
          </motion.div>
        </motion.section>

        {/* Reserve space for the fixed Neural Core on desktop */}
        <div className="hidden lg:block min-h-[420px]" aria-hidden="true" />
      </div>
    </div>
  )
}
