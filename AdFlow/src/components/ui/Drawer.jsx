import { AnimatePresence, m } from 'framer-motion'

export function Drawer({ isOpen, onClose, title, children }) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <m.button
            type="button"
            className="fixed inset-0 z-40 bg-slate-900/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <m.aside
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md border-l border-slate-200 bg-white p-5 shadow-soft"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <h3 className="mb-4 text-xl font-semibold text-slate-900">{title}</h3>
            {children}
          </m.aside>
        </>
      ) : null}
    </AnimatePresence>
  )
}
