import { put } from '@vercel/blob'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import formidable from 'formidable'
import { readFile } from 'node:fs/promises'

const SUPPORTED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const MAX_FILE_SIZE = 20 * 1024 * 1024

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return res.status(500).json({ error: 'BLOB_READ_WRITE_TOKEN is missing.' })
  }

  try {
    const form = formidable({ maxFileSize: MAX_FILE_SIZE, multiples: false })
    const [, files] = await form.parse(req)
    const fileEntry = files.file
    const file = Array.isArray(fileEntry) ? fileEntry[0] : fileEntry

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded.' })
    }

    if (!SUPPORTED_MIME_TYPES.has(file.mimetype ?? '')) {
      return res.status(400).json({ error: 'Unsupported file type.' })
    }

    const buffer = await readFile(file.filepath)
    const extension = file.originalFilename?.split('.').pop() ?? 'jpg'
    const pathname = `uploads/original-${Date.now()}-${crypto.randomUUID()}.${extension}`

    const blob = await put(pathname, buffer, {
      contentType: file.mimetype ?? 'application/octet-stream',
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    return res.status(200).json({
      url: blob.url,
      downloadUrl: blob.downloadUrl,
      pathname: blob.pathname,
      size: file.size,
      originalName: file.originalFilename,
    })
  } catch {
    return res.status(500).json({ error: 'Upload failed.' })
  }
}
