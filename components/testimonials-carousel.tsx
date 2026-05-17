'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

const defaultTestimonials = [
  {
    id: '1',
    client_name: 'John Smith',
    text: 'Dr. Physio helped me recover from my knee injury faster than I expected. The therapists are professional and caring.',
    rating: 5,
    image_url: '👤',
  },
  {
    id: '2',
    client_name: 'Maria Garcia',
    text: 'After my surgery, I was worried about recovery. The team at Dr. Physio made the process smooth and painless.',
    rating: 5,
    image_url: '👤',
  },
  {
    id: '3',
    client_name: 'David Lee',
    text: 'Excellent service and results. I recommend Dr. Physio to all my friends and family.',
    rating: 5,
    image_url: '👤',
  },
  {
    id: '4',
    client_name: 'Sarah Williams',
    text: 'The therapists really understand your needs and create personalized treatment plans.',
    rating: 5,
    image_url: '👤',
  },
  {
    id: '5',
    client_name: 'Michael Brown',
    text: 'I&apos;ve been to many clinics, but Dr. Physio is by far the best. Highly recommended!',
    rating: 5,
    image_url: '👤',
  },
]

export function TestimonialsCarousel() {
  const [testimonials, setTestimonials] = useState(defaultTestimonials)
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', slidesToScroll: 1 })
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(true)

  useEffect(() => {
    async function loadTestimonials() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        if (data && data.length > 0) {
          setTestimonials(data)
        }
      } catch (error) {
        console.error(
          'Error loading testimonials:',
          error instanceof Error ? error.message : JSON.stringify(error),
        )
      }
    }

    loadTestimonials()
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
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="flex-none w-full md:w-1/2 lg:w-1/3">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="h-full border-primary/20 hover:border-primary/50 hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    {/* Rating */}
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className="fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>

                    {/* Testimonial Text */}
                    <p className="text-foreground mb-6 leading-relaxed">
                      "{testimonial.text}"
                    </p>

                    {/* Client Info */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-2xl">
                        {testimonial.image_url || '👤'}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          {testimonial.client_name}
                        </p>
                        <p className="text-xs text-muted-foreground">Patient</p>
                      </div>
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
  )
}
