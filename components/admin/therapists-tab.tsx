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

interface Therapist {
  id: string
  name: string
  specialization: string
  bio: string
}

export function TherapistsTab() {
  const [therapists, setTherapists] = useState<Therapist[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    bio: '',
  })

  useEffect(() => {
    loadTherapists()
  }, [])

  async function loadTherapists() {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('therapists')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setTherapists(data || [])
    } catch (error) {
      console.error('Error loading therapists:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function addTherapist(e: React.FormEvent) {
    e.preventDefault()
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('therapists')
        .insert([
          {
            name: formData.name,
            specialization: formData.specialization,
            bio: formData.bio,
          },
        ])

      if (error) throw error
      setFormData({ name: '', specialization: '', bio: '' })
      setShowForm(false)
      await loadTherapists()
    } catch (error) {
      console.error('Error adding therapist:', error)
    }
  }

  async function deleteTherapist(id: string) {
    if (confirm('Are you sure?')) {
      try {
        const supabase = createClient()
        const { error } = await supabase
          .from('therapists')
          .delete()
          .eq('id', id)

        if (error) throw error
        await loadTherapists()
      } catch (error) {
        console.error('Error deleting therapist:', error)
      }
    }
  }

  if (isLoading) {
    return <div>Loading therapists...</div>
  }

  return (
    <div className="space-y-4">
      {showForm && (
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={addTherapist} className="space-y-4">
              <Input
                placeholder="Therapist Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
              <Input
                placeholder="Specialization"
                value={formData.specialization}
                onChange={(e) =>
                  setFormData({ ...formData, specialization: e.target.value })
                }
                required
              />
              <textarea
                placeholder="Bio"
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                className="w-full px-3 py-2 border border-border rounded-md min-h-20"
              />
              <div className="flex gap-2">
                <Button type="submit">Save Therapist</Button>
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
        Add Therapist
      </Button>

      <Card>
        <CardContent className="pt-6">
          {therapists.length === 0 ? (
            <p className="text-muted-foreground">No therapists yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead>Bio</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {therapists.map((therapist) => (
                    <TableRow key={therapist.id}>
                      <TableCell className="font-medium">
                        {therapist.name}
                      </TableCell>
                      <TableCell className="text-sm">
                        {therapist.specialization}
                      </TableCell>
                      <TableCell className="text-sm max-w-xs truncate">
                        {therapist.bio}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteTherapist(therapist.id)}
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
