'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { Activity, Zap, Heart, Shield } from 'lucide-react'

const iconMap: Record<string, React.ReactNode> = {
  'physical-therapy': <Activity className="w-8 h-8" />,
  'sports-injury': <Zap className="w-8 h-8" />,
  'rehabilitation': <Heart className="w-8 h-8" />,
  'wellness': <Shield className="w-8 h-8" />,
}

const defaultServices = [
  {
    id: '1',
    name: 'Physical Therapy',
    description: 'Comprehensive rehabilitation for injuries and chronic pain management.',
    price: 150,
    duration_minutes: 60,
  },
  {
    id: '2',
    name: 'Sports Injury Recovery',
    description: 'Specialized treatment for athletic injuries and performance enhancement.',
    price: 180,
    duration_minutes: 60,
  },
  {
    id: '3',
    name: 'Post-Surgical Rehabilitation',
    description: 'Guided recovery programs following surgical procedures.',
    price: 160,
    duration_minutes: 60,
  },
  {
    id: '4',
    name: 'Wellness & Prevention',
    description: 'Preventative care to maintain mobility and reduce future injuries.',
    price: 120,
    duration_minutes: 45,
  },
]

export function ServicesSection() {
  const [services, setServices] = useState(defaultServices)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadServices() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .limit(4)

        if (error) throw error
        if (data && data.length > 0) {
          setServices(data)
        }
      } catch (error) {
        console.error(
          'Error loading services:',
          error instanceof Error ? error.message : JSON.stringify(error),
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadServices()
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Our Services
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive physical therapy solutions designed for your recovery and wellness goals.
          </p>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {services.map((service, index) => (
            <motion.div key={service.id} variants={itemVariants}>
              <Card className="h-full hover:shadow-lg transition-shadow border-primary/20 hover:border-primary/50">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                    {iconMap['physical-therapy']}
                  </div>
                  <CardTitle className="text-foreground">{service.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground mb-4">
                    {service.description}
                  </CardDescription>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-primary">
                      ${service.price}
                    </span>
                    <span className="text-muted-foreground">
                      {service.duration_minutes} min
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
