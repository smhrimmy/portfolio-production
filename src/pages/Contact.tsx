import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Helmet } from "react-helmet-async"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { getContactConfig } from "../data/contact"
import { contactFormSchema, type ContactConfig, type ContactFormValues } from "../types/contact"
import { fadeInUp, staggerContainer } from "../design-system/motion"
import { Button } from "../components/ui/button"

export default function Contact() {
  const [config, setConfig] = useState<ContactConfig | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema)
  })

  useEffect(() => {
    getContactConfig().then((c) => {
      setConfig(c)
      setIsLoading(false)
    })
  }, [])

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true)
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log("Form data:", data)
    setIsSubmitting(false)
    setIsSuccess(true)
  }

  if (isLoading || !config) {
    return (
      <div className="container py-24 min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Contact | Portfolio OS</title>
      </Helmet>
      
      <div className="pt-24 pb-32">
        <section className="container max-w-screen-md py-12 md:py-24">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <span className="text-sm font-mono font-medium tracking-wider text-primary uppercase">
                Contact
              </span>
            </motion.div>
            
            <motion.h1 
              variants={fadeInUp} 
              className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-8"
            >
              Let's build something.
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-muted-foreground mb-8 max-w-xl leading-relaxed"
            >
              I am currently open to new opportunities and technical collaborations. Whether you have a specific project or just want to say hi, my inbox is open.
            </motion.p>

            {config.availability && (
              <motion.div variants={fadeInUp} className="mb-12 inline-flex items-center px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-primary mr-3 animate-pulse" />
                {config.availability}
              </motion.div>
            )}

            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 rounded-2xl bg-primary/5 border border-primary/20 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-display font-bold mb-4">Message Transmitted</h3>
                <p className="text-muted-foreground mb-8">Thank you for reaching out. I'll get back to you shortly.</p>
                <Button variant="outline" onClick={() => setIsSuccess(false)}>Send Another Message</Button>
              </motion.div>
            ) : (
              <motion.form 
                variants={fadeInUp} 
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Name</label>
                    <input 
                      id="name"
                      {...register("name")}
                      className={`w-full px-4 py-3 rounded-lg bg-surface border ${errors.name ? 'border-destructive focus:ring-destructive/20' : 'border-border focus:ring-primary/20'} focus:outline-none focus:ring-2 transition-shadow`}
                    />
                    {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <input 
                      id="email"
                      type="email"
                      {...register("email")}
                      className={`w-full px-4 py-3 rounded-lg bg-surface border ${errors.email ? 'border-destructive focus:ring-destructive/20' : 'border-border focus:ring-primary/20'} focus:outline-none focus:ring-2 transition-shadow`}
                    />
                    {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                  <input 
                    id="subject"
                    {...register("subject")}
                    className={`w-full px-4 py-3 rounded-lg bg-surface border ${errors.subject ? 'border-destructive focus:ring-destructive/20' : 'border-border focus:ring-primary/20'} focus:outline-none focus:ring-2 transition-shadow`}
                  />
                  {errors.subject && <p className="text-sm text-destructive mt-1">{errors.subject.message}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">Message</label>
                  <textarea 
                    id="message"
                    rows={6}
                    {...register("message")}
                    className={`w-full px-4 py-3 rounded-lg bg-surface border ${errors.message ? 'border-destructive focus:ring-destructive/20' : 'border-border focus:ring-primary/20'} focus:outline-none focus:ring-2 transition-shadow resize-y`}
                  />
                  {errors.message && <p className="text-sm text-destructive mt-1">{errors.message.message}</p>}
                </div>

                <Button type="submit" size="lg" className="w-full sm:w-auto h-14 px-10 text-lg" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </motion.form>
            )}

            <motion.div variants={fadeInUp} className="mt-24 pt-12 border-t border-border">
              <h3 className="text-xl font-display font-semibold mb-6">Direct Contact</h3>
              <div className="flex flex-col sm:flex-row gap-8">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  <a href={`mailto:${config.email}`} className="text-lg font-medium hover:text-primary transition-colors">
                    {config.email}
                  </a>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Social</p>
                  <div className="flex gap-4">
                    {config.socialLinks.map(social => (
                      <a key={social.platform} href={social.url} target="_blank" rel="noopener noreferrer" className="text-lg font-medium hover:text-primary transition-colors">
                        {social.platform}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>
      </div>
    </>
  )
}
