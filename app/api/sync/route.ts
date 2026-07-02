import { NextResponse } from 'next/server'
import { syncMatches } from '@/app/lib/sync'

export async function POST() {
  try {
    await syncMatches()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Sync error:', error)
    return NextResponse.json(
      { error: 'Failed to sync with FIFA API' },
      { status: 500 }
    )
  }
}
