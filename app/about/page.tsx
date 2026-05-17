'use client'

import { motion } from 'framer-motion'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AboutPage() {
  return (
    <main>
      <Navigation />
      
      <section className="py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
              About Dr. Physio
            </h1>
            
            <div className="prose prose-invert max-w-none space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Dr. Physio is a premier physical therapy and rehabilitation clinic dedicated to helping patients recover from injuries, manage chronic pain, and achieve optimal wellness. With over 15 years of combined experience, our team of expert therapists is committed to providing personalized care and evidence-based treatment.
              </p>

              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                To empower our patients to live healthier, more active lives by providing exceptional physical therapy services that combine cutting-edge techniques with compassionate care. We believe in treating the whole person, not just the injury.
              </p>

              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Our Values</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Patient-Centered Care</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Every treatment plan is tailored to the individual needs and goals of our patients.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Excellence</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">We strive for excellence in every aspect of our practice, from clinical expertise to customer service.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Integrity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">We operate with transparency and honesty in all our dealings with patients and colleagues.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Compassion</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">We genuinely care about our patients&apos; wellbeing and recovery journey.</p>
                  </CardContent>
                </Card>
              </div>

              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Why Choose Us?</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <span>Experienced therapists with specialized training in various rehabilitation techniques</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <span>Personalized treatment plans designed for your specific condition</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <span>State-of-the-art facilities and equipment</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <span>Convenient scheduling and responsive customer service</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <span>Proven track record of successful patient outcomes</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
