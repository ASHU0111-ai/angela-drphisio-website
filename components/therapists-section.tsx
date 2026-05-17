'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const defaultTherapists = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialization: 'Sports Injury Specialist',
    bio: 'Expert in athletic rehabilitation with 10+ years of experience.',
    image_url: '👨‍⚕️',
  },
  {
    id: '2',
    name: 'Michael Chen',
    specialization: 'Post-Surgical Recovery',
    bio: 'Specializes in rehabilitation following surgical procedures.',
    image_url: '👩‍⚕️',
  },
  {
    id: '3',
    name: 'Emma Williams',
    specialization: 'Chronic Pain Management',
    bio: 'Dedicated to helping patients manage and overcome chronic pain.',
    image_url: '👨‍⚕️',
  },
  {
    id: '4',
    name: 'James Rodriguez',
    specialization: 'Wellness & Prevention',
    bio: 'Focused on preventative care and maintaining optimal mobility.',
    image_url: '👩‍⚕️',
  },
]

export function TherapistsSection() {
  const [therapists, setTherapists] = useState(defaultTherapists)
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', slidesToScroll: 1 })
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(true)

  useEffect(() => {
    async function loadTherapists() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('therapists')
          .select('*')
          .limit(4)

        if (error) throw error
        if (data && data.length > 0) {
          setTherapists(data)
        }
      } catch (error) {
        console.error(
          'Error loading therapists:',
          error instanceof Error ? error.message : JSON.stringify(error),
        )
      }
    }

    loadTherapists()
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    const onSelect = () => {
      setCanScrollPrev(emblaApi.canScrollPrev())
      setCanScrollNext(emblaApi.canScrollNext())
    }

    emblaApi.on('select', onSelect)
    onSelect()
  }, [emblaApi])

  const scrollPrev = () => emblaApi?.scrollPrev()
  const scrollNext = () => emblaApi?.scrollNext()

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Meet Our Therapists
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experienced professionals dedicated to your recovery and wellness journey.
          </p>
        </motion.div>

        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {therapists.map((therapist) => (
                <div key={therapist.id} className="flex-none w-full md:w-1/2 lg:w-1/3">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow border-primary/20">
                      <CardContent className="p-0">
                        <div className="bg-gradient-to-br from-primary/20 to-secondary/20 h-64 flex items-center justify-center text-6xl">
                          {therapist.image_url || '👨‍⚕️'}
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-foreground mb-2">
                            {therapist.name}
                          </h3>
                          <p className="text-sm font-semibold text-primary mb-3">
                            {therapist.specialization}
                          </p>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {therapist.bio}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Controls */}
          <div className="flex justify-center gap-4 mt-8">
            <Button
              size="icon"
              variant="outline"
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              className="rounded-full"
            >
              <ChevronLeft size={20} />
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={scrollNext}
              disabled={!canScrollNext}
              className="rounded-full"
            >
              <ChevronRight size={20} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
