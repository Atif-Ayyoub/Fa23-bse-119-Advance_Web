import { ChangeEvent, DragEvent, RefObject, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { AppFooter } from './components/AppFooter'
import { FeatureSection } from './components/FeatureSection'
import { HeroSection } from './components/HeroSection'
import { Navbar } from './components/Navbar'
import { SupportSection } from './components/SupportSection'
import { ToastItem, ToastStack } from './components/ToastStack'

type OutputFormat = 'jpeg' | 'png' | 'webp'

type Preset = {
  id: string
  label: string
  width: number
  height: number
}

const THEME_KEY = 'pixelresize-theme'
const MAX_FILE_SIZE_MB = 20
const MAX_DIMENSION = 10000

const presets: Preset[] = [
  { id: 'custom', label: 'Custom', width: 0, height: 0 },
  { id: 'instagram-post', label: 'Instagram Post', width: 1080, height: 1080 },
  { id: 'instagram-story', label: 'Instagram Story', width: 1080, height: 1920 },
  { id: 'youtube-thumb', label: 'YouTube Thumbnail', width: 1280, height: 720 },
  { id: 'linkedin-post', label: 'LinkedIn Post', width: 1200, height: 627 },
  { id: 'facebook-cover', label: 'Facebook Cover', width: 820, height: 312 },
]

const formatMime: Record<OutputFormat, string> = {
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
}

const formatExtension: Record<OutputFormat, string> = {
  jpeg: 'jpg',
  png: 'png',
  webp: 'webp',
}

function App() {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const workspaceRef = useRef<HTMLElement | null>(null)
  const featuresRef = useRef<HTMLDivElement | null>(null)
  const supportRef = useRef<HTMLDivElement | null>(null)

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)

  const [isDragActive, setIsDragActive] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const [sourceFile, setSourceFile] = useState<File | null>(null)
  const [originalUrl, setOriginalUrl] = useState<string | null>(null)
  const [originalWidth, setOriginalWidth] = useState(0)
  const [originalHeight, setOriginalHeight] = useState(0)

  const [targetWidth, setTargetWidth] = useState('')
  const [targetHeight, setTargetHeight] = useState('')
  const [lockAspectRatio, setLockAspectRatio] = useState(true)
  const [selectedPreset, setSelectedPreset] = useState('custom')

  const [format, setFormat] = useState<OutputFormat>('jpeg')
  const [quality, setQuality] = useState(86)

  const [resultBlob, setResultBlob] = useState<Blob | null>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [error, setError] = useState<string>('')
  const [toasts, setToasts] = useState<ToastItem[]>([])

  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY)
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const nextDark = savedTheme ? savedTheme === 'dark' : systemDark

    setIsDark(nextDark)
    document.documentElement.classList.toggle('dark', nextDark)
  }, [])

  useEffect(() => {
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  useEffect(() => {
    return () => {
      if (originalUrl) {
        URL.revokeObjectURL(originalUrl)
      }
      if (resultUrl) {
        URL.revokeObjectURL(resultUrl)
      }
    }
  }, [originalUrl, resultUrl])

  const aspectRatio = useMemo(() => {
    if (!originalWidth || !originalHeight) {
      return 1
    }
    return originalWidth / originalHeight
  }, [originalWidth, originalHeight])

  const canResize = useMemo(() => {
    const width = Number(targetWidth)
    const height = Number(targetHeight)
    return Boolean(
      sourceFile && width > 0 && height > 0 && Number.isFinite(width) && Number.isFinite(height),
    )
  }, [sourceFile, targetHeight, targetWidth])

  const estimatedSize = useMemo(() => {
    if (!sourceFile || !targetWidth || !targetHeight || !originalWidth || !originalHeight) {
      return null
    }

    const widthRatio = Number(targetWidth) / originalWidth
    const heightRatio = Number(targetHeight) / originalHeight
    const scaleImpact = Math.max(0.08, widthRatio * heightRatio)
    const qualityImpact = format === 'png' ? 1 : quality / 100
    const formatImpact = format === 'png' ? 1.08 : format === 'webp' ? 0.74 : 0.84

    return formatFileSize(Math.round(sourceFile.size * scaleImpact * qualityImpact * formatImpact))
  }, [
    format,
    originalHeight,
    originalWidth,
    quality,
    sourceFile,
    targetHeight,
    targetWidth,
  ])

  function pushToast(type: ToastItem['type'], message: string) {
    const id = Date.now() + Math.floor(Math.random() * 1000)
    setToasts((current) => [...current, { id, type, message }])
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id))
    }, 3000)
  }

  function scrollToSection(target: RefObject<Element | null>) {
    target.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setMobileMenuOpen(false)
  }

  function openFilePicker() {
    fileInputRef.current?.click()
  }

  function clearResult() {
    setResultBlob(null)
    if (resultUrl) {
      URL.revokeObjectURL(resultUrl)
      setResultUrl(null)
    }
  }

  async function readImageMetadata(file: File) {
    const objectUrl = URL.createObjectURL(file)

    const dimensions = await new Promise<{ width: number; height: number }>((resolve, reject) => {
      const image = new Image()
      image.onload = () => resolve({ width: image.width, height: image.height })
      image.onerror = () => reject(new Error('Could not read image.'))
      image.src = objectUrl
    })

    if (originalUrl) {
      URL.revokeObjectURL(originalUrl)
    }

    setOriginalUrl(objectUrl)
    setOriginalWidth(dimensions.width)
    setOriginalHeight(dimensions.height)
    setTargetWidth(String(dimensions.width))
    setTargetHeight(String(dimensions.height))
    setSelectedPreset('custom')

    clearResult()
  }

  async function handleFile(file: File) {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('This file format is not supported.')
      pushToast('error', 'Unsupported file format.')
      return
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`Please upload an image under ${MAX_FILE_SIZE_MB}MB.`)
      pushToast('error', 'Image exceeds maximum size limit.')
      return
    }

    try {
      setError('')
      setSourceFile(file)
      await readImageMetadata(file)
      pushToast('success', 'Image uploaded successfully.')
    } catch {
      setError('We could not read this image. Please try a different file.')
      pushToast('error', 'Upload failed.')
    }
  }

  async function onInputChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    await handleFile(file)
    event.target.value = ''
  }

  async function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setIsDragActive(false)

    const file = event.dataTransfer.files?.[0]
    if (!file) {
      return
    }

    await handleFile(file)
  }

  function onWidthChange(value: string) {
    const nextWidth = sanitizeNumericInput(value)
    setTargetWidth(nextWidth)

    if (lockAspectRatio && nextWidth && aspectRatio > 0) {
      setTargetHeight(String(Math.max(1, Math.round(Number(nextWidth) / aspectRatio))))
    }

    setSelectedPreset('custom')
  }

  function onHeightChange(value: string) {
    const nextHeight = sanitizeNumericInput(value)
    setTargetHeight(nextHeight)

    if (lockAspectRatio && nextHeight && aspectRatio > 0) {
      setTargetWidth(String(Math.max(1, Math.round(Number(nextHeight) * aspectRatio))))
    }

    setSelectedPreset('custom')
  }

  function onPresetChange(value: string) {
    setSelectedPreset(value)
    if (value === 'custom') {
      return
    }

    const preset = presets.find((entry) => entry.id === value)
    if (!preset) {
      return
    }

    setTargetWidth(String(preset.width))
    setTargetHeight(String(preset.height))
  }

  function removeFile() {
    setSourceFile(null)
    setOriginalWidth(0)
    setOriginalHeight(0)
    setTargetWidth('')
    setTargetHeight('')
    setSelectedPreset('custom')
    setError('')

    if (originalUrl) {
      URL.revokeObjectURL(originalUrl)
      setOriginalUrl(null)
    }

    clearResult()
    pushToast('info', 'Image removed.')
  }

  function resetSettings() {
    if (!sourceFile) {
      return
    }

    setTargetWidth(String(originalWidth))
    setTargetHeight(String(originalHeight))
    setLockAspectRatio(true)
    setSelectedPreset('custom')
    setFormat('jpeg')
    setQuality(86)
    setError('')

    clearResult()
    pushToast('info', 'Settings reset.')
  }

  async function resizeImage() {
    if (!sourceFile || !originalUrl) {
      setError('Please upload an image first.')
      return
    }

    const width = Number(targetWidth)
    const height = Number(targetHeight)

    if (width <= 0 || height <= 0 || !Number.isFinite(width) || !Number.isFinite(height)) {
      setError('Please enter a valid width and height.')
      pushToast('error', 'Invalid dimensions.')
      return
    }

    setIsProcessing(true)
    setError('')

    try {
      const image = await loadImage(originalUrl)
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const context = canvas.getContext('2d')
      if (!context) {
        throw new Error('Canvas is not available.')
      }

      context.imageSmoothingEnabled = true
      context.imageSmoothingQuality = 'high'
      context.drawImage(image, 0, 0, width, height)

      const outputBlob = await new Promise<Blob | null>((resolve) => {
        const qualityValue = format === 'png' ? undefined : quality / 100
        canvas.toBlob((blob) => resolve(blob), formatMime[format], qualityValue)
      })

      if (!outputBlob) {
        throw new Error('Resize failed')
      }

      clearResult()
      const nextResultUrl = URL.createObjectURL(outputBlob)
      setResultBlob(outputBlob)
      setResultUrl(nextResultUrl)
      pushToast('success', 'Resized successfully.')
    } catch {
      setError('We could not process the image right now. Please try again.')
      pushToast('error', 'Resize failed.')
    } finally {
      setIsProcessing(false)
    }
  }

  function downloadResult() {
    if (!resultBlob) {
      setError('Please resize an image before downloading.')
      return
    }

    const baseName = sourceFile?.name.replace(/\.[^/.]+$/, '') ?? 'pixelresize'
    const filename = `${baseName}-${Date.now()}.${formatExtension[format]}`

    const blobUrl = URL.createObjectURL(resultBlob)
    const anchor = document.createElement('a')
    anchor.href = blobUrl
    anchor.download = filename
    anchor.click()
    URL.revokeObjectURL(blobUrl)

    pushToast('success', 'Download started.')
  }

  return (
    <div className="min-h-screen">
      <Navbar
        onGoToWorkspace={() => scrollToSection(workspaceRef)}
        onGoToFeatures={() => scrollToSection(featuresRef)}
        onGoToSupport={() => scrollToSection(supportRef)}
        isDark={isDark}
        onToggleTheme={() => setIsDark((current) => !current)}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen((current) => !current)}
        onCloseMobileMenu={() => setMobileMenuOpen(false)}
      />

      <main>
        <HeroSection
          onGoToWorkspace={() => scrollToSection(workspaceRef)}
          onGoToFeatures={() => scrollToSection(featuresRef)}
        />

        <section ref={workspaceRef} id="workspace" className="section-gap pt-0">
          <div className="app-container grid gap-5 xl:grid-cols-[1fr_1fr]">
            <div className="space-y-5">
              <motion.section
                className="panel"
                whileHover={{ y: -1 }}
                onDragOver={(event) => {
                  event.preventDefault()
                  setIsDragActive(true)
                }}
                onDragLeave={() => setIsDragActive(false)}
                onDrop={onDrop}
              >
                <div
                  role="button"
                  tabIndex={0}
                  onClick={openFilePicker}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      openFilePicker()
                    }
                  }}
                  className={`rounded-[28px] border-2 border-dashed p-7 text-center transition ${
                    isDragActive
                      ? 'border-[#6f53ff] bg-[#f1edff] dark:border-[#8f7bff] dark:bg-[#1a2240]'
                      : 'border-[#d0caf8] bg-[#faf9ff] hover:border-[#9c8afa] dark:border-[#394066] dark:bg-[#10182b] dark:hover:border-[#8f7bff]'
                  }`}
                  aria-label="Upload image area"
                >
                  <h2 className="font-display text-[22px] font-semibold leading-tight">Upload your image</h2>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#66607f] dark:text-[#a4add2]">
                    Drag and drop or click to browse. Supported formats: JPG, PNG, WEBP. Maximum size {MAX_FILE_SIZE_MB}MB.
                  </p>
                  <button type="button" className="btn-secondary mt-4 h-11" onClick={openFilePicker}>
                    Choose File
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  accept="image/jpeg,image/png,image/webp"
                  onChange={onInputChange}
                />

                <div className="mt-5 rounded-2xl border border-[#ddd9ef] bg-white/70 p-4 dark:border-[#303a58] dark:bg-[#10192d]">
                  <p className="text-xs font-medium text-[#6d6888] dark:text-[#99a3cb]">Uploaded file</p>
                  <p className="mt-1 text-sm font-semibold break-all">{sourceFile?.name ?? 'No file selected yet'}</p>
                  <p className="mt-1 text-xs text-[#6d6888] dark:text-[#99a3cb]">
                    {sourceFile ? `${formatFileSize(sourceFile.size)} · ${originalWidth || '--'} × ${originalHeight || '--'} px` : 'Upload to view file metadata'}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" onClick={openFilePicker} className="btn-secondary h-10 px-4 text-xs">
                      Replace
                    </button>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="btn-secondary h-10 px-4 text-xs"
                      disabled={!sourceFile}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </motion.section>

              <section className="panel">
                <div className="mb-6 flex items-center justify-between gap-3">
                  <h2 className="font-display text-[22px] font-semibold">Resize Settings</h2>
                  <button type="button" onClick={resetSettings} className="btn-secondary h-10 px-4 text-xs">
                    Reset
                  </button>
                </div>

                <label className="mb-4 block">
                  <span className="field-label">Preset</span>
                  <select
                    className="input-base"
                    value={selectedPreset}
                    onChange={(event) => onPresetChange(event.target.value)}
                  >
                    {presets.map((preset) => (
                      <option key={preset.id} value={preset.id}>
                        {preset.id === 'custom'
                          ? 'Custom'
                          : `${preset.label} (${preset.width} × ${preset.height})`}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="mb-4 grid gap-3 sm:grid-cols-2">
                  <label>
                    <span className="field-label">Width (px)</span>
                    <input
                      className="input-base"
                      inputMode="numeric"
                      value={targetWidth}
                      onChange={(event) => onWidthChange(event.target.value)}
                      placeholder="Width"
                    />
                  </label>
                  <label>
                    <span className="field-label">Height (px)</span>
                    <input
                      className="input-base"
                      inputMode="numeric"
                      value={targetHeight}
                      onChange={(event) => onHeightChange(event.target.value)}
                      placeholder="Height"
                    />
                  </label>
                </div>

                <label className="flex h-13 items-center justify-between rounded-[14px] border border-[#ddd9ef] px-4 dark:border-[#303a58]">
                  <span className="text-sm font-medium text-[#403b58] dark:text-[#c6cae6]">Lock aspect ratio</span>
                  <input
                    type="checkbox"
                    checked={lockAspectRatio}
                    onChange={(event) => setLockAspectRatio(event.target.checked)}
                    aria-label="Lock aspect ratio"
                    className="h-4 w-4 accent-[#6f53ff]"
                  />
                </label>
              </section>

              <section className="panel">
                <h2 className="font-display text-[22px] font-semibold">Output Settings</h2>

                <label className="mt-6 block">
                  <span className="field-label">Output format</span>
                  <select className="input-base" value={format} onChange={(event) => setFormat(event.target.value as OutputFormat)}>
                    <option value="jpeg">JPG</option>
                    <option value="png">PNG</option>
                    <option value="webp">WEBP</option>
                  </select>
                </label>

                <label className="mt-4 block" aria-live="polite">
                  <span className="field-label">
                    Quality {format === 'png' ? '(Not used for PNG)' : `(${quality}%)`}
                  </span>
                  <input
                    className="w-full accent-[#6f53ff]"
                    type="range"
                    min={30}
                    max={100}
                    value={quality}
                    onChange={(event) => setQuality(Number(event.target.value))}
                    disabled={format === 'png'}
                  />
                  <span className="mt-1 block text-xs text-[#6f6889] dark:text-[#9ca5cc]">
                    {format === 'png'
                      ? 'PNG uses lossless compression.'
                      : 'Lower quality reduces file size, higher quality preserves detail.'}
                  </span>
                </label>

                <div className="mt-5 grid gap-3 rounded-2xl border border-[#ddd9ef] bg-white/70 p-4 text-sm dark:border-[#303a58] dark:bg-[#10192d] md:grid-cols-2">
                  <div>
                    <p className="text-xs text-[#6f6889] dark:text-[#9ca5cc]">Estimated output size</p>
                    <p className="mt-1 font-semibold">{estimatedSize ?? '--'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6f6889] dark:text-[#9ca5cc]">Current output format</p>
                    <p className="mt-1 font-semibold">{format.toUpperCase()}</p>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-primary mt-6 w-full"
                  onClick={resizeImage}
                  disabled={!canResize || isProcessing}
                >
                  {isProcessing ? 'Resizing image...' : 'Resize Image'}
                </button>
              </section>
            </div>

            <div className="space-y-5">
              <section className="panel">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h2 className="font-display text-[22px] font-semibold">Original Preview</h2>
                  <p className="text-xs text-[#6f6889] dark:text-[#9ca5cc]">
                    {originalWidth && originalHeight
                      ? `${originalWidth} × ${originalHeight} px`
                      : 'Awaiting upload'}
                  </p>
                </div>
                <div className="grid min-h-70 place-items-center rounded-3xl border border-[#ddd9ef] bg-[#faf9ff] p-4 dark:border-[#2f3752] dark:bg-[#10182b]">
                  {originalUrl ? (
                    <img
                      src={originalUrl}
                      alt="Original image preview"
                      className="max-h-85 max-w-full rounded-2xl object-contain"
                    />
                  ) : (
                    <p className="max-w-xs text-center text-sm text-[#6b6584] dark:text-[#a2abd2]">
                      Upload an image to preview the original version and metadata.
                    </p>
                  )}
                </div>
              </section>

              <section className="panel">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h2 className="font-display text-[22px] font-semibold">Resized Result</h2>
                  <p className="text-xs text-[#6f6889] dark:text-[#9ca5cc]">
                    {resultBlob ? formatFileSize(resultBlob.size) : 'No result yet'}
                  </p>
                </div>
                <div className="grid min-h-70 place-items-center rounded-3xl border border-[#ddd9ef] bg-[#f8f7ff] p-4 dark:border-[#2f3752] dark:bg-[#0f162a]">
                  {resultUrl ? (
                    <img
                      src={resultUrl}
                      alt="Resized image preview"
                      className="max-h-85 max-w-full rounded-2xl object-contain"
                    />
                  ) : (
                    <p className="max-w-xs text-center text-sm text-[#6b6584] dark:text-[#a2abd2]">
                      Resize your image to preview the generated output.
                    </p>
                  )}
                </div>

                <div className="mt-4 grid gap-3 rounded-2xl border border-[#ddd9ef] bg-white/70 p-4 text-sm dark:border-[#303a58] dark:bg-[#10192d] md:grid-cols-3">
                  <div>
                    <p className="text-xs text-[#6f6889] dark:text-[#9ca5cc]">Dimensions</p>
                    <p className="mt-1 font-semibold">{targetWidth || '--'} × {targetHeight || '--'} px</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6f6889] dark:text-[#9ca5cc]">Format</p>
                    <p className="mt-1 font-semibold">{format.toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6f6889] dark:text-[#9ca5cc]">Status</p>
                    <p className="mt-1 font-semibold">
                      {isProcessing ? 'Processing' : resultBlob ? 'Ready' : 'Pending'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-secondary mt-4 w-full"
                  onClick={downloadResult}
                  disabled={!resultBlob || isProcessing}
                >
                  Download Image
                </button>
              </section>

              {error && (
                <div className="rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/70 dark:text-rose-300">
                  {error}
                </div>
              )}
            </div>
          </div>
        </section>

        <div ref={featuresRef}>
          <FeatureSection />
        </div>

        <div ref={supportRef}>
          <SupportSection />
        </div>
      </main>

      <AppFooter
        onGoToWorkspace={() => scrollToSection(workspaceRef)}
        onGoToFeatures={() => scrollToSection(featuresRef)}
        onGoToSupport={() => scrollToSection(supportRef)}
      />

      <ToastStack toasts={toasts} />
    </div>
  )
}

function sanitizeNumericInput(value: string) {
  if (!value) {
    return ''
  }

  const digitsOnly = value.replace(/[^0-9]/g, '')
  if (!digitsOnly) {
    return ''
  }

  return String(Math.min(MAX_DIMENSION, Math.max(1, Number(digitsOnly))))
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`
  }

  const kb = bytes / 1024
  if (kb < 1024) {
    return `${kb.toFixed(1)} KB`
  }

  const mb = kb / 1024
  return `${mb.toFixed(2)} MB`
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Image failed to load.'))
    image.src = src
  })
}

export default App
