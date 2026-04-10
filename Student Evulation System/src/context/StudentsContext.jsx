import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const StudentsContext = createContext(null)

export function StudentsProvider({ children }) {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [batches, setBatches] = useState([])
  const [selectedSection, setSelectedSection] = useState(() => {
    try { return localStorage.getItem('selectedSection') || 'All Sections' } catch (e) { return 'All Sections' }
  })
  const [selectedBatch, setSelectedBatch] = useState(() => {
    try { const raw = localStorage.getItem('selectedBatch'); return raw ? JSON.parse(raw) : null } catch (e) { return null }
  })

  useEffect(() => { loadBatches(); loadStudents(); }, [])

  useEffect(() => {
    // reload students when selected batch changes
    loadStudents()
  }, [selectedBatch])

  useEffect(() => {
    try { localStorage.setItem('selectedSection', selectedSection) } catch (e) { /* ignore */ }
  }, [selectedSection])

  useEffect(() => {
    try { localStorage.setItem('selectedBatch', JSON.stringify(selectedBatch)) } catch (e) { /* ignore */ }
  }, [selectedBatch])

  async function loadStudents() {
    setLoading(true)
    try {
      const s = await window.electronAPI.getStudents(selectedBatch ? selectedBatch.id : null)
      setStudents(s || [])
    } catch (err) {
      console.error('StudentsProvider: loadStudents error', err)
      setStudents([])
    } finally {
      setLoading(false)
    }
  }

  async function loadBatches() {
    try {
      const b = await window.electronAPI.getBatches()
      setBatches(b || [])
      // if no selectedBatch, pick first or null
      if (!selectedBatch) {
        setSelectedBatch(b && b.length ? b[0] : null)
      }
    } catch (err) {
      console.error('StudentsProvider: loadBatches error', err)
      setBatches([])
    }
  }

  const sections = useMemo(() => {
    const setA = new Set(students.map(s => (s.section || '').toString().trim()).filter(x => x))
    const arr = Array.from(setA).sort()
    return ['All Sections', ...arr]
  }, [students])

  return (
    <StudentsContext.Provider value={{ students, loading, loadStudents, sections, selectedSection, setSelectedSection, batches, loadBatches, selectedBatch, setSelectedBatch }}>
      {children}
    </StudentsContext.Provider>
  )
}

export function useStudents() {
  const ctx = useContext(StudentsContext)
  if (!ctx) throw new Error('useStudents must be used within StudentsProvider')
  return ctx
}

export default StudentsContext
