import { Outlet } from 'react-router-dom'
import { m } from 'framer-motion'
import { pageVariant } from '../../animations/variants'
import { Footer } from './Footer'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'

export function DashboardLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="mx-auto flex w-full max-w-7xl flex-1">
        <Sidebar />
        <main className="w-full p-4 sm:p-6">
          <m.div
            initial={pageVariant.initial}
            animate={pageVariant.animate}
            exit={pageVariant.exit}
            transition={pageVariant.transition}
            className="space-y-6"
          >
            <Outlet />
          </m.div>
        </main>
      </div>
      <Footer />
    </div>
  )
}
