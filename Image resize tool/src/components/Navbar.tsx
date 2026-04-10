import { motion } from 'framer-motion'
import { ThemeToggle } from './ThemeToggle'

type NavbarProps = {
  onGoToWorkspace: () => void
  onGoToFeatures: () => void
  onGoToSupport: () => void
  isDark: boolean
  onToggleTheme: () => void
  mobileMenuOpen: boolean
  onToggleMobileMenu: () => void
  onCloseMobileMenu: () => void
}

export function Navbar({
  onGoToWorkspace,
  onGoToFeatures,
  onGoToSupport,
  isDark,
  onToggleTheme,
  mobileMenuOpen,
  onToggleMobileMenu,
  onCloseMobileMenu,
}: NavbarProps) {
  function handleAction(action: () => void) {
    action()
    onCloseMobileMenu()
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#d9d6eb] bg-white/80 backdrop-blur-md transition-colors dark:border-[#2a3247] dark:bg-[#0f1422]/85">
      <nav className="app-container py-4">
        <div className="flex h-12 items-center justify-between gap-4">
          <button
            type="button"
            onClick={onGoToWorkspace}
            className="font-display text-lg font-bold tracking-tight"
          >
            PixelResize Pro
          </button>

          <div className="hidden items-center gap-1 md:flex">
            <button type="button" onClick={onGoToWorkspace} className="btn-secondary h-10 px-4 text-xs">
              Workspace
            </button>
            <button type="button" onClick={onGoToFeatures} className="btn-secondary h-10 px-4 text-xs">
              Features
            </button>
            <button type="button" onClick={onGoToSupport} className="btn-secondary h-10 px-4 text-xs">
              Support
            </button>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
            <motion.button
              whileHover={{ y: -1 }}
              type="button"
              onClick={onGoToWorkspace}
              className="btn-primary h-11"
            >
              Get Started
            </motion.button>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
            <button
              type="button"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
              onClick={onToggleMobileMenu}
              className="btn-secondary h-11 w-11 rounded-full p-0"
            >
              ☰
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="mt-4 grid gap-2 rounded-2xl border border-[#d9d6eb] bg-white/95 p-3 dark:border-[#2a3247] dark:bg-[#12192c] md:hidden">
            <button type="button" onClick={() => handleAction(onGoToWorkspace)} className="btn-secondary w-full">
              Workspace
            </button>
            <button type="button" onClick={() => handleAction(onGoToFeatures)} className="btn-secondary w-full">
              Features
            </button>
            <button type="button" onClick={() => handleAction(onGoToSupport)} className="btn-secondary w-full">
              Support
            </button>
            <button type="button" onClick={() => handleAction(onGoToWorkspace)} className="btn-primary w-full">
              Get Started
            </button>
          </div>
        )}
      </nav>
    </header>
  )
}
