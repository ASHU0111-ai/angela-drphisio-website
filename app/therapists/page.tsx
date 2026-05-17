'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function TherapistsPage() {
  const [therapists, setTherapists] = useState<any[]>([])

  useEffect(() => {
    async function loadTherapists() {
      const supabase = createClient()
      const { data } = await supabase.from('therapists').select('*')
      if (data) setTherapists(data)
    }
    loadTherapists()
  }, [])

  return (
    <main>
      <Navigation />
      
      <section className="py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              Meet Our Therapists
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our experienced team of professionals
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {therapists.length > 0 ? (
              therapists.map((therapist, index) => (
                <motion.div
                  key={therapist.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="text-6xl mb-4 text-center">👨‍⚕️</div>
                      <h3 className="text-xl font-bold text-foreground mb-2">{therapist.name}</h3>
                      <p className="text-sm font-semibold text-primary mb-3">{therapist.specialization}</p>
                      <p className="text-muted-foreground text-sm">{therapist.bio}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <p className="col-span-full text-center text-muted-foreground">Therapists coming soon</p>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
