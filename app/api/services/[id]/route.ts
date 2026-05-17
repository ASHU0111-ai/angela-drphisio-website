import { query } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params

  try {
    const body = await req.json()
    const columns = Object.keys(body)

    if (columns.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    const values = Object.values(body)
    const setClauses = columns
      .map((column, index) => `"${column}"=$${index + 1}`)
      .join(', ')
    const text = `UPDATE services SET ${setClauses} WHERE id=$${columns.length + 1} RETURNING *`
    const result = await query(text, [...values, id])

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error updating service:', error)
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params

  try {
    await query('DELETE FROM services WHERE id=$1', [id])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting service:', error)
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 })
  }
}
