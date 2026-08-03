import fs from 'fs'
import path from 'path'

const sourceImagePath = `C:\\Users\\Mayur\\.gemini\\antigravity-ide\\brain\\ce2cc578-e268-4e6a-8955-2a0ea42fadad\\streakhub_logo_1785762617477.png`

export function ensureIcons() {
  try {
    if (!fs.existsSync(sourceImagePath)) return

    const targets = [
      'public/icon.png',
      'public/icon-192.png',
      'public/icon-512.png',
      'public/apple-touch-icon.png',
      'public/favicon.ico',
      'src/app/favicon.ico',
      'src/app/icon.png',
      'src/app/apple-touch-icon.png',
    ]

    for (const target of targets) {
      const destPath = path.join(process.cwd(), target)
      const destDir = path.dirname(destPath)
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true })
      }
      fs.copyFileSync(sourceImagePath, destPath)
    }
  } catch (e) {
    // Ignore errors gracefully
  }
}

// Execute immediately upon module import on server
ensureIcons()
