type AppFooterProps = {
  onGoToWorkspace: () => void
  onGoToFeatures: () => void
  onGoToSupport: () => void
}

export function AppFooter({ onGoToWorkspace, onGoToFeatures, onGoToSupport }: AppFooterProps) {
  return (
    <footer className="border-t border-[#d7d4ea] py-10 dark:border-[#2a3247]">
      <div className="app-container grid gap-5 text-sm text-[#686282] md:grid-cols-3 dark:text-[#9ea6cb]">
        <div>
          <p className="font-display text-base font-semibold text-[#1d1a31] dark:text-[#e7e9ff]">PixelResize Pro</p>
          <p className="mt-2">Premium image resizing for creators and teams.</p>
        </div>

        <div>
          <p className="font-medium text-[#1d1a31] dark:text-[#e7e9ff]">Quick Links</p>
          <div className="mt-2 flex flex-col items-start gap-2">
            <button type="button" onClick={onGoToWorkspace} className="hover:underline">
              Workspace
            </button>
            <button type="button" onClick={onGoToFeatures} className="hover:underline">
              Features
            </button>
            <button type="button" onClick={onGoToSupport} className="hover:underline">
              Support
            </button>
          </div>
        </div>

        <div>
          <p className="font-medium text-[#1d1a31] dark:text-[#e7e9ff]">Contact</p>
          <p className="mt-2">support@pixelresize.pro</p>
          <p className="mt-2">© {new Date().getFullYear()} PixelResize Pro</p>
        </div>
      </div>
    </footer>
  )
}
