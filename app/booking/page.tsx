'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle2, ChevronRight } from 'lucide-react'

type BookingStep = 'service' | 'therapist' | 'date' | 'details' | 'confirmation'

interface BookingFormData {
  serviceId: string
  therapistId: string
  preferredDate: string
  preferredTime: string
  firstName: string
  lastName: string
  email: string
  phone: string
  message: string
}

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState<BookingStep>('service')
  const [services, setServices] = useState<any[]>([])
  const [therapists, setTherapists] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState<BookingFormData>({
    serviceId: '',
    therapistId: '',
    preferredDate: '',
    preferredTime: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingId, setBookingId] = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        const supabase = createClient()
        
        const [servicesResult, therapistsResult] = await Promise.all([
          supabase.from('services').select('*'),
          supabase.from('therapists').select('*'),
        ])

        if (servicesResult.data) setServices(servicesResult.data)
        if (therapistsResult.data) setTherapists(therapistsResult.data)
      } catch (error) {
        console.error('Error loading booking data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const handleServiceSelect = (serviceId: string) => {
    setFormData({ ...formData, serviceId })
    setCurrentStep('therapist')
  }

  const handleTherapistSelect = (therapistId: string) => {
    setFormData({ ...formData, therapistId })
    setCurrentStep('date')
  }

  const handleDateTimeSubmit = () => {
    if (formData.preferredDate && formData.preferredTime) {
      setCurrentStep('details')
    }
  }

  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmitBooking = async () => {
    setIsSubmitting(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('appointments')
        .insert([
          {
            service_id: formData.serviceId,
            therapist_id: formData.therapistId,
            preferred_date: formData.preferredDate,
            preferred_time: formData.preferredTime,
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            message: formData.message,
            status: 'pending',
          },
        ])
        .select()

      if (error) throw error
      
      if (data && data[0]) {
        setBookingId(data[0].id)
        setCurrentStep('confirmation')
      }
    } catch (error) {
      console.error('Error submitting booking:', error)
      alert('Failed to submit booking. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const steps = [
    { id: 'service', label: 'Select Service', number: 1 },
    { id: 'therapist', label: 'Choose Therapist', number: 2 },
    { id: 'date', label: 'Pick Date & Time', number: 3 },
    { id: 'details', label: 'Your Details', number: 4 },
    { id: 'confirmation', label: 'Confirmed', number: 5 },
  ] as const

  if (isLoading) {
    return (
      <main>
        <Navigation />
        <div className="container mx-auto px-4 py-20">
          <p>Loading...</p>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main>
      <Navigation />
      
      <section className="min-h-screen py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">
              Book Your Appointment
            </h1>
            <p className="text-lg text-muted-foreground">
              Schedule your therapy session in just a few steps.
            </p>
          </motion.div>

          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex justify-between mb-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <motion.div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                      currentStep === step.id
                        ? 'bg-primary text-primary-foreground'
                        : steps.findIndex(s => s.id === currentStep) > index
                        ? 'bg-primary/30 text-primary'
                        : 'bg-border text-muted-foreground'
                    }`}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                  >
                    {step.number}
                  </motion.div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-1 w-8 mx-2 transition-all ${
                        steps.findIndex(s => s.id === currentStep) > index
                          ? 'bg-primary'
                          : 'bg-border'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Service Selection */}
          {currentStep === 'service' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Select a Service</CardTitle>
                  <CardDescription>
                    Choose the therapy service you need
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => handleServiceSelect(service.id)}
                      className="w-full p-4 border-2 border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-left group"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-foreground group-hover:text-primary">
                            {service.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            ${service.price} • {service.duration_minutes} min
                          </p>
                        </div>
                        <ChevronRight className="text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Therapist Selection */}
          {currentStep === 'therapist' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Choose Your Therapist</CardTitle>
                  <CardDescription>
                    Select a therapist from our team
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {therapists.map((therapist) => (
                    <button
                      key={therapist.id}
                      onClick={() => handleTherapistSelect(therapist.id)}
                      className="w-full p-4 border-2 border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-left group"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-foreground group-hover:text-primary">
                            {therapist.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {therapist.specialization}
                          </p>
                        </div>
                        <ChevronRight className="text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>
              <Button
                variant="ghost"
                onClick={() => setCurrentStep('service')}
                className="mt-4"
              >
                &larr; Back
              </Button>
            </motion.div>
          )}

          {/* Date & Time Selection */}
          {currentStep === 'date' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Select Date & Time</CardTitle>
                  <CardDescription>
                    Choose your preferred appointment time
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Preferred Date
                    </label>
                    <Input
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Preferred Time
                    </label>
                    <select
                      value={formData.preferredTime}
                      onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-md"
                    >
                      <option value="">Select a time</option>
                      <option value="09:00">9:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="14:00">2:00 PM</option>
                      <option value="15:00">3:00 PM</option>
                      <option value="16:00">4:00 PM</option>
                    </select>
                  </div>
                  <Button onClick={handleDateTimeSubmit} className="w-full">
                    Continue
                  </Button>
                </CardContent>
              </Card>
              <Button
                variant="ghost"
                onClick={() => setCurrentStep('therapist')}
                className="mt-4"
              >
                &larr; Back
              </Button>
            </motion.div>
          )}

          {/* Details Collection */}
          {currentStep === 'details' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Your Information</CardTitle>
                  <CardDescription>
                    Please provide your contact details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      placeholder="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleDetailsChange}
                    />
                    <Input
                      placeholder="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleDetailsChange}
                    />
                  </div>
                  <Input
                    placeholder="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleDetailsChange}
                  />
                  <Input
                    placeholder="Phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleDetailsChange}
                  />
                  <textarea
                    placeholder="Additional Message (optional)"
                    name="message"
                    value={formData.message}
                    onChange={handleDetailsChange}
                    className="w-full px-3 py-2 border border-border rounded-md min-h-24"
                  />
                  <Button
                    onClick={handleSubmitBooking}
                    disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.phone || isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? 'Submitting...' : 'Confirm Booking'}
                  </Button>
                </CardContent>
              </Card>
              <Button
                variant="ghost"
                onClick={() => setCurrentStep('date')}
                className="mt-4"
              >
                &larr; Back
              </Button>
            </motion.div>
          )}

          {/* Confirmation */}
          {currentStep === 'confirmation' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="border-primary">
                <CardContent className="pt-12 pb-12 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="mb-6 flex justify-center"
                  >
                    <CheckCircle2 className="w-16 h-16 text-primary" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-foreground mb-2">
                    Booking Confirmed!
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Your appointment has been successfully booked. A confirmation email has been sent to your email address.
                  </p>
                  <p className="text-sm text-muted-foreground mb-8">
                    Booking ID: {bookingId}
                  </p>
                  <Link href="/">
                    <Button>Back to Home</Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
