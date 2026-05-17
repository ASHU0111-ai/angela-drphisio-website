'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trash2, Plus } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface Service {
  id: string
  name: string
  description: string
  price: number
  duration_minutes: number
}

export function ServicesTab() {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration_minutes: '',
  })

  useEffect(() => {
    loadServices()
  }, [])

  async function loadServices() {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setServices(data || [])
    } catch (error) {
      console.error(
        'Error loading services:',
        error instanceof Error ? error.message : JSON.stringify(error),
      )
    } finally {
      setIsLoading(false)
    }
  }

  async function addService(e: React.FormEvent) {
    e.preventDefault()
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('services')
        .insert([
          {
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            duration_minutes: parseInt(formData.duration_minutes),
          },
        ])

      if (error) throw error
      setFormData({ name: '', description: '', price: '', duration_minutes: '' })
      setShowForm(false)
      await loadServices()
    } catch (error) {
      console.error(
        'Error adding service:',
        error instanceof Error ? error.message : JSON.stringify(error),
      )
    }
  }

  async function deleteService(id: string) {
    if (confirm('Are you sure?')) {
      try {
        const supabase = createClient()
        const { error } = await supabase
          .from('services')
          .delete()
          .eq('id', id)

        if (error) throw error
        await loadServices()
      } catch (error) {
        console.error('Error deleting service:', error)
      }
    }
  }

  if (isLoading) {
    return <div>Loading services...</div>
  }

  return (
    <div className="space-y-4">
      {showForm && (
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={addService} className="space-y-4">
              <Input
                placeholder="Service Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-border rounded-md min-h-20"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  placeholder="Price"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                />
                <Input
                  type="number"
                  placeholder="Duration (minutes)"
                  value={formData.duration_minutes}
                  onChange={(e) =>
                    setFormData({ ...formData, duration_minutes: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">Save Service</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Button onClick={() => setShowForm(!showForm)}>
        <Plus className="mr-2 h-4 w-4" />
        Add Service
      </Button>

      <Card>
        <CardContent className="pt-6">
          {services.length === 0 ? (
            <p className="text-muted-foreground">No services yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-medium">
                        {service.name}
                      </TableCell>
                      <TableCell className="text-sm max-w-xs truncate">
                        {service.description}
                      </TableCell>
                      <TableCell className="text-sm">
                        ${service.price}
                      </TableCell>
                      <TableCell className="text-sm">
                        {service.duration_minutes} min
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteService(service.id)}
                        >
                          <Trash2 size={16} className="text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
