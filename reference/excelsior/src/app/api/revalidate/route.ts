import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { collection, operation, secret } = body

    // Optional: Add a secret for security
    if (process.env.REVALIDATION_SECRET && secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
    }

    if (!collection) {
      return NextResponse.json({ message: 'Collection is required' }, { status: 400 })
    }

    // Map Payload collections to cache tags
    const tagMap: Record<string, string> = {
      'projects': 'projects',
      'articles': 'articles',
      'article-categories': 'article-categories',
    }

    const tag = tagMap[collection]
    if (tag) {
      revalidateTag(tag, 'max')
      console.log(`Revalidated tag: ${tag} due to ${operation} on ${collection}`)
      return NextResponse.json({ revalidated: true, tag, now: Date.now() })
    }

    return NextResponse.json({ revalidated: false, message: 'No tag for this collection' })
  } catch (error) {
    console.error('Revalidation error:', error)
    return NextResponse.json({ message: 'Error revalidating', error }, { status: 500 })
  }
}

