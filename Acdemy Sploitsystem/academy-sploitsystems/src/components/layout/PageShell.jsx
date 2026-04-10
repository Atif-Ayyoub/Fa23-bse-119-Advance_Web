import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import Footer from './Footer'
import Navbar from './Navbar'
import FloatingSocialBar from '../common/FloatingSocialBar'

function PageShell({ children }) {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-[#070a13] text-white">
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35 }}
        >
          {children}
        </motion.main>
      </AnimatePresence>
      <Footer />
      <FloatingSocialBar />
    </div>
  )
}

export default PageShell
