import React, { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import Assessments from './pages/Assessments'
import ExportPage from './pages/ExportPage'
import Marks from './pages/Marks'
import { StudentsProvider } from './context/StudentsContext'

export default function App() {
  const [activePage, setActivePage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const renderPage = () => {
    switch (activePage) {
      case 'students':
        return <Students />
      case 'assessments':
        return <Assessments />
      case 'marks':
        return <Marks />
      case 'export':
        return <ExportPage />
      default:
        return <Dashboard />
    }
  }

  // Listen for requests from other pages to open marks on the Dashboard
  useEffect(() => {
    const handler = (e) => {
      const detail = e?.detail || {}
      if (detail && detail.action === 'open-marks' && detail.assessment) {
        // navigate to dashboard first
        setActivePage('dashboard')
        // give Dashboard a moment to mount, then ask it to open the modal
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('evaldesk:open-marks-modal', { detail }))
        }, 80)
      }
    }
    window.addEventListener('evaldesk:open-marks', handler)
    return () => window.removeEventListener('evaldesk:open-marks', handler)
  }, [])

  return (
    <StudentsProvider>
      <div className="h-screen font-display flex">
        <Sidebar activePage={activePage} onNavigate={(p) => { setActivePage(p); setSidebarOpen(false); }} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 bg-slate-50 md:ml-64 h-screen overflow-y-auto">
          <div className="md:hidden p-3">
            <button aria-label="Toggle sidebar" onClick={() => setSidebarOpen(true)} className="px-3 py-2 rounded-md bg-white/80 shadow-sm">☰</button>
          </div>
          {renderPage()}
        </div>
      </div>
    </StudentsProvider>
  )
}

