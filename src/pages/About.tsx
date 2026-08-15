import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Helmet } from "react-helmet-async"
import { getProfile } from "../data/profile"
import type { Profile } from "../types/profile"
import { fadeInUp, staggerContainer } from "../design-system/motion"
import { Button } from "../components/ui/button"
import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"

export default function About() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getProfile().then((p) => {
      setProfile(p)
      setIsLoading(false)
    })
  }, [])

  if (isLoading) {
    return (
      <div className="container py-24 min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!profile) return null

  return (
    <>
      <Helmet>
        <title>About | Portfolio OS</title>
      </Helmet>
      
      <div className="pt-24 pb-32">
        {/* Hero Section */}
        <section className="container max-w-4xl py-12 md:py-24">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <span className="text-sm font-mono font-medium tracking-wider text-primary uppercase">
                About
              </span>
            </motion.div>
            
            <motion.h1 
              variants={fadeInUp} 
              className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-8 leading-[1.1]"
            >
              {profile.name}
            </motion.h1>
            
            <motion.h2 
              variants={fadeInUp}
              className="text-2xl md:text-3xl text-foreground font-display font-medium mb-8"
            >
              {profile.headline}
            </motion.h2>

            <motion.p 
              variants={fadeInUp}
              className="text-xl md:text-2xl text-muted-foreground mb-12 font-sans leading-relaxed"
            >
              {profile.subheadline}
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-4">
              <Button asChild size="lg" className="h-12 px-8 text-base">
                <Link to="/projects">Explore Projects</Link>
              </Button>
              {profile.resumeUrl && (
                <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base">
                  <Link to="/resume">View Resume</Link>
                </Button>
              )}
            </motion.div>
          </motion.div>
        </section>

        <div className="container max-w-4xl space-y-32">
          
          {/* Professional Story */}
          <section>
            <h3 className="text-3xl font-display font-bold mb-8">Who I Am</h3>
            <div className="prose prose-lg dark:prose-invert">
              <p className="text-xl text-foreground/80 leading-relaxed">
                {profile.bio}
              </p>
            </div>
          </section>

          {/* How I Work */}
          <section>
            <h3 className="text-3xl font-display font-bold mb-8">How I Work</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
              {[
                { title: "Discover", desc: "Understanding the actual user problem and business goals before writing a line of code." },
                { title: "Define", desc: "Establishing strict technical and design requirements that align with reality." },
                { title: "Design", desc: "Prototyping intuitive interfaces and scalable data models." },
                { title: "Build", desc: "Executing robust, accessible, and performant engineering solutions." },
                { title: "Test", desc: "Ensuring cross-browser compatibility, accessibility, and logic validity." },
                { title: "Ship", desc: "Deploying cleanly and iterating based on real-world feedback." },
              ].map((step, idx) => (
                <div key={idx} className="relative pl-8 border-l border-primary/20 hover:border-primary/60 transition-colors">
                  <div className="absolute top-0 left-0 w-2 h-2 -translate-x-[5px] rounded-full bg-primary" />
                  <h4 className="text-xl font-display font-semibold mb-2">{step.title}</h4>
                  <p className="text-muted-foreground">{step.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Design x Engineering */}
          <section>
            <h3 className="text-3xl font-display font-bold mb-8">Design <span className="text-primary font-serif italic">×</span> Engineering</h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              I operate at the intersection of rigorous engineering and compelling user experience. One cannot succeed without the other.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {profile.values.map(val => (
                <div key={val} className="p-6 rounded-2xl bg-surface border border-border/50 text-center flex items-center justify-center min-h-[120px]">
                  <span className="font-medium text-lg">{val}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Current Focus */}
          {profile.currentFocus.length > 0 && (
            <section>
              <h3 className="text-3xl font-display font-bold mb-8">Current Focus</h3>
              <div className="flex flex-wrap gap-4">
                {profile.currentFocus.map(focus => (
                  <span key={focus} className="px-6 py-3 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-mono tracking-wide">
                    {focus}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Footer CTA */}
          <section className="pt-12 border-t border-border">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-display font-bold mb-2">Ready to talk?</h3>
                <p className="text-muted-foreground">Let's discuss how we can work together.</p>
              </div>
              <Button asChild size="lg" className="h-14 px-8 text-lg w-full md:w-auto group">
                <Link to="/contact">
                  Contact Me
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </section>

        </div>
      </div>
    </>
  )
}
