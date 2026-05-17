'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trash2, CheckCircle, Clock } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface Appointment {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  preferred_date: string
  preferred_time: string
  status: string
  created_at: string
}

export function AppointmentsTab() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadAppointments()
  }, [])

  async function loadAppointments() {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('preferred_date', { ascending: false })

      if (error) throw error
      setAppointments(data || [])
    } catch (error) {
      console.error(
        'Error loading appointments:',
        error instanceof Error ? error.message : JSON.stringify(error),
      )
    } finally {
      setIsLoading(false)
    }
  }

  async function updateStatus(id: string, status: string) {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id)

      if (error) throw error
      await loadAppointments()
    } catch (error) {
      console.error('Error updating appointment:', error)
    }
  }

  async function deleteAppointment(id: string) {
    if (confirm('Are you sure?')) {
      try {
        const supabase = createClient()
        const { error } = await supabase
          .from('appointments')
          .delete()
          .eq('id', id)

        if (error) throw error
        await loadAppointments()
      } catch (error) {
        console.error('Error deleting appointment:', error)
      }
    }
  }

  if (isLoading) {
    return <div>Loading appointments...</div>
  }

  return (
    <Card>
      <CardContent className="pt-6">
        {appointments.length === 0 ? (
          <p className="text-muted-foreground">No appointments yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((apt) => (
                  <TableRow key={apt.id}>
                    <TableCell className="font-medium">
                      {apt.first_name} {apt.last_name}
                    </TableCell>
                    <TableCell className="text-sm">{apt.email}</TableCell>
                    <TableCell className="text-sm">{apt.phone}</TableCell>
                    <TableCell className="text-sm">{apt.preferred_date}</TableCell>
                    <TableCell className="text-sm">{apt.preferred_time}</TableCell>
                    <TableCell>
                      <Badge
                        variant={apt.status === 'confirmed' ? 'default' : 'secondary'}
                      >
                        {apt.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {apt.status !== 'confirmed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStatus(apt.id, 'confirmed')}
                          >
                            <CheckCircle size={16} />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteAppointment(apt.id)}
                        >
                          <Trash2 size={16} className="text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
