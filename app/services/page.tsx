'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([])

  useEffect(() => {
    async function loadServices() {
      const supabase = createClient()
      const { data } = await supabase.from('services').select('*')
      if (data) setServices(data)
    }
    loadServices()
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
              Our Services
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive physical therapy solutions tailored to your needs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {services.length > 0 ? (
              services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle>{service.name}</CardTitle>
                      <CardDescription>${service.price}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{service.description}</p>
                      <p className="text-sm text-foreground mb-4">Duration: {service.duration_minutes} minutes</p>
                      <Link href="/booking">
                        <Button className="w-full">Book Service</Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <p className="col-span-full text-center text-muted-foreground">Services coming soon</p>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
