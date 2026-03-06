import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { generateAutomatedArticle } from '@/services/contentGenerationService'

function isAuthorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (!secret) return true

  const authHeader = request.headers.get('authorization')
  return authHeader === `Bearer ${secret}`
}

function parseBoolean(value: string | null) {
  return value === '1' || value === 'true'
}

async function handleRequest(request: NextRequest, body?: Record<string, any>) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = await getPayload({ config })
    const searchParams = request.nextUrl.searchParams

    const result = await generateAutomatedArticle(payload, {
      dryRun: body?.dryRun ?? parseBoolean(searchParams.get('dryRun')),
      force: body?.force ?? parseBoolean(searchParams.get('force')),
      topicOverride: body?.topicOverride,
      triggerSource: request.method === 'POST' ? 'manual' : 'cron',
    })

    return NextResponse.json({ ok: true, result })
  } catch (error) {
    console.error('Automated article generation failed:', error)

    return NextResponse.json(
      {
        error: 'Failed to generate article',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  return handleRequest(request)
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as Record<string, any>
  return handleRequest(request, body)
}
