import { put } from '@vercel/blob'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import formidable from 'formidable'
import { readFile } from 'node:fs/promises'
import sharp from 'sharp'

type OutputFormat = 'jpeg' | 'png' | 'webp'

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
    const [fields, files] = await form.parse(req)
    const fileEntry = files.file
    const file = Array.isArray(fileEntry) ? fileEntry[0] : fileEntry

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded.' })
    }

    if (!SUPPORTED_MIME_TYPES.has(file.mimetype ?? '')) {
      return res.status(400).json({ error: 'Unsupported file type.' })
    }

    const width = Number(Array.isArray(fields.width) ? fields.width[0] : fields.width)
    const height = Number(Array.isArray(fields.height) ? fields.height[0] : fields.height)
    const formatField = Array.isArray(fields.format) ? fields.format[0] : fields.format
    const qualityField = Array.isArray(fields.quality) ? fields.quality[0] : fields.quality

    const format: OutputFormat =
      formatField === 'png' || formatField === 'webp' || formatField === 'jpeg'
        ? formatField
        : 'jpeg'

    const quality = Math.max(30, Math.min(100, Number(qualityField || 86)))

    if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
      return res.status(400).json({ error: 'Invalid width or height.' })
    }

    const inputBuffer = await readFile(file.filepath)
    const resized = sharp(inputBuffer).resize(width, height, { fit: 'fill' })

    const outputBuffer =
      format === 'png'
        ? await resized.png({ compressionLevel: 9 }).toBuffer()
        : format === 'webp'
          ? await resized.webp({ quality }).toBuffer()
          : await resized.jpeg({ quality, mozjpeg: true }).toBuffer()

    const extension = format === 'jpeg' ? 'jpg' : format
    const blob = await put(`outputs/resized-${Date.now()}-${crypto.randomUUID()}.${extension}`, outputBuffer, {
      contentType: `image/${format}`,
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    return res.status(200).json({
      url: blob.url,
      downloadUrl: blob.downloadUrl,
      pathname: blob.pathname,
      width,
      height,
      format,
      size: outputBuffer.byteLength,
      quality: format === 'png' ? null : quality,
    })
  } catch {
    return res.status(500).json({ error: 'Resize failed.' })
  }
}
