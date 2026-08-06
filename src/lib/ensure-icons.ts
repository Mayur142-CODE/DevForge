import fs from 'fs'
import path from 'path'

export function ensureIcons() {
  try {
    const logoSvgPath = path.join(process.cwd(), 'public/logo.svg')
    if (!fs.existsSync(logoSvgPath)) return

    // Clean up any legacy conflicting app route directories if present
    const conflictingDirs = [
      'src/app/icon-192.png',
      'src/app/icon-512.png',
      'src/app/apple-touch-icon.png',
      'src/app/icon.png',
    ]

    for (const relDir of conflictingDirs) {
      const fullDir = path.join(process.cwd(), relDir)
      if (fs.existsSync(fullDir)) {
        try {
          fs.rmSync(fullDir, { recursive: true, force: true })
        } catch {
          // Silently handle
        }
      }
    }

    // Ensure all static icon endpoints in public exist and match logo.svg
    const targets = [
      'public/favicon.svg',
      'public/favicon.ico',
      'public/icon.svg',
      'public/icon.png',
      'public/icon-192.png',
      'public/icon-512.png',
      'public/apple-touch-icon.png',
    ]

    for (const target of targets) {
      const destPath = path.join(process.cwd(), target)
      try {
        if (!fs.existsSync(destPath)) {
          fs.copyFileSync(logoSvgPath, destPath)
        }
      } catch {
        // Silently handle
      }
    }
  } catch {
    // Ignore errors gracefully
  }
}

ensureIcons()
