import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Helmet } from "react-helmet-async"
import { getResume } from "../data/resume"
import { getProfile } from "../data/profile"
import { getExperience } from "../data/experience"
import type { Resume } from "../types/resume"
import type { Profile } from "../types/profile"
import type { Experience } from "../types/experience"
import { fadeInUp, staggerContainer } from "../design-system/motion"
import { Button } from "../components/ui/button"
import { Download, ExternalLink, Printer } from "lucide-react"

export default function ResumePage() {
  const [resume, setResume] = useState<Resume | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [experience, setExperience] = useState<Experience[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    Promise.all([getResume(), getProfile(), getExperience()]).then(([r, p, e]) => {
      setResume(r)
      setProfile(p)
      setExperience(e)
      setIsLoading(false)
    })
  }, [])

  if (isLoading || !resume || !profile) {
    return (
      <div className="container py-24 min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <>
      <Helmet>
        <title>Resume | Portfolio OS</title>
      </Helmet>
      
      <div className="pt-24 pb-32 print:pt-0 print:pb-0">
        
        {/* Actions - Hidden on print */}
        <div className="container max-w-4xl mb-12 print:hidden">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 rounded-2xl bg-primary/5 border border-primary/10"
          >
            <div>
              <h2 className="text-xl font-display font-semibold mb-1">Professional Resume</h2>
              <p className="text-muted-foreground text-sm">Last updated: {new Date(resume.updatedAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button onClick={handlePrint} variant="outline" className="shrink-0">
                <Printer className="w-4 h-4 mr-2" /> Print
              </Button>
              <Button asChild className="shrink-0">
                <a href={resume.fileUrl} download>
                  <Download className="w-4 h-4 mr-2" /> Download PDF
                </a>
              </Button>
              <Button asChild variant="secondary" className="shrink-0">
                <a href={resume.fileUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" /> View PDF
                </a>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Web Resume Content - Acts as a preview/HTML version */}
        <div className="container max-w-4xl print:max-w-none print:px-0">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="bg-background sm:bg-surface sm:border sm:border-border/50 sm:rounded-2xl sm:p-12 print:bg-white print:border-none print:text-black print:p-0"
          >
            {/* Header */}
            <header className="mb-12 border-b border-border/50 pb-8 print:border-black/20">
              <h1 className="text-4xl sm:text-5xl font-display font-bold mb-4 print:text-black">
                {profile.name}
              </h1>
              <p className="text-xl text-primary font-medium mb-6 print:text-black/80">
                {profile.headline}
              </p>
              
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-muted-foreground font-mono text-sm print:text-black/60">
                <span>{profile.email}</span>
                {profile.location && <span>{profile.location}</span>}
                {profile.socialLinks.map(social => (
                  <a key={social.platform} href={social.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors print:text-black/60">
                    {social.platform}
                  </a>
                ))}
              </div>
            </header>

            {/* Summary */}
            <section className="mb-12">
              <h2 className="text-xl font-mono uppercase tracking-wider mb-6 text-muted-foreground print:text-black/50">Summary</h2>
              <p className="text-lg leading-relaxed print:text-black">
                {profile.bio}
              </p>
            </section>

            {/* Experience */}
            <section className="mb-12">
              <h2 className="text-xl font-mono uppercase tracking-wider mb-6 text-muted-foreground print:text-black/50">Experience</h2>
              <div className="space-y-8">
                {experience.map(exp => (
                  <div key={exp.id}>
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
                      <h3 className="text-2xl font-display font-bold print:text-black">{exp.role}</h3>
                      <span className="text-primary font-mono text-sm print:text-black/70">
                        {new Date(exp.startDate).getFullYear()} &mdash; {exp.current ? "Present" : exp.endDate ? new Date(exp.endDate).getFullYear() : ""}
                      </span>
                    </div>
                    <p className="text-lg font-medium text-muted-foreground mb-4 print:text-black/80">{exp.company}{exp.location ? `, ${exp.location}` : ""}</p>
                    
                    <p className="text-foreground/80 print:text-black mb-4 leading-relaxed">{exp.summary}</p>
                    
                    {exp.responsibilities && exp.responsibilities.length > 0 && (
                      <ul className="list-disc list-outside ml-5 space-y-2 text-foreground/80 print:text-black">
                        {exp.responsibilities.map((resp, i) => (
                          <li key={i}>{resp}</li>
                        ))}
                      </ul>
                    )}
                    
                    {exp.contributions && exp.contributions.length > 0 && !exp.responsibilities && (
                       <ul className="list-disc list-outside ml-5 space-y-2 text-foreground/80 print:text-black">
                        {exp.contributions.map((cont, i) => (
                          <li key={i}>{cont}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>

          </motion.div>
        </div>
      </div>
    </>
  )
}
