import { query } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

const allowedOrderColumns = ['created_at']

function buildTestimonialQuery(params: URLSearchParams) {
  const order = params.get('order')
  const direction = params.get('direction') === 'asc' ? 'ASC' : 'DESC'
  let text = 'SELECT * FROM testimonials'
  const values: any[] = []

  if (order && allowedOrderColumns.includes(order)) {
    text += ` ORDER BY "${order}" ${direction}`
  }

  const limit = parseInt(params.get('limit') ?? '', 10)
  if (!Number.isNaN(limit) && limit > 0) {
    values.push(limit)
    text += ` LIMIT $${values.length}`
  }

  return { text, values }
}

export async function GET(req: NextRequest) {
  try {
    const { text, values } = buildTestimonialQuery(req.nextUrl.searchParams)
    const result = await query(text, values)
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const row = Array.isArray(body) ? body[0] : body
    const columns = Object.keys(row)

    if (columns.length === 0) {
      return NextResponse.json({ error: 'Missing testimonial data' }, { status: 400 })
    }

    const values = Object.values(row)
    const text = `INSERT INTO testimonials (${columns
      .map((column) => `"${column}"`)
      .join(', ')}) VALUES (${columns.map((_, index) => `$${index + 1}`).join(', ')}) RETURNING *`
    const result = await query(text, values)

    return NextResponse.json(result.rows, { status: 201 })
  } catch (error) {
    console.error('Error creating testimonial:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
