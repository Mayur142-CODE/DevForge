import { NextResponse } from 'next/server'
import fs from 'fs'
import { ensureIcons } from '@/lib/ensure-icons'

const sourceImagePath = `C:\\Users\\Mayur\\.gemini\\antigravity-ide\\brain\\ce2cc578-e268-4e6a-8955-2a0ea42fadad\\streakhub_logo_1785762617477.png`

export async function GET() {
  ensureIcons()
  if (fs.existsSync(sourceImagePath)) {
    const buffer = fs.readFileSync(sourceImagePath)
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  }
  return new NextResponse('Not found', { status: 404 })
}
