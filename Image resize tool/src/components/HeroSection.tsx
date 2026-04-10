import { motion } from 'framer-motion'

type HeroSectionProps = {
  onGoToWorkspace: () => void
  onGoToFeatures: () => void
}

export function HeroSection({ onGoToWorkspace, onGoToFeatures }: HeroSectionProps) {
  return (
    <section className="section-gap pb-10 md:pb-14 xl:pb-16">
      <div className="app-container grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          <span className="inline-flex rounded-full border border-[#d7d2fd] bg-[#efebff] px-3 py-1.5 text-xs font-semibold text-[#4f2fd2] dark:border-[#424972] dark:bg-[#1f2642] dark:text-[#bcb6ff]">
            Premium Image Resizer
          </span>
          <h1 className="max-w-205 text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl xl:text-[56px]">
            Resize images in seconds with a premium web tool
          </h1>
          <p className="max-w-170 text-base leading-7 text-[#5b5676] md:text-lg dark:text-[#aeb4d1]">
            Upload, resize, optimize, and download beautiful image files instantly with
            polished controls and reliable output quality.
          </p>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={onGoToWorkspace} className="btn-primary w-full sm:w-auto">
              Open Workspace
            </button>
            <button type="button" onClick={onGoToFeatures} className="btn-secondary w-full sm:w-auto">
              Explore Features
            </button>
          </div>
          <p className="text-sm text-[#6e688a] dark:text-[#96a0c7]">
            No account required. Your files stay private and are processed securely.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.4 }}
          className="panel hidden min-h-67.5 lg:block"
        >
          <div className="flex h-full flex-col justify-between gap-5">
            <div>
              <h2 className="text-2xl font-semibold">Pixel-perfect controls</h2>
              <p className="mt-2 text-sm leading-6 text-[#676180] dark:text-[#a4add2]">
                Designed for creators, marketers, ecommerce teams, and developers who need clean results fast.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl border border-[#dbd8ef] bg-white/80 p-4 dark:border-[#2f3752] dark:bg-[#11192d]">
                <p className="text-[#6f6887] dark:text-[#a2abd2]">Formats</p>
                <p className="mt-1 font-semibold">JPG · PNG · WEBP</p>
              </div>
              <div className="rounded-2xl border border-[#dbd8ef] bg-white/80 p-4 dark:border-[#2f3752] dark:bg-[#11192d]">
                <p className="text-[#6f6887] dark:text-[#a2abd2]">Max upload</p>
                <p className="mt-1 font-semibold">20 MB</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
