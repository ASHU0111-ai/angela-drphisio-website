'use client'

import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar, Users, MessageSquare, Settings, LogOut, Menu, X } from 'lucide-react'
import { AppointmentsTab } from '@/components/admin/appointments-tab'
import { TestimonialsTab } from '@/components/admin/testimonials-tab'
import { ServicesTab } from '@/components/admin/services-tab'
import { TherapistsTab } from '@/components/admin/therapists-tab'
import { useState as useStateHook } from 'react'

export default function AdminDashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p>Loading...</p>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/admin/login' })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-40">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-card border border-border"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${
          sidebarOpen ? 'block' : 'hidden md:block'
        } w-full md:w-64 bg-card border-r border-border min-h-screen p-6 fixed md:relative z-30`}>
          <div className="mb-8 pt-12 md:pt-0">
            <div className="flex items-center gap-2 font-bold text-xl text-primary mb-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                DP
              </div>
              Dr. Physio
            </div>
            <p className="text-sm text-muted-foreground">Admin Dashboard</p>
          </div>

          <nav className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Management
            </p>
            <Link href="#appointments" onClick={() => setSidebarOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Appointments
              </Button>
            </Link>
            <Link href="#testimonials" onClick={() => setSidebarOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                <MessageSquare className="mr-2 h-4 w-4" />
                Testimonials
              </Button>
            </Link>
            <Link href="#services" onClick={() => setSidebarOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Services
              </Button>
            </Link>
            <Link href="#therapists" onClick={() => setSidebarOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Therapists
              </Button>
            </Link>
          </nav>

          <div className="mt-8 pt-8 border-t border-border">
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 pt-20 md:pt-0">
          <div className="p-6 md:p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Welcome back, Admin
              </h1>
              <p className="text-muted-foreground">
                Manage your clinic&apos;s operations and content
              </p>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="appointments" className="w-full">
              <TabsList className="grid w-full md:w-auto md:grid-cols-4 mb-8">
                <TabsTrigger value="appointments">Appointments</TabsTrigger>
                <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="therapists">Therapists</TabsTrigger>
              </TabsList>

              <TabsContent value="appointments" className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-foreground">Appointments</h2>
                </div>
                <AppointmentsTab />
              </TabsContent>

              <TabsContent value="testimonials" className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-foreground">Testimonials</h2>
                </div>
                <TestimonialsTab />
              </TabsContent>

              <TabsContent value="services" className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-foreground">Services</h2>
                </div>
                <ServicesTab />
              </TabsContent>

              <TabsContent value="therapists" className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-foreground">Therapists</h2>
                </div>
                <TherapistsTab />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
