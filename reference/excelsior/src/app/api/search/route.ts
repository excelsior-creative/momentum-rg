import { getPayloadClient } from '@/lib/payload'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('q')

  if (!query) {
    return NextResponse.json({ results: [] })
  }

  try {
    const payload = await getPayloadClient()
    
    const { docs } = await payload.find({
      collection: 'search',
      where: {
        or: [
          {
            title: {
              like: query,
            },
          },
          {
            excerpt: {
              like: query,
            },
          },
        ],
      },
      limit: 20,
      sort: '-priority',
    })

    return NextResponse.json({ results: docs })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Failed to search' }, { status: 500 })
  }
}

