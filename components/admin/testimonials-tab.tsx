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

interface Testimonial {
  id: string
  client_name: string
  text: string
  rating: number
}

export function TestimonialsTab() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    client_name: '',
    text: '',
    rating: 5,
  })

  useEffect(() => {
    loadTestimonials()
  }, [])

  async function loadTestimonials() {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setTestimonials(data || [])
    } catch (error) {
      console.error(
        'Error loading testimonials:',
        error instanceof Error ? error.message : JSON.stringify(error),
      )
    } finally {
      setIsLoading(false)
    }
  }

  async function addTestimonial(e: React.FormEvent) {
    e.preventDefault()
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('testimonials')
        .insert([
          {
            client_name: formData.client_name,
            text: formData.text,
            rating: formData.rating,
          },
        ])

      if (error) throw error
      setFormData({ client_name: '', text: '', rating: 5 })
      setShowForm(false)
      await loadTestimonials()
    } catch (error) {
      console.error('Error adding testimonial:', error)
    }
  }

  async function deleteTestimonial(id: string) {
    if (confirm('Are you sure?')) {
      try {
        const supabase = createClient()
        const { error } = await supabase
          .from('testimonials')
          .delete()
          .eq('id', id)

        if (error) throw error
        await loadTestimonials()
      } catch (error) {
        console.error('Error deleting testimonial:', error)
      }
    }
  }

  if (isLoading) {
    return <div>Loading testimonials...</div>
  }

  return (
    <div className="space-y-4">
      {showForm && (
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={addTestimonial} className="space-y-4">
              <Input
                placeholder="Client Name"
                value={formData.client_name}
                onChange={(e) =>
                  setFormData({ ...formData, client_name: e.target.value })
                }
                required
              />
              <textarea
                placeholder="Testimonial Text"
                value={formData.text}
                onChange={(e) =>
                  setFormData({ ...formData, text: e.target.value })
                }
                className="w-full px-3 py-2 border border-border rounded-md min-h-24"
                required
              />
              <select
                value={formData.rating}
                onChange={(e) =>
                  setFormData({ ...formData, rating: parseInt(e.target.value) })
                }
                className="w-full px-3 py-2 border border-border rounded-md"
              >
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
              <div className="flex gap-2">
                <Button type="submit">Save Testimonial</Button>
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
        Add Testimonial
      </Button>

      <Card>
        <CardContent className="pt-6">
          {testimonials.length === 0 ? (
            <p className="text-muted-foreground">No testimonials yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client Name</TableHead>
                    <TableHead>Text</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testimonials.map((testimonial) => (
                    <TableRow key={testimonial.id}>
                      <TableCell className="font-medium">
                        {testimonial.client_name}
                      </TableCell>
                      <TableCell className="text-sm max-w-xs truncate">
                        {testimonial.text}
                      </TableCell>
                      <TableCell className="text-sm">
                        {'⭐'.repeat(testimonial.rating)}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteTestimonial(testimonial.id)}
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
