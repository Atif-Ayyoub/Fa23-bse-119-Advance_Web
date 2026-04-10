const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']
const ALLOWED_IMAGE_HOSTS = [
  'images.unsplash.com',
  'i.imgur.com',
  'cdn.pixabay.com',
  'res.cloudinary.com',
  'lh3.googleusercontent.com',
]

export function extractYouTubeThumbnail(url) {
  const regExp = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/
  const match = String(url ?? '').match(regExp)
  if (!match) return null
  return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`
}

export function validateExternalImageUrl(url) {
  try {
    const parsed = new URL(url)

    if (!['https:', 'http:'].includes(parsed.protocol)) {
      return { valid: false, reason: 'Only http/https URLs are allowed.' }
    }

    const hostname = parsed.hostname.toLowerCase()
    const pathname = parsed.pathname.toLowerCase()

    const hasExtension = IMAGE_EXTENSIONS.some((extension) => pathname.endsWith(extension))
    const hostAllowed = ALLOWED_IMAGE_HOSTS.some((allowedHost) => hostname === allowedHost || hostname.endsWith(`.${allowedHost}`))

    if (!hasExtension && !hostAllowed) {
      return { valid: false, reason: 'Image URL must use a known image host or a valid image extension.' }
    }

    return { valid: true, reason: null }
  } catch {
    return { valid: false, reason: 'Invalid URL format.' }
  }
}

export function normalizeMediaUrl(url) {
  const raw = String(url ?? '').trim()
  if (!raw) {
    return { valid: false, sourceType: 'other', originalUrl: '', thumbnailUrl: null, reason: 'URL is empty.' }
  }

  const youtubeThumb = extractYouTubeThumbnail(raw)
  if (youtubeThumb) {
    return {
      valid: true,
      sourceType: 'youtube',
      originalUrl: raw,
      thumbnailUrl: youtubeThumb,
      reason: null,
    }
  }

  const imageResult = validateExternalImageUrl(raw)
  if (imageResult.valid) {
    return {
      valid: true,
      sourceType: 'image',
      originalUrl: raw,
      thumbnailUrl: raw,
      reason: null,
    }
  }

  if (/^https?:\/\//i.test(raw)) {
    return {
      valid: true,
      sourceType: 'other',
      originalUrl: raw,
      thumbnailUrl: null,
      reason: 'URL saved as generic external media.',
    }
  }

  return {
    valid: false,
    sourceType: 'other',
    originalUrl: raw,
    thumbnailUrl: null,
    reason: imageResult.reason ?? 'Unsupported media URL.',
  }
}
